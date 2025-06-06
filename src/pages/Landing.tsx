import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  MapPin,
  Search,
  ArrowRight,
  Clock,
  Users,
  Star,
  CheckCircle,
  Zap,
  Shield,
  Heart,
} from "lucide-react";
import { mockBusinesses, BUSINESS_CATEGORIES } from "../data/mockData";
import { useAuth } from "../contexts/AuthContext";

const Landing: React.FC = () => {
  const { isAuthenticated, user } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [location, setLocation] = useState("New York, NY");

  const filteredBusinesses =
    selectedCategory === "all"
      ? mockBusinesses.slice(0, 6)
      : mockBusinesses
          .filter((b) => b.category === selectedCategory)
          .slice(0, 6);

  const features = [
    {
      icon: <Clock className="w-6 h-6 text-blue-500" />,
      title: "Real-time Updates",
      description: "Get live queue positions and accurate wait times",
    },
    {
      icon: <Zap className="w-6 h-6 text-yellow-500" />,
      title: "Skip the Wait",
      description: "Book your spot remotely and arrive when it's your turn",
    },
    {
      icon: <Shield className="w-6 h-6 text-green-500" />,
      title: "Secure & Reliable",
      description: "Your bookings are safe with our secure platform",
    },
    {
      icon: <Heart className="w-6 h-6 text-red-500" />,
      title: "Better Experience",
      description: "No more standing in long queues or wasted time",
    },
  ];

  const stats = [
    { number: "10,000+", label: "Happy Users" },
    { number: "500+", label: "Partner Businesses" },
    { number: "50,000+", label: "Queues Managed" },
    { number: "4.8★", label: "Average Rating" },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div
            className={
              'absolute inset-0 bg-[url(\'data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23000000" fill-opacity="0.1"%3E%3Ccircle cx="7" cy="7" r="1"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\')]'
            }
          />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            {/* Hero Content */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="mb-12"
            >
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.6 }}
                className="inline-flex items-center px-4 py-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-sm font-medium mb-6"
              >
                �� Smart Queue Management Platform
              </motion.div>

              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-gray-900 dark:text-white mb-6">
                Skip the Wait,{" "}
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Book Your Spot
                </span>
              </h1>

              <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
                Join thousands who save time daily by booking queue spots at
                hospitals, salons, banks, restaurants, and government offices.
              </p>
            </motion.div>

            {/* Search Section */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="max-w-4xl mx-auto mb-12"
            >
              <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-white/20 dark:border-gray-700/20">
                <div className="grid md:grid-cols-3 gap-4">
                  {/* Location Input */}
                  <div className="relative">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Your Location
                    </label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <input
                        type="text"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        placeholder="Enter your location"
                      />
                    </div>
                  </div>

                  {/* Category Dropdown */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Service Category
                    </label>
                    <select
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    >
                      <option value="all">All Categories</option>
                      {BUSINESS_CATEGORIES.map((category) => (
                        <option key={category.value} value={category.value}>
                          {category.icon} {category.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Search Button */}
                  <div className="flex flex-col justify-end">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-6 rounded-lg font-semibold hover:shadow-lg transition-all duration-200 flex items-center justify-center space-x-2"
                    >
                      <Search className="w-4 h-4" />
                      <span>Explore Queues Nearby</span>
                    </motion.button>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.8 }}
              className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4"
            >
              {!isAuthenticated ? (
                <>
                  <Link to="/signup-user">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-200"
                    >
                      Get Started Free
                    </motion.button>
                  </Link>
                  <Link to="/login">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-8 py-4 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl font-semibold text-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-200"
                    >
                      Sign In
                    </motion.button>
                  </Link>
                  <Link to="/signup-business">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-6 py-3 text-blue-600 dark:text-blue-400 font-medium hover:underline"
                    >
                      For Businesses →
                    </motion.button>
                  </Link>
                </>
              ) : (
                <Link
                  to={
                    user?.role === "user"
                      ? "/home"
                      : user?.role === "business"
                        ? "/dashboard"
                        : "/admin"
                  }
                >
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-200 flex items-center space-x-2"
                  >
                    <span>Go to Dashboard</span>
                    <ArrowRight className="w-4 h-4" />
                  </motion.button>
                </Link>
              )}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="text-3xl md:text-4xl font-bold text-blue-600 dark:text-blue-400 mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-600 dark:text-gray-400">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              Why Choose Skiply?
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Experience the future of queue management with our smart,
              efficient, and user-friendly platform.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2, duration: 0.6 }}
                viewport={{ once: true }}
                whileHover={{ y: -5 }}
                className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-700"
              >
                <div className="flex justify-center mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3 text-center">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 text-center">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Businesses */}
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              Popular Services Near You
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Book your spot at these top-rated businesses
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredBusinesses.map((business, index) => {
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

              return (
                <motion.div
                  key={business.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.6 }}
                  viewport={{ once: true }}
                  whileHover={{ y: -5 }}
                  className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 dark:border-gray-700"
                >
                  <div className="h-48 bg-gradient-to-r from-blue-500 to-purple-600 relative">
                    <div className="absolute inset-0 bg-black/20" />
                    <div className="absolute top-4 left-4">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-white/20 text-white backdrop-blur-sm">
                        {category?.icon} {category?.label}
                      </span>
                    </div>
                    <div className="absolute bottom-4 left-4 right-4">
                      <h3 className="text-xl font-bold text-white mb-2">
                        {business.name}
                      </h3>
                      <div className="flex items-center space-x-1 text-white/80">
                        <MapPin className="w-3 h-3" />
                        <span className="text-sm truncate">
                          {business.address}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-1">
                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                        <span className="font-semibold">{business.rating}</span>
                        <span className="text-gray-500 text-sm">
                          ({business.totalReviews})
                        </span>
                      </div>
                      <div
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          business.isAcceptingBookings
                            ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
                            : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300"
                        }`}
                      >
                        {business.isAcceptingBookings ? "Open" : "Closed"}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-6">
                      <div className="text-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <Users className="w-4 h-4 text-blue-500 mx-auto mb-1" />
                        <div className="font-semibold">{totalQueue}</div>
                        <div className="text-xs text-gray-500">in queue</div>
                      </div>
                      <div className="text-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <Clock className="w-4 h-4 text-green-500 mx-auto mb-1" />
                        <div className="font-semibold">{avgWait}m</div>
                        <div className="text-xs text-gray-500">avg wait</div>
                      </div>
                    </div>

                    <Link
                      to={
                        isAuthenticated ? `/business/${business.id}` : "/login"
                      }
                    >
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-lg font-semibold hover:shadow-lg transition-all duration-200 flex items-center justify-center space-x-2"
                      >
                        <span>Book My Spot</span>
                        <ArrowRight className="w-4 h-4" />
                      </motion.button>
                    </Link>
                  </div>
                </motion.div>
              );
            })}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mt-12"
          >
            <Link to={isAuthenticated ? "/home" : "/signup-user"}>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 border-2 border-blue-600 text-blue-600 dark:text-blue-400 dark:border-blue-400 rounded-xl font-semibold hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all duration-200 flex items-center space-x-2 mx-auto"
              >
                <span>View All Businesses</span>
                <ArrowRight className="w-4 h-4" />
              </motion.button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
              Ready to Skip the Wait?
            </h2>
            <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
              Join thousands of satisfied users who never wait in line anymore.
              Start your smart queue experience today.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
              {!isAuthenticated ? (
                <>
                  <Link to="/signup-user">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-8 py-4 bg-white text-blue-600 rounded-xl font-semibold text-lg hover:bg-gray-50 transition-colors shadow-lg"
                    >
                      Start Booking Now
                    </motion.button>
                  </Link>
                  <Link to="/signup-business">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-8 py-4 border-2 border-white text-white rounded-xl font-semibold text-lg hover:bg-white/10 transition-colors"
                    >
                      List Your Business
                    </motion.button>
                  </Link>
                </>
              ) : (
                <Link
                  to={
                    user?.role === "user"
                      ? "/home"
                      : user?.role === "business"
                        ? "/dashboard"
                        : "/admin"
                  }
                >
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-8 py-4 bg-white text-blue-600 rounded-xl font-semibold text-lg hover:bg-gray-50 transition-colors shadow-lg"
                  >
                    Go to Dashboard
                  </motion.button>
                </Link>
              )}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-lg">S</span>
                </div>
                <span className="text-xl font-bold">Skiply</span>
              </div>
              <p className="text-gray-400 mb-4">
                Smart queue management for the modern world. Save time, skip the
                wait.
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-4">For Users</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link
                    to="/home"
                    className="hover:text-white transition-colors"
                  >
                    Browse Services
                  </Link>
                </li>
                <li>
                  <Link
                    to="/signup-user"
                    className="hover:text-white transition-colors"
                  >
                    Sign Up
                  </Link>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    How it Works
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">For Businesses</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link
                    to="/signup-business"
                    className="hover:text-white transition-colors"
                  >
                    Register Business
                  </Link>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Pricing
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Features
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Help Center
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Contact Us
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Privacy Policy
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>
              &copy; 2024 Skiply. All rights reserved. Built with ❤️ for better
              queue management.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
