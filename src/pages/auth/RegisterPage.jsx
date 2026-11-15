import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import PasswordField from "../../components/auth/PasswordField";
import { useAuth } from "../../context/AuthContext";
import "./AuthPage.css";

const RegisterPage = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirm: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (form.password.length < 6) {
      setError("Mật khẩu cần ít nhất 6 ký tự.");
      return;
    }
    if (form.password !== form.confirm) {
      setError("Mật khẩu nhập lại chưa khớp.");
      return;
    }

    setLoading(true);
    const result = await register(form.name, form.email, form.password);
    setLoading(false);

    if (!result.ok) {
      setError(result.message);
      return;
    }
    setError("");
    navigate("/login", { state: { registered: true } }); // đăng ký xong sang đăng nhập
  };

  return (
    <main className="auth-page">
      <div className="auth-card">
        <Link to="/" className="auth-logo">
          LUMI MUSIC
        </Link>
        <h1 className="auth-title">Tạo tài khoản</h1>
        <p className="auth-sub">Tham gia để nghe nhạc theo cách của bạn.</p>

        <form onSubmit={handleSubmit}>
          <div className="auth-field">
            <label htmlFor="reg-name">Tên hiển thị</label>
            <input
              id="reg-name"
              name="name"
              type="text"
              autoComplete="name"
              required
              value={form.name}
              onChange={handleChange}
            />
          </div>

          <div className="auth-field">
            <label htmlFor="reg-email">Email</label>
            <input
              id="reg-email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={form.email}
              onChange={handleChange}
            />
          </div>

          <PasswordField
            id="reg-password"
            name="password"
            label="Mật khẩu"
            autoComplete="new-password"
            value={form.password}
            onChange={handleChange}
          />
          <PasswordField
            id="reg-confirm"
            name="confirm"
            label="Nhập lại mật khẩu"
            autoComplete="new-password"
            value={form.confirm}
            onChange={handleChange}
          />

          {error && (
            <p className="auth-error" role="alert">
              {error}
            </p>
          )}

          <button type="submit" className="auth-submit" disabled={loading}>
            {loading ? "Đang đăng ký..." : "Đăng ký"}
          </button>
        </form>

        <p className="auth-switch">
          Đã có tài khoản? <Link to="/login">Đăng nhập</Link>
        </p>
      </div>
    </main>
  );
};

export default RegisterPage;
