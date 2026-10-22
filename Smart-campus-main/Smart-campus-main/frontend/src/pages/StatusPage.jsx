import { useEffect, useState } from "react";
import api from "../api";
import Shell from "../components/Shell";
import StatusBadge from "../components/StatusBadge";

export default function StatusPage() {
  const [printJobs, setPrintJobs] = useState([]);
  const [orders, setOrders] = useState([]);

  const loadStatus = async () => {
    const [printRes, diningRes] = await Promise.all([api.get("/print/jobs"), api.get("/dining/orders")]);
    setPrintJobs(printRes.data);
    setOrders(diningRes.data);
  };

  useEffect(() => {
    loadStatus().catch(() => {});
    const timer = setInterval(() => loadStatus().catch(() => {}), 4000);
    return () => clearInterval(timer);
  }, []);

  return (
    <Shell title="Live Status">
      <div className="two-column">
        <section className="panel">
          <h3>Print queue</h3>
          <div className="stack-list">
            {printJobs.map((job) => (
              <div key={job.id} className="ticket-card">
                <div className="ticket-head">
                  <strong>{job.token}</strong>
                  <StatusBadge status={job.displayStatus} />
                </div>
                <p>{job.fileName}</p>
                <p className="muted">Printer: {job.printerId || "Awaiting assignment"}</p>
              </div>
            ))}
            {!printJobs.length ? <p className="muted">No active print jobs.</p> : null}
          </div>
        </section>

        <section className="panel">
          <h3>Dining orders</h3>
          <div className="stack-list">
            {orders.map((order) => (
              <div key={order.id} className="ticket-card">
                <div className="ticket-head">
                  <strong>{order.token}</strong>
                  <StatusBadge status={order.status} />
                </div>
                <p>Orders ahead: {order.ordersAhead}</p>
                <p className="muted">Estimated wait: {order.estimatedWaitMinutes} mins</p>
              </div>
            ))}
            {!orders.length ? <p className="muted">No dining orders yet.</p> : null}
          </div>
        </section>
      </div>
    </Shell>
  );
}
