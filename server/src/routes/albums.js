import { Router } from 'express';
import { Album } from '../models/Album.js';
import { Track } from '../models/Track.js';

export const albumsRouter = Router();

albumsRouter.get('/', async (req, res) => {
  try {
    const { artist } = req.query;
    const filter = artist ? { artist } : {};
    const albums = await Album.find(filter).populate('artist').sort({ createdAt: -1 }).lean();
    return res.json(albums);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Ошибка сервера' });
  }
});

albumsRouter.get('/:id', async (req, res) => {
  try {
    const album = await Album.findById(req.params.id).populate('artist').lean();
    if (!album) {
      return res.status(404).json({ error: 'Альбом не найден' });
    }
    const tracks = await Track.find({ album: album._id })
      .populate('artist')
      .sort({ order: 1, title: 1 })
      .lean();
    return res.json({ ...album, tracks });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Ошибка сервера' });
  }
});
