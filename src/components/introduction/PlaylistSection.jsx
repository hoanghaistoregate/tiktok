import PlaylistCard from "./PlaylistCard";
import { useSongs } from "../../context/SongsContext";
import "./PlaylistSection.css";

// Playlist lấy từ server, quản lý ở trang admin
const PlaylistSection = ({ onPlay }) => {
  const { playlists } = useSongs();

  return (
    <section
      className="playlist-section"
      aria-labelledby="playlist-section-title"
    >
      <div className="playlist-section-head d-flex align-items-end justify-content-between">
        <div>
          <h2 id="playlist-section-title" className="playlist-section-title">
            Dành riêng cho bạn
          </h2>
        </div>
        <a href="#all" className="playlist-section-link">
          Xem tất cả
        </a>
      </div>

      <div className="playlist-grid">
        {playlists.map((p) => (
          <PlaylistCard
            key={p.id}
            image={p.image}
            color={p.color}
            coverTitle={p.coverTitle}
            vol={p.vol}
            title={p.title}
            onPlay={() => onPlay && onPlay(p)}
          />
        ))}
      </div>
    </section>
  );
};

export default PlaylistSection;
