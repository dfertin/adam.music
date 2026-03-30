import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { api } from '../api/client.js';

export default function Artists() {
  const [artists, setArtists] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const data = await api('/artists');
        if (!cancelled) setArtists(data);
      } catch (e) {
        toast.error(e.message || 'Ошибка');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) {
    return (
      <div className="adam-container" style={{ padding: '3rem' }}>
        <div className="adam-spinner" style={{ margin: '0 auto' }} />
      </div>
    );
  }

  return (
    <div className="adam-container" style={{ padding: '2rem 0' }}>
      <h1 className="adam-h1">Артисты</h1>
      <div
        style={{
          marginTop: '1.5rem',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
          gap: '1.25rem',
        }}
      >
        {artists.map((a) => (
          <Link key={a._id} to={`/artists/${a._id}`} className="adam-card" style={{ textDecoration: 'none', color: 'inherit' }}>
            <div style={{ aspectRatio: '1', background: '#e8e6df', overflow: 'hidden' }}>
              {a.image ? (
                <img src={a.image} alt="" width={400} height={400} loading="lazy" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                <div style={{ height: '100%', display: 'grid', placeItems: 'center', color: 'var(--adam-muted)' }}>♪</div>
              )}
            </div>
            <div style={{ padding: '1rem' }}>
              <div style={{ fontWeight: 600 }}>{a.name}</div>
              {a.bio ? <p style={{ fontSize: '0.9rem', color: 'var(--adam-muted)', margin: '0.35rem 0 0' }}>{a.bio.slice(0, 80)}…</p> : null}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
