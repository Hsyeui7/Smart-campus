import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import { authRouter } from "./routes/auth.js";
import { printRouter } from "./routes/print.js";
import { diningRouter } from "./routes/dining.js";
import { dashboardRouter } from "./routes/dashboard.js";
import { startSimulators } from "./services/simulators.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

app.get("/api/health", (_, res) => {
  res.json({ message: "Smart Campus API is running" });
});

app.use("/api/auth", authRouter);
app.use("/api/print", printRouter);
app.use("/api/dining", diningRouter);
app.use("/api/dashboard", dashboardRouter);

app.use((error, _, res, __) => {
  return res.status(400).json({ message: error.message || "Something went wrong" });
});

app.listen(PORT, () => {
  console.log(`Smart Campus backend running on port ${PORT}`);
  startSimulators();
});
