import React, { useState, useEffect } from "react";
import { mockBusinesses } from "@/lib/api";
import type { Business } from "@/lib/types";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calendar as CalendarIcon,
  Clock,
  ChevronLeft,
  ChevronRight,
  Plus,
  Users,
  CheckCircle,
  AlertCircle,
  X,
  Edit,
  Trash2,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { QueueBookingModal } from "../QueueBookingModal";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { toast } from "sonner";
import "./BookingCalendar.css";

interface TimeSlot {
  id: string;
  time: string;
  available: boolean;
  capacity: number;
  booked: number;
  bookings: BookingSlot[];
}

interface BookingSlot {
  id: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  service: string;
  notes?: string;
  status: "confirmed" | "pending" | "completed" | "cancelled";
  duration: number;
  amount?: number;
}

interface BookingCalendarProps {
  businessId: string;
  onBookingCreate?: (booking: BookingSlot) => void;
  onBookingUpdate?: (booking: BookingSlot) => void;
  onBookingDelete?: (bookingId: string) => void;
  isManagementMode?: boolean;
}

const BookingCalendar: React.FC<BookingCalendarProps> = ({
  businessId,
  onBookingCreate,
  onBookingUpdate,
  onBookingDelete,
  isManagementMode = false,
}) => {

  const [business, setBusiness] = useState<Business | null>(null);

  useEffect(() => {
    // Find the business by _id from mockBusinesses
    const found = mockBusinesses.find((b) => b._id === businessId);
    setBusiness(found || null);
  }, [businessId]);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<TimeSlot | null>(
    null,
  );
  const [dateSlots, setDateSlots] = useState<{ [date: string]: TimeSlot[] }>({});
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
const [selectedService, setSelectedService] = useState<string>("");
  const [editingBooking, setEditingBooking] = useState<BookingSlot | null>(
    null,
  );
  const [viewMode, setViewMode] = useState<"month" | "week" | "day">("month");

  const [bookingForm, setBookingForm] = useState({
    customerName: "",
    customerPhone: "",
    customerEmail: "",
    service: "",
    notes: "",
    duration: 30,
    amount: 0,
  });

  // Generate calendar days
  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];

    // Add empty slots for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }

    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }

    return days;
  };

  // Generate time slots for a specific date
  const generateTimeSlots = (date: Date): TimeSlot[] => {
    const slots: TimeSlot[] = [];
    const startHour = 9; // 9 AM
    const endHour = 17; // 5 PM
    const interval = 30; // 30 minutes

    for (let hour = startHour; hour < endHour; hour++) {
      for (let minute = 0; minute < 60; minute += interval) {
        const time = `${hour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}`;
        slots.push({
          id: `slot-${time}`,
          time,
          available: true,
          capacity: 4,
          booked: 0,
          bookings: [],
        });
      }
    }

    return slots;
  };

  // Update time slots when date changes
  useEffect(() => {
    const dateString = selectedDate.toDateString();
    if (dateSlots[dateString]) {
      setTimeSlots(dateSlots[dateString]);
    } else {
      const slots = generateTimeSlots(selectedDate);
      setDateSlots((prev) => ({ ...prev, [dateString]: slots }));
      setTimeSlots(slots);
    }
  }, [selectedDate, dateSlots]);

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
    const dateString = date.toDateString();
    if (dateSlots[dateString]) {
      setTimeSlots(dateSlots[dateString]);
    } else {
      const slots = generateTimeSlots(date);
      setDateSlots((prev) => ({ ...prev, [dateString]: slots }));
      setTimeSlots(slots);
    }
  };

  const handleTimeSlotSelect = (slot: TimeSlot) => {
    setSelectedTimeSlot(slot);
    setIsBookingModalOpen(true);
  };

  const handleBookingDelete = (bookingId: string) => {
    const dateString = selectedDate.toDateString();
    const updatedSlots = (dateSlots[dateString] || timeSlots).map((slot) => {
      if (slot.bookings.some((booking) => booking.id === bookingId)) {
        const updatedBookings = slot.bookings.filter(
          (booking) => booking.id !== bookingId,
        );
        return {
          ...slot,
          bookings: updatedBookings,
          booked: updatedBookings.length,
          available: updatedBookings.length < slot.capacity,
        };
      }
      return slot;
    });

    setTimeSlots(updatedSlots);
    setDateSlots((prev) => ({ ...prev, [dateString]: updatedSlots }));
    toast.success("Booking deleted successfully!");
  };

  const getBookingCountForDate = (date: Date) => {
    const dateString = date.toDateString();
    const slots = dateSlots[dateString];
    if (!slots || slots.length === 0) return 0;
    return slots.reduce((sum, slot) => sum + (slot.bookings ? slot.bookings.length : 0), 0);
  };

  const getDayClass = (date: Date | null) => {
    if (!date) return "";

    // Use the actual current date
    const today = new Date();
    today.setHours(0,0,0,0);
    const isToday = date.toDateString() === today.toDateString();
    const isSelected = date.toDateString() === selectedDate.toDateString();
    const isPast = date < today;
    const bookingCount = getBookingCountForDate(date);

    let classes = "calendar-day";

    if (isToday) classes += " today";
    if (isSelected) classes += " selected";
    if (isPast) classes += " greyed-out";
    if (bookingCount > 15) classes += " busy";
    else if (bookingCount > 8) classes += " moderate";
    else classes += " available";

    return classes;
  };

  const handleBookingSubmit = () => {
    if (!selectedTimeSlot) return;

    if (!bookingForm.customerName || !bookingForm.customerPhone || !bookingForm.customerEmail) {
      toast.error("Please fill in all required fields");
      return;
    }

    const newBooking: BookingSlot = {
      id: `booking-${Date.now()}`,
      customerName: bookingForm.customerName,
      customerPhone: bookingForm.customerPhone,
      customerEmail: bookingForm.customerEmail,
      service: selectedService,
      notes: bookingForm.notes,
      duration: bookingForm.duration,
      amount: bookingForm.amount,
      status: "pending",
    };

    // Update the time slot for the current date
    const dateString = selectedDate.toDateString();
    const updatedSlots = (dateSlots[dateString] || timeSlots).map((slot) => {
      if (slot.id === selectedTimeSlot.id) {
        return {
          ...slot,
          bookings: [...slot.bookings, newBooking],
          booked: slot.booked + 1,
          available: slot.booked + 1 < slot.capacity,
        };
      }
      return slot;
    });

    setTimeSlots(updatedSlots);
    setDateSlots((prev) => ({ ...prev, [dateString]: updatedSlots }));

    if (onBookingCreate) {
      onBookingCreate(newBooking);
    }

    // Reset form
    setBookingForm({
      customerName: "",
      customerPhone: "",
      customerEmail: "",
      service: "",
      notes: "",
      duration: 30,
      amount: 0,
    });

    setIsBookingModalOpen(false);
    setSelectedTimeSlot(null);
    toast.success("Booking created successfully!");
  };

  const navigateMonth = (direction: "prev" | "next") => {
    const newDate = new Date(currentDate);
    newDate.setMonth(currentDate.getMonth() + (direction === "next" ? 1 : -1));
    setCurrentDate(newDate);
  };

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return (
    <div className="space-y-6">
      {/* Calendar Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center space-x-2">
              <CalendarIcon className="w-5 h-5" />
              <span>Booking Calendar</span>
            </CardTitle>
            <div className="flex items-center space-x-2">
              <div className="flex bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
                <button
                  onClick={() => setViewMode("month")}
                  className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                    viewMode === "month"
                      ? "bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm"
                      : "text-gray-600 dark:text-gray-400"
                  }`}
                >
                  Month
                </button>
                <button
                  onClick={() => setViewMode("week")}
                  className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                    viewMode === "week"
                      ? "bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm"
                      : "text-gray-600 dark:text-gray-400"
                  }`}
                >
                  Week
                </button>
                <button
                  onClick={() => setViewMode("day")}
                  className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                    viewMode === "day"
                      ? "bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm"
                      : "text-gray-600 dark:text-gray-400"
                  }`}
                >
                  Day
                </button>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Month Navigation */}
          <div className="flex items-center justify-between mb-6">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigateMonth("prev")}
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <h2 className="text-xl font-semibold">
              {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
            </h2>
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigateMonth("next")}
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>

          {viewMode === "month" && (
            <>
              {/* Calendar Grid */}
              <div className="grid grid-cols-7 gap-1 mb-4">
                {dayNames.map((day) => (
                  <div
                    key={day}
                    className="text-center text-sm font-medium text-gray-500 dark:text-gray-400 py-2"
                  >
                    {day}
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-7 gap-1">
                {getDaysInMonth(currentDate).map((date, index) => (
                  <motion.div
                    key={index}
                    whileHover={date && !(date < new Date('2025-07-22T00:00:00+05:30')) ? { scale: 1.05 } : {}}
                    whileTap={date && !(date < new Date('2025-07-22T00:00:00+05:30')) ? { scale: 0.95 } : {}}
                    className={`h-20 border border-gray-200 dark:border-gray-700 rounded-lg ${
                      date
                        ? (date < new Date('2025-07-22T00:00:00+05:30')
                            ? "bg-gray-200 dark:bg-gray-800 text-gray-400 cursor-not-allowed pointer-events-none greyed-out"
                            : "cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800"
                          )
                        : ""
                    } ${getDayClass(date)}`}
                    onClick={() => date && !(date < new Date('2025-07-22T00:00:00+05:30')) && handleDateSelect(date)}
                  >
                    {date && (
                      <div className="p-2 h-full flex flex-col">
                        <span className="text-sm font-medium">
                          {date.getDate()}
                        </span>
                        <div className="flex-1 flex items-end">
                          <div className="w-full">
                            {/* Only show queue number if NOT a past date */}
                            {(() => {
                              const today = new Date("2025-07-22T10:51:27+05:30");
                              today.setHours(0,0,0,0);
                              if (date >= today && getBookingCountForDate(date) > 0) {
                                return (
                                  <Badge
                                    variant="secondary"
                                    className="text-xs w-full justify-center"
                                  >
                                    {getBookingCountForDate(date)}
                                  </Badge>
                                );
                              }
                              return null;
                            })()}
                          </div>
                        </div>
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Time Slots */}
      {(() => {
        // Use fixed current date as per system info
        const today = new Date("2025-07-22T10:51:27+05:30");
        today.setHours(0,0,0,0);
        const isPast = selectedDate < today;
        if ((viewMode === "day" || selectedDate) && !isPast) {
          return (
            <Card>
              <CardHeader>
                <CardTitle>
                  Available Time Slots - {selectedDate.toLocaleDateString()}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-3">
                  {timeSlots.map((slot) => (
                    <motion.div
                      key={slot.id}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className={`p-3 rounded-lg border cursor-pointer transition-all ${
                        slot.available
                          ? "border-green-200 bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-300 hover:bg-green-100 dark:hover:bg-green-900/30"
                          : "border-red-200 bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-300"
                      }`}
                      onClick={() => handleTimeSlotSelect(slot)}
                    >
                      <div className="text-center">
                        <div className="font-medium text-sm">{slot.time}</div>
                        <div className="text-xs mt-1">
                          {slot.booked}/{slot.capacity}
                        </div>
                        {slot.bookings.length > 0 && (
                          <div className="flex justify-center mt-1">
                            <Users className="w-3 h-3" />
                          </div>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          );
        }
        return null;
      })()}

      {/* Booking Details Modal */}
      <Dialog open={isBookingModalOpen} onOpenChange={setIsBookingModalOpen}>
  {business && (
    <QueueBookingModal
      business={business}
      isOpen={isBookingModalOpen}
      onClose={() => setIsBookingModalOpen(false)}
      onSuccess={(booking) => {
        setIsBookingModalOpen(false);
        if (onBookingCreate) onBookingCreate(booking);
      }}
      onServiceSelect={(service) => setSelectedService(service)}
    />
  )}
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {isManagementMode ? "Manage Bookings" : "Book Appointment"}
            </DialogTitle>
          </DialogHeader>

          {selectedTimeSlot && (
            <div className="space-y-6">
              {/* Time Slot Info */}
              <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium">
                    {selectedDate.toLocaleDateString()} at{" "}
                    {selectedTimeSlot.time}
                  </span>
                  <Badge
                    variant={
                      selectedTimeSlot.available ? "default" : "destructive"
                    }
                  >
                    {selectedTimeSlot.booked}/{selectedTimeSlot.capacity}
                  </Badge>
                </div>
              </div>

              {/* Existing Bookings (Management Mode) */}
              {isManagementMode && selectedTimeSlot.bookings.length > 0 && (
                <div className="space-y-3">
                  <h4 className="font-medium">Existing Bookings</h4>
                  {selectedTimeSlot.bookings.map((booking) => (
                    <div
                      key={booking.id}
                      className="border border-gray-200 dark:border-gray-700 rounded-lg p-3"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <p className="font-medium">{booking.customerName}</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {booking.service}
                          </p>
                          <p className="text-xs text-gray-500">
                            {booking.customerPhone}
                          </p>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Badge
                            variant={
                              booking.status === "confirmed"
                                ? "default"
                                : booking.status === "completed"
                                  ? "outline"
                                  : booking.status === "cancelled"
                                    ? "destructive"
                                    : "secondary"
                            }
                          >
                            {booking.status}
                          </Badge>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setEditingBooking(booking)}
                          >
                            <Edit className="w-3 h-3" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleBookingDelete(booking.id)}
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* New Booking Form */}
              {(selectedTimeSlot.available || isManagementMode) && (
                <div className="space-y-4">
                  <h4 className="font-medium">
                    {isManagementMode ? "Add New Booking" : "Book Appointment"}
                  </h4>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="customerName">Full Name</Label>
                      <Input
                        id="customerName"
                        value={bookingForm.customerName}
                        onChange={(e) =>
                          setBookingForm({
                            ...bookingForm,
                            customerName: e.target.value,
                          })
                        }
                        placeholder="Enter full name"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="customerPhone">Phone</Label>
                      <Input
                        id="customerPhone"
                        value={bookingForm.customerPhone}
                        onChange={(e) =>
                          setBookingForm({
                            ...bookingForm,
                            customerPhone: e.target.value,
                          })
                        }
                        placeholder="Phone number"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="customerEmail">Email</Label>
                    <Input
                      id="customerEmail"
                      type="email"
                      value={bookingForm.customerEmail}
                      onChange={(e) =>
                        setBookingForm({
                          ...bookingForm,
                          customerEmail: e.target.value,
                        })
                      }
                      placeholder="Email address"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      
                      
                    </div>
                    {isManagementMode && (
                      <div className="space-y-2">
                        <Label htmlFor="amount">Amount ($)</Label>
                        <Input
                          id="amount"
                          type="number"
                          value={bookingForm.amount}
                          onChange={(e) =>
                            setBookingForm({
                              ...bookingForm,
                              amount: parseFloat(e.target.value),
                            })
                          }
                          min="0"
                          step="0.01"
                        />
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="notes">Notes (Optional)</Label>
                    <Textarea
                      id="notes"
                      value={bookingForm.notes}
                      onChange={(e) =>
                        setBookingForm({
                          ...bookingForm,
                          notes: e.target.value,
                        })
                      }
                      placeholder="Any special requirements or notes"
                      rows={3}
                    />
                  </div>

                  <div className="flex space-x-2">
                    <Button
  onClick={handleBookingSubmit}
  disabled={
    !bookingForm.customerName ||
    !bookingForm.customerPhone ||
    !bookingForm.customerEmail
  }
  className="flex-1"
>
  <Plus className="w-4 h-4 mr-2" />
  {isManagementMode ? "Add Booking" : "Book Appointment"}
</Button>
                    <Button
                      variant="outline"
                      onClick={() => setIsBookingModalOpen(false)}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              )}

              {!selectedTimeSlot.available && !isManagementMode && (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                  <AlertCircle className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>This time slot is fully booked</p>
                  <p className="text-sm">Please select a different time</p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Legend */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Legend</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4 text-sm">
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-green-100 border border-green-200 rounded"></div>
              <span>Available</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-yellow-100 border border-yellow-200 rounded"></div>
              <span>Moderate</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-red-100 border border-red-200 rounded"></div>
              <span>Busy</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-blue-100 border border-blue-200 rounded"></div>
              <span>Selected</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BookingCalendar;