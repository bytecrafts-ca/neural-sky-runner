import type { VideoItem } from "../api/youtube";

export function VideoCard({
  video,
  focused,
  onSelect,
}: {
  video: VideoItem;
  focused: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      className={`video-card${focused ? " video-card--focus" : ""}`}
      onClick={onSelect}
    >
      <img src={video.thumbnail} alt="" loading="lazy" />
      <div className="video-card__body">
        <strong>{video.title}</strong>
        <span>{video.channel}</span>
      </div>
    </button>
  );
}
