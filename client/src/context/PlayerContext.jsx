import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

const PlayerContext = createContext(null);

export function PlayerProvider({ children }) {
  const audioRef = useRef(null);
  const [current, setCurrent] = useState(null);
  const [queue, setQueue] = useState([]);
  const [playing, setPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const playTrack = useCallback((track, nextQueue) => {
    if (!track?.audioUrl) return;
    if (Array.isArray(nextQueue)) setQueue(nextQueue);
    setCurrent(track);
  }, []);

  useEffect(() => {
    const el = audioRef.current;
    if (!el || !current?.audioUrl) return undefined;
    el.src = current.audioUrl;
    el.play().then(() => setPlaying(true)).catch(() => setPlaying(false));
    return undefined;
  }, [current?._id, current?.audioUrl]);

  useEffect(() => {
    const el = audioRef.current;
    if (!el) return undefined;
    const onTime = () => setCurrentTime(el.currentTime);
    const onDur = () => setDuration(el.duration || 0);
    const onEnded = () => {
      setCurrent((c) => {
        if (!c || !queue.length) {
          setPlaying(false);
          return c;
        }
        const idx = queue.findIndex((t) => String(t._id) === String(c._id));
        const next = queue[idx + 1];
        if (next) return next;
        setPlaying(false);
        return c;
      });
    };
    el.addEventListener('timeupdate', onTime);
    el.addEventListener('loadedmetadata', onDur);
    el.addEventListener('ended', onEnded);
    return () => {
      el.removeEventListener('timeupdate', onTime);
      el.removeEventListener('loadedmetadata', onDur);
      el.removeEventListener('ended', onEnded);
    };
  }, [queue]);

  const toggle = useCallback(() => {
    const el = audioRef.current;
    if (!el || !current) return;
    if (playing) {
      el.pause();
      setPlaying(false);
    } else {
      el.play().then(() => setPlaying(true)).catch(() => {});
    }
  }, [current, playing]);

  const seek = useCallback(
    (ratio) => {
      const el = audioRef.current;
      if (!el || !duration) return;
      el.currentTime = Math.max(0, Math.min(duration, ratio * duration));
    },
    [duration]
  );

  const playNext = useCallback(() => {
    if (!current || !queue.length) return;
    const idx = queue.findIndex((t) => String(t._id) === String(current._id));
    const next = queue[idx + 1];
    if (next) setCurrent(next);
  }, [current, queue]);

  const playPrev = useCallback(() => {
    if (!current || !queue.length) return;
    const idx = queue.findIndex((t) => String(t._id) === String(current._id));
    const prev = queue[idx - 1];
    if (prev) setCurrent(prev);
  }, [current, queue]);

  const value = useMemo(
    () => ({
      current,
      queue,
      playing,
      currentTime,
      duration,
      playTrack,
      toggle,
      seek,
      setQueue,
      playNext,
      playPrev,
    }),
    [current, queue, playing, currentTime, duration, playTrack, toggle, seek, playNext, playPrev]
  );

  return (
    <PlayerContext.Provider value={value}>
      <audio ref={audioRef} preload="metadata" />
      {children}
    </PlayerContext.Provider>
  );
}

export function usePlayer() {
  const ctx = useContext(PlayerContext);
  if (!ctx) {
    throw new Error('usePlayer вне PlayerProvider');
  }
  return ctx;
}
