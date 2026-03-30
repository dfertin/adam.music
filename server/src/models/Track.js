import mongoose from 'mongoose';

const trackSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    durationSec: { type: Number, default: 0 },
    audioUrl: { type: String, required: true },
    order: { type: Number, default: 0 },
    album: { type: mongoose.Schema.Types.ObjectId, ref: 'Album', required: true },
    artist: { type: mongoose.Schema.Types.ObjectId, ref: 'Artist', required: true },
  },
  { timestamps: true }
);

export const Track = mongoose.model('Track', trackSchema);
