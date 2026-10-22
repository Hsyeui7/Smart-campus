import { useEffect, useState } from "react";
import api from "../api";
import Shell from "../components/Shell";
import StatusBadge from "../components/StatusBadge";

export default function AdminDashboard() {
  const [overview, setOverview] = useState(null);

  useEffect(() => {
    const load = async () => {
      const { data } = await api.get("/dashboard/admin/overview");
      setOverview(data);
    };
    load().catch(() => {});
    const timer = setInterval(() => load().catch(() => {}), 4000);
    return () => clearInterval(timer);
  }, []);

  if (!overview) {
    return <Shell title="Printer Dashboard">Loading printer dashboard...</Shell>;
  }

  return (
    <Shell title="Printer Dashboard">
      <section className="stats-grid">
        <div className="stat-card">
          <span>Total print jobs</span>
          <strong>{overview.summary.totalPrintJobs}</strong>
        </div>
        <div className="stat-card">
          <span>Active print jobs</span>
          <strong>{overview.summary.activePrintJobs}</strong>
        </div>
      </section>

      <div className="two-column">
        <section className="panel">
          <h3>Printer fleet</h3>
          <div className="stack-list">
            {overview.printers.map((printer) => (
              <div key={printer.id} className="list-row">
                <div>
                  <strong>{printer.name}</strong>
                  <p className="muted">{printer.id}</p>
                </div>
                <StatusBadge status={printer.status} />
              </div>
            ))}
          </div>
        </section>

        <section className="panel">
          <h3>Recent print jobs</h3>
          <div className="stack-list">
            {overview.printJobs.slice(0, 8).map((job) => (
              <div key={job.id} className="list-row">
                <div>
                  <strong>{job.token}</strong>
                  <p className="muted">
                    {job.studentName} • {job.fileName}
                  </p>
                </div>
                <StatusBadge status={job.status} />
              </div>
            ))}
          </div>
        </section>
      </div>
    </Shell>
  );
}
