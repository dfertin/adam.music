import mongoose from 'mongoose';
import { Artist } from './models/Artist.js';
import { Album } from './models/Album.js';
import { Track } from './models/Track.js';

const REMOTE_URI = 'mongodb+srv://sdsss1824_db_user:Ym8qLLs3UFBzZQjI@cluster0.xynykny.mongodb.net/';
const LOCAL_URI = 'mongodb://127.0.0.1:27017/adam';

async function migrate() {
  if (REMOTE_URI.includes('...')) {
    console.error('❌ ОШИБКА: Вы забыли вставить свою ссылку REMOTE_URI в файл src/migrate.js');
    process.exit(1);
  }

  try {
    console.log('1. Подключаемся к локальной базе данных (ваш компьютер)...');
    await mongoose.connect(LOCAL_URI);


    const artists = await Artist.find().lean();
    const albums = await Album.find().lean();
    const tracks = await Track.find().lean();
    console.log(`✅ Найдено локально: ${artists.length} артистов, ${albums.length} альбомов, ${tracks.length} треков.`);

    console.log('Отключаемся от локальной базы...');
    await mongoose.disconnect();

    console.log('\n===================================\n');

    console.log('2. Подключаемся к облачной базе (Atlas) из Render...');
    await mongoose.connect(REMOTE_URI);

    console.log('Удаляем старые "тестовые" данные из облачной базы...');
    await Artist.deleteMany({});
    await Album.deleteMany({});
    await Track.deleteMany({});

    console.log('Производим загрузку ваших локальных данных в облако...');
    
    if (artists.length > 0) await Artist.insertMany(artists);
    if (albums.length > 0) await Album.insertMany(albums);
    if (tracks.length > 0) await Track.insertMany(tracks);

    console.log('✅ УСПЕШНО! Все ваши локальные песни перенесены в интернет.');
  } catch (error) {
    console.error('❌ Ошибка во время переноса:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Скрипт завершен.');
  }
}

migrate();
