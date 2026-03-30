import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { api } from '../api/client.js';
import { useAuth } from '../context/AuthContext.jsx';
import { usePlayer } from '../context/PlayerContext.jsx';
import { VinylDisc } from '../components/VinylDisc.jsx';
import { AddToPlaylist } from '../components/AddToPlaylist.jsx';

export default function Album() {
  const { id } = useParams();
  const { isAuthenticated, user } = useAuth();
  const { playTrack } = usePlayer();
  const [album, setAlbum] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [rating, setRating] = useState(5);
  const [text, setText] = useState('');
  const [favSet, setFavSet] = useState(() => new Set());

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const [a, revs] = await Promise.all([api(`/albums/${id}`), api(`/reviews?albumId=${id}`)]);
        if (!cancelled) {
          setAlbum(a);
          setReviews(revs);
        }
        if (isAuthenticated) {
          try {
            const favs = await api('/favorites');
            if (!cancelled) {
              const ids = new Set(favs.map((f) => String(f.track?._id || f.track)));
              setFavSet(ids);
            }
          } catch {
            /* ignore */
          }
        }
      } catch (e) {
        toast.error(e.message || 'Альбом не найден');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [id, isAuthenticated]);

  async function submitReview(e) {
    e.preventDefault();
    if (!isAuthenticated) {
      toast.error('Войдите, чтобы оставить отзыв');
      return;
    }
    try {
      const r = await api('/reviews', {
        method: 'POST',
        body: { albumId: id, rating, text },
      });
      toast.success('Успешно сохранено');
      setReviews((prev) => {
        const rest = prev.filter((x) => String(x.user?._id || x.user) !== String(user?.id));
        return [r, ...rest];
      });
      setText('');
    } catch (err) {
      toast.error(err.message || 'Ошибка');
    }
  }

  async function toggleFavorite(trackId) {
    if (!isAuthenticated) {
      toast.error('Войдите, чтобы добавить в избранное');
      return;
    }
    try {
      const has = favSet.has(String(trackId));
      if (has) {
        await api(`/favorites?trackId=${trackId}`, { method: 'DELETE' });
        setFavSet((prev) => {
          const n = new Set(prev);
          n.delete(String(trackId));
          return n;
        });
        toast.success('Удалено из избранного');
      } else {
        await api('/favorites', { method: 'POST', body: { trackId } });
        setFavSet((prev) => new Set(prev).add(String(trackId)));
        toast.success('Добавлено в избранное');
      }
    } catch (err) {
      toast.error(err.message || 'Ошибка');
    }
  }

  if (loading || !album) {
    return (
      <div className="adam-container" style={{ padding: '3rem' }}>
        <div className="adam-spinner" style={{ margin: '0 auto' }} />
      </div>
    );
  }

  const cover = album.coverUrl || 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=800';

  return (
    <div className="adam-container" style={{ padding: '2rem 0' }}>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(200px, 320px) 1fr',
          gap: '2rem',
          alignItems: 'start',
        }}
        className="album-hero"
      >
        <div className="adam-card" style={{ padding: 0 }}>
          <img src={cover} alt="" width={640} height={640} style={{ width: '100%', aspectRatio: '1', objectFit: 'cover' }} loading="eager" />
        </div>
        <div>
          <p className="adam-eyebrow" style={{ margin: 0 }}>
            {album.genre || 'Альбом'}
          </p>
          <h1 className="adam-h1" style={{ margin: '0.5rem 0' }}>
            {album.title}
          </h1>
          <p style={{ fontSize: '1.05rem', letterSpacing: '0.02em' }}>{album.artist?.name}</p>
          {album.year ? <p style={{ color: 'var(--adam-muted)' }}>{album.year}</p> : null}
          <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.25rem', alignItems: 'center' }}>
            <VinylDisc size={72} spinning={false} label="LP" />
            <span style={{ color: 'var(--adam-muted)', fontSize: '0.95rem' }}>Виниловая подача — слушайте треки ниже.</span>
          </div>
        </div>
      </div>

      <section style={{ marginTop: '2.5rem' }}>
        <h2 className="adam-h2">Треки</h2>
        <ul style={{ listStyle: 'none', padding: 0, margin: '1rem 0 0' }}>
          {(album.tracks || []).map((t, i) => (
            <li
              key={t._id}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '1rem',
                padding: '0.65rem 0',
                borderBottom: '1px solid var(--adam-border)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <span style={{ color: 'var(--adam-muted)', width: '1.5rem' }}>{i + 1}</span>
                <button
                  type="button"
                  className="adam-btn adam-btn--ghost"
                  style={{ padding: '0.35rem 0.75rem' }}
                  onClick={() => playTrack(t, album.tracks)}
                >
                  ▶
                </button>
                <span style={{ fontWeight: 500 }}>{t.title}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap', justifyContent: 'flex-end' }}>
                <span style={{ color: 'var(--adam-muted)', fontSize: '0.85rem', fontVariantNumeric: 'tabular-nums' }}>
                  {t.durationSec ? `${Math.floor(t.durationSec / 60)}:${String(t.durationSec % 60).padStart(2, '0')}` : ''}
                </span>
                <AddToPlaylist trackId={t._id} compact />
                <button type="button" className="adam-btn adam-btn--minimal" style={{ padding: '0.3rem 0.55rem' }} onClick={() => toggleFavorite(t._id)}>
                  {favSet.has(String(t._id)) ? '★' : '☆'}
                </button>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section style={{ marginTop: '2.5rem' }}>
        <h2 className="adam-h2">Отзывы</h2>
        {isAuthenticated ? (
          <form onSubmit={submitReview} style={{ marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.75rem', maxWidth: 480 }}>
            <label style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
              <span>Оценка (1–5)</span>
              <input
                className="adam-input"
                type="number"
                min={1}
                max={5}
                value={rating}
                onChange={(e) => setRating(Number(e.target.value))}
              />
            </label>
            <label style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
              <span>Комментарий</span>
              <textarea className="adam-input" rows={3} value={text} onChange={(e) => setText(e.target.value)} />
            </label>
            <button type="submit" className="adam-btn" style={{ alignSelf: 'flex-start' }}>
              Отправить
            </button>
          </form>
        ) : (
          <p style={{ color: 'var(--adam-muted)' }}>Войдите, чтобы оставить отзыв.</p>
        )}
        <ul style={{ listStyle: 'none', padding: 0, marginTop: '1.5rem' }}>
          {reviews.map((r) => (
            <li key={r._id} className="adam-card" style={{ padding: '1rem 1.25rem', marginBottom: '0.75rem' }}>
              <strong>{r.rating}★</strong> — {r.user?.name || r.user?.email || 'Пользователь'}
              {r.text ? <p style={{ margin: '0.5rem 0 0', color: 'var(--adam-muted)' }}>{r.text}</p> : null}
            </li>
          ))}
        </ul>
      </section>
      <style>{`
        @media (max-width: 768px) {
          .album-hero {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
