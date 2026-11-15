import express from "express";
import cors from "cors";
import fs from "fs";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const app = express();
app.use(cors());
app.use(express.json());

const DATA_FILE = new URL("./data.json", import.meta.url);
// Khi đưa lên mạng thật, đặt biến môi trường JWT_SECRET thay cho chuỗi này
const JWT_SECRET =
  process.env.JWT_SECRET || "doi-chuoi-bi-mat-nay-truoc-khi-dua-len-mang";

const readData = () => JSON.parse(fs.readFileSync(DATA_FILE, "utf-8"));
const writeData = (data) =>
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));

// Playlist "Dành riêng cho bạn": lần đầu chạy sẽ tự nạp 5 playlist mẫu vào data.json
const SEED_PLAYLISTS = [
  {
    id: 1,
    image: "/images/a3.jpg",
    color: "#c9d3c0",
    coverTitle: "Soobin Hoàng Sơn",
    vol: "Track No.1",
    title: "Những bài hát hay nhất",
  },
  {
    id: 2,
    image: "/images/a2.jpeg",
    color: "#8a6f5a",
    coverTitle: "Sơn Tùng MT-P",
    vol: "Vol. 02",
    title: "Bản Nhạc Hay Nhất",
  },
  {
    id: 3,
    image: "/images/a4.jpeg",
    color: "#9b8fc2",
    coverTitle: "Quang Hùng MasterD",
    vol: "Track No.2",
    title: "Giai Điệu Bắt Tai",
  },
  {
    id: 4,
    image: "/images/a5.jpg",
    color: "#3f5a7a",
    coverTitle: "Dangrangto",
    vol: "Vol. 04",
    title: "Nhạc Rap Real Love",
  },
  {
    id: 5,
    image: "/images/a6.jpeg",
    color: "#7a8f6a",
    coverTitle: "B Ray",
    vol: "Track No.4",
    title: "Bản Tình Ca Buồn",
  },
];
{
  const data = readData();
  if (!Array.isArray(data.playlists)) {
    data.playlists = SEED_PLAYLISTS;
    writeData(data);
  }
}

// Không bao giờ trả mật khẩu (đã mã hóa) về cho trình duyệt
const publicUser = ({ passwordHash, ...rest }) => rest;
const isEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

// Danh sách bài hát cho người nghe: không gồm bài đang ẩn
app.get("/api/songs", (req, res) => {
  res.json(readData().songs.filter((s) => s.status !== "hidden"));
});

// Đăng ký
app.post("/api/register", async (req, res) => {
  const name = String(req.body.name ?? "").trim();
  const email = String(req.body.email ?? "")
    .trim()
    .toLowerCase();
  const password = String(req.body.password ?? "");

  if (!name)
    return res.status(400).json({ message: "Vui lòng nhập tên hiển thị." });
  if (!isEmail(email))
    return res.status(400).json({ message: "Email không hợp lệ." });
  if (password.length < 6)
    return res.status(400).json({ message: "Mật khẩu cần ít nhất 6 ký tự." });

  const data = readData();
  if (data.users.some((u) => u.email === email))
    return res.status(409).json({ message: "Email này đã được đăng ký." });

  const passwordHash = await bcrypt.hash(password, 10);
  const user = { id: Date.now(), name, email, passwordHash, role: "user" };
  data.users.push(user);
  writeData(data);

  res.status(201).json({ user: publicUser(user) });
});

// Đăng nhập
app.post("/api/login", async (req, res) => {
  const email = String(req.body.email ?? "")
    .trim()
    .toLowerCase();
  const password = String(req.body.password ?? "");

  const user = readData().users.find((u) => u.email === email);
  const ok = user && (await bcrypt.compare(password, user.passwordHash));
  // Một thông báo chung để không lộ email nào đã đăng ký
  if (!ok)
    return res.status(401).json({ message: "Email hoặc mật khẩu không đúng." });

  const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, {
    expiresIn: "7d",
  });
  res.json({ token, user: publicUser(user) });
});

// Kiểm tra người gọi API có phải admin không
const requireAdmin = (req, res, next) => {
  const token = (req.headers.authorization || "").replace("Bearer ", "");
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    const user = readData().users.find((u) => u.id === payload.id);
    if (user?.role !== "admin")
      return res.status(403).json({ message: "Chỉ admin mới được thao tác." });
    next();
  } catch {
    res.status(401).json({ message: "Vui lòng đăng nhập lại." });
  }
};

// Chỉ lấy các trường được phép lưu cho một bài hát
const pickSong = (b) => ({
  title: String(b.title ?? "").trim(),
  artist: String(b.artist ?? "").trim(),
  album: String(b.album ?? "").trim(),
  duration: String(b.duration ?? "").trim(),
  plays: Math.max(0, Number(b.plays) || 0),
  status: b.status === "hidden" ? "hidden" : "active",
  image: String(b.image ?? "").trim(),
  color: String(b.color ?? "#8a6f5a"),
  src: String(b.src ?? "").trim(),
});

// Danh sách đầy đủ gồm cả bài đang ẩn (chỉ admin)
app.get("/api/admin/songs", requireAdmin, (req, res) => {
  res.json(readData().songs);
});

// Danh sách người dùng (chỉ admin)
app.get("/api/users", requireAdmin, (req, res) => {
  res.json(readData().users.map(publicUser));
});

// Thêm / sửa / xoá bài hát (chỉ admin)
app.post("/api/songs", requireAdmin, (req, res) => {
  const song = pickSong(req.body);
  if (!song.title || !song.artist)
    return res.status(400).json({ message: "Thiếu tên bài hoặc nghệ sĩ." });
  const data = readData();
  const item = { id: Date.now(), ...song };
  data.songs.push(item);
  writeData(data);
  res.status(201).json(item);
});

app.put("/api/songs/:id", requireAdmin, (req, res) => {
  const data = readData();
  const i = data.songs.findIndex((s) => String(s.id) === req.params.id);
  if (i < 0) return res.sendStatus(404);
  data.songs[i] = { ...data.songs[i], ...pickSong(req.body) };
  writeData(data);
  res.json(data.songs[i]);
});

app.delete("/api/songs/:id", requireAdmin, (req, res) => {
  const data = readData();
  data.songs = data.songs.filter((s) => String(s.id) !== req.params.id);
  writeData(data);
  res.sendStatus(204);
});

// Playlist: ai cũng xem được, chỉ admin mới thêm / sửa / xoá
const pickPlaylist = (b) => ({
  title: String(b.title ?? "").trim(),
  coverTitle: String(b.coverTitle ?? "").trim(),
  vol: String(b.vol ?? "").trim(),
  image: String(b.image ?? "").trim(),
  color: String(b.color ?? "#8a6f5a"),
});

app.get("/api/playlists", (req, res) => {
  res.json(readData().playlists);
});

app.post("/api/playlists", requireAdmin, (req, res) => {
  const item = pickPlaylist(req.body);
  if (!item.title)
    return res.status(400).json({ message: "Thiếu tên playlist." });
  const data = readData();
  const created = { id: Date.now(), ...item };
  data.playlists.push(created);
  writeData(data);
  res.status(201).json(created);
});

app.put("/api/playlists/:id", requireAdmin, (req, res) => {
  const data = readData();
  const i = data.playlists.findIndex((p) => String(p.id) === req.params.id);
  if (i < 0) return res.sendStatus(404);
  data.playlists[i] = { ...data.playlists[i], ...pickPlaylist(req.body) };
  writeData(data);
  res.json(data.playlists[i]);
});

app.delete("/api/playlists/:id", requireAdmin, (req, res) => {
  const data = readData();
  data.playlists = data.playlists.filter((p) => String(p.id) !== req.params.id);
  writeData(data);
  res.sendStatus(204);
});

app.listen(3001, () => {
  console.log("Server chạy ở http://localhost:3001");
});
