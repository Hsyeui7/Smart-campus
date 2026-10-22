import { Link } from "react-router-dom";
import Shell from "../components/Shell";

const cards = [
  {
    title: "Smart Printing",
    body: "Upload PDF files, pay instantly, and track printer allocation in real time.",
    to: "/print",
  },
  {
    title: "Smart Dining",
    body: "Place mobile-first food orders, view queue position, and follow kitchen status live.",
    to: "/dining",
  },
  {
    title: "Live Status",
    body: "Watch all your active print jobs and meal orders from one place.",
    to: "/status",
  },
];

export default function StudentDashboard() {
  return (
    <Shell title="Student Dashboard">
      <section className="hero-card">
        <div>
          <p className="eyebrow">Everything in one place</p>
          <h2>Campus services designed for quick student flow</h2>
          <p className="muted" >
            Submit documents, skip dining queues, and track every token from your phone.
          </p>
        </div>
      </section>

      <section className="card-grid">
        {cards.map((card) => (
          <article key={card.title} className="panel">
            <h3>{card.title}</h3>
            <p className="muted">{card.body}</p>
            <Link className="primary-btn inline-btn" to={card.to}>
              Open
            </Link>
          </article>
        ))}
      </section>
    </Shell>
  );
}
