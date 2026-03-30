import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { api } from '../api/client.js';
import { AlbumCard } from '../components/AlbumCard.jsx';

export default function ArtistDetail() {
  const { id } = useParams();
  const [artist, setArtist] = useState(null);
  const [albums, setAlbums] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const [a, albs] = await Promise.all([api(`/artists/${id}`), api(`/albums?artist=${id}`)]);
        if (!cancelled) {
          setArtist(a);
          setAlbums(albs);
        }
      } catch (e) {
        toast.error(e.message || 'Не найдено');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [id]);

  if (loading || !artist) {
    return (
      <div className="adam-container" style={{ padding: '3rem' }}>
        <div className="adam-spinner" style={{ margin: '0 auto' }} />
      </div>
    );
  }

  return (
    <div className="adam-container" style={{ padding: '2rem 0' }}>
      <Link to="/artists" style={{ fontSize: '0.95rem' }}>
        ← Все артисты
      </Link>
      <div style={{ display: 'flex', gap: '1.5rem', marginTop: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
        <div
          style={{
            width: 140,
            height: 140,
            borderRadius: '50%',
            overflow: 'hidden',
            background: '#e8e6df',
            flexShrink: 0,
          }}
        >
          {artist.image ? (
            <img src={artist.image} alt="" width={280} height={280} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          ) : null}
        </div>
        <div>
          <h1 className="adam-h1" style={{ margin: 0 }}>
            {artist.name}
          </h1>
          {artist.bio ? <p style={{ color: 'var(--adam-muted)', maxWidth: '56ch' }}>{artist.bio}</p> : null}
        </div>
      </div>
      <h2 className="adam-h2" style={{ marginTop: '2rem' }}>
        Альбомы
      </h2>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
          gap: '1.25rem',
          marginTop: '1rem',
        }}
      >
        {albums.map((album) => (
          <AlbumCard key={album._id} album={album} />
        ))}
      </div>
    </div>
  );
}
