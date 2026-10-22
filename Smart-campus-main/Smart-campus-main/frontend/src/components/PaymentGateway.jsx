export default function PaymentGateway({
  title,
  subtitle,
  amount,
  payeeLabel,
  payeeValue,
  referenceLabel,
  referenceValue,
}) {
  return (
    <section className="payment-gateway">
      <div className="gateway-shell">
        <div className="gateway-topbar">
          <div>
            <p className="eyebrow gateway-eyebrow">Secure campus payment</p>
            <h2>{title}</h2>
          </div>
          <span className="gateway-badge">Gateway Active</span>
        </div>

        <div className="gateway-body">
          <div className="gateway-amount-card">
            <span>Amount</span>
            <strong>Rs. {amount}</strong>
            <p>{subtitle}</p>
          </div>

          <div className="gateway-details">
            <div className="gateway-row">
              <span>{payeeLabel}</span>
              <strong>{payeeValue}</strong>
            </div>
            <div className="gateway-row">
              <span>{referenceLabel}</span>
              <strong>{referenceValue}</strong>
            </div>
            <div className="gateway-row">
              <span>Mode</span>
              <strong>Campus Wallet / UPI Mock</strong>
            </div>
          </div>
        </div>

        <div className="gateway-progress">
          <div className="gateway-loader" />
          <div className="gateway-step done">Authenticating student account</div>
          <div className="gateway-step active">Processing payment request</div>
          <div className="gateway-step">Generating receipt</div>
        </div>
      </div>
    </section>
  );
}
