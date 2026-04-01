import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { VinylDisc } from '../components/VinylDisc.jsx';
import { api } from '../api/client.js';

function formatCompact(n) {
  const x = Number(n || 0);
  if (x >= 1_000_000) return `${Math.round((x / 1_000_000) * 10) / 10}M+`;
  if (x >= 1_000) return `${Math.round(x / 1_000)}K+`;
  return `${x}+`;
}

export default function Landing() {
  const [stats, setStats] = useState({ tracks: 0, artists: 0, genres: 0 });

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const s = await api('/stats');
        if (!cancelled) setStats(s);
      } catch {}
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="adam-container landing-page adam-pad-landing">
      <div className="landing-hero">
        <div className="landing-hero__meta">
          <span className="adam-eyebrow">adam</span>
        </div>

        <div className="landing-hero__copy">
          <h1 className="adam-display landing-title">Новая эпоха музыки</h1>
          <p className="adam-lead">
            Открывай, исследуй и чувствуй музыку как никогда раньше.
            <br />
            Твоё музыкальное путешествие начинается здесь.
          </p>

          <div className="landing-actions">
            <Link to="/discover" className="adam-btn">
              Начать →
            </Link>
            <Link to="/register" className="adam-btn adam-btn--ghost">
              Обзор
            </Link>
          </div>

          <div className="landing-stats" aria-label="Статистика">
            <div>
              <div className="landing-stat__value">{formatCompact(stats.tracks)}</div>
              <div className="landing-stat__label">треков</div>
            </div>
            <div>
              <div className="landing-stat__value">{formatCompact(stats.artists)}</div>
              <div className="landing-stat__label">исполнителей</div>
            </div>
            <div>
              <div className="landing-stat__value">{formatCompact(stats.genres)}</div>
              <div className="landing-stat__label">жанров</div>
            </div>
          </div>
        </div>

        <div className="landing-hero__visual landing-visual-wrap">
          <div className="landing-glass-blob" aria-hidden />
          <div className="landing-gold-dot" aria-hidden />
          <div className="landing-visual-inner">
            <VinylDisc size={200} spinning label="A" />
          </div>
        </div>
      </div>

      <div className="landing-footer">
        <p className="adam-eyebrow landing-footer-note">
          музыкальный проект
        </p>
        <div className="landing-box">
          Тишина в интерфейсе —
          <br />
          фокус на альбоме
        </div>
      </div>
    </div>
  );
}
