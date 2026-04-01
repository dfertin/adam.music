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
          } catch {}
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
      <div className="adam-container adam-pad-4">
        <div className="adam-spinner" />
      </div>
    );
  }

  const cover = album.coverUrl || 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=800';

  return (
    <div className="adam-container adam-pad-2">
      <div className="album-hero">
        <div className="adam-card">
          <img src={cover} alt="" width={640} height={640} className="album-cover" loading="eager" />
        </div>
        <div>
          <p className="adam-eyebrow">{album.genre || 'Альбом'}</p>
          <h1 className="adam-h1 album-top-gap">
            {album.title}
          </h1>
          <p className="discover-sub album-sub-gap">
            {album.artist?.name}
          </p>
          {album.year ? <p className="discover-sub">{album.year}</p> : null}
          <div className="landing-actions album-actions-gap">
            <VinylDisc size={72} spinning={false} label="LP" />
            <span className="discover-sub">Виниловая подача — слушайте треки ниже.</span>
          </div>
        </div>
      </div>

      <section className="section-gap">
        <h2 className="adam-h2">Треки</h2>
        <ul className="album-tracks">
          {(album.tracks || []).map((t, i) => (
            <li key={t._id} className="album-track">
              <div className="album-track__idx">{String(i + 1).padStart(2, '0')}</div>
              <div className="min-w-0">
                <button type="button" className="adam-btn adam-btn--ghost track-play-btn" onClick={() => playTrack(t, album.tracks)}>
                  ▶
                </button>
                <span className="album-track__title">{t.title}</span>
                <div className="album-track__meta">{album.artist?.name}</div>
              </div>
              <div className="album-track__album">{album.title}</div>
              <div className="album-track__plays">
                —
              </div>
              <div className="track-row__actions">
                <div className="album-track__duration">
                  {t.durationSec ? `${Math.floor(t.durationSec / 60)}:${String(t.durationSec % 60).padStart(2, '0')}` : ''}
                </div>
                <AddToPlaylist trackId={t._id} compact />
                <button type="button" className="adam-btn adam-btn--minimal" onClick={() => toggleFavorite(t._id)}>
                  {favSet.has(String(t._id)) ? '♥' : '♡'}
                </button>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section className="section-gap">
        <h2 className="adam-h2">Отзывы</h2>
        {isAuthenticated ? (
          <form onSubmit={submitReview} className="form-col review-form">
            <label className="label-col">
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
            <label className="label-col">
              <span>Комментарий</span>
              <textarea className="adam-input" rows={3} value={text} onChange={(e) => setText(e.target.value)} />
            </label>
            <button type="submit" className="adam-btn">
              Отправить
            </button>
          </form>
        ) : (
          <p className="discover-sub">Войдите, чтобы оставить отзыв.</p>
        )}
        <ul className="plain-list section-gap-sm">
          {reviews.map((r) => (
            <li key={r._id} className="adam-card review-item">
              <strong>{r.rating}★</strong> — {r.user?.name || r.user?.email || 'Пользователь'}
              {r.text ? <p className="discover-sub review-text">{r.text}</p> : null}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
