import { useEffect, useState } from "react";
import api from "../api";
import PaymentGateway from "../components/PaymentGateway";
import PaymentReceipt from "../components/PaymentReceipt";
import Shell from "../components/Shell";
import StatusBadge from "../components/StatusBadge";
import { useAuth } from "../context/AuthContext";

const PRINT_RATE = 7;

export default function PrintPage() {
  const { user } = useAuth();
  const [file, setFile] = useState(null);
  const [copies, setCopies] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [jobs, setJobs] = useState([]);
  const [printers, setPrinters] = useState([]);
  const [paymentPhase, setPaymentPhase] = useState("idle");
  const [receipt, setReceipt] = useState(null);

  const loadData = async () => {
    const [jobsResponse, printerResponse] = await Promise.all([
      api.get("/print/jobs"),
      api.get("/print/printers"),
    ]);
    setJobs(jobsResponse.data);
    setPrinters(printerResponse.data);
  };

  useEffect(() => {
    loadData().catch(() => {});
    const timer = setInterval(() => loadData().catch(() => {}), 4000);
    return () => clearInterval(timer);
  }, []);

  const amount = copies * PRINT_RATE;

  const formatDateTime = (value) =>
    new Intl.DateTimeFormat("en-IN", {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(value);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!file) {
      setError("Please choose a PDF file");
      return;
    }

    setSubmitting(true);
    setError("");
    setPaymentPhase("processing");

    const payload = new FormData();
    payload.append("document", file);
    payload.append("copies", copies);

    try {
      await new Promise((resolve) => setTimeout(resolve, 2400));
      const { data } = await api.post("/print/jobs", payload, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setReceipt({
        heading: "Print receipt generated",
        amount,
        transactionId: `TXN-PRT-${Date.now().toString().slice(-8)}`,
        paymentFor: `Smart Printing for ${file.name}`,
        receiptLines: [
          { label: "Print token", value: data.job.token },
          { label: "File", value: data.job.fileName },
          { label: "Copies", value: data.job.copies },
          { label: "Status", value: data.job.displayStatus },
        ],
        metaLines: [
          { label: "Processed at", value: formatDateTime(data.job.createdAt) },
          { label: "Assigned printer", value: data.job.printerId || "Waiting" },
          { label: "Payment status", value: data.job.paymentStatus },
        ],
      });
      setPaymentPhase("success");
      setFile(null);
      setCopies(1);
      event.target.reset();
      await loadData();
    } catch (err) {
      setPaymentPhase("idle");
      setError(err.response?.data?.message || "Unable to submit print job");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Shell title="Smart Printing">
      {paymentPhase === "processing" ? (
        <PaymentGateway
          title="Processing your print payment"
          subtitle="The gateway is validating the PDF and reserving the next print token."
          amount={amount}
          payeeLabel="Merchant"
          payeeValue="Campus Printing Hub"
          referenceLabel="Document"
          referenceValue={file?.name || "Pending file"}
        />
      ) : null}

      {paymentPhase === "success" && receipt ? (
        <PaymentReceipt
          heading={receipt.heading}
          amount={receipt.amount}
          transactionId={receipt.transactionId}
          paymentFor={receipt.paymentFor}
          receiptLines={receipt.receiptLines}
          metaLines={receipt.metaLines}
          email={user?.email}
          doneLabel="Submit another print"
          onDone={() => setPaymentPhase("idle")}
        />
      ) : null}

      <div className="two-column">
        <section className="panel">
          <h3>Upload PDF</h3>
          <p className="muted">Payment is mocked at Rs. {PRINT_RATE} per copy. Successful checkout creates a print token.</p>
          <form className="form-grid" onSubmit={handleSubmit}>
            <label>
              PDF file
              <input type="file" accept="application/pdf" onChange={(e) => setFile(e.target.files?.[0] || null)} />
            </label>
            <label>
              Copies
              <input
                type="number"
                min="1"
                value={copies}
                onChange={(e) => setCopies(Number(e.target.value))}
              />
            </label>
            {file ? (
              <div className="helper-card">
                <strong>Selected file</strong>
                <p>{file.name}</p>
              </div>
            ) : null}
            {error ? <div className="error-banner">{error}</div> : null}
            <button className="primary-btn" type="submit" disabled={submitting}>
              {submitting ? "Opening gateway..." : `Pay Rs. ${amount} & Print`}
            </button>
          </form>
        </section>

        <section className="panel">
          <h3>Printer Activity</h3>
          <div className="stack-list">
            {printers.map((printer) => (
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
      </div>

      <section className="panel">
        <h3>Your print jobs</h3>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Token</th>
                <th>File</th>
                <th>Copies</th>
                <th>Status</th>
                <th>Printer</th>
              </tr>
            </thead>
            <tbody>
              {jobs.map((job) => (
                <tr key={job.id}>
                  <td>{job.token}</td>
                  <td>{job.fileName}</td>
                  <td>{job.copies}</td>
                  <td>
                    <StatusBadge status={job.displayStatus} />
                  </td>
                  <td>{job.printerId || "Waiting"}</td>
                </tr>
              ))}
              {!jobs.length ? (
                <tr>
                  <td colSpan="5" className="empty-cell">
                    No print jobs yet.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </section>
    </Shell>
  );
}
