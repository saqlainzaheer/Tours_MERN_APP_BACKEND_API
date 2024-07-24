import mongoose from 'mongoose';

const tourSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name Filed Is Required'],
  },
  rating: {
    type: Number,
    default: 4.5,
  },
  price: {
    type: Number,
    required: [true, 'Price Field Is Required'],
  },
});
export const Tour = mongoose.model('Tour', tourSchema);
