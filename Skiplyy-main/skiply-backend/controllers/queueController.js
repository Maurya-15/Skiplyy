import Booking from '../models/Booking.js';

export const bookQueue = async (req, res) => {
  const { business, departmentName } = req.body;

  const booking = await Booking.create({
    user: req.user._id,
    business,
    departmentName,
  });

  res.json(booking);
};

export const getUserBookings = async (req, res) => {
  const bookings = await Booking.find({ user: req.user._id }).populate('business');
  res.json(bookings);
};

export const updateBookingStatus = async (req, res) => {
  const booking = await Booking.findById(req.params.id);
  if (!booking) return res.status(404).json({ message: 'Booking not found' });

  booking.status = req.body.status;
  await booking.save();

  res.json(booking);
};
