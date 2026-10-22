import express from "express";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import { v4 as uuidv4 } from "uuid";
import { db } from "../data.js";
import { requireAuth, requireRole } from "../middleware/auth.js";
import { assignPrintJobs, serializePrintJob } from "../services/simulators.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const storage = multer.diskStorage({
  destination: (_, __, cb) => cb(null, path.join(__dirname, "../../uploads")),
  filename: (_, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname.replace(/\s+/g, "-")}`);
  },
});

const upload = multer({
  storage,
  fileFilter: (_, file, cb) => {
    const isPdf = path.extname(file.originalname).toLowerCase() === ".pdf";
    if (!isPdf) {
      return cb(new Error("Only PDF files are allowed"));
    }
    cb(null, true);
  },
});

export const printRouter = express.Router();

printRouter.post(
  "/jobs",
  requireAuth,
  requireRole("student"),
  upload.single("document"),
  (req, res) => {
    const copies = Number(req.body.copies || 1);
    if (!req.file) {
      return res.status(400).json({ message: "PDF file is required" });
    }
    if (!Number.isFinite(copies) || copies < 1) {
      return res.status(400).json({ message: "Copies must be at least 1" });
    }

    const now = Date.now();
    const job = {
      id: uuidv4(),
      token: `PRT-${now.toString().slice(-6)}`,
      studentId: req.user.id,
      studentName: req.user.name,
      fileName: req.file.originalname,
      storedFileName: req.file.filename,
      copies,
      paymentStatus: "Paid",
      status: "Queued",
      printerId: null,
      createdAt: now,
    };

    db.printJobs.push(job);
    assignPrintJobs();

    return res.status(201).json({
      message: "Print job created",
      job: serializePrintJob(job),
    });
  }
);

printRouter.get("/jobs", requireAuth, (req, res) => {
  const jobs =
    req.user.role === "student"
      ? db.printJobs.filter((job) => job.studentId === req.user.id)
      : db.printJobs;

  const ordered = [...jobs].sort((a, b) => b.createdAt - a.createdAt).map(serializePrintJob);
  return res.json(ordered);
});

printRouter.get("/jobs/:id", requireAuth, (req, res) => {
  const job = db.printJobs.find((entry) => entry.id === req.params.id);
  if (!job) {
    return res.status(404).json({ message: "Print job not found" });
  }

  if (req.user.role === "student" && job.studentId !== req.user.id) {
    return res.status(403).json({ message: "Access denied" });
  }

  return res.json(serializePrintJob(job));
});

printRouter.get("/printers", requireAuth, (req, res) => {
  return res.json(db.printers);
});
