import { Router } from 'express';
import { Review } from '../models/Review.js';
import { Album } from '../models/Album.js';
import { authRequired } from '../middleware/auth.js';

export const reviewsRouter = Router();

reviewsRouter.get('/', async (req, res) => {
  try {
    const { albumId } = req.query;
    const filter = albumId ? { album: albumId } : {};
    const reviews = await Review.find(filter)
      .populate('user', 'name email')
      .populate('album', 'title coverUrl')
      .sort({ createdAt: -1 })
      .lean();
    return res.json(reviews);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Ошибка сервера' });
  }
});

reviewsRouter.post('/', authRequired, async (req, res) => {
  try {
    const { albumId, rating, text } = req.body || {};
    if (!albumId || !rating) {
      return res.status(400).json({ error: 'Укажите albumId и rating' });
    }
    const album = await Album.findById(albumId);
    if (!album) {
      return res.status(404).json({ error: 'Альбом не найден' });
    }
    const review = await Review.findOneAndUpdate(
      { user: req.userId, album: albumId },
      { rating, text: text || '', user: req.userId, album: albumId },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    )
      .populate('user', 'name email')
      .lean();
    return res.status(201).json(review);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Ошибка сервера' });
  }
});
