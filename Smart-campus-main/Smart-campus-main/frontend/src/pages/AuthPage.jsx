import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const initialState = { name: "", email: "", password: "", role: "student" };

export default function AuthPage({ mode }) {
  const isLogin = mode === "login";
  const [form, setForm] = useState(initialState);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { login, signup } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError("");

    try {
      const authAction = isLogin ? login : signup;
      const payload = isLogin
        ? { email: form.email, password: form.password }
        : form;
      const result = await authAction(payload);

      const redirectMap = {
        student: "/",
        admin: "/admin",
        vendor: "/vendor",
      };

      navigate(location.state?.from?.pathname || redirectMap[result.user.role]);
    } catch (err) {
      setError(err.response?.data?.message || "Unable to continue");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <p className="eyebrow">DIGIDoze</p>
        <h1>{isLogin ? "Welcome back" : "Create your account"}</h1>
        <p className="muted">
          Access smart printing, mobile dining, and role-based campus dashboards.
        </p>

        <form className="form-grid" onSubmit={handleSubmit}>
          {!isLogin && (
            <label>
              Full name
              <input name="name" value={form.name} onChange={handleChange} required />
            </label>
          )}
          <label>
            Email
            <input name="email" type="email" value={form.email} onChange={handleChange} required />
          </label>
          <label>
            Password
            <input
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              required
            />
          </label>
          {!isLogin && (
            <label>
              Role
              <select name="role" value={form.role} onChange={handleChange}>
                <option value="student">Student</option>
                <option value="admin">Admin</option>
                <option value="vendor">Vendor</option>
              </select>
            </label>
          )}
          {error ? <div className="error-banner">{error}</div> : null}
          <button className="primary-btn" type="submit" disabled={loading}>
            {loading ? "Please wait..." : isLogin ? "Login" : "Sign up"}
          </button>
        </form>

        <div className="helper-card">
          <strong>Demo accounts</strong>
          <p>student@campus.local / student123</p>
          <p>admin@campus.local / admin123</p>
          <p>vendor@campus.local / vendor123</p>
        </div>

        <p className="switch-link">
          {isLogin ? "Need an account?" : "Already registered?"}{" "}
          <Link to={isLogin ? "/signup" : "/login"}>{isLogin ? "Sign up" : "Login"}</Link>
        </p>
      </div>
    </div>
  );
}
