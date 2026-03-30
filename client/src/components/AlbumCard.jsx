import { Link } from 'react-router-dom';

export function AlbumCard({ album }) {
  const cover = album.coverUrl || 'https://images.unsplash.com/photo-1487182760356-c0399a7b7b6?w=400';
  return (
    <Link to={`/album/${album._id}`} className="adam-card" style={{ textDecoration: 'none', color: 'inherit' }}>
      <div
        style={{
          aspectRatio: '1',
          overflow: 'hidden',
          background: 'linear-gradient(145deg, #ebe8df, #ddd9cf)',
          borderRadius: 'calc(var(--radius-lg) - 2px) calc(var(--radius-lg) - 2px) 0 0',
        }}
      >
        <img src={cover} alt="" loading="lazy" decoding="async" width={400} height={400} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
      </div>
      <div style={{ padding: '1rem 1.15rem 1.2rem' }}>
        <div className="adam-display" style={{ fontSize: '0.98rem', marginBottom: '0.25rem' }}>
          {album.title}
        </div>
        <div style={{ fontSize: '0.82rem', color: 'var(--adam-muted)', letterSpacing: '0.02em' }}>{album.artist?.name}</div>
        {album.year ? (
          <div style={{ fontSize: '0.72rem', color: 'var(--adam-faint)', marginTop: '0.4rem', letterSpacing: '0.08em' }}>{album.year}</div>
        ) : null}
      </div>
    </Link>
  );
}
