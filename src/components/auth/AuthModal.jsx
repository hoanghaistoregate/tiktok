import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { useNavigate } from "react-router-dom";
import "./AuthModal.css";

// Hộp thoại chọn: Đăng ký / Đăng nhập / Đăng nhập bằng Zalo
const AuthModal = ({ open, onClose }) => {
  const navigate = useNavigate();
  const firstBtnRef = useRef(null);

  // Nhấn Esc để đóng, khóa cuộn trang phía sau, đưa con trỏ vào nút đầu tiên
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    if (firstBtnRef.current) firstBtnRef.current.focus();
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) return null;

  // Đóng hộp thoại rồi chuyển sang trang tương ứng
  const goTo = (path) => {
    onClose();
    navigate(path);
  };

  const handleZalo = () => {
    onClose();
    // TODO: đăng nhập bằng Zalo cần đăng ký ứng dụng ở developers.zalo.me
    console.log("Đăng nhập bằng Zalo");
  };

  return createPortal(
    <div className="auth-overlay" onMouseDown={onClose}>
      <div
        className="auth-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="auth-modal-title"
        onMouseDown={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          className="auth-modal-close"
          aria-label="Đóng"
          onClick={onClose}
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            aria-hidden="true"
          >
            <path d="M6 6l12 12M18 6L6 18" />
          </svg>
        </button>

        <h2 id="auth-modal-title" className="auth-modal-title">
          Tài khoản
        </h2>
        <p className="auth-modal-sub">
          Đăng nhập để lưu bài hát và playlist của bạn.
        </p>

        <button
          type="button"
          className="auth-modal-btn is-primary"
          ref={firstBtnRef}
          onClick={() => goTo("/register")}
        >
          Đăng ký
        </button>
        <button
          type="button"
          className="auth-modal-btn"
          onClick={() => goTo("/login")}
        >
          Đăng nhập
        </button>

        <div className="auth-modal-divider">
          <span>hoặc</span>
        </div>

        <button type="button" className="auth-modal-btn" onClick={handleZalo}>
          Đăng nhập bằng Zalo
        </button>
      </div>
    </div>,
    document.body,
  );
};

export default AuthModal;
