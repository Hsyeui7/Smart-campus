import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const studentLinks = [
  { to: "/", label: "Dashboard" },
  { to: "/print", label: "Print" },
  { to: "/dining", label: "Dining" },
  { to: "/status", label: "Status" },
];

const adminLinks = [{ to: "/admin", label: "Printer Dashboard" }];
const vendorLinks = [{ to: "/vendor", label: "Vendor Dashboard" }];

export default function Shell({ title, children }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const navLinks = [
    ...(user?.role === "student" ? studentLinks : []),
    ...(user?.role === "admin" ? adminLinks : []),
    ...(user?.role === "vendor" ? vendorLinks : []),
  ];

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <Link to="/" className="brand">
          Smart Campus
        </Link>
        <div className="user-card">
          <strong>{user?.name}</strong>
          <span>{user?.role}</span>
        </div>
        <nav className="nav-list">
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}
            >
              {link.label}
            </NavLink>
          ))}
        </nav>
        <button className="secondary-btn" onClick={handleLogout}>
          Logout
        </button>
      </aside>
      <main className="page-shell">
        <header className="page-header">
          <div>
            <p className="eyebrow">Connected campus services</p>
            <h1>{title}</h1>
          </div>
        </header>
        {children}
      </main>
    </div>
  );
}
