import { useEffect, useState } from "react";
import api from "../api";
import Shell from "../components/Shell";
import StatusBadge from "../components/StatusBadge";

const actions = ["Preparing", "Ready", "Completed"];

export default function VendorDashboard() {
  const [overview, setOverview] = useState(null);
  const [updatingId, setUpdatingId] = useState("");

  const loadOverview = async () => {
    const { data } = await api.get("/dashboard/vendor/overview");
    setOverview(data);
  };

  useEffect(() => {
    loadOverview().catch(() => {});
    const timer = setInterval(() => loadOverview().catch(() => {}), 4000);
    return () => clearInterval(timer);
  }, []);

  const updateStatus = async (id, status) => {
    setUpdatingId(id);
    try {
      await api.patch(`/dining/orders/${id}/status`, { status });
      await loadOverview();
    } finally {
      setUpdatingId("");
    }
  };

  if (!overview) {
    return <Shell title="Vendor Dashboard">Loading vendor dashboard...</Shell>;
  }

  return (
    <Shell title="Vendor Dashboard">
      <section className="stats-grid">
        <div className="stat-card">
          <span>Total orders</span>
          <strong>{overview.summary.totalOrders}</strong>
        </div>
        <div className="stat-card">
          <span>Active orders</span>
          <strong>{overview.summary.activeOrders}</strong>
        </div>
      </section>

      <section className="panel">
        <h3>Incoming orders</h3>
        <div className="stack-list">
          {overview.orders.map((order) => (
            <div key={order.id} className="vendor-order">
              <div className="ticket-head">
                <div>
                  <strong>{order.token}</strong>
                  <p className="muted">{order.studentName}</p>
                </div>
                <StatusBadge status={order.status} />
              </div>
              <p className="muted">
                Queue ahead: {order.ordersAhead} • ETA: {order.estimatedWaitMinutes} mins
              </p>
              <ul className="order-items">
                {order.items.map((item) => (
                  <li key={item.id}>
                    {item.name} x {item.quantity}
                  </li>
                ))}
              </ul>
              <div className="action-row">
                {actions.map((status) => (
                  <button
                    key={status}
                    className="secondary-btn inline-btn"
                    disabled={updatingId === order.id || order.status === "Completed"}
                    onClick={() => updateStatus(order.id, status)}
                  >
                    {status}
                  </button>
                ))}
              </div>
            </div>
          ))}
          {!overview.orders.length ? <p className="muted">No orders in the queue.</p> : null}
        </div>
      </section>
    </Shell>
  );
}
