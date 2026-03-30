import { Router } from 'express';
import { Album } from '../models/Album.js';
import { Artist } from '../models/Artist.js';
import { Track } from '../models/Track.js';

export const searchRouter = Router();

searchRouter.get('/', async (req, res) => {
  try {
    const q = (req.query.q || '').trim();
    if (!q) {
      return res.json({ albums: [], artists: [], tracks: [] });
    }
    const rx = new RegExp(q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
    const [albums, artists, tracks] = await Promise.all([
      Album.find({ title: rx }).populate('artist').limit(20).lean(),
      Artist.find({ name: rx }).limit(20).lean(),
      Track.find({ title: rx }).populate('artist').populate('album').limit(30).lean(),
    ]);
    return res.json({ albums, artists, tracks });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Ошибка сервера' });
  }
});
