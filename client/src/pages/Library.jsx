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
    <div style={{ marginTop: '0.75rem' }}>
      <button type="button" className="adam-btn adam-btn--minimal" style={{ fontSize: '0.78rem', padding: '0.45rem 0.85rem' }} onClick={() => setOpen((v) => !v)}>
        {open ? 'Скрыть поиск' : '+ Добавить треки'}
      </button>
      {open && (
        <div className="adam-glass" style={{ marginTop: '0.65rem', padding: '0.85rem', borderRadius: 'var(--radius-md)' }}>
          <input
            className="adam-input"
            placeholder="Название трека или артист…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            style={{ marginBottom: '0.65rem' }}
          />
          {loading ? (
            <div className="adam-spinner" style={{ width: '1.75rem', height: '1.75rem', margin: '0.5rem auto' }} />
          ) : (
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, maxHeight: 200, overflowY: 'auto' }}>
              {filtered.map((t) => (
                <li
                  key={t._id}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    gap: '0.5rem',
                    padding: '0.4rem 0',
                    borderBottom: '1px solid var(--adam-border)',
                    fontSize: '0.88rem',
                  }}
                >
                  <span style={{ minWidth: 0 }}>
                    {t.title}
                    <span style={{ color: 'var(--adam-muted)' }}> — {t.artist?.name}</span>
                  </span>
                  <button
                    type="button"
                    className="adam-btn adam-btn--minimal"
                    style={{ padding: '0.25rem 0.55rem', fontSize: '0.72rem', flexShrink: 0 }}
                    onClick={() => addTrack(t._id)}
                  >
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
      <div className="adam-container" style={{ padding: '4rem 0' }}>
        <div className="adam-spinner" style={{ margin: '0 auto' }} />
      </div>
    );
  }

  return (
    <div className="adam-container" style={{ padding: '2rem 0 3rem' }}>
      <p className="adam-eyebrow" style={{ margin: '0 0 0.35rem' }}>
        Коллекция
      </p>
      <h1 className="adam-h1" style={{ marginBottom: '0.5rem' }}>
        Библиотека
      </h1>
      <p className="adam-lead" style={{ marginBottom: '2rem' }}>
        Плейлисты и избранное. Создайте плейлист и добавляйте треки по одному из каталога или со страницы альбома.
      </p>

      <section style={{ marginBottom: '2.75rem' }}>
        <h2 className="adam-h2" style={{ marginBottom: '1rem' }}>
          Плейлисты
        </h2>
        <form onSubmit={createPlaylist} style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1.25rem' }}>
          <input
            className="adam-input"
            style={{ maxWidth: 300, flex: '1 1 200px' }}
            placeholder="Название нового плейлиста"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
          />
          <button type="submit" className="adam-btn">
            Создать
          </button>
        </form>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {playlists.map((pl) => {
            const ids = new Set((pl.tracks || []).map((t) => String(t._id)));
            return (
              <div key={pl._id} className="adam-glass" style={{ padding: '1.15rem 1.35rem', borderRadius: 'var(--radius-lg)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem', flexWrap: 'wrap' }}>
                  <div>
                    <div className="adam-eyebrow" style={{ marginBottom: '0.35rem' }}>
                      Плейлист
                    </div>
                    <div className="adam-display" style={{ fontSize: '1.15rem' }}>
                      {pl.name}
                    </div>
                  </div>
                  <button type="button" className="adam-btn adam-btn--minimal" style={{ fontSize: '0.78rem' }} onClick={() => removePlaylist(pl._id)}>
                    Удалить
                  </button>
                </div>
                <PlaylistTrackAdd playlistId={pl._id} existingIds={ids} onAdded={() => refreshPlaylist(pl._id)} />
                <ul style={{ listStyle: 'none', padding: 0, margin: '0.85rem 0 0' }}>
                  {(pl.tracks || []).map((t) => (
                    <li
                      key={t._id}
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        gap: '0.65rem',
                        padding: '0.45rem 0',
                        borderBottom: '1px solid var(--adam-border)',
                        fontSize: '0.9rem',
                      }}
                    >
                      <button
                        type="button"
                        onClick={() => playTrack(t, pl.tracks)}
                        style={{
                          border: 'none',
                          background: 'none',
                          padding: 0,
                          textAlign: 'left',
                          cursor: 'pointer',
                          color: 'inherit',
                          flex: 1,
                          minWidth: 0,
                        }}
                      >
                        <span style={{ fontWeight: 600 }}>{t.title}</span>
                        <span style={{ color: 'var(--adam-muted)' }}> — {t.artist?.name}</span>
                      </button>
                      <button
                        type="button"
                        className="adam-btn adam-btn--minimal"
                        style={{ padding: '0.2rem 0.5rem', fontSize: '0.72rem' }}
                        onClick={() => removeTrackFromPlaylist(pl._id, t._id)}
                      >
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
        <h2 className="adam-h2" style={{ marginBottom: '1rem' }}>
          Избранное
        </h2>
        <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
          {favorites.map((f) => {
            const t = f.track;
            if (!t) return null;
            return (
              <li
                key={f._id}
                className="adam-card"
                style={{
                  padding: '0.85rem 1rem',
                  marginBottom: '0.5rem',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  gap: '0.75rem',
                }}
              >
                <span style={{ fontSize: '0.92rem' }}>
                  <span style={{ fontWeight: 600 }}>{t.title}</span>
                  <span style={{ color: 'var(--adam-muted)' }}> — {t.artist?.name}</span>
                </span>
                <button type="button" className="adam-btn adam-btn--ghost" style={{ padding: '0.35rem 0.75rem', fontSize: '0.78rem' }} onClick={() => playTrack(t, [t])}>
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
