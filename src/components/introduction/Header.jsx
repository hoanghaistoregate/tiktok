import { useEffect, useRef, useState } from "react";
import AuthModal from "../auth/AuthModal";
import { useAuth } from "../../context/AuthContext";
import { Link } from "react-router-dom";
import "./Header.css";

const Header = ({ onSearch }) => {
  const { user, logout } = useAuth();
  const [query, setQuery] = useState("");
  const [authOpen, setAuthOpen] = useState(false); // hộp thoại chọn đăng ký / đăng nhập
  const [menuOpen, setMenuOpen] = useState(false); // menu của người đã đăng nhập
  const menuRef = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSearch) onSearch(query.trim());
  };

  // Menu người dùng: bấm ra ngoài hoặc nhấn Esc thì đóng
  useEffect(() => {
    if (!menuOpen) return;
    const onClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target))
        setMenuOpen(false);
    };
    const onKey = (e) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    document.addEventListener("mousedown", onClickOutside);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClickOutside);
      document.removeEventListener("keydown", onKey);
    };
  }, [menuOpen]);

  const handleLogout = () => {
    logout();
    setMenuOpen(false);
  };

  return (
    <header className="header d-flex align-items-center gap-3 px-4 py-3">
      {/* Nút quay lại / đi tiếp */}
      <div className="header-nav d-flex gap-1">
        <button type="button" className="header-btn" aria-label="Quay lại">
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>
        <button type="button" className="header-btn" aria-label="Đi tiếp">
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M9 18l6-6-6-6" />
          </svg>
        </button>
      </div>

      {/* Ô tìm kiếm */}
      <form
        className="header-search flex-grow-1"
        role="search"
        onSubmit={handleSubmit}
      >
        <label htmlFor="header-search-input" className="visually-hidden">
          Tìm kiếm
        </label>
        <input
          id="header-search-input"
          type="search"
          className="form-control"
          placeholder="Tìm bài hát, nghệ sĩ, playlist yêu thích..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </form>

      {/* Bên phải */}
      <div className="header-right d-flex align-items-center gap-3 ms-auto">
        <a href="#plus" className="header-plus">
          Khám phá Plus
        </a>

        {user ? (
          // Đã đăng nhập: hiện tên người dùng
          <div className="header-account-wrap" ref={menuRef}>
            <button
              type="button"
              className="header-account header-user"
              aria-expanded={menuOpen}
              aria-controls="account-menu"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              <span className="header-avatar" aria-hidden="true">
                {user.name.trim().charAt(0).toUpperCase()}
              </span>
              <span className="header-user-name">{user.name}</span>
            </button>

            {menuOpen && (
              <div id="account-menu" className="header-menu">
                <div className="header-menu-info">
                  <strong>{user.name}</strong>
                  <span>{user.email}</span>
                  {user.role === "admin" && <span>Quản trị viên</span>}
                </div>
                <div className="header-menu-line" />
                {user.role === "admin" && (
                  <Link
                    to="/admin"
                    className="header-menu-item"
                    onClick={() => setMenuOpen(false)}
                  >
                    Quản lý bài hát
                  </Link>
                )}
                <button
                  type="button"
                  className="header-menu-item"
                  onClick={handleLogout}
                >
                  Đăng xuất
                </button>
              </div>
            )}
          </div>
        ) : (
          // Chưa đăng nhập: bấm để mở hộp thoại
          <button
            type="button"
            className="header-account"
            onClick={() => setAuthOpen(true)}
          >
            Tài khoản
          </button>
        )}
      </div>

      <AuthModal open={authOpen} onClose={() => setAuthOpen(false)} />
    </header>
  );
};

export default Header;
