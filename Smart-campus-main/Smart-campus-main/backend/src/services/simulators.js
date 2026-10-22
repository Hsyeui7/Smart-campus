import { db } from "../data.js";

const PRINT_SPEED_MS = 9000;
const READY_DELAY_MS = 5000;
const PREPARING_INTERVAL_MS = 12000;
const READY_INTERVAL_MS = 10000;

const getPrintStatus = (job) => {
  if (job.status === "Completed") return "Ready";
  return job.status;
};

export const assignPrintJobs = () => {
  const queuedJobs = db.printJobs
    .filter((job) => job.status === "Queued")
    .sort((a, b) => a.createdAt - b.createdAt);

  db.printers.forEach((printer) => {
    if (printer.currentJobId || !queuedJobs.length) return;

    const nextJob = queuedJobs.shift();
    printer.currentJobId = nextJob.id;
    printer.status = "Printing";

    nextJob.status = "Printing";
    nextJob.printerId = printer.id;
    nextJob.startedAt = Date.now();
  });
};

export const tickPrintJobs = () => {
  const now = Date.now();
  db.printJobs.forEach((job) => {
    if (job.status === "Printing" && now - job.startedAt >= PRINT_SPEED_MS) {
      job.status = "Completed";
      job.completedAt = now;
      const printer = db.printers.find((item) => item.id === job.printerId);
      if (printer) {
        printer.currentJobId = null;
        printer.status = "Idle";
      }
    }
  });

  assignPrintJobs();
};

export const tickDiningOrders = () => {
  const now = Date.now();

  const queuedOrders = db.diningOrders
    .filter((order) => order.status === "Queued")
    .sort((a, b) => a.createdAt - b.createdAt);

  const activePreparing = db.diningOrders.filter((order) => order.status === "Preparing");

  if (activePreparing.length < 3 && queuedOrders.length) {
    const slots = 3 - activePreparing.length;
    queuedOrders.slice(0, slots).forEach((order) => {
      order.status = "Preparing";
      order.preparingAt = now;
    });
  }

  db.diningOrders.forEach((order) => {
    if (order.status === "Preparing" && now - order.preparingAt >= PREPARING_INTERVAL_MS) {
      order.status = "Ready";
      order.readyAt = now;
    } else if (order.status === "Ready" && now - order.readyAt >= READY_INTERVAL_MS) {
      order.status = "Completed";
      order.completedAt = now;
    }
  });
};

export const computeOrdersAhead = (targetOrderId) => {
  const activeStatuses = ["Queued", "Preparing"];
  const activeOrders = db.diningOrders
    .filter((order) => activeStatuses.includes(order.status))
    .sort((a, b) => a.createdAt - b.createdAt);

  const index = activeOrders.findIndex((order) => order.id === targetOrderId);
  return index > 0 ? index : 0;
};

export const estimateDiningWait = (order) => {
  const ahead = computeOrdersAhead(order.id);
  const base = order.estimatedPrepMinutes || 8;
  return ahead * 4 + base;
};

export const serializePrintJob = (job) => ({
  ...job,
  displayStatus: getPrintStatus(job),
});

export const startSimulators = () => {
  setInterval(tickPrintJobs, 3000);
  setInterval(tickDiningOrders, 4000);
};

export const getDashboardSummary = () => ({
  totalPrintJobs: db.printJobs.length,
  activePrintJobs: db.printJobs.filter((job) => ["Queued", "Printing"].includes(job.status)).length,
  totalDiningOrders: db.diningOrders.length,
  activeDiningOrders: db.diningOrders.filter((order) => ["Queued", "Preparing", "Ready"].includes(order.status)).length,
});
