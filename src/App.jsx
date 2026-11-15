import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import Header from "./components/introduction/Header";
import Sidebar from "./components/introduction/Sidebar";
import PlayMusic from "./components/track/PlayMusic";
import FooterPage from "./components/footer/FooterPage";
import HomePage from "./pages/chart/HomePage";
import ChartPage from "./pages/chart/ChartPage";
import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";
import AdminPage from "./pages/admin/AdminPage";
import { useSongs } from "./context/SongsContext";

const App = () => {
  const [current, setCurrent] = useState(null);
  const { songs } = useSongs();

  const handleSearch = (keyword) => {
    console.log("Tìm:", keyword);
  };

  // Tìm vị trí bài đang phát để chuyển bài trước / sau
  const index = current ? songs.findIndex((s) => s.id === current.id) : -1;
  const handleNext = () =>
    songs.length && setCurrent(songs[(index + 1) % songs.length]);
  const handlePrev = () =>
    songs.length &&
    setCurrent(songs[(index - 1 + songs.length) % songs.length]);

  return (
    <Routes>
      {/* Đăng nhập / đăng ký / admin: trang riêng, không có Sidebar, Header, footer */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/admin" element={<AdminPage />} />

      {/* Các trang còn lại dùng chung khung Sidebar + Header + footer + thanh nhạc */}
      <Route
        path="/*"
        element={
          <div className="music d-flex">
            <Sidebar />
            <div className="flex-grow-1" style={{ paddingBottom: 90 }}>
              <Header onSearch={handleSearch} />
              <main className="p-4">
                <Routes>
                  <Route
                    path="/"
                    element={
                      <HomePage
                        currentId={current?.id}
                        onPlay={setCurrent}
                        onPlayFirst={() => songs[0] && setCurrent(songs[0])}
                      />
                    }
                  />
                  <Route
                    path="/chart"
                    element={
                      <ChartPage currentId={current?.id} onPlay={setCurrent} />
                    }
                  />
                </Routes>
              </main>
              <FooterPage />
            </div>

            <PlayMusic
              track={current}
              onNext={handleNext}
              onPrev={handlePrev}
            />
          </div>
        }
      />
    </Routes>
  );
};

export default App;
