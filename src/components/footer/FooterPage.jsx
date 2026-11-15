import { useState } from "react";
import "./FooterPage.css";

const columns = [
  {
    title: "Nghe theo khoảnh khắc",
    links: [
      "Buổi sáng chậm rãi",
      "Chiều mơ mộng",
      "Tối cà phê & guitar",
      "Đêm không ngủ",
    ],
  },
  {
    title: "Có gì mới",
    links: [
      "Playlist vừa lên sóng",
      "Nghệ sĩ indie nên nghe",
      "Radio theo tâm trạng",
    ],
  },
  {
    title: "Về LUMI MUSIC",
    links: [
      "Câu chuyện của LUMI MUSIC",
      "Hợp tác nghệ sĩ",
      "Nhắn cho chúng mình",
    ],
  },
];

const moods = ["Thư giãn", "Yêu đời", "Tập trung", "Lãng mạn"];

export default function FooterPage() {
  const [email, setEmail] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email.trim()) return;
    // TODO: gọi API đăng ký tại đây
    setEmail("");
  };

  return (
    <footer className="luma-footer">
      <div className="luma-footer__wrap">
        <div className="luma-footer__cta">
          <div>
            <h3>Thêm một bài nữa nhé?</h3>
            <p>
              Tải LUMI MUSIC về máy để nghe mọi lúc, kể cả khi không có mạng.
            </p>
          </div>
          <button type="button" className="luma-footer__btn">
            Tải ứng dụng
          </button>
        </div>

        <div className="luma-footer__grid">
          <div className="luma-footer__brand">
            <a href="/" className="sidebar-logo">
              <span className="sidebar-logo-mark" aria-hidden="true">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.4"
                  strokeLinecap="round"
                >
                  <path d="M4 10v4M8 6v12M12 3v18M16 7v10M20 10v4" />
                </svg>
              </span>
              <span className="sidebar-logo-text">
                LUMI<span> MUSIC</span>
              </span>
            </a>
            <p>Nhạc hay cho từng khoảnh khắc trong ngày.</p>
            <form className="luma-footer__form" onSubmit={handleSubmit}>
              <input
                type="email"
                placeholder="Nhận gợi ý nhạc mỗi tuần"
                aria-label="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <button type="submit" className="luma-footer__btn">
                Nhận gợi ý
              </button>
            </form>
          </div>

          {columns.map((col) => (
            <div key={col.title}>
              <h4>{col.title}</h4>
              <ul>
                {col.links.map((link) => (
                  <li key={link}>
                    <a href="#">{link}</a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="luma-footer__moods">
          {moods.map((m) => (
            <span key={m}>{m}</span>
          ))}
        </div>

        <div className="luma-footer__bottom">
          <span>Làm bằng ♪ tại Việt Nam · © 2026 LUMI MUSIC</span>
          <nav>
            <a href="#">Điều khoản dùng</a>
            <a href="#">Quyền riêng tư</a>
            <a href="#">Cookie</a>
          </nav>
        </div>
      </div>
    </footer>
  );
}
