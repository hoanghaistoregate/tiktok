import { createContext, useContext, useState } from "react";
import axios from "axios";

// Gọi server (npm run server) để đăng ký / đăng nhập, dữ liệu lưu trong server/data.json
const API = "http://localhost:3001/api";
const AuthContext = createContext(null);

const read = (key) => {
  try {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : null;
  } catch {
    return null;
  }
};
const write = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // bỏ qua nếu trình duyệt chặn localStorage
  }
};
const remove = (key) => {
  try {
    localStorage.removeItem(key);
  } catch {
    // bỏ qua
  }
};

const errorMessage = (err) =>
  err.response?.data?.message ||
  "Không kết nối được server. Hãy chạy npm run server.";

export const AuthProvider = ({ children }) => {
  // Người đang đăng nhập (giữ lại sau khi tải lại trang)
  const [user, setUser] = useState(() => read("luma_user"));

  // Trả về { ok: true } hoặc { ok: false, message }
  const register = async (name, email, password) => {
    try {
      await axios.post(`${API}/register`, { name, email, password });
      return { ok: true };
    } catch (err) {
      return { ok: false, message: errorMessage(err) };
    }
  };

  const login = async (email, password) => {
    try {
      const { data } = await axios.post(`${API}/login`, { email, password });
      setUser(data.user);
      write("luma_user", data.user);
      write("luma_token", data.token);
      return { ok: true };
    } catch (err) {
      return { ok: false, message: errorMessage(err) };
    }
  };

  const logout = () => {
    setUser(null);
    remove("luma_user");
    remove("luma_token");
  };

  return (
    <AuthContext.Provider value={{ user, register, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
