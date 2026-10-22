import express from "express";
import { db } from "../data.js";
import { requireAuth, requireRole } from "../middleware/auth.js";
import { computeOrdersAhead, estimateDiningWait, getDashboardSummary, serializePrintJob } from "../services/simulators.js";

export const dashboardRouter = express.Router();

dashboardRouter.get("/admin/overview", requireAuth, requireRole("admin"), (req, res) => {
  return res.json({
    summary: getDashboardSummary(),
    printers: db.printers,
    printJobs: [...db.printJobs].sort((a, b) => b.createdAt - a.createdAt).map(serializePrintJob),
  });
});

dashboardRouter.get("/vendor/overview", requireAuth, requireRole("vendor"), (req, res) => {
  const orders = [...db.diningOrders]
    .sort((a, b) => b.createdAt - a.createdAt)
    .map((order) => ({
      ...order,
      ordersAhead: computeOrdersAhead(order.id),
      estimatedWaitMinutes: estimateDiningWait(order),
    }));

  return res.json({
    summary: {
      totalOrders: db.diningOrders.length,
      activeOrders: db.diningOrders.filter((order) => ["Queued", "Preparing", "Ready"].includes(order.status)).length,
    },
    orders,
    menuItems: db.menuItems,
  });
});
