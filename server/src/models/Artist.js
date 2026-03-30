import mongoose from 'mongoose';

const artistSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    image: { type: String, default: '' },
    bio: { type: String, default: '' },
  },
  { timestamps: true }
);

export const Artist = mongoose.model('Artist', artistSchema);
