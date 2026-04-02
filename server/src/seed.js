import 'dotenv/config';
import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { connectDb } from './db.js';
import { Artist } from './models/Artist.js';
import { Album } from './models/Album.js';
import { Track } from './models/Track.js';

const demos = [
  {
    artist: {
      name: 'Lumen Echo',
      image: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=400',
      bio: 'Электроника и атмосфера.',
    },
    album: {
      title: 'Ночные волны',
      coverUrl: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=600',
      year: 2023,
      genre: 'Electronic',
    },
    tracks: [
      {
        title: 'Intro',
        durationSec: 180,
        audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
      },
      {
        title: 'Pulse',
        durationSec: 210,
        audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
      },
    ],
  },
  {
    artist: {
      name: 'Velvet Grove',
      image: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=400',
      bio: 'Соул и джаз.',
    },
    album: {
      title: 'Зелёный свет',
      coverUrl: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=600',
      year: 2022,
      genre: 'Soul',
    },
    tracks: [
      {
        title: 'Первый лист',
        durationSec: 195,
        audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
      },
      {
        title: 'Сад',
        durationSec: 240,
        audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3',
      },
    ],
  },
  {
    artist: {
      name: 'Northline',
      image: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=400',
      bio: 'Инди-рок.',
    },
    album: {
      title: 'Горизонт',
      coverUrl: 'https://images.unsplash.com/photo-1498038432885-c6f3b84b8c73?w=600',
      year: 2024,
      genre: 'Indie',
    },
    tracks: [
      {
        title: 'Поезд',
        durationSec: 200,
        audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3',
      },
    ],
  },
];

async function seed() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error('Задайте MONGODB_URI');
    process.exit(1);
  }
  await connectDb(uri);

  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  const dataPath = path.join(__dirname, 'seed_data.json');

  if (!fs.existsSync(dataPath)) {
    console.log('Файл seed_data.json не найден. Используем 0 треков или заливаем стандартные...');
    await mongoose.disconnect();
    return;
  }

  const raw = fs.readFileSync(dataPath, 'utf-8');
  const data = JSON.parse(raw);

  console.log('Удаляем всё из базы...');
  await Artist.deleteMany({});
  await Album.deleteMany({});
  await Track.deleteMany({});

  console.log('Заливаем локальные данные в облако...');
  if (data.artists?.length) await Artist.insertMany(data.artists);
  if (data.albums?.length) await Album.insertMany(data.albums);
  if (data.tracks?.length) await Track.insertMany(data.tracks);

  console.log(`Seed готов: ${data.tracks?.length} треков добавлено в облако!`);
  await mongoose.disconnect();
}

seed().catch((e) => {
  console.error(e);
  process.exit(1);
});
