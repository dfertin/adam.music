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
    <div
      className="adam-glass"
      style={{
        position: 'fixed',
        bottom: '0.75rem',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 50,
        width: 'min(920px, calc(100% - 1.5rem))',
        padding: '0.65rem 1rem 0.85rem',
        borderRadius: 'var(--radius-lg)',
      }}
    >
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 1.1fr) minmax(0, 1.4fr)',
          gap: '1rem',
          alignItems: 'center',
        }}
        className="adam-player-grid"
      >
        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', minWidth: 0 }}>
          <VinylDisc size={52} spinning={playing} label="♪" />
          <div style={{ minWidth: 0 }}>
            <div
              className="adam-display"
              style={{
                fontSize: '0.92rem',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              {current.title}
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--adam-muted)', letterSpacing: '0.04em', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {current.artist?.name || '—'}
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.35rem' }}>
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
            <button type="button" className="adam-btn adam-btn--icon" style={{ width: '2.65rem', height: '2.65rem' }} onClick={() => toggle()} aria-label={playing ? 'Пауза' : 'Играть'}>
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
            <span style={{ fontSize: '0.72rem', color: 'var(--adam-faint)', marginLeft: '0.35rem', fontVariantNumeric: 'tabular-nums' }}>
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
            style={{
              width: '100%',
              height: 5,
              borderRadius: 999,
              border: 'none',
              padding: 0,
              cursor: 'pointer',
              background: 'rgba(20,19,18,0.08)',
            }}
          >
            <div
              style={{
                height: '100%',
                width: `${ratio * 100}%`,
                borderRadius: 999,
                background: 'var(--adam-accent)',
                pointerEvents: 'none',
              }}
            />
          </button>
        </div>
      </div>
      <style>{`
        @media (max-width: 640px) {
          .adam-player-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
