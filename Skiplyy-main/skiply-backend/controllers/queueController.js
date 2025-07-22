import Booking from '../models/Booking.js';
import { generateQrCodeString } from '../utils/qr.js';
import mongoose from 'mongoose';

export const bookQueue = async (req, res) => {
  try {
    console.log("Booking payload received:", req.body);
    
    // Extract businessId from either 'business' or 'businessId' field
    const { business, businessId, businessName, departmentName, customerName, customerPhone, notes, bookedAt } = req.body;
    
    // Use whichever field contains the business ID
    const actualBusinessId = businessId || business;
    
    if (!actualBusinessId) {
      return res.status(400).json({ message: "Business ID is required" });
    }
    
    if (!businessName) {
      return res.status(400).json({ message: "Business name is required" });
    }
    
    if (!departmentName || !customerName || !customerPhone) {
      return res.status(400).json({ message: "Missing required booking details: departmentName, customerName, or customerPhone" });
    }

    // Validate that businessId is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(actualBusinessId)) {
      return res.status(400).json({ message: "Invalid business ID format" });
    }

    console.log("Creating booking with businessId:", actualBusinessId);

    const booking = await Booking.create({
      user: req.user._id,
      business: new mongoose.Types.ObjectId(actualBusinessId),
      businessId: actualBusinessId,
      businessName,
      departmentName,
      customerName,
      customerPhone,
      notes: notes || '',
      bookedAt: bookedAt ? new Date(bookedAt) : new Date(),
      status: 'pending',
      qrCode: generateQrCodeString(),
    });

    console.log("Booking created successfully:", booking);
    res.status(201).json(booking);
    
  } catch (error) {
    console.error("Error creating booking:", error);
    res.status(500).json({ 
      message: "Failed to create booking", 
      error: error.message 
    });
  }
};

export const getUserBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user._id }).populate('business'); // Use 'business' field
    res.json(bookings);
  } catch (error) {
    console.error("Error fetching user bookings:", error);
    res.status(500).json({ 
      message: "Failed to fetch bookings", 
      error: error.message 
    });
  }
};

export const updateBookingStatus = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    booking.status = req.body.status;
    await booking.save();

    res.json(booking);
  } catch (error) {
    console.error("Error updating booking status:", error);
    res.status(500).json({ 
      message: "Failed to update booking status", 
      error: error.message 
    });
  }
};