import "./Hero.css";

// Props: có thể truyền từ App.jsx, nếu không truyền sẽ dùng giá trị mặc định
const Hero = ({
  title = "Bật nhạc lên. Chạm cảm hứng.",
  description = "Những giai điệu tươi mới cho ngày đầy năng lượng.",
  trackCount = 50,
  duration = "3 giờ 12 phút",
  image = "/images/a1.jpg",
  onPlay,
}) => {
  return (
    <section
      className="hero d-flex align-items-center"
      aria-labelledby="hero-title"
    >
      <div className="hero-content">
        {/* <p className="hero-label">{label}</p> */}
        <h1 id="hero-title" className="hero-title">
          {title}
        </h1>
        <p className="hero-text">{description}</p>

        <div className="hero-actions d-flex align-items-center gap-3 flex-wrap">
          <button type="button" className="hero-play" onClick={onPlay}>
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="currentColor"
              aria-hidden="true"
            >
              <path d="M7 4l13 8-13 8z" />
            </svg>
            Nghe ngay
          </button>
          <span className="hero-meta">
            {trackCount} bài hát &bull; {duration}
          </span>
        </div>
      </div>

      <div className="hero-image">
        {image ? (
          <img src={image} alt="" />
        ) : (
          <div className="hero-image-placeholder">Ảnh banner</div>
        )}
      </div>
    </section>
  );
};

export default Hero;
