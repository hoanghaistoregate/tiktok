import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import axios from "axios";

const API = "http://localhost:3001/api";
const SongsContext = createContext({
  songs: [],
  playlists: [],
  reload: () => {},
});

// Lấy bài hát (đã loại bài đang ẩn) và playlist từ server
export const SongsProvider = ({ children }) => {
  const [songs, setSongs] = useState([]);
  const [playlists, setPlaylists] = useState([]);

  const reload = useCallback(async () => {
    try {
      const [s, p] = await Promise.all([
        axios.get(`${API}/songs`),
        axios.get(`${API}/playlists`),
      ]);
      setSongs(s.data);
      setPlaylists(p.data);
    } catch {
      // giữ dữ liệu cũ nếu server chưa chạy
    }
  }, []);

  useEffect(() => {
    reload();
  }, [reload]);

  return (
    <SongsContext.Provider value={{ songs, playlists, reload }}>
      {children}
    </SongsContext.Provider>
  );
};

export const useSongs = () => useContext(SongsContext);
