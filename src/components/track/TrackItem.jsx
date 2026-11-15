import { useState } from "react";
import "./TrackItem.css";

// Một dòng bài hát trong danh sách
const TrackItem = ({ index, track, active = false, onPlay }) => {
  const [liked, setLiked] = useState(false);

  return (
    <li className={"track-item" + (active ? " is-active" : "")}>
      <span className="track-index">{String(index).padStart(2, "0")}</span>

      <button
        type="button"
        className="track-main"
        aria-label={`Phát bài ${track.title}`}
        onClick={() => onPlay && onPlay(track)}
      >
        <span className="track-cover" style={{ backgroundColor: track.color }}>
          {track.image && <img src={track.image} alt="" />}
        </span>
        <span className="track-info">
          <strong className="track-title">{track.title}</strong>
          <span className="track-artist">{track.artist}</span>
        </span>
      </button>

      <button
        type="button"
        className={"track-heart" + (liked ? " is-liked" : "")}
        aria-label={liked ? "Bỏ yêu thích" : "Yêu thích"}
        aria-pressed={liked}
        onClick={() => setLiked(!liked)}
      >
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill={liked ? "currentColor" : "none"}
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M12 20s-7-4.5-7-10a4 4 0 017-2.6A4 4 0 0119 10c0 5.5-7 10-7 10z" />
        </svg>
      </button>

      <span className="track-duration">{track.duration}</span>
    </li>
  );
};

export default TrackItem;
