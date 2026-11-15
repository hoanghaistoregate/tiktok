import "./PlaylistCard.css";

// Một thẻ playlist: ảnh bìa (có chữ đè lên), tên và mô tả bên dưới
const PlaylistCard = ({
  image = "",
  color = "#c9d3c0", // màu nền khi chưa có ảnh
  tag = "LUMA MUSIC",
  coverTitle = "Sơn Tùng MTP",
  vol = "Track no1",
  title = "Những bài Hát Hay Nhất",
  //   description = "Thả lòng cùng những giai điệu dịu êm.",
  onPlay,
}) => {
  return (
    <article className="playlist-card">
      <div className="playlist-cover" style={{ backgroundColor: color }}>
        {image && <img src={image} alt="" />}

        <div className="playlist-cover-text">
          <span className="playlist-tag">{tag}</span>
          <strong className="playlist-cover-title">{coverTitle}</strong>
          <span className="playlist-vol">{vol}</span>
        </div>

        <button
          type="button"
          className="playlist-play"
          aria-label={`Phát playlist ${title}`}
          onClick={onPlay}
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="currentColor"
            aria-hidden="true"
          >
            <path d="M7 4l13 8-13 8z" />
          </svg>
        </button>
      </div>

      <h3 className="playlist-title">{title}</h3>
      {/* <p className="playlist-desc">{description}</p> */}
    </article>
  );
};

export default PlaylistCard;
