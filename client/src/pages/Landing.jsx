import { Link } from 'react-router-dom';
import { VinylDisc } from '../components/VinylDisc.jsx';

export default function Landing() {
  return (
    <div className="adam-container landing-page">
      <div className="landing-hero">
        <div className="landing-hero__meta" style={{ marginBottom: '0.5rem', width: '100%', justifyContent: 'space-between' }}>
          <span className="adam-eyebrow">adam</span>
        </div>

        <div className="landing-hero__copy">
          <h1 className="adam-display" style={{ fontSize: 'clamp(2.25rem, 5vw, 3.75rem)', marginBottom: '1.25rem' }}>
            ADAM · ЗВУК
          </h1>
          <p className="adam-lead" style={{ marginBottom: '1.75rem' }}>
            Минимум шума — максимум музыки. Каталог, плейлисты и один плеер на всё приложение в спокойной бежево-зелёной гамме.
          </p>
          <div style={{ display: 'flex', gap: '0.65rem', flexWrap: 'wrap', alignItems: 'center' }}>
            <Link to="/discover" className="adam-btn">
              Слушать каталог
            </Link>
            <Link to="/register" className="adam-btn adam-btn--ghost">
              Создать аккаунт
            </Link>
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

      <div
        style={{
          marginTop: '3rem',
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
          alignItems: 'flex-end',
          gap: '1.5rem',
          paddingTop: '2rem',
          borderTop: '1px solid var(--adam-border)',
        }}
      >
        <p className="adam-eyebrow" style={{ margin: 0, maxWidth: '280px' }}>
          музыкальный проект
        </p>
        <div className="landing-box" style={{ margin: 0 }}>
          Тишина в интерфейсе —<br />
          фокус на альбоме
        </div>
      </div>

      <style>{`
        @media (max-width: 899px) {
          .landing-hero {
            display: flex;
            flex-direction: column;
          }
          .landing-hero__visual {
            min-height: 320px;
          }
        }
      `}</style>
    </div>
  );
}
