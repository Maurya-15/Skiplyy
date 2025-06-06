import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Star,
  MapPin,
  Clock,
  Users,
  Phone,
  Globe,
  CheckCircle,
  XCircle,
  Calendar,
  Award,
} from "lucide-react";
import { mockBusinesses, BUSINESS_CATEGORIES } from "../data/mockData";
import { Business } from "../types";
import { BookingModal } from "../components/BookingModal";

const BusinessDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [business, setBusiness] = useState<Business | null>(null);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [selectedDepartmentId, setSelectedDepartmentId] = useState<string>("");

  useEffect(() => {
    if (id) {
      const foundBusiness = mockBusinesses.find((b) => b.id === id);
      setBusiness(foundBusiness || null);
    }
  }, [id]);

  const handleBookingClick = (departmentId?: string) => {
    if (departmentId) {
      setSelectedDepartmentId(departmentId);
    }
    setIsBookingModalOpen(true);
  };

  if (!business) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🏢</div>
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
            Business Not Found
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            The business you're looking for doesn't exist or has been removed.
          </p>
          <Link to="/home">
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

  const category = BUSINESS_CATEGORIES.find(
    (c) => c.value === business.category,
  );
  const totalQueue = business.departments.reduce(
    (sum, dept) => sum + dept.currentQueueSize,
    0,
  );
  const avgWait = Math.round(
    business.departments.reduce(
      (sum, dept) => sum + dept.estimatedWaitTime,
      0,
    ) / business.departments.length,
  );

  const reviews = [
    {
      name: "Sarah M.",
      rating: 5,
      comment: "Great service! The queue system saved me so much time.",
      date: "2 days ago",
    },
    {
      name: "John D.",
      rating: 4,
      comment: "Very organized and professional staff.",
      date: "1 week ago",
    },
    {
      name: "Emily R.",
      rating: 5,
      comment: "Love being able to book ahead. Highly recommend!",
      date: "2 weeks ago",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50/50 via-white to-purple-50/50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Back Button */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Link to="/home">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Search</span>
          </motion.button>
        </Link>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Business Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 dark:border-gray-700/20 overflow-hidden"
            >
              <div className="h-64 bg-gradient-to-r from-blue-500 to-purple-600 relative">
                {business.coverPhoto && (
                  <img
                    src={business.coverPhoto}
                    alt={business.name}
                    className="w-full h-full object-cover"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/80 to-purple-600/80" />
                <div className="absolute top-4 left-4">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-white/20 text-white backdrop-blur-sm">
                    {category?.icon} {category?.label}
                  </span>
                </div>
                <div className="absolute top-4 right-4">
                  <span
                    className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                      business.isAcceptingBookings
                        ? "bg-green-500/20 text-green-100 border border-green-400/30"
                        : "bg-red-500/20 text-red-100 border border-red-400/30"
                    }`}
                  >
                    {business.isAcceptingBookings ? (
                      <>
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Accepting Bookings
                      </>
                    ) : (
                      <>
                        <XCircle className="w-3 h-3 mr-1" />
                        Closed for Bookings
                      </>
                    )}
                  </span>
                </div>
                <div className="absolute bottom-6 left-6 right-6">
                  <h1 className="text-3xl font-bold text-white mb-2">
                    {business.name}
                  </h1>
                  <div className="flex items-center space-x-4 text-white/90">
                    <div className="flex items-center space-x-1">
                      <MapPin className="w-4 h-4" />
                      <span>{business.address}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-1">
                      <Star className="w-5 h-5 text-yellow-400 fill-current" />
                      <span className="text-xl font-semibold">
                        {business.rating}
                      </span>
                      <span className="text-gray-500">
                        ({business.totalReviews} reviews)
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-6 text-sm">
                    <div className="text-center">
                      <div className="flex items-center space-x-1 text-blue-600 dark:text-blue-400 mb-1">
                        <Users className="w-4 h-4" />
                        <span className="font-semibold">{totalQueue}</span>
                      </div>
                      <div className="text-gray-500">in queue</div>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center space-x-1 text-green-600 dark:text-green-400 mb-1">
                        <Clock className="w-4 h-4" />
                        <span className="font-semibold">{avgWait}m</span>
                      </div>
                      <div className="text-gray-500">avg wait</div>
                    </div>
                  </div>
                </div>

                {business.description && (
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                    {business.description}
                  </p>
                )}
              </div>
            </motion.div>

            {/* Departments/Services */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 dark:border-gray-700/20 p-6"
            >
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center">
                <Calendar className="w-6 h-6 mr-3 text-blue-600" />
                Available Services
              </h2>

              <div className="grid gap-4">
                {business.departments.map((department, index) => (
                  <motion.div
                    key={department.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + index * 0.1, duration: 0.5 }}
                    className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                      department.isActive &&
                      department.currentQueueSize < department.maxQueueSize
                        ? "border-blue-200 dark:border-blue-800 bg-blue-50/50 dark:bg-blue-900/20 hover:border-blue-300 dark:hover:border-blue-700 cursor-pointer"
                        : "border-gray-200 dark:border-gray-600 bg-gray-50/50 dark:bg-gray-700/20 opacity-60"
                    }`}
                    onClick={() => {
                      if (
                        department.isActive &&
                        department.currentQueueSize < department.maxQueueSize
                      ) {
                        handleBookingClick(department.id);
                      }
                    }}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                          {department.name}
                        </h3>
                        {department.description && (
                          <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                            {department.description}
                          </p>
                        )}
                        <div className="flex items-center space-x-4 text-sm">
                          <div className="flex items-center space-x-1">
                            <Clock className="w-3 h-3 text-gray-400" />
                            <span className="text-gray-600 dark:text-gray-400">
                              {department.estimatedWaitTime} min wait
                            </span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Users className="w-3 h-3 text-gray-400" />
                            <span className="text-gray-600 dark:text-gray-400">
                              {department.currentQueueSize}/
                              {department.maxQueueSize} spots
                            </span>
                          </div>
                          {department.price && (
                            <div className="text-green-600 dark:text-green-400 font-semibold">
                              ${department.price}
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="text-right">
                        {!department.isActive ? (
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400">
                            Closed
                          </span>
                        ) : department.currentQueueSize >=
                          department.maxQueueSize ? (
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300">
                            Full
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300">
                            Available
                          </span>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Reviews */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 dark:border-gray-700/20 p-6"
            >
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center">
                <Award className="w-6 h-6 mr-3 text-yellow-500" />
                Recent Reviews
              </h2>

              <div className="space-y-4">
                {reviews.map((review, index) => (
                  <div
                    key={index}
                    className="border-b border-gray-200 dark:border-gray-600 last:border-b-0 pb-4 last:pb-0"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                          <span className="text-white text-xs font-semibold">
                            {review.name.charAt(0)}
                          </span>
                        </div>
                        <span className="font-medium text-gray-900 dark:text-white">
                          {review.name}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-3 h-3 ${
                                i < review.rating
                                  ? "text-yellow-400 fill-current"
                                  : "text-gray-300"
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-xs text-gray-500">
                          {review.date}
                        </span>
                      </div>
                    </div>
                    <p className="text-gray-600 dark:text-gray-300 text-sm">
                      {review.comment}
                    </p>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Booking Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="sticky top-8 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 dark:border-gray-700/20 p-6"
            >
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 text-center">
                Book Your Spot
              </h3>

              <div className="text-center mb-6">
                <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-1">
                  ~{avgWait} min
                </div>
                <p className="text-sm text-gray-500">Average wait time</p>
              </div>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">
                    People in queue:
                  </span>
                  <span className="font-semibold">{totalQueue}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">
                    Available services:
                  </span>
                  <span className="font-semibold">
                    {
                      business.departments.filter(
                        (d) =>
                          d.isActive && d.currentQueueSize < d.maxQueueSize,
                      ).length
                    }
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">
                    Rating:
                  </span>
                  <div className="flex items-center space-x-1">
                    <Star className="w-3 h-3 text-yellow-400 fill-current" />
                    <span className="font-semibold">{business.rating}</span>
                  </div>
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleBookingClick()}
                disabled={
                  !business.isAcceptingBookings ||
                  business.departments.every(
                    (d) => !d.isActive || d.currentQueueSize >= d.maxQueueSize,
                  )
                }
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 rounded-lg font-semibold hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {!business.isAcceptingBookings
                  ? "Closed for Bookings"
                  : business.departments.every(
                        (d) =>
                          !d.isActive || d.currentQueueSize >= d.maxQueueSize,
                      )
                    ? "All Services Full"
                    : "Book My Spot"}
              </motion.button>

              <p className="text-xs text-gray-500 text-center mt-3">
                No booking fees • Cancel anytime
              </p>
            </motion.div>

            {/* Contact Information */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 dark:border-gray-700/20 p-6"
            >
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Contact Information
              </h3>

              <div className="space-y-3 text-sm">
                <div className="flex items-center space-x-3">
                  <MapPin className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-600 dark:text-gray-300">
                    {business.address}
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  <Phone className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-600 dark:text-gray-300">
                    +1 (555) 123-4567
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  <Globe className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-600 dark:text-gray-300">
                    www.business-website.com
                  </span>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-600">
                <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                  Opening Hours
                </h4>
                <div className="space-y-1 text-xs">
                  {Object.entries(business.openingHours).map(([day, hours]) => (
                    <div key={day} className="flex justify-between">
                      <span className="capitalize text-gray-600 dark:text-gray-400">
                        {day}:
                      </span>
                      <span className="text-gray-900 dark:text-white">
                        {hours.closed
                          ? "Closed"
                          : `${hours.start} - ${hours.end}`}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Booking Modal */}
      <BookingModal
        business={business}
        isOpen={isBookingModalOpen}
        onClose={() => {
          setIsBookingModalOpen(false);
          setSelectedDepartmentId("");
        }}
        preSelectedDepartmentId={selectedDepartmentId}
      />
    </div>
  );
};

export default BusinessDetail;
