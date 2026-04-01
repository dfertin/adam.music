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
      <div className="adam-container adam-pad-4">
        <div className="adam-spinner" />
      </div>
    );
  }

  return (
    <div className="adam-container adam-pad-2">
      <h1 className="adam-h1">Артисты</h1>
      <div className="artists-grid">
        {artists.map((a) => (
          <Link key={a._id} to={`/artists/${a._id}`} className="adam-card album-card-link">
            <div className="artist-card-cover">
              {a.image ? (
                <img src={a.image} alt="" width={400} height={400} loading="lazy" className="artist-card-img" />
              ) : (
                <div className="artist-card-fallback">♪</div>
              )}
            </div>
            <div className="artist-card-body">
              <div className="album-card-title">{a.name}</div>
              {a.bio ? <p className="muted-text">{a.bio.slice(0, 80)}…</p> : null}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
