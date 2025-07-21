// models/booking.js
import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    business: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Business',
      required: true,
    },
    departmentName: {
      type: String,
      required: true,
      trim: true,
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'completed'],
      default: 'pending',
    },
  },
  { timestamps: true } // adds createdAt and updatedAt automatically
);

export default mongoose.model('Booking', bookingSchema);
