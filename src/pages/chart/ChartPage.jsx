import TrackItem from "../../components/track/TrackItem";
import { useSongs } from "../../context/SongsContext";
import "./ChartPage.css";

// Trang Bảng xếp hạng: xếp theo lượt nghe (bài có lượt nghe bằng nhau giữ nguyên thứ tự)
const ChartPage = ({ currentId, onPlay }) => {
  const { songs } = useSongs();
  const ranked = [...songs].sort((a, b) => (b.plays || 0) - (a.plays || 0));

  return (
    <section className="chart-page" aria-labelledby="chart-title">
      <h1 id="chart-title" className="chart-title">
        Bảng xếp hạng
      </h1>
      <p className="chart-sub">Những bài hát được nghe nhiều nhất.</p>

      <ul className="chart-items">
        {ranked.map((t, i) => (
          <TrackItem
            key={t.id}
            index={i + 1}
            track={t}
            active={currentId === t.id}
            onPlay={onPlay}
          />
        ))}
      </ul>
    </section>
  );
};

export default ChartPage;
