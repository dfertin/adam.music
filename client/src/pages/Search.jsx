import { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { api } from '../api/client.js';
import { useAuth } from '../context/AuthContext.jsx';
import { usePlayer } from '../context/PlayerContext.jsx';
import { AddToPlaylist } from '../components/AddToPlaylist.jsx';

export default function Search() {
  const { isAuthenticated } = useAuth();
  const { playTrack } = usePlayer();
  const [params, setParams] = useSearchParams();
  const q = params.get('q') || '';
  const [query, setQuery] = useState(q);
  const [result, setResult] = useState({ albums: [], artists: [], tracks: [] });
  const [loading, setLoading] = useState(false);
  const [favSet, setFavSet] = useState(() => new Set());

  useEffect(() => {
    setQuery(q);
  }, [q]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      try {
        let data;
        if (q.trim()) {
          data = await api(`/search?q=${encodeURIComponent(q)}`);
        } else {
          const [albums, artists, tracks] = await Promise.all([api('/albums'), api('/artists'), api('/tracks')]);
          data = { albums, artists, tracks };
        }
        if (!cancelled) setResult(data);
      } catch (e) {
        toast.error(e.message || 'Ошибка поиска');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [q]);

  useEffect(() => {
    if (!isAuthenticated) {
      setFavSet(new Set());
      return;
    }
    let cancelled = false;
    (async () => {
      try {
        const favs = await api('/favorites');
        if (!cancelled) {
          setFavSet(new Set(favs.map((f) => String(f.track?._id || f.track))));
        }
      } catch {
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [isAuthenticated]);

  const tracksByAlbum = useMemo(() => {
    const map = new Map();
    result.tracks.forEach((t) => {
      const key = String(t.album?._id || '');
      if (!key) return;
      if (!map.has(key)) map.set(key, []);
      map.get(key).push(t);
    });
    return map;
  }, [result.tracks]);

  async function toggleFavorite(trackId) {
    if (!isAuthenticated) {
      toast.error('Войдите, чтобы добавлять в избранное');
      return;
    }
    try {
      const has = favSet.has(String(trackId));
      if (has) {
        await api(`/favorites?trackId=${trackId}`, { method: 'DELETE' });
        setFavSet((prev) => {
          const next = new Set(prev);
          next.delete(String(trackId));
          return next;
        });
        toast.success('Удалено из избранного');
      } else {
        await api('/favorites', { method: 'POST', body: { trackId } });
        setFavSet((prev) => new Set(prev).add(String(trackId)));
        toast.success('Добавлено в избранное');
      }
    } catch (e) {
      toast.error(e.message || 'Ошибка');
    }
  }

  function onSubmit(e) {
    e.preventDefault();
    setParams(query.trim() ? { q: query.trim() } : {});
  }

  return (
    <div className="adam-container adam-pad-2">
      <h1 className="adam-h1">Поиск</h1>
      <form onSubmit={onSubmit} className="search-form">
        <input
          className="adam-input search-input-grow"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Альбом, артист, трек…"
          aria-label="Поисковый запрос"
        />
        <button type="submit" className="adam-btn">
          Найти
        </button>
      </form>
      {!q.trim() ? <p className="discover-sub library-top-gap">Показываем все альбомы, исполнителей и треки.</p> : null}
      {loading ? (
        <div className="search-sections">
          <div className="adam-spinner" />
        </div>
      ) : (
        <div className="search-sections">
          <section>
            <h2 className="adam-h2">Альбомы</h2>
            <ul className="plain-list">
              {result.albums.map((a) => (
                <li key={a._id} className="list-item-sm">
                  <Link to={`/album/${a._id}`}>{a.title}</Link>
                  {a.artist?.name ? <span className="muted-text"> — {a.artist.name}</span> : null}
                </li>
              ))}
            </ul>
          </section>
          <section>
            <h2 className="adam-h2">Артисты</h2>
            <ul className="plain-list">
              {result.artists.map((a) => (
                <li key={a._id} className="list-item-sm">
                  <Link to={`/artists/${a._id}`}>{a.name}</Link>
                </li>
              ))}
            </ul>
          </section>
          <section>
            <h2 className="adam-h2">Треки</h2>
            <ul className="plain-list">
              {result.tracks.map((t) => (
                <li key={t._id} className="track-row">
                  <button
                    type="button"
                    onClick={() => {
                      const queue = tracksByAlbum.get(String(t.album?._id || '')) || [t];
                      playTrack(t, queue);
                    }}
                    className="track-row__title-btn"
                  >
                    <span className="album-card-title">{t.title}</span>
                    {t.artist?.name ? <span className="muted-text"> — {t.artist.name}</span> : null}
                    {t.album?._id ? (
                      <span>
                        {' '}
                        (<Link to={`/album/${t.album._id}`}>альбом</Link>)
                      </span>
                    ) : null}
                  </button>
                  <div className="track-row__actions">
                    <button type="button" className="adam-btn adam-btn--ghost adam-btn--xs" onClick={() => {
                      const queue = tracksByAlbum.get(String(t.album?._id || '')) || [t];
                      playTrack(t, queue);
                    }}>
                      ▶
                    </button>
                    {isAuthenticated ? (
                      <>
                        <button type="button" className="adam-btn adam-btn--minimal" onClick={() => toggleFavorite(t._id)}>
                          {favSet.has(String(t._id)) ? '♥' : '♡'}
                        </button>
                        <AddToPlaylist trackId={t._id} compact />
                      </>
                    ) : null}
                  </div>
                </li>
              ))}
            </ul>
          </section>
        </div>
      )}
    </div>
  );
}
