import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    album: { type: mongoose.Schema.Types.ObjectId, ref: 'Album', required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    text: { type: String, default: '', trim: true },
  },
  { timestamps: true }
);

reviewSchema.index({ user: 1, album: 1 }, { unique: true });

export const Review = mongoose.model('Review', reviewSchema);
