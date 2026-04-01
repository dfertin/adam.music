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
      <div className="adam-container adam-pad-4">
        <div className="adam-spinner" />
      </div>
    );
  }

  return (
    <div className="adam-container adam-pad-2">
      <Link to="/artists" className="muted-text">
        ← Все артисты
      </Link>
      <div className="artist-detail-head">
        <div className="artist-avatar">
          {artist.image ? (
            <img src={artist.image} alt="" width={280} height={280} />
          ) : null}
        </div>
        <div>
          <h1 className="adam-h1">
            {artist.name}
          </h1>
          {artist.bio ? <p className="muted-text">{artist.bio}</p> : null}
        </div>
      </div>
      <h2 className="adam-h2 section-gap">
        Альбомы
      </h2>
      <div className="album-grid">
        {albums.map((album) => (
          <AlbumCard key={album._id} album={album} />
        ))}
      </div>
    </div>
  );
}
