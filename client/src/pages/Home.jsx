import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { api } from '../api/client.js';
import { useAuth } from '../context/AuthContext.jsx';
import { AlbumCard } from '../components/AlbumCard.jsx';

export default function Home() {
  const { isAuthenticated, user } = useAuth();
  const [albums, setAlbums] = useState([]);
  const [playlists, setPlaylists] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const albumData = await api('/albums');
        if (!cancelled) setAlbums(albumData);
        if (isAuthenticated) {
          try {
            const pl = await api('/playlists');
            if (!cancelled) setPlaylists(pl);
          } catch {
            /* ignore */
          }
        } else if (!cancelled) {
          setPlaylists([]);
        }
      } catch (e) {
        toast.error(e.message || 'Не удалось загрузить данные');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [isAuthenticated]);

  if (loading) {
    return (
      <div className="adam-container" style={{ padding: '4rem 0' }}>
        <div className="adam-spinner" style={{ margin: '0 auto' }} />
      </div>
    );
  }

  const firstName = user?.name?.trim()?.split(/\s+/)[0] || '';

  return (
    <div className="adam-container" style={{ padding: '2rem 0 3rem' }}>
      <header
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
          alignItems: 'flex-end',
          gap: '1rem',
          marginBottom: '2.25rem',
        }}
      >
        <div>
          {isAuthenticated && firstName ? (
            <p className="adam-eyebrow" style={{ margin: '0 0 0.35rem' }}>
              Добро пожаловать
            </p>
          ) : (
            <p className="adam-eyebrow" style={{ margin: '0 0 0.35rem' }}>
              Каталог
            </p>
          )}
          <h1 className="adam-h1">
            {isAuthenticated && firstName ? `Привет, ${firstName}` : 'Открытия для вас'}
          </h1>
          <p className="adam-lead" style={{ marginTop: '0.5rem', marginBottom: 0 }}>
            Подборка релизов и ваши плейлисты — в одном спокойном экране.
          </p>
        </div>
        <Link to="/search" className="adam-btn adam-btn--ghost" style={{ flexShrink: 0 }}>
          Найти трек
        </Link>
      </header>

      {isAuthenticated && playlists.length > 0 && (
        <section style={{ marginBottom: '2.75rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.75rem' }}>
            <h2 className="adam-h2">Мои плейлисты</h2>
            <Link to="/library" className="adam-eyebrow" style={{ color: 'var(--adam-accent)', textDecoration: 'none' }}>
              Управление →
            </Link>
          </div>
          <div className="adam-scroll-row">
            {playlists.map((pl) => (
              <article key={pl._id} className="playlist-strip-card">
                <div className="adam-eyebrow" style={{ marginBottom: '0.5rem', color: 'var(--adam-faint)' }}>
                  Плейлист
                </div>
                <div className="adam-display" style={{ fontSize: '1.05rem', marginBottom: '0.35rem' }}>
                  {pl.name}
                </div>
                <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--adam-muted)' }}>
                  {(pl.tracks || []).length} {pl.tracks?.length === 1 ? 'трек' : 'треков'}
                </p>
                <Link
                  to="/library"
                  className="adam-btn adam-btn--minimal"
                  style={{ marginTop: '1rem', width: '100%', justifyContent: 'center', fontSize: '0.78rem', padding: '0.5rem' }}
                >
                  Открыть
                </Link>
              </article>
            ))}
          </div>
        </section>
      )}

      <section>
        <h2 className="adam-h2" style={{ marginBottom: '1.25rem' }}>
          Новинки и релизы
        </h2>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(190px, 1fr))',
            gap: '1.35rem',
          }}
        >
          {albums.map((a) => (
            <AlbumCard key={a._id} album={a} />
          ))}
        </div>
      </section>
    </div>
  );
}
