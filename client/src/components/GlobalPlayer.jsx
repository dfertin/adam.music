import { usePlayer } from '../context/PlayerContext.jsx';
import { VinylDisc } from './VinylDisc.jsx';

function formatTime(sec) {
  if (!sec || Number.isNaN(sec)) return '0:00';
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
}

export function GlobalPlayer() {
  const { current, queue, playing, currentTime, duration, toggle, seek, playNext, playPrev } = usePlayer();
  if (!current) return null;

  const ratio = duration ? currentTime / duration : 0;
  const idx = queue.findIndex((t) => String(t._id) === String(current._id));
  const hasPrev = idx > 0;
  const hasNext = idx >= 0 && idx < queue.length - 1;

  return (
    <div className="adam-glass adam-global-player">
      <div className="adam-player-grid">
        <div className="adam-player-left">
          <VinylDisc size={52} spinning={playing} label="♪" />
          <div className="adam-player-meta">
            <div className="adam-display adam-player-title">
              {current.title}
            </div>
            <div className="adam-player-artist">
              {current.artist?.name || '—'}
            </div>
          </div>
        </div>
        <div className="adam-player-right">
          <div className="adam-player-controls">
            <button
              type="button"
              className="adam-btn adam-btn--icon adam-btn--minimal"
              disabled={!hasPrev}
              style={{ opacity: hasPrev ? 1 : 0.35 }}
              aria-label="Предыдущий"
              onClick={() => playPrev()}
            >
              ‹
            </button>
            <button type="button" className="adam-btn adam-btn--icon adam-player-play" onClick={() => toggle()} aria-label={playing ? 'Пауза' : 'Играть'}>
              {playing ? '⏸' : '▶'}
            </button>
            <button
              type="button"
              className="adam-btn adam-btn--icon adam-btn--minimal"
              disabled={!hasNext}
              style={{ opacity: hasNext ? 1 : 0.35 }}
              aria-label="Следующий"
              onClick={() => playNext()}
            >
              ›
            </button>
            <span className="adam-player-time">
              {formatTime(currentTime)} / {formatTime(duration)}
            </span>
          </div>
          <button
            type="button"
            aria-label="Прогресс"
            onClick={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              const x = e.clientX - rect.left;
              seek(x / rect.width);
            }}
            className="adam-player-progress"
          >
            <div
              className="adam-player-progress__bar"
              style={{ width: `${ratio * 100}%` }}
            />
          </button>
        </div>
      </div>
    </div>
  );
}
