import { Router } from 'express';
import { Artist } from '../models/Artist.js';

export const artistsRouter = Router();

artistsRouter.get('/', async (_req, res) => {
  try {
    const artists = await Artist.find().sort({ name: 1 }).lean();
    return res.json(artists);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Ошибка сервера' });
  }
});

artistsRouter.get('/:id', async (req, res) => {
  try {
    const artist = await Artist.findById(req.params.id).lean();
    if (!artist) {
      return res.status(404).json({ error: 'Артист не найден' });
    }
    return res.json(artist);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Ошибка сервера' });
  }
});
