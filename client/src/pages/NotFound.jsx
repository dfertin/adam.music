import { Link } from 'react-router-dom';
import { VinylDisc } from '../components/VinylDisc.jsx';

export default function NotFound() {
  return (
    <div className="adam-container adam-pad-4 nf-wrap">
      <div className="nf-disc">
        <VinylDisc size={100} spinning={false} label="?" />
      </div>
      <h1 className="adam-h1">404</h1>
      <p className="muted-text">Страница не найдена — возможно, трек закончился раньше времени.</p>
      <Link to="/" className="adam-btn nf-home-btn">
        На главную
      </Link>
    </div>
  );
}
