import type { VideoItem } from "../types/video";

export function FeedCard({
  video,
  focused,
  onSelect,
}: {
  video: VideoItem;
  focused: boolean;
  onSelect: () => void;
}) {
  return (
    <article className={`feed-card${focused ? " feed-card--focus" : ""}`}>
      <button type="button" className="feed-card__hit" onClick={onSelect}>
        <div className="feed-card__thumb">
          <img src={video.thumbnail} alt="" loading="lazy" />
          {video.duration && <span className="feed-card__duration">{video.duration}</span>}
        </div>
        <div className="feed-card__meta">
          <strong>{video.title}</strong>
          <span>{video.channel}</span>
        </div>
      </button>
    </article>
  );
}
