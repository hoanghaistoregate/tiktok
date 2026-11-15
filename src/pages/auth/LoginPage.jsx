import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import PasswordField from "../../components/auth/PasswordField";
import { useAuth } from "../../context/AuthContext";
import "./AuthPage.css";

const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const result = await login(form.email, form.password);
    setLoading(false);

    if (!result.ok) {
      setError(result.message);
      return;
    }
    navigate("/"); // đăng nhập xong về trang chủ
  };

  return (
    <main className="auth-page">
      <div className="auth-card">
        <Link to="/" className="auth-logo">
          LUMI MUSIC
        </Link>
        <h1 className="auth-title">Đăng nhập</h1>
        <p className="auth-sub">Chào mừng bạn quay lại.</p>

        {/* Hiện khi vừa đăng ký xong và được chuyển sang đây */}
        {location.state?.registered && (
          <p className="auth-notice" role="status">
            Đăng ký thành công. Hãy đăng nhập để tiếp tục.
          </p>
        )}

        <form onSubmit={handleSubmit}>
          <div className="auth-field">
            <label htmlFor="login-email">Email</label>
            <input
              id="login-email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={form.email}
              onChange={handleChange}
            />
          </div>

          <PasswordField
            id="login-password"
            name="password"
            label="Mật khẩu"
            autoComplete="current-password"
            value={form.password}
            onChange={handleChange}
          />

          {error && (
            <p className="auth-error" role="alert">
              {error}
            </p>
          )}

          <button type="submit" className="auth-submit" disabled={loading}>
            {loading ? "Đang đăng nhập..." : "Đăng nhập"}
          </button>
        </form>

        <div className="auth-divider">
          <span>hoặc</span>
        </div>

        <button
          type="button"
          className="auth-zalo"
          onClick={() => console.log("Đăng nhập bằng Zalo")}
        >
          Đăng nhập bằng Zalo
        </button>

        <p className="auth-switch">
          Chưa có tài khoản? <Link to="/register">Đăng ký</Link>
        </p>
      </div>
    </main>
  );
};

export default LoginPage;
