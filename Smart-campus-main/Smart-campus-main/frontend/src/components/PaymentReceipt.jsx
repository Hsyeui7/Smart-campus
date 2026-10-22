export default function PaymentReceipt({
  heading,
  amount,
  transactionId,
  paymentFor,
  receiptLines,
  metaLines,
  email,
  onDone,
  doneLabel = "Done",
}) {
  return (
    <section className="payment-receipt">
      <div className="receipt-card">
        <div className="receipt-success">
          <span className="receipt-check">✓</span>
          <div>
            <p className="eyebrow">Payment confirmed</p>
            <h2>{heading}</h2>
            <p className="muted">{paymentFor}</p>
          </div>
        </div>

        <div className="receipt-total">
          <span>Total paid</span>
          <strong>Rs. {amount}</strong>
        </div>

        <div className="receipt-grid">
          {receiptLines.map((line) => (
            <div key={line.label} className="receipt-row">
              <span>{line.label}</span>
              <strong>{line.value}</strong>
            </div>
          ))}
        </div>

        <div className="receipt-divider" />

        <div className="receipt-grid">
          <div className="receipt-row">
            <span>Transaction ID</span>
            <strong>{transactionId}</strong>
          </div>
          {email ? (
            <div className="receipt-row">
              <span>Registered email</span>
              <strong>{email}</strong>
            </div>
          ) : null}
          {metaLines.map((line) => (
            <div key={line.label} className="receipt-row">
              <span>{line.label}</span>
              <strong>{line.value}</strong>
            </div>
          ))}
        </div>

        <button className="primary-btn" type="button" onClick={onDone}>
          {doneLabel}
        </button>
      </div>
    </section>
  );
}
