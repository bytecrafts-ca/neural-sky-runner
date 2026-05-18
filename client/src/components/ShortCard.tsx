import type { VideoItem } from "../types/video";

export function ShortCard({
  video,
  active,
  onSelect,
}: {
  video: VideoItem;
  active: boolean;
  onSelect: () => void;
}) {
  return (
    <section className={`short-card${active ? " short-card--active" : ""}`}>
      <button type="button" className="short-card__hit" onClick={onSelect}>
        <img src={video.thumbnail} alt="" className="short-card__bg" loading="lazy" />
        <div className="short-card__glass">
          <strong>{video.title}</strong>
          <span>{video.channel}</span>
          {active && <em>Tap to play</em>}
        </div>
      </button>
    </section>
  );
}
