import { Navigate, Route, Routes } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import AuthPage from "./pages/AuthPage";
import StudentDashboard from "./pages/StudentDashboard";
import PrintPage from "./pages/PrintPage";
import DiningPage from "./pages/DiningPage";
import StatusPage from "./pages/StatusPage";
import AdminDashboard from "./pages/AdminDashboard";
import VendorDashboard from "./pages/VendorDashboard";

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<AuthPage mode="login" />} />
      <Route path="/signup" element={<AuthPage mode="signup" />} />

      <Route element={<ProtectedRoute roles={["student"]} />}>
        <Route path="/" element={<StudentDashboard />} />
        <Route path="/print" element={<PrintPage />} />
        <Route path="/dining" element={<DiningPage />} />
        <Route path="/status" element={<StatusPage />} />
      </Route>

      <Route element={<ProtectedRoute roles={["admin"]} />}>
        <Route path="/admin" element={<AdminDashboard />} />
      </Route>

      <Route element={<ProtectedRoute roles={["vendor"]} />}>
        <Route path="/vendor" element={<VendorDashboard />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
