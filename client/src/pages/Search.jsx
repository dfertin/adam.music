import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { api } from '../api/client.js';

export default function Search() {
  const [params, setParams] = useSearchParams();
  const q = params.get('q') || '';
  const [query, setQuery] = useState(q);
  const [result, setResult] = useState({ albums: [], artists: [], tracks: [] });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setQuery(q);
  }, [q]);

  useEffect(() => {
    if (!q.trim()) {
      setResult({ albums: [], artists: [], tracks: [] });
      return;
    }
    let cancelled = false;
    (async () => {
      setLoading(true);
      try {
        const data = await api(`/search?q=${encodeURIComponent(q)}`);
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

  function onSubmit(e) {
    e.preventDefault();
    setParams(query.trim() ? { q: query.trim() } : {});
  }

  return (
    <div className="adam-container" style={{ padding: '2rem 0' }}>
      <h1 className="adam-h1">Поиск</h1>
      <form onSubmit={onSubmit} style={{ marginTop: '1rem', display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
        <input
          className="adam-input"
          style={{ flex: '1 1 240px' }}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Альбом, артист, трек…"
          aria-label="Поисковый запрос"
        />
        <button type="submit" className="adam-btn">
          Найти
        </button>
      </form>
      {loading ? (
        <div style={{ marginTop: '2rem' }}>
          <div className="adam-spinner" />
        </div>
      ) : (
        <div style={{ marginTop: '2rem', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          <section>
            <h2 className="adam-h2">Альбомы</h2>
            <ul style={{ listStyle: 'none', padding: 0 }}>
              {result.albums.map((a) => (
                <li key={a._id} style={{ padding: '0.35rem 0' }}>
                  <Link to={`/album/${a._id}`}>{a.title}</Link>
                  {a.artist?.name ? <span style={{ color: 'var(--adam-muted)' }}> — {a.artist.name}</span> : null}
                </li>
              ))}
            </ul>
          </section>
          <section>
            <h2 className="adam-h2">Артисты</h2>
            <ul style={{ listStyle: 'none', padding: 0 }}>
              {result.artists.map((a) => (
                <li key={a._id} style={{ padding: '0.35rem 0' }}>
                  <Link to={`/artists/${a._id}`}>{a.name}</Link>
                </li>
              ))}
            </ul>
          </section>
          <section>
            <h2 className="adam-h2">Треки</h2>
            <ul style={{ listStyle: 'none', padding: 0 }}>
              {result.tracks.map((t) => (
                <li key={t._id} style={{ padding: '0.35rem 0' }}>
                  {t.title}
                  {t.artist?.name ? <span style={{ color: 'var(--adam-muted)' }}> — {t.artist.name}</span> : null}
                  {t.album?._id ? (
                    <span>
                      {' '}
                      (<Link to={`/album/${t.album._id}`}>альбом</Link>)
                    </span>
                  ) : null}
                </li>
              ))}
            </ul>
          </section>
        </div>
      )}
    </div>
  );
}
