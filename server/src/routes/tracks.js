import { Router } from 'express';
import { Track } from '../models/Track.js';

export const tracksRouter = Router();

tracksRouter.get('/', async (_req, res) => {
  try {
    const tracks = await Track.find()
      .populate('artist')
      .populate('album')
      .sort({ createdAt: -1 })
      .limit(200)
      .lean();
    return res.json(tracks);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Ошибка сервера' });
  }
});
