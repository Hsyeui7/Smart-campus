export default function StatusBadge({ status }) {
  const map = {
    Queued: "badge queued",
    Printing: "badge printing",
    Ready: "badge ready",
    Completed: "badge complete",
    Preparing: "badge printing",
    Paid: "badge ready",
    Idle: "badge idle",
  };

  return <span className={map[status] || "badge idle"}>{status}</span>;
}
