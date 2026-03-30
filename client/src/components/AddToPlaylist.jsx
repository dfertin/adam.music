import { useEffect, useRef, useState } from 'react';
import toast from 'react-hot-toast';
import { api } from '../api/client.js';
import { useAuth } from '../context/AuthContext.jsx';

export function AddToPlaylist({ trackId, compact = false }) {
  const { isAuthenticated } = useAuth();
  const [open, setOpen] = useState(false);
  const [playlists, setPlaylists] = useState([]);
  const [loading, setLoading] = useState(false);
  const wrapRef = useRef(null);

  useEffect(() => {
    function onDoc(e) {
      if (!wrapRef.current?.contains(e.target)) setOpen(false);
    }
    if (open) {
      document.addEventListener('click', onDoc);
    }
    return () => document.removeEventListener('click', onDoc);
  }, [open]);

  useEffect(() => {
    if (!open || !isAuthenticated) return;
    let cancelled = false;
    (async () => {
      setLoading(true);
      try {
        const pl = await api('/playlists');
        if (!cancelled) setPlaylists(pl);
      } catch (e) {
        toast.error(e.message || 'Не удалось загрузить плейлисты');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [open, isAuthenticated]);

  async function addTo(plId) {
    try {
      await api(`/playlists/${plId}/tracks`, { method: 'POST', body: { trackId } });
      toast.success('Трек добавлен в плейлист');
      setOpen(false);
    } catch (e) {
      toast.error(e.message || 'Не удалось добавить');
    }
  }

  if (!isAuthenticated) return null;

  return (
    <div className="adam-add-pl" ref={wrapRef}>
      <button
        type="button"
        className={compact ? 'adam-btn adam-btn--minimal' : 'adam-btn adam-btn--ghost'}
        style={compact ? { padding: '0.35rem 0.65rem', fontSize: '0.8rem' } : undefined}
        onClick={(e) => {
          e.stopPropagation();
          setOpen((v) => !v);
        }}
      >
        + В плейлист
      </button>
      {open && (
        <ul className="adam-add-pl__menu" onClick={(e) => e.stopPropagation()}>
          {loading ? (
            <li className="adam-add-pl__empty">Загрузка…</li>
          ) : playlists.length === 0 ? (
            <li className="adam-add-pl__empty">Сначала создайте плейлист в библиотеке</li>
          ) : (
            playlists.map((pl) => (
              <li key={pl._id}>
                <button type="button" onClick={() => addTo(pl._id)}>
                  {pl.name}
                </button>
              </li>
            ))
          )}
        </ul>
      )}
    </div>
  );
}
