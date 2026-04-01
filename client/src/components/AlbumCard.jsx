import { Link } from 'react-router-dom';

export function AlbumCard({ album }) {
  const cover = album.coverUrl || 'https://images.unsplash.com/photo-1487182760356-c0399a7b7b6?w=400';
  return (
    <Link to={`/album/${album._id}`} className="adam-card album-card-link">
      <div className="album-card-cover">
        <img src={cover} alt="" loading="lazy" decoding="async" width={400} height={400} />
      </div>
      <div className="album-card-body">
        <div className="adam-display album-card-title">
          {album.title}
        </div>
        <div className="album-card-artist">{album.artist?.name}</div>
        {album.year ? (
          <div className="album-card-year">{album.year}</div>
        ) : null}
      </div>
    </Link>
  );
}
