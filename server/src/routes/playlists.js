import { Router } from 'express';
import { Playlist } from '../models/Playlist.js';
import { Track } from '../models/Track.js';
import { authRequired } from '../middleware/auth.js';

export const playlistsRouter = Router();

playlistsRouter.get('/', authRequired, async (req, res) => {
  try {
    const playlists = await Playlist.find({ user: req.userId })
      .populate({ path: 'tracks', populate: [{ path: 'artist' }, { path: 'album' }] })
      .sort({ updatedAt: -1 })
      .lean();
    return res.json(playlists);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Ошибка сервера' });
  }
});

playlistsRouter.post('/', authRequired, async (req, res) => {
  try {
    const { name, trackIds } = req.body || {};
    if (!name || typeof name !== 'string') {
      return res.status(400).json({ error: 'Укажите название плейлиста' });
    }
    const tracks = Array.isArray(trackIds) ? trackIds : [];
    const pl = await Playlist.create({
      user: req.userId,
      name: name.trim(),
      tracks,
    });
    const populated = await Playlist.findById(pl._id)
      .populate({ path: 'tracks', populate: [{ path: 'artist' }, { path: 'album' }] })
      .lean();
    return res.status(201).json(populated);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Ошибка сервера' });
  }
});

playlistsRouter.put('/:id', authRequired, async (req, res) => {
  try {
    const { name, trackIds } = req.body || {};
    const pl = await Playlist.findOne({ _id: req.params.id, user: req.userId });
    if (!pl) {
      return res.status(404).json({ error: 'Плейлист не найден' });
    }
    if (name !== undefined) pl.name = String(name).trim();
    if (Array.isArray(trackIds)) pl.tracks = trackIds;
    await pl.save();
    const populated = await Playlist.findById(pl._id)
      .populate({ path: 'tracks', populate: [{ path: 'artist' }, { path: 'album' }] })
      .lean();
    return res.json(populated);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Ошибка сервера' });
  }
});

playlistsRouter.delete('/:id', authRequired, async (req, res) => {
  try {
    const r = await Playlist.deleteOne({ _id: req.params.id, user: req.userId });
    if (r.deletedCount === 0) {
      return res.status(404).json({ error: 'Плейлист не найден' });
    }
    return res.json({ ok: true });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Ошибка сервера' });
  }
});

playlistsRouter.post('/:id/tracks', authRequired, async (req, res) => {
  try {
    const { trackId } = req.body || {};
    if (!trackId) {
      return res.status(400).json({ error: 'Укажите trackId' });
    }
    const track = await Track.findById(trackId);
    if (!track) {
      return res.status(404).json({ error: 'Трек не найден' });
    }
    const pl = await Playlist.findOne({ _id: req.params.id, user: req.userId });
    if (!pl) {
      return res.status(404).json({ error: 'Плейлист не найден' });
    }
    const sid = String(trackId);
    if (!pl.tracks.map((t) => String(t)).includes(sid)) {
      pl.tracks.push(trackId);
      await pl.save();
    }
    const populated = await Playlist.findById(pl._id)
      .populate({ path: 'tracks', populate: [{ path: 'artist' }, { path: 'album' }] })
      .lean();
    return res.json(populated);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Ошибка сервера' });
  }
});

playlistsRouter.delete('/:id/tracks/:trackId', authRequired, async (req, res) => {
  try {
    const pl = await Playlist.findOne({ _id: req.params.id, user: req.userId });
    if (!pl) {
      return res.status(404).json({ error: 'Плейлист не найден' });
    }
    pl.tracks = pl.tracks.filter((t) => String(t) !== String(req.params.trackId));
    await pl.save();
    const populated = await Playlist.findById(pl._id)
      .populate({ path: 'tracks', populate: [{ path: 'artist' }, { path: 'album' }] })
      .lean();
    return res.json(populated);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Ошибка сервера' });
  }
});
