import { useState } from "react";
import "./Sidebar.css";
import { NavLink } from "react-router-dom";

const icons = {
  discover: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M15.5 8.5l-2 5-5 2 2-5z" />
    </>
  ),
  chart: <path d="M6 20V10M12 20V4M18 20v-7" />,
  library: (
    <g fill="currentColor" stroke="none" transform="scale(1.5)">
      <path d="M9 13c0 1.105-1.12 2-2.5 2S4 14.105 4 13s1.12-2 2.5-2 2.5.895 2.5 2" />
      <path fillRule="evenodd" d="M9 3v10H8V3z" />
      <path d="M8 2.82a1 1 0 0 1 .804-.98l3-.6A1 1 0 0 1 13 2.22V4L8 5z" />
    </g>
  ),
  heart: (
    <path d="M12 20s-7-4.5-7-10a4 4 0 017-2.6A4 4 0 0119 10c0 5.5-7 10-7 10z" />
  ),
  clock: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </>
  ),
  music: (
    <>
      <path d="M9 18V6l10-2v12" />
      <circle cx="7" cy="18" r="2" />
      <circle cx="17" cy="16" r="2" />
    </>
  ),
};

const menu = [
  { id: "discover", label: "Khám phá", icon: "discover", to: "/" },
  { id: "chart", label: "Bảng xếp hạng", icon: "chart", to: "/chart" },
  { id: "library", label: "Thư Viện", icon: "library" },
];

const library = [
  { id: "liked", label: "Bài hát yêu thích", icon: "heart" },
  { id: "recent", label: "Nghe gần đây", icon: "clock" },
  { id: "mine", label: "Playlist của tôi", icon: "music" },
];

const playlists = [
  { id: "p1", label: "Một chút bình yên" },
  { id: "p2", label: "Đường về nhà" },
  { id: "p3", label: "Đêm không ngủ" },
];

const NavItem = ({ item, active, onSelect }) => {
  const iconSvg = (
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
      {icons[item.icon]}
    </svg>
  );

  // Mục có đường dẫn: chuyển trang
  if (item.to) {
    return (
      <li>
        <NavLink
          to={item.to}
          end
          className={({ isActive }) =>
            "sidebar-item" + (isActive ? " is-active" : "")
          }
        >
          {iconSvg}
          <span>{item.label}</span>
        </NavLink>
      </li>
    );
  }

  // Mục chưa có trang: giữ như cũ
  return (
    <li>
      <button
        type="button"
        className={"sidebar-item" + (active ? " is-active" : "")}
        aria-current={active ? "page" : undefined}
        onClick={() => onSelect(item.id)}
      >
        {iconSvg}
        <span>{item.label}</span>
      </button>
    </li>
  );
};

// children: nội dung đặt ở cuối cột (sau này là thẻ "Khám phá Plus")
const Sidebar = ({ children }) => {
  const [active, setActive] = useState("null");

  return (
    <aside className="sidebar d-flex flex-column">
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

      <nav aria-label="Menu chính">
        <h2 className="sidebar-title">Âm nhạc cho bạn</h2>
        <ul className="sidebar-list">
          {menu.map((item) => (
            <NavItem
              key={item.id}
              item={item}
              active={active === item.id}
              onSelect={setActive}
            />
          ))}
        </ul>

        <h2 className="sidebar-title">Thư viện của bạn</h2>
        <ul className="sidebar-list">
          {library.map((item) => (
            <NavItem
              key={item.id}
              item={item}
              active={active === item.id}
              onSelect={setActive}
            />
          ))}
        </ul>
      </nav>

      <div className="sidebar-playlists">
        <div className="d-flex align-items-center justify-content-between">
          <h2 className="sidebar-title mb-0">BXH Top 100</h2>
          <button
            type="button"
            className="sidebar-add"
            aria-label="Tạo playlist mới"
          ></button>
        </div>
        <ul className="sidebar-list">
          {playlists.map((p) => (
            <li key={p.id}>
              <a href="#playlist" className="sidebar-playlist">
                {p.label}
              </a>
            </li>
          ))}
        </ul>
      </div>

      <div className="sidebar-bottom mt-auto">{children}</div>
    </aside>
  );
};

export default Sidebar;
