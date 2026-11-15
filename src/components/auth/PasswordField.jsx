import { useState } from "react";

// Ô mật khẩu có nút hiện / ẩn. Style nằm trong pages/auth/AuthPage.css
const PasswordField = ({ id, name, label, autoComplete, value, onChange }) => {
  const [show, setShow] = useState(false);

  return (
    <div className="auth-field">
      <label htmlFor={id}>{label}</label>
      <div className="auth-password">
        <input
          id={id}
          name={name}
          type={show ? "text" : "password"}
          autoComplete={autoComplete}
          required
          value={value}
          onChange={onChange}
        />
        <button
          type="button"
          className="auth-eye"
          aria-label={show ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
          aria-pressed={show}
          onClick={() => setShow(!show)}
        >
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
            {show ? (
              <>
                <path d="M3 3l18 18" />
                <path d="M10.6 6.1A9.8 9.8 0 0112 6c5 0 8.5 4 9.5 6a14 14 0 01-2.6 3.3M6.6 7.6A14 14 0 002.5 12c1 2 4.5 6 9.5 6 1.5 0 2.9-.4 4-1" />
                <path d="M9.9 9.9a3 3 0 004.2 4.2" />
              </>
            ) : (
              <>
                <path d="M2.5 12C3.5 10 7 6 12 6s8.5 4 9.5 6c-1 2-4.5 6-9.5 6s-8.5-4-9.5-6z" />
                <circle cx="12" cy="12" r="3" />
              </>
            )}
          </svg>
        </button>
      </div>
    </div>
  );
};

export default PasswordField;
