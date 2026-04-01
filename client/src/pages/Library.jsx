import { useCallback, useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import { api } from '../api/client.js';
import { usePlayer } from '../context/PlayerContext.jsx';

function PlaylistTrackAdd({ playlistId, existingIds, onAdded }) {
  const [open, setOpen] = useState(false);
  const [allTracks, setAllTracks] = useState([]);
  const [q, setQ] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open) return;
    let cancelled = false;
    (async () => {
      setLoading(true);
      try {
        const t = await api('/tracks');
        if (!cancelled) setAllTracks(t);
      } catch (e) {
        toast.error(e.message || 'Ошибка');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [open]);

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    const list = !s
      ? allTracks
      : allTracks.filter(
          (t) =>
            (t.title && t.title.toLowerCase().includes(s)) ||
            (t.artist?.name && t.artist.name.toLowerCase().includes(s))
        );
    return list.slice(0, 50);
  }, [allTracks, q]);

  async function addTrack(trackId) {
    if (existingIds.has(String(trackId))) {
      toast.error('Этот трек уже в плейлисте');
      return;
    }
    try {
      await api(`/playlists/${playlistId}/tracks`, { method: 'POST', body: { trackId } });
      toast.success('Трек добавлен');
      onAdded();
      setOpen(false);
      setQ('');
    } catch (e) {
      toast.error(e.message || 'Не удалось добавить');
    }
  }

  return (
    <div className="library-top-gap">
      <button type="button" className="adam-btn adam-btn--minimal adam-btn--xs" onClick={() => setOpen((v) => !v)}>
        {open ? 'Скрыть поиск' : '+ Добавить треки'}
      </button>
      {open && (
        <div className="adam-glass library-add-wrap">
          <input
            className="adam-input"
            placeholder="Название трека или артист…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
          {loading ? (
            <div className="adam-spinner" />
          ) : (
            <ul className="plain-list library-scroll-list">
              {filtered.map((t) => (
                <li key={t._id} className="library-track-option">
                  <span>
                    {t.title}
                    <span className="muted-text"> — {t.artist?.name}</span>
                  </span>
                  <button type="button" className="adam-btn adam-btn--minimal" onClick={() => addTrack(t._id)}>
                    +
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}

export default function Library() {
  const { playTrack } = usePlayer();
  const [playlists, setPlaylists] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newName, setNewName] = useState('');

  const load = useCallback(async () => {
    try {
      const [pl, fav] = await Promise.all([api('/playlists'), api('/favorites')]);
      setPlaylists(pl);
      setFavorites(fav);
    } catch (e) {
      toast.error(e.message || 'Ошибка загрузки');
    }
  }, []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        await load();
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [load]);

  async function createPlaylist(e) {
    e.preventDefault();
    if (!newName.trim()) return;
    try {
      const pl = await api('/playlists', { method: 'POST', body: { name: newName.trim() } });
      setPlaylists((p) => [pl, ...p]);
      setNewName('');
      toast.success('Плейлист создан');
    } catch (err) {
      toast.error(err.message || 'Ошибка');
    }
  }

  async function removePlaylist(plId) {
    try {
      await api(`/playlists/${plId}`, { method: 'DELETE' });
      setPlaylists((p) => p.filter((x) => x._id !== plId));
      toast.success('Удалено');
    } catch (err) {
      toast.error(err.message || 'Ошибка');
    }
  }

  async function removeTrackFromPlaylist(plId, trackId) {
    try {
      const updated = await api(`/playlists/${plId}/tracks/${trackId}`, { method: 'DELETE' });
      setPlaylists((ps) => ps.map((p) => (p._id === plId ? updated : p)));
      toast.success('Трек убран из плейлиста');
    } catch (err) {
      toast.error(err.message || 'Ошибка');
    }
  }

  async function refreshPlaylist(plId) {
    const full = await api('/playlists');
    const one = full.find((p) => p._id === plId);
    if (one) {
      setPlaylists((ps) => ps.map((p) => (p._id === plId ? one : p)));
    } else {
      await load();
    }
  }

  if (loading) {
    return (
      <div className="adam-container adam-pad-4">
        <div className="adam-spinner" />
      </div>
    );
  }

  return (
    <div className="adam-container adam-pad-2">
      <p className="adam-eyebrow">
        Коллекция
      </p>
      <h1 className="adam-h1">
        Библиотека
      </h1>
      <p className="adam-lead">
        Плейлисты и избранное. Создайте плейлист и добавляйте треки по одному из каталога или со страницы альбома.
      </p>

      <section className="search-sections">
        <h2 className="adam-h2">
          Плейлисты
        </h2>
        <form onSubmit={createPlaylist} className="search-form">
          <input
            className="adam-input search-input-grow"
            placeholder="Название нового плейлиста"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
          />
          <button type="submit" className="adam-btn">
            Создать
          </button>
        </form>
        <div className="search-sections">
          {playlists.map((pl) => {
            const ids = new Set((pl.tracks || []).map((t) => String(t._id)));
            return (
              <div key={pl._id} className="adam-glass artist-card-body">
                <div className="discover-header">
                  <div>
                    <div className="adam-eyebrow">
                      Плейлист
                    </div>
                    <div className="adam-display">
                      {pl.name}
                    </div>
                  </div>
                  <button type="button" className="adam-btn adam-btn--minimal" onClick={() => removePlaylist(pl._id)}>
                    Удалить
                  </button>
                </div>
                <PlaylistTrackAdd playlistId={pl._id} existingIds={ids} onAdded={() => refreshPlaylist(pl._id)} />
                <ul className="plain-list">
                  {(pl.tracks || []).map((t) => (
                    <li key={t._id} className="track-row">
                      <button type="button" onClick={() => playTrack(t, pl.tracks)} className="track-row__title-btn">
                        <span className="album-card-title">{t.title}</span>
                        <span className="muted-text"> — {t.artist?.name}</span>
                      </button>
                      <button type="button" className="adam-btn adam-btn--minimal" onClick={() => removeTrackFromPlaylist(pl._id, t._id)}>
                        Убрать
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </section>

      <section>
        <h2 className="adam-h2">
          Избранное
        </h2>
        <ul className="plain-list">
          {favorites.map((f) => {
            const t = f.track;
            if (!t) return null;
            return (
              <li key={f._id} className="track-row adam-card">
                <span>
                  <span className="album-card-title">{t.title}</span>
                  <span className="muted-text"> — {t.artist?.name}</span>
                </span>
                <button type="button" className="adam-btn adam-btn--ghost adam-btn--xs" onClick={() => playTrack(t, [t])}>
                  ▶
                </button>
              </li>
            );
          })}
        </ul>
      </section>
    </div>
  );
}
