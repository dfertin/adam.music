import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { api } from '../api/client.js';
import { useAuth } from '../context/AuthContext.jsx';
import { usePlayer } from '../context/PlayerContext.jsx';
import { VinylDisc } from '../components/VinylDisc.jsx';

export default function Home() {
  const { isAuthenticated, user } = useAuth();
  const { playTrack } = usePlayer();
  const [albums, setAlbums] = useState([]);
  const [loading, setLoading] = useState(true);
  const [playingAlbumId, setPlayingAlbumId] = useState('');

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const albumData = await api('/albums');
        if (!cancelled) setAlbums(albumData);
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
      <div className="adam-container adam-pad-4">
        <div className="adam-spinner" />
      </div>
    );
  }

  const firstName = user?.name?.trim()?.split(/\s+/)[0] || '';
  const reco = albums[0];
  const trending = albums.slice(1, 5);

  async function playAlbumFirstTrack(album) {
    if (!album?._id) return;
    try {
      setPlayingAlbumId(album._id);
      const fullAlbum = await api(`/albums/${album._id}`);
      const tracks = Array.isArray(fullAlbum?.tracks) ? fullAlbum.tracks : [];
      const first = tracks[0];
      if (!first?.audioUrl) {
        toast.error('В этом альбоме пока нет доступных треков');
        return;
      }
      playTrack(first, tracks);
    } catch (e) {
      toast.error(e.message || 'Не удалось запустить трек');
    } finally {
      setPlayingAlbumId('');
    }
  }

  return (
    <div className="adam-container adam-pad-2">
      <header className="discover-header">
        <div>
          <h1 className="adam-h1">{isAuthenticated && firstName ? `Добрый вечер, ${firstName}` : 'Добрый вечер'}</h1>
          <p className="discover-sub">Что вы хотите послушать?</p>
          <div className="discover-search">
            <input className="adam-input" placeholder="Поиск песен, исполнителей, альбомов..." aria-label="Поиск" />
          </div>
        </div>
      </header>

      <div className="discover-grid">
        {reco ? (
          <section className="discover-reco" aria-label="Рекомендованный альбом">
            <div>
              <div className="adam-eyebrow">Рекомендованный альбом</div>
              <div className="discover-reco__title">{reco.title}</div>
              <div className="discover-reco__meta">{reco.artist?.name || '—'}</div>
              <div className="discover-reco__actions">
                <button type="button" className="adam-btn" disabled={playingAlbumId === reco._id} onClick={() => playAlbumFirstTrack(reco)}>
                  {playingAlbumId === reco._id ? 'Загрузка...' : '▶ Слушать сейчас'}
                </button>
              </div>
            </div>
            <div className="discover-reco__vinyl" aria-hidden>
              <VinylDisc size={110} spinning={false} label="A" />
            </div>
          </section>
        ) : null}

        <section aria-label="Популярное сейчас">
          <div className="trending-head">
            <h2 className="adam-h2">Популярное сейчас</h2>
            <Link to="/search" className="adam-eyebrow muted-link">
              Далее →
            </Link>
          </div>
          <div className="trending-grid">
            {trending.map((a) => (
              <article key={a._id} className="trending-card">
                <div className="trending-card__top">
                  <div className="trending-card__dot" aria-hidden />
                  <button type="button" className="trending-card__play" aria-label="Играть" disabled={playingAlbumId === a._id} onClick={() => playAlbumFirstTrack(a)}>
                    ▶
                  </button>
                </div>
                <div className="trending-card__name">{a.title}</div>
                <div className="trending-card__meta">{a.artist?.name || '—'}</div>
              </article>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
