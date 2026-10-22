import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ roles }) {
  const { isAuthenticated, loading, user } = useAuth();

  if (loading) return <div className="page-shell">Loading session...</div>;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (roles && !roles.includes(user.role)) {
    const fallbackByRole = {
      student: "/",
      admin: "/admin",
      vendor: "/vendor",
    };
    return <Navigate to={fallbackByRole[user.role] || "/login"} replace />;
  }

  return <Outlet />;
}
