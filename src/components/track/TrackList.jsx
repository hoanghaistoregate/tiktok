import TrackItem from "./TrackItem";
import { useSongs } from "../../context/SongsContext";
import { Link } from "react-router-dom";
import "./TrackList.css";

const TrackList = ({ currentId, onPlay }) => {
  const { songs } = useSongs();

  return (
    <section className="track-list" aria-labelledby="track-list-title">
      <div className="track-list-head d-flex align-items-end justify-content-between">
        <div>
          <h2 id="track-list-title" className="track-list-title">
            Đang được yêu thích
          </h2>
        </div>
        <Link to="/chart" className="track-list-link"></Link>
      </div>

      <ul className="track-list-items">
        {songs.map((t, i) => (
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

export default TrackList;
