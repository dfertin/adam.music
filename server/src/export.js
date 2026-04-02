import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { Artist } from './models/Artist.js';
import { Album } from './models/Album.js';
import { Track } from './models/Track.js';

const LOCAL_URI = 'mongodb://127.0.0.1:27017/adam';

async function exportData() {
  try {
    console.log('Подключаемся к локальной базе...');
    await mongoose.connect(LOCAL_URI);
    
    const artists = await Artist.find().lean();
    const albums = await Album.find().lean();
    const tracks = await Track.find().lean();
    
    const data = { artists, albums, tracks };
    
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    const outPath = path.join(__dirname, 'seed_data.json');
    
    fs.writeFileSync(outPath, JSON.stringify(data, null, 2));
    
    console.log(`✅ Идеально! Данные сохранены в файл: src/seed_data.json`);
    console.log(`Найдено: ${artists.length} арт., ${albums.length} альб., ${tracks.length} трек.`);
  } catch (error) {
    console.error('Ошибка:', error);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

exportData();
