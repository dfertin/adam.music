import { usePlayer } from '../context/PlayerContext.jsx';
import { VinylDisc } from './VinylDisc.jsx';

function formatTime(sec) {
  if (!sec || Number.isNaN(sec)) return '0:00';
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
}

export function NowPlayingPanel() {
  const { current, queue, playing, currentTime, duration, toggle, seek, playNext, playPrev } = usePlayer();

  const ratio = duration ? currentTime / duration : 0;
  const idx = current ? queue.findIndex((t) => String(t._id) === String(current._id)) : -1;
  const hasPrev = idx > 0;
  const hasNext = idx >= 0 && idx < queue.length - 1;

  return (
    <aside className="adam-now adam-glass" aria-label="Сейчас играет">
      <div className="now-tabs">
        <span className="now-tab now-tab--active">Сейчас играет</span>
        <span className="now-tab">Очередь</span>
      </div>

      <div className="now-stage">
        <VinylDisc size={180} spinning={Boolean(current && playing)} label="♪" />
      </div>

      <div className="now-title">{current?.title || 'Выберите трек'}</div>
      <div className="now-artist">{current?.artist?.name || '—'}</div>

      <button
        type="button"
        className="now-progress"
        aria-label="Прогресс"
        disabled={!current}
        onClick={(e) => {
          const rect = e.currentTarget.getBoundingClientRect();
          const x = e.clientX - rect.left;
          seek(x / rect.width);
        }}
      >
        <div className="now-progress__bar" style={{ width: `${ratio * 100}%` }} />
      </button>

      <div className="now-controls">
        <button type="button" className="adam-btn adam-btn--icon adam-btn--minimal" disabled={!hasPrev} onClick={() => playPrev()} aria-label="Предыдущий">
          ‹
        </button>
        <button type="button" className="adam-btn adam-btn--icon" onClick={() => toggle()} aria-label={playing ? 'Пауза' : 'Играть'} disabled={!current}>
          {playing ? '⏸' : '▶'}
        </button>
        <button type="button" className="adam-btn adam-btn--icon adam-btn--minimal" disabled={!hasNext} onClick={() => playNext()} aria-label="Следующий">
          ›
        </button>
      </div>

      <div className="now-time">
        {formatTime(currentTime)} / {formatTime(duration)}
      </div>
    </aside>
  );
}

