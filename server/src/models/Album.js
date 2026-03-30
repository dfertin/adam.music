import mongoose from 'mongoose';

const albumSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    coverUrl: { type: String, default: '' },
    year: { type: Number, default: null },
    genre: { type: String, default: '' },
    artist: { type: mongoose.Schema.Types.ObjectId, ref: 'Artist', required: true },
  },
  { timestamps: true }
);

export const Album = mongoose.model('Album', albumSchema);
