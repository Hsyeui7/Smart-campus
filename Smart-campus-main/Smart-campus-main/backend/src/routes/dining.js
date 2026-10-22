import express from "express";
import { v4 as uuidv4 } from "uuid";
import { db } from "../data.js";
import { requireAuth, requireRole } from "../middleware/auth.js";
import { computeOrdersAhead, estimateDiningWait } from "../services/simulators.js";

export const diningRouter = express.Router();

const enrichOrder = (order) => ({
  ...order,
  ordersAhead: computeOrdersAhead(order.id),
  estimatedWaitMinutes: estimateDiningWait(order),
});

diningRouter.get("/menu", requireAuth, (req, res) => {
  return res.json(db.menuItems);
});

diningRouter.post("/orders", requireAuth, requireRole("student"), (req, res) => {
  const { items } = req.body;
  if (!Array.isArray(items) || !items.length) {
    return res.status(400).json({ message: "At least one item is required" });
  }

  const normalizedItems = items
    .map((entry) => {
      const menuItem = db.menuItems.find((item) => item.id === entry.id);
      const quantity = Number(entry.quantity || 1);
      if (!menuItem || quantity < 1) return null;
      return {
        id: menuItem.id,
        name: menuItem.name,
        price: menuItem.price,
        quantity,
        lineTotal: menuItem.price * quantity,
      };
    })
    .filter(Boolean);

  if (!normalizedItems.length) {
    return res.status(400).json({ message: "No valid menu items selected" });
  }

  const totalAmount = normalizedItems.reduce((sum, item) => sum + item.lineTotal, 0);
  const estimatedPrepMinutes = normalizedItems.reduce(
    (sum, item) => sum + (db.menuItems.find((menu) => menu.id === item.id)?.prepMinutes || 5) * item.quantity,
    0
  );

  const now = Date.now();
  const order = {
    id: uuidv4(),
    token: `DIN-${now.toString().slice(-6)}`,
    studentId: req.user.id,
    studentName: req.user.name,
    items: normalizedItems,
    totalAmount,
    estimatedPrepMinutes: Math.max(6, Math.round(estimatedPrepMinutes / normalizedItems.length)),
    paymentStatus: "Paid",
    status: "Queued",
    createdAt: now,
  };

  db.diningOrders.push(order);

  return res.status(201).json({
    message: "Order placed successfully",
    order: enrichOrder(order),
  });
});

diningRouter.get("/orders", requireAuth, (req, res) => {
  const orders =
    req.user.role === "student"
      ? db.diningOrders.filter((order) => order.studentId === req.user.id)
      : db.diningOrders;

  const ordered = [...orders].sort((a, b) => b.createdAt - a.createdAt).map(enrichOrder);
  return res.json(ordered);
});

diningRouter.get("/orders/:id", requireAuth, (req, res) => {
  const order = db.diningOrders.find((entry) => entry.id === req.params.id);
  if (!order) {
    return res.status(404).json({ message: "Order not found" });
  }

  if (req.user.role === "student" && order.studentId !== req.user.id) {
    return res.status(403).json({ message: "Access denied" });
  }

  return res.json(enrichOrder(order));
});

diningRouter.patch("/orders/:id/status", requireAuth, requireRole("vendor"), (req, res) => {
  const { status } = req.body;
  const allowedStatuses = ["Preparing", "Ready", "Completed"];
  const order = db.diningOrders.find((entry) => entry.id === req.params.id);

  if (!order) {
    return res.status(404).json({ message: "Order not found" });
  }

  if (!allowedStatuses.includes(status)) {
    return res.status(400).json({ message: "Invalid order status" });
  }

  order.status = status;
  if (status === "Preparing") order.preparingAt = Date.now();
  if (status === "Ready") order.readyAt = Date.now();
  if (status === "Completed") order.completedAt = Date.now();

  return res.json({
    message: "Order status updated",
    order: enrichOrder(order),
  });
});
