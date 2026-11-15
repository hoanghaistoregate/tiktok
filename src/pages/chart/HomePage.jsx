import Hero from "../../components/introduction/Hero";
import PlaylistSection from "../../components/introduction/PlaylistSection";
import TrackList from "../../components/track/TrackList";

// Trang chủ: gom các phần cũ của App vào đây
const HomePage = ({ currentId, onPlay, onPlayFirst }) => {
  return (
    <>
      <Hero onPlay={onPlayFirst} />

      <div className="mt-4">
        <PlaylistSection onPlay={(p) => console.log("Phát:", p.title)} />
      </div>

      <TrackList currentId={currentId} onPlay={onPlay} />
    </>
  );
};

export default HomePage;
