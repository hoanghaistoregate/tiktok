import { useEffect, useMemo, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";
import { useSongs } from "../../context/SongsContext";
import "./AdminPage.css";

const API = "http://localhost:3001/api";
const EMPTY = {
  title: "",
  artist: "",
  album: "",
  duration: "",
  plays: 0,
  status: "active",
  image: "",
  color: "#8a6f5a",
  src: "",
};

const ICONS = {
  overview: "M3 11l9-8 9 8v10a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z",
  songs:
    "M9 18V5l12-2v13M9 18a3 3 0 1 1-6 0 3 3 0 0 1 6 0zM21 16a3 3 0 1 1-6 0 3 3 0 0 1 6 0z",
  users:
    "M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75",
  play: "M6 4l14 8-14 8z",
  playlists: "M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01",
};
const NAV = [
  { id: "overview", label: "Tổng quan" },
  { id: "songs", label: "Bài hát" },
  { id: "playlists", label: "Playlist" },
  { id: "users", label: "Người dùng" },
];

const Icon = ({ name }) => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d={ICONS[name]} />
  </svg>
);

// Gắn token đăng nhập vào mỗi yêu cầu gửi lên server
const authHeader = () => {
  try {
    const token = JSON.parse(localStorage.getItem("luma_token"));
    return { headers: { Authorization: `Bearer ${token}` } };
  } catch {
    return {};
  }
};

const fmt = (n) => Number(n || 0).toLocaleString("en-US");
const isHidden = (s) => s.status === "hidden";

/* ---------- Bảng bài hát ---------- */
function SongTable({ rows, onEdit, onToggle, onDelete }) {
  if (rows.length === 0)
    return <p className="adm-muted">Không có bài hát nào.</p>;
  return (
    <div className="adm-scroll">
      <table className="adm-table">
        <thead>
          <tr>
            <th>#</th>
            <th>Bài hát</th>
            <th>Nghệ sĩ</th>
            <th>Album</th>
            <th>Lượt nghe</th>
            <th>Trạng thái</th>
            <th>Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((s, i) => (
            <tr key={s.id}>
              <td>{i + 1}</td>
              <td>
                <div className="adm-song">
                  <span
                    className="adm-thumb"
                    style={{
                      backgroundColor: s.color,
                      backgroundImage: s.image ? `url(${s.image})` : "none",
                    }}
                  />
                  <strong>{s.title}</strong>
                </div>
              </td>
              <td>{s.artist}</td>
              <td>{s.album || "—"}</td>
              <td>{fmt(s.plays)}</td>
              <td>
                <span className={`adm-pill ${isHidden(s) ? "is-hidden" : ""}`}>
                  {isHidden(s) ? "Tạm ẩn" : "Đang phát"}
                </span>
              </td>
              <td>
                <div className="adm-actions">
                  <button type="button" onClick={() => onEdit(s)}>
                    Sửa
                  </button>
                  <button type="button" onClick={() => onToggle(s)}>
                    {isHidden(s) ? "Hiện" : "Ẩn"}
                  </button>
                  <button
                    type="button"
                    className="is-danger"
                    onClick={() => onDelete(s)}
                  >
                    Xoá
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const EMPTY_PL = {
  title: "",
  coverTitle: "",
  vol: "",
  image: "",
  color: "#8a6f5a",
};

/* ---------- Quản lý playlist "Dành riêng cho bạn" ---------- */
function PlaylistsPanel({ playlists, onChanged, onFail }) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(EMPTY_PL);
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  const openAdd = () => {
    setEditingId(null);
    setForm(EMPTY_PL);
    setOpen(true);
  };
  const openEdit = (p) => {
    setEditingId(p.id);
    setForm({ ...EMPTY_PL, ...p });
    setOpen(true);
  };
  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) return onFail(null, "Vui lòng nhập tên playlist.");
    try {
      if (editingId)
        await axios.put(`${API}/playlists/${editingId}`, form, authHeader());
      else await axios.post(`${API}/playlists`, form, authHeader());
      setOpen(false);
      await onChanged();
    } catch (err) {
      onFail(err, "Lưu thất bại, thử lại nhé.");
    }
  };

  const handleDelete = async (p) => {
    if (!window.confirm(`Xoá playlist "${p.title}"?`)) return;
    try {
      await axios.delete(`${API}/playlists/${p.id}`, authHeader());
      await onChanged();
    } catch (err) {
      onFail(err, "Xoá thất bại, thử lại nhé.");
    }
  };

  return (
    <section className="adm-card">
      <div className="adm-card-head">
        <h2>Playlist &quot;Dành riêng cho bạn&quot; ({playlists.length})</h2>
        <button type="button" className="adm-btn" onClick={openAdd}>
          + Thêm playlist
        </button>
      </div>

      {playlists.length === 0 ? (
        <p className="adm-muted">Chưa có playlist nào.</p>
      ) : (
        <div className="adm-scroll">
          <table className="adm-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Playlist</th>
                <th>Tên trên bìa</th>
                <th>Nhãn</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {playlists.map((p, i) => (
                <tr key={p.id}>
                  <td>{i + 1}</td>
                  <td>
                    <div className="adm-song">
                      <span
                        className="adm-thumb"
                        style={{
                          backgroundColor: p.color,
                          backgroundImage: p.image ? `url(${p.image})` : "none",
                        }}
                      />
                      <strong>{p.title}</strong>
                    </div>
                  </td>
                  <td>{p.coverTitle || "—"}</td>
                  <td>{p.vol || "—"}</td>
                  <td>
                    <div className="adm-actions">
                      <button type="button" onClick={() => openEdit(p)}>
                        Sửa
                      </button>
                      <button
                        type="button"
                        className="is-danger"
                        onClick={() => handleDelete(p)}
                      >
                        Xoá
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {open && (
        <div className="adm-overlay" onMouseDown={() => setOpen(false)}>
          <form
            className="adm-modal"
            role="dialog"
            aria-modal="true"
            aria-label={editingId ? "Sửa playlist" : "Thêm playlist"}
            onMouseDown={(e) => e.stopPropagation()}
            onSubmit={handleSubmit}
          >
            <h2>{editingId ? "Sửa playlist" : "Thêm playlist mới"}</h2>
            <label>
              Tên playlist
              <input name="title" value={form.title} onChange={handleChange} />
            </label>
            <div className="adm-row">
              <label>
                Tên trên bìa
                <input
                  name="coverTitle"
                  value={form.coverTitle}
                  onChange={handleChange}
                  placeholder="Soobin Hoàng Sơn"
                />
              </label>
              <label>
                Nhãn
                <input
                  name="vol"
                  value={form.vol}
                  onChange={handleChange}
                  placeholder="Vol. 02"
                />
              </label>
            </div>
            <label>
              Đường dẫn ảnh
              <input
                name="image"
                value={form.image}
                onChange={handleChange}
                placeholder="/images/a1.jpg"
              />
            </label>
            <label>
              Màu nền (khi chưa có ảnh)
              <input
                type="color"
                name="color"
                value={form.color}
                onChange={handleChange}
              />
            </label>
            <div className="adm-modal-actions">
              <button
                type="button"
                className="adm-btn is-ghost"
                onClick={() => setOpen(false)}
              >
                Huỷ
              </button>
              <button type="submit" className="adm-btn">
                {editingId ? "Lưu thay đổi" : "Thêm playlist"}
              </button>
            </div>
          </form>
        </div>
      )}
    </section>
  );
}

/* ---------- Trang admin ---------- */
export default function AdminPage() {
  const { user, logout } = useAuth();
  const { reload: reloadPublic } = useSongs();
  const [view, setView] = useState("overview");
  const [songs, setSongs] = useState([]);
  const [users, setUsers] = useState([]);
  const [playlists, setPlaylists] = useState([]);
  const [query, setQuery] = useState("");
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState(EMPTY);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState("");

  const isAdmin = user?.role === "admin";

  const handleFail = (err, fallback) => {
    if (err.response?.status === 401) {
      setError("Phiên đăng nhập hết hạn, vui lòng đăng nhập lại.");
      logout();
    } else {
      setError(err.response?.data?.message || fallback);
    }
  };

  const load = async () => {
    try {
      const [s, u, p] = await Promise.all([
        axios.get(`${API}/admin/songs`, authHeader()),
        axios.get(`${API}/users`, authHeader()),
        axios.get(`${API}/playlists`),
      ]);
      setSongs(s.data);
      setUsers(u.data);
      setPlaylists(p.data);
      setError("");
      reloadPublic(); // cập nhật trang chủ ngay
    } catch (err) {
      handleFail(err, "Không tải được dữ liệu. Hãy chạy npm run server.");
    }
  };

  useEffect(() => {
    if (isAdmin) load();
  }, [isAdmin]);

  useEffect(() => {
    if (!modal) return;
    const onKey = (e) => e.key === "Escape" && closeModal();
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [modal]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return songs;
    return songs.filter((s) =>
      [s.title, s.artist, s.album].some((v) =>
        String(v ?? "")
          .toLowerCase()
          .includes(q),
      ),
    );
  }, [songs, query]);

  const recent = useMemo(
    () => [...filtered].sort((a, b) => b.id - a.id).slice(0, 5),
    [filtered],
  );
  const top = useMemo(
    () =>
      [...songs].sort((a, b) => (b.plays || 0) - (a.plays || 0)).slice(0, 4),
    [songs],
  );

  // Chặn người không phải admin
  if (!isAdmin) return <Navigate to="/" replace />;

  const totalPlays = songs.reduce((sum, s) => sum + (Number(s.plays) || 0), 0);
  const hiddenCount = songs.filter(isHidden).length;
  const today = new Date().toLocaleDateString("vi-VN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const openAdd = () => {
    setEditingId(null);
    setForm(EMPTY);
    setModal(true);
  };
  const openEdit = (s) => {
    setEditingId(s.id);
    setForm({ ...EMPTY, ...s });
    setModal(true);
  };
  function closeModal() {
    setModal(false);
  }

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim() || !form.artist.trim())
      return setError("Vui lòng nhập tên bài hát và nghệ sĩ.");
    const body = { ...form, plays: Number(form.plays) || 0 };
    try {
      if (editingId)
        await axios.put(`${API}/songs/${editingId}`, body, authHeader());
      else await axios.post(`${API}/songs`, body, authHeader());
      closeModal();
      await load();
    } catch (err) {
      handleFail(err, "Lưu thất bại, thử lại nhé.");
    }
  };

  const handleToggle = async (s) => {
    try {
      await axios.put(
        `${API}/songs/${s.id}`,
        { ...s, status: isHidden(s) ? "active" : "hidden" },
        authHeader(),
      );
      await load();
    } catch (err) {
      handleFail(err, "Đổi trạng thái thất bại.");
    }
  };

  const handleDelete = async (s) => {
    if (!window.confirm(`Xoá bài "${s.title}"?`)) return;
    try {
      await axios.delete(`${API}/songs/${s.id}`, authHeader());
      await load();
    } catch (err) {
      handleFail(err, "Xoá thất bại, thử lại nhé.");
    }
  };

  const tableProps = {
    onEdit: openEdit,
    onToggle: handleToggle,
    onDelete: handleDelete,
  };

  return (
    <div className="adm">
      {/* Thanh bên */}
      <aside className="adm-side">
        <div className="adm-brand">
          <span className="adm-logo" aria-hidden="true">
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
          <div>
            <strong>
              LUMI<span> MUSIC</span>
            </strong>
            <small>Admin Panel</small>
          </div>
        </div>

        <nav className="adm-nav" aria-label="Quản trị">
          {NAV.map((n) => (
            <button
              key={n.id}
              type="button"
              className={view === n.id ? "is-active" : ""}
              aria-current={view === n.id ? "page" : undefined}
              onClick={() => setView(n.id)}
            >
              <Icon name={n.id} />
              {n.label}
            </button>
          ))}
        </nav>

        <div className="adm-side-foot">
          <Link to="/">← Về LUMI MUSIC</Link>
          <p>
            Âm nhạc
            <br />
            kết nối mọi người
          </p>
        </div>
      </aside>

      <div className="adm-main">
        {/* Thanh trên */}
        <header className="adm-top">
          <input
            type="search"
            className="adm-search"
            placeholder="Tìm bài hát, nghệ sĩ, album..."
            aria-label="Tìm kiếm"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <div className="adm-user">
            <span className="adm-avatar" aria-hidden="true">
              {user.name.trim().charAt(0).toUpperCase()}
            </span>
            <span>{user.name}</span>
            <button type="button" onClick={logout}>
              Đăng xuất
            </button>
          </div>
        </header>

        <div className="adm-content">
          {error && (
            <div className="adm-error" role="alert">
              {error}
            </div>
          )}

          {view === "overview" && (
            <>
              <div className="adm-hello">
                <div>
                  <h1>Chào mừng trở lại!</h1>
                  <p>Quản lý nền tảng phát nhạc dễ dàng hơn mỗi ngày.</p>
                </div>
                <div className="adm-date">
                  <small>Hôm nay</small>
                  <strong>{today}</strong>
                </div>
              </div>

              <div className="adm-stats">
                {[
                  {
                    k: "green",
                    icon: "play",
                    label: "Lượt nghe",
                    val: fmt(totalPlays),
                    sub: `${songs.length} bài hát`,
                  },
                  {
                    k: "mist",
                    icon: "users",
                    label: "Số người dùng",
                    val: fmt(users.length),
                    sub: "Tài khoản đã đăng ký",
                  },
                  {
                    k: "blush",
                    icon: "songs",
                    label: "Bài hát",
                    val: fmt(songs.length),
                    sub: `${hiddenCount} bài đang ẩn`,
                  },
                ].map((c) => (
                  <div key={c.label} className={`adm-stat is-${c.k}`}>
                    <span className="adm-stat-icon">
                      <Icon name={c.icon} />
                    </span>
                    <div>
                      <span>{c.label}</span>
                      <strong>{c.val}</strong>
                      <small>{c.sub}</small>
                    </div>
                    <svg
                      className="adm-spark"
                      viewBox="0 0 120 40"
                      preserveAspectRatio="none"
                      aria-hidden="true"
                    >
                      <path
                        d="M0 34 C15 30 25 20 40 24 S65 12 80 16 S105 6 120 4 V40 H0 Z"
                        fill="currentColor"
                      />
                    </svg>
                  </div>
                ))}
              </div>

              <div className="adm-grid">
                <section className="adm-card">
                  <div className="adm-card-head">
                    <h2>Bài hát gần đây</h2>
                    <button type="button" onClick={() => setView("songs")}>
                      Xem tất cả →
                    </button>
                  </div>
                  <SongTable rows={recent} {...tableProps} />
                </section>

                <section className="adm-card">
                  <div className="adm-card-head">
                    <h2>Bài hát nổi bật</h2>
                  </div>
                  <ol className="adm-top-list">
                    {top.map((s, i) => (
                      <li key={s.id}>
                        <span
                          className="adm-thumb is-lg"
                          style={{
                            backgroundColor: s.color,
                            backgroundImage: s.image
                              ? `url(${s.image})`
                              : "none",
                          }}
                        />
                        <div>
                          <strong>{s.title}</strong>
                          <small>{s.artist}</small>
                        </div>
                        <b>#{i + 1}</b>
                      </li>
                    ))}
                  </ol>
                </section>
              </div>
            </>
          )}

          {view === "songs" && (
            <section className="adm-card">
              <div className="adm-card-head">
                <h2>Tất cả bài hát ({filtered.length})</h2>
                <button type="button" className="adm-btn" onClick={openAdd}>
                  + Thêm bài hát
                </button>
              </div>
              <SongTable rows={filtered} {...tableProps} />
            </section>
          )}

          {view === "users" && (
            <section className="adm-card">
              <div className="adm-card-head">
                <h2>Người dùng ({users.length})</h2>
              </div>
              <div className="adm-scroll">
                <table className="adm-table">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Tên</th>
                      <th>Email</th>
                      <th>Vai trò</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((u, i) => (
                      <tr key={u.id}>
                        <td>{i + 1}</td>
                        <td>
                          <strong>{u.name}</strong>
                        </td>
                        <td>{u.email}</td>
                        <td>
                          <span
                            className={`adm-pill ${u.role === "admin" ? "" : "is-hidden"}`}
                          >
                            {u.role === "admin"
                              ? "Quản trị viên"
                              : "Người dùng"}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          )}

          {view === "playlists" && (
            <PlaylistsPanel
              playlists={playlists}
              onChanged={load}
              onFail={(err, msg) =>
                err ? handleFail(err, msg) : setError(msg)
              }
            />
          )}
        </div>
      </div>

      {/* Hộp thoại thêm / sửa */}
      {modal && (
        <div className="adm-overlay" onMouseDown={closeModal}>
          <form
            className="adm-modal"
            role="dialog"
            aria-modal="true"
            aria-label={editingId ? "Sửa bài hát" : "Thêm bài hát"}
            onMouseDown={(e) => e.stopPropagation()}
            onSubmit={handleSubmit}
          >
            <h2>{editingId ? "Sửa bài hát" : "Thêm bài hát mới"}</h2>
            <div className="adm-row">
              <label>
                Tên bài hát
                <input
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                />
              </label>
              <label>
                Nghệ sĩ
                <input
                  name="artist"
                  value={form.artist}
                  onChange={handleChange}
                />
              </label>
            </div>
            <div className="adm-row">
              <label>
                Album
                <input
                  name="album"
                  value={form.album}
                  onChange={handleChange}
                />
              </label>
              <label>
                Thời lượng
                <input
                  name="duration"
                  value={form.duration}
                  onChange={handleChange}
                  placeholder="3:38"
                />
              </label>
            </div>
            <div className="adm-row">
              <label>
                Lượt nghe
                <input
                  type="number"
                  min="0"
                  name="plays"
                  value={form.plays}
                  onChange={handleChange}
                />
              </label>
              <label>
                Trạng thái
                <select
                  name="status"
                  value={form.status}
                  onChange={handleChange}
                >
                  <option value="active">Đang phát</option>
                  <option value="hidden">Tạm ẩn</option>
                </select>
              </label>
            </div>
            <div className="adm-row">
              <label>
                Đường dẫn ảnh
                <input
                  name="image"
                  value={form.image}
                  onChange={handleChange}
                  placeholder="/images/a1.jpg"
                />
              </label>
              <label>
                Đường dẫn file nhạc
                <input
                  name="src"
                  value={form.src}
                  onChange={handleChange}
                  placeholder="/music/bai6.mp3"
                />
              </label>
            </div>
            <label>
              Màu chủ đạo
              <input
                type="color"
                name="color"
                value={form.color}
                onChange={handleChange}
              />
            </label>
            <div className="adm-modal-actions">
              <button
                type="button"
                className="adm-btn is-ghost"
                onClick={closeModal}
              >
                Huỷ
              </button>
              <button type="submit" className="adm-btn">
                {editingId ? "Lưu thay đổi" : "Thêm bài hát"}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
