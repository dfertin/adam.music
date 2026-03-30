import { Link } from 'react-router-dom';
import { VinylDisc } from '../components/VinylDisc.jsx';

export default function NotFound() {
  return (
    <div className="adam-container" style={{ padding: '4rem 0', textAlign: 'center' }}>
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.5rem' }}>
        <VinylDisc size={100} spinning={false} label="?" />
      </div>
      <h1 className="adam-h1">404</h1>
      <p style={{ color: 'var(--adam-muted)' }}>Страница не найдена — возможно, трек закончился раньше времени.</p>
      <Link to="/" className="adam-btn" style={{ marginTop: '1.5rem', display: 'inline-flex' }}>
        На главную
      </Link>
    </div>
  );
}
