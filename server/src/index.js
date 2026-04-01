import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { connectDb } from './db.js';
import { authRouter } from './routes/auth.js';
import { albumsRouter } from './routes/albums.js';
import { tracksRouter } from './routes/tracks.js';
import { artistsRouter } from './routes/artists.js';
import { favoritesRouter } from './routes/favorites.js';
import { reviewsRouter } from './routes/reviews.js';
import { playlistsRouter } from './routes/playlists.js';
import { searchRouter } from './routes/search.js';
import { statsRouter } from './routes/stats.js';

const app = express();
const PORT = Number(process.env.PORT) || 5000;

app.use(
  cors({
    origin: ['http://localhost:3000', 'http://127.0.0.1:3000'],
    credentials: true,
  })
);
app.use(express.json());

app.get('/api/health', (_req, res) => {
  res.json({ ok: true });
});

app.use('/api/auth', authRouter);
app.use('/api/albums', albumsRouter);
app.use('/api/tracks', tracksRouter);
app.use('/api/artists', artistsRouter);
app.use('/api/favorites', favoritesRouter);
app.use('/api/reviews', reviewsRouter);
app.use('/api/playlists', playlistsRouter);
app.use('/api/search', searchRouter);
app.use('/api/stats', statsRouter);

app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ error: 'Внутренняя ошибка сервера' });
});

async function main() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error('Задайте MONGODB_URI в .env');
    process.exit(1);
  }
  if (!process.env.JWT_SECRET) {
    console.error('Задайте JWT_SECRET в .env');
    process.exit(1);
  }
  try {
    await connectDb(uri);
    console.log('MongoDB подключена');
  } catch (e) {
    console.error('Ошибка подключения к MongoDB:', e.message);
    process.exit(1);
  }

  const server = app.listen(PORT, () => {
    console.log(`ADAM API: http://localhost:${PORT}`);
  });

  server.on('error', (err) => {
    if (err && err.code === 'EADDRINUSE') {
      console.error(`Порт ${PORT} уже занят. Закройте процесс на этом порту или запустите сервер с PORT=другой_порт.`);
      process.exit(1);
    }
    console.error(err);
    process.exit(1);
  });
}

main();
