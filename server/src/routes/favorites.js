import { Router } from 'express';
import { Favorite } from '../models/Favorite.js';
import { Track } from '../models/Track.js';
import { authRequired } from '../middleware/auth.js';

export const favoritesRouter = Router();

favoritesRouter.get('/', authRequired, async (req, res) => {
  try {
    const list = await Favorite.find({ user: req.userId })
      .populate({ path: 'track', populate: [{ path: 'artist' }, { path: 'album' }] })
      .sort({ createdAt: -1 })
      .lean();
    return res.json(list);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Ошибка сервера' });
  }
});

favoritesRouter.post('/', authRequired, async (req, res) => {
  try {
    const { trackId } = req.body || {};
    if (!trackId) {
      return res.status(400).json({ error: 'Укажите trackId' });
    }
    const track = await Track.findById(trackId);
    if (!track) {
      return res.status(404).json({ error: 'Трек не найден' });
    }
    const existing = await Favorite.findOne({ user: req.userId, track: trackId });
    if (existing) {
      return res.status(200).json({ ok: true });
    }
    await Favorite.create({ user: req.userId, track: trackId });
    return res.status(201).json({ ok: true });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Ошибка сервера' });
  }
});

favoritesRouter.delete('/', authRequired, async (req, res) => {
  try {
    const trackId = req.query.trackId;
    if (!trackId) {
      return res.status(400).json({ error: 'Укажите trackId' });
    }
    await Favorite.deleteOne({ user: req.userId, track: trackId });
    return res.json({ ok: true });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Ошибка сервера' });
  }
});
