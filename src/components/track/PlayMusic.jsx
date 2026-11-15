import { useEffect, useRef, useState } from "react";
import "./PlayMusic.css";

// Đổi số giây thành dạng m:ss
const formatTime = (s) => {
  if (!s || isNaN(s)) return "0:00";
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return `${m}:${String(sec).padStart(2, "0")}`;
};

const Icon = ({ children, fill }) => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill={fill ? "currentColor" : "none"}
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    {children}
  </svg>
);

// track: bài đang chọn (hoặc null). onNext / onPrev: App xử lý chuyển bài
const PlayMusic = ({ track, onNext, onPrev }) => {
  const audioRef = useRef(null);
  const [playing, setPlaying] = useState(false);
  const [time, setTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.7);
  const [error, setError] = useState(false);

  // Có bài mới thì tự phát (vì người dùng vừa bấm chọn bài)
  useEffect(() => {
    const audio = audioRef.current;
    if (!track || !audio) return;
    setError(false);
    setTime(0);
    audio.play().catch(() => {});
  }, [track?.id]);

  // Cập nhật âm lượng
  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = volume;
  }, [volume]);

  const toggle = () => {
    const audio = audioRef.current;
    if (!track || !audio) return;
    if (audio.paused) audio.play().catch(() => {});
    else audio.pause();
  };

  const seek = (e) => {
    const value = Number(e.target.value);
    audioRef.current.currentTime = value;
    setTime(value);
  };

  return (
    <div className="player" role="region" aria-label="Trình phát nhạc">
      <audio
        ref={audioRef}
        src={track ? track.src : undefined}
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onTimeUpdate={(e) => setTime(e.target.currentTime)}
        onLoadedMetadata={(e) => setDuration(e.target.duration)}
        onEnded={onNext}
        onError={() => setError(true)}
      />

      {/* Trái: thông tin bài hát */}
      <div className="player-track">
        <span
          className="player-cover"
          style={{ backgroundColor: track ? track.color : "#e7e6da" }}
        >
          {track && track.image && <img src={track.image} alt="" />}
        </span>
        <span className="player-info">
          <strong className="player-title">
            {track ? track.title : "Chưa chọn bài hát"}
          </strong>
          <span className="player-artist">
            {error
              ? "Không tải được file nhạc"
              : track
                ? track.artist
                : "Chọn một bài để phát"}
          </span>
        </span>
      </div>

      {/* Giữa: nút điều khiển và thanh tiến độ */}
      <div className="player-center">
        <div className="player-controls">
          <button
            type="button"
            className="player-btn"
            aria-label="Bài trước"
            onClick={onPrev}
            disabled={!track}
          >
            <Icon fill>
              <path d="M6 5h2v14H6zM20 5v14L9 12z" />
            </Icon>
          </button>
          <button
            type="button"
            className="player-main-btn"
            aria-label={playing ? "Tạm dừng" : "Phát"}
            onClick={toggle}
            disabled={!track}
          >
            {playing ? (
              <Icon fill>
                <path d="M7 5h3v14H7zM14 5h3v14h-3z" />
              </Icon>
            ) : (
              <Icon fill>
                <path d="M7 4l13 8-13 8z" />
              </Icon>
            )}
          </button>
          <button
            type="button"
            className="player-btn"
            aria-label="Bài tiếp theo"
            onClick={onNext}
            disabled={!track}
          >
            <Icon fill>
              <path d="M16 5h2v14h-2zM4 5l11 7-11 7z" />
            </Icon>
          </button>
        </div>

        <div className="player-progress">
          <span className="player-time">{formatTime(time)}</span>
          <input
            type="range"
            min="0"
            max={duration || 0}
            step="0.1"
            value={time}
            onChange={seek}
            disabled={!track}
            aria-label="Tua bài hát"
          />
          <span className="player-time">{formatTime(duration)}</span>
        </div>
      </div>

      {/* Phải: âm lượng */}
      <div className="player-volume">
        <Icon>
          <path d="M4 9v6h4l5 4V5L8 9z" />
          <path d="M16.5 8.5a5 5 0 010 7" />
        </Icon>
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={volume}
          onChange={(e) => setVolume(Number(e.target.value))}
          aria-label="Âm lượng"
        />
      </div>
    </div>
  );
};

export default PlayMusic;
