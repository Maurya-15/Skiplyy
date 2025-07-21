import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Clock,
  Users,
  Phone,
  MapPin,
  RefreshCw,
  XCircle,
  CheckCircle,
  AlertTriangle,
} from "lucide-react";
import { mockBookings, mockBusinesses } from "../data/mockData";
import { QueueBooking, Business } from "../types";
import { toast } from "sonner";

const QueueTracker: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [booking, setBooking] = useState<QueueBooking | null>(null);
  const [business, setBusiness] = useState<Business | null>(null);
  const [queuePosition, setQueuePosition] = useState(1);
  const [estimatedWait, setEstimatedWait] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(new Date());

  useEffect(() => {
    if (id) {
      const foundBooking = mockBookings.find((b) => b.id === id);
      if (foundBooking) {
        setBooking(foundBooking);
        const foundBusiness = mockBusinesses.find(
          (b) => b.id === foundBooking.businessId,
        );
        setBusiness(foundBusiness || null);

        // Simulate queue movement
        const position = Math.max(
          1,
          foundBooking.tokenNumber - Math.floor(Math.random() * 3),
        );
        setQueuePosition(position);
        setEstimatedWait(position * 15); // 15 min per person
      }
    }
  }, [id]);

  // Auto-refresh every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      if (booking && queuePosition > 1) {
        // Simulate queue movement
        const newPosition = Math.max(
          1,
          queuePosition - Math.floor(Math.random() * 2),
        );
        setQueuePosition(newPosition);
        setEstimatedWait(newPosition * 15);
        setLastUpdated(new Date());

        if (newPosition === 1) {
          toast.success("🎉 It's your turn! Please proceed to the counter.");
        } else if (newPosition <= 3) {
          toast.info("⏰ You're next in line! Please stay nearby.");
        }
      }
    }, 30000);

    return () => clearInterval(interval);
  }, [booking, queuePosition]);

  const handleRefresh = () => {
    setIsLoading(true);
    setTimeout(() => {
      const newPosition = Math.max(
        1,
        queuePosition - Math.floor(Math.random() * 2),
      );
      setQueuePosition(newPosition);
      setEstimatedWait(newPosition * 15);
      setLastUpdated(new Date());
      setIsLoading(false);
    }, 1000);
  };

  const handleCancelBooking = () => {
    if (confirm("Are you sure you want to cancel this booking?")) {
      toast.success("Booking cancelled successfully");
      // In a real app, this would make an API call
      window.location.href = "/user-home";
    }
  };

  const getProgressPercentage = () => {
    if (!booking) return 0;
    const totalAhead = booking.tokenNumber - 1;
    const completed = totalAhead - (queuePosition - 1);
    return Math.min(100, (completed / totalAhead) * 100);
  };

  const getStatusColor = () => {
    if (queuePosition === 1) return "text-green-600";
    if (queuePosition <= 3) return "text-yellow-600";
    return "text-blue-600";
  };

  const getStatusMessage = () => {
    if (queuePosition === 1)
      return "🎉 It's your turn! Please proceed to the counter.";
    if (queuePosition <= 3)
      return "⏰ You're next in line! Please stay nearby.";
    return `⏳ You have ${queuePosition - 1} people ahead of you.`;
  };

  if (!booking || !business) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">📋</div>
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
            Booking Not Found
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            The booking you're looking for doesn't exist or has been cancelled.
          </p>
          <Link to="/user-home">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Back to Home
            </motion.button>
          </Link>
        </div>
      </div>
    );
  }

  const department = business.departments.find(
    (d) => d.id === booking.departmentId,
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50/50 via-white to-purple-50/50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Header */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Link to="/user-home">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Home</span>
          </motion.button>
        </Link>

        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Queue Tracker
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Real-time updates for your booking
          </p>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 space-y-6">
        {/* Status Alert */}
        {queuePosition === 1 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl p-4"
          >
            <div className="flex items-center space-x-3">
              <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
              <div>
                <h3 className="font-semibold text-green-800 dark:text-green-200">
                  It's Your Turn!
                </h3>
                <p className="text-green-700 dark:text-green-300 text-sm">
                  Please proceed to the service counter immediately.
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Main Status Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 dark:border-gray-700/20 overflow-hidden"
        >
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white text-center">
            <div className="text-6xl font-bold mb-2">
              #{booking.tokenNumber}
            </div>
            <h2 className="text-xl font-semibold">Your Token Number</h2>
          </div>

          <div className="p-6 space-y-6">
            {/* Progress Bar */}
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span>Queue Progress</span>
                <span className="font-semibold">
                  {Math.round(getProgressPercentage())}%
                </span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${getProgressPercentage()}%` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 h-3 rounded-full"
                />
              </div>
            </div>

            {/* Current Status */}
            <div className="text-center space-y-3">
              <div className={`text-5xl font-bold ${getStatusColor()}`}>
                Position #{queuePosition}
              </div>
              <p className="text-gray-600 dark:text-gray-400">
                {getStatusMessage()}
              </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
                <Users className="w-8 h-8 text-blue-600 dark:text-blue-400 mx-auto mb-2" />
                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  {queuePosition - 1}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  People ahead
                </div>
              </div>

              <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-xl">
                <Clock className="w-8 h-8 text-green-600 dark:text-green-400 mx-auto mb-2" />
                <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                  {estimatedWait}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Minutes left
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Business Information */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 dark:border-gray-700/20 p-6"
        >
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
            <MapPin className="w-5 h-5 mr-2 text-blue-600" />
            Business Information
          </h3>

          <div className="space-y-3">
            <div>
              <h4 className="font-semibold text-gray-900 dark:text-white">
                {business.name}
              </h4>
              <p className="text-gray-600 dark:text-gray-400">
                {business.address}
              </p>
            </div>

            <div className="flex items-center space-x-3 text-sm">
              <Phone className="w-4 h-4 text-gray-400" />
              <span className="text-gray-600 dark:text-gray-400">
                +1 (555) 123-4567
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-500">Service:</span>
                <div className="font-semibold">{department?.name}</div>
              </div>
              <div>
                <span className="text-gray-500">Booked at:</span>
                <div className="font-semibold">
                  {new Date(booking.bookedAt).toLocaleTimeString()}
                </div>
              </div>
            </div>

            {booking.notes && (
              <div>
                <span className="text-gray-500 text-sm">Notes:</span>
                <p className="text-sm text-gray-700 dark:text-gray-300 mt-1">
                  {booking.notes}
                </p>
              </div>
            )}
          </div>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="grid grid-cols-2 gap-4"
        >
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleRefresh}
            disabled={isLoading}
            className="flex items-center justify-center space-x-2 px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors disabled:opacity-50"
          >
            <RefreshCw
              className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`}
            />
            <span>Refresh</span>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleCancelBooking}
            className="flex items-center justify-center space-x-2 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            <XCircle className="w-4 h-4" />
            <span>Cancel Booking</span>
          </motion.button>
        </motion.div>

        {/* Last Updated */}
        <div className="text-center text-xs text-gray-500">
          Last updated: {lastUpdated.toLocaleTimeString()}
        </div>

        {/* Tips */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4"
        >
          <h4 className="font-semibold text-blue-800 dark:text-blue-200 mb-2 flex items-center">
            <AlertTriangle className="w-4 h-4 mr-2" />
            💡 Tips
          </h4>
          <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
            <li>• Stay nearby when you're in the top 3 positions</li>
            <li>• This page refreshes automatically every 30 seconds</li>
            <li>• You'll get notifications when it's almost your turn</li>
            <li>• You can cancel your booking anytime if plans change</li>
          </ul>
        </motion.div>
      </div>
    </div>
  );
};

export default QueueTracker;
