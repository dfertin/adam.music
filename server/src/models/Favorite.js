import mongoose from 'mongoose';

const favoriteSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    track: { type: mongoose.Schema.Types.ObjectId, ref: 'Track', required: true },
  },
  { timestamps: true }
);

favoriteSchema.index({ user: 1, track: 1 }, { unique: true });

export const Favorite = mongoose.model('Favorite', favoriteSchema);
