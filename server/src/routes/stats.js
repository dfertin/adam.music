import express from 'express';
import { Album } from '../models/Album.js';
import { Artist } from '../models/Artist.js';
import { Track } from '../models/Track.js';
import { User } from '../models/User.js';

export const statsRouter = express.Router();

statsRouter.get('/', async (_req, res, next) => {
  try {
    const [tracks, artists, users, genres] = await Promise.all([
      Track.countDocuments(),
      Artist.countDocuments(),
      User.countDocuments(),
      Album.distinct('genre'),
    ]);

    const genreCount = (genres || []).filter((g) => typeof g === 'string' && g.trim().length > 0).length;

    res.json({
      tracks,
      artists,
      genres: genreCount,
      users,
    });
  } catch (e) {
    next(e);
  }
});

