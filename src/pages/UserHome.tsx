import React, { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Search,
  Filter,
  MapPin,
  Star,
  Clock,
  Users,
  ArrowRight,
  SlidersHorizontal,
  X,
} from "lucide-react";
import { mockBusinesses, BUSINESS_CATEGORIES } from "../data/mockData";
import { useAuth } from "../contexts/AuthContext";
import { Business, BusinessCategory } from "../types";

const UserHome: React.FC = () => {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<
    BusinessCategory | "all"
  >("all");
  const [location, setLocation] = useState("New York, NY");
  const [sortBy, setSortBy] = useState<"distance" | "rating" | "wait-time">(
    "distance",
  );
  const [showFilters, setShowFilters] = useState(false);
  const [maxWaitTime, setMaxWaitTime] = useState<number>(120);
  const [minRating, setMinRating] = useState<number>(0);

  const filteredBusinesses = useMemo(() => {
    let filtered = mockBusinesses.filter((business) => {
      // Search filter
      const matchesSearch =
        business.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        business.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
        business.description?.toLowerCase().includes(searchQuery.toLowerCase());

      // Category filter
      const matchesCategory =
        selectedCategory === "all" || business.category === selectedCategory;

      // Rating filter
      const matchesRating = business.rating >= minRating;

      // Wait time filter
      const avgWaitTime =
        business.departments.reduce(
          (sum, dept) => sum + dept.estimatedWaitTime,
          0,
        ) / business.departments.length;
      const matchesWaitTime = avgWaitTime <= maxWaitTime;

      return (
        matchesSearch && matchesCategory && matchesRating && matchesWaitTime
      );
    });

    // Sort businesses
    switch (sortBy) {
      case "rating":
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case "wait-time":
        filtered.sort((a, b) => {
          const avgWaitA =
            a.departments.reduce(
              (sum, dept) => sum + dept.estimatedWaitTime,
              0,
            ) / a.departments.length;
          const avgWaitB =
            b.departments.reduce(
              (sum, dept) => sum + dept.estimatedWaitTime,
              0,
            ) / b.departments.length;
          return avgWaitA - avgWaitB;
        });
        break;
      default: // distance
        // In a real app, this would sort by actual distance
        break;
    }

    return filtered;
  }, [searchQuery, selectedCategory, minRating, maxWaitTime, sortBy]);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  const BusinessCard: React.FC<{ business: Business; index: number }> = ({
    business,
    index,
  }) => {
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
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.1, duration: 0.6 }}
        whileHover={{ y: -5 }}
        className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-white/20 dark:border-gray-700/20"
      >
        <div className="h-40 bg-gradient-to-r from-blue-500 to-purple-600 relative">
          <div className="absolute inset-0 bg-black/20" />
          <div className="absolute top-4 left-4">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-white/20 text-white backdrop-blur-sm">
              {category?.icon} {category?.label}
            </span>
          </div>
          <div className="absolute top-4 right-4">
            <span
              className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                business.isAcceptingBookings
                  ? "bg-green-500/20 text-green-100 border border-green-400/30"
                  : "bg-red-500/20 text-red-100 border border-red-400/30"
              }`}
            >
              {business.isAcceptingBookings ? "Open" : "Closed"}
            </span>
          </div>
          <div className="absolute bottom-4 left-4 right-4">
            <h3 className="text-lg font-bold text-white mb-1">
              {business.name}
            </h3>
            <div className="flex items-center space-x-1 text-white/80">
              <MapPin className="w-3 h-3" />
              <span className="text-sm truncate">{business.address}</span>
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
            <div className="text-xs text-gray-500">
              {Math.round(Math.random() * 5 + 1)} km away
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="text-center p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
              <Users className="w-4 h-4 text-blue-500 mx-auto mb-1" />
              <div className="font-semibold text-sm">{totalQueue}</div>
              <div className="text-xs text-gray-500">in queue</div>
            </div>
            <div className="text-center p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
              <Clock className="w-4 h-4 text-green-500 mx-auto mb-1" />
              <div className="font-semibold text-sm">{avgWait}m</div>
              <div className="text-xs text-gray-500">avg wait</div>
            </div>
          </div>

          <div className="mb-4">
            <div className="text-xs text-gray-500 mb-2">
              Available Services:
            </div>
            <div className="flex flex-wrap gap-1">
              {business.departments.slice(0, 2).map((dept) => (
                <span
                  key={dept.id}
                  className="inline-block px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 text-xs rounded-full"
                >
                  {dept.name}
                </span>
              ))}
              {business.departments.length > 2 && (
                <span className="inline-block px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 text-xs rounded-full">
                  +{business.departments.length - 2} more
                </span>
              )}
            </div>
          </div>

          <Link to={`/business/${business.id}`}>
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
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50/50 via-white to-purple-50/50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <div className="text-center md:text-left mb-6">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">
              {getGreeting()}, {user?.name}! 👋
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Find and book your spot in queues near you
            </p>
          </div>
        </motion.div>

        {/* Search and Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 dark:border-gray-700/20 p-6 mb-8"
        >
          {/* Main Search Bar */}
          <div className="flex flex-col lg:flex-row gap-4 mb-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search businesses, services, or locations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors"
              />
            </div>

            <div className="flex gap-2">
              <select
                value={selectedCategory}
                onChange={(e) =>
                  setSelectedCategory(
                    e.target.value as BusinessCategory | "all",
                  )
                }
                className="px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors min-w-[180px]"
              >
                <option value="all">All Categories</option>
                {BUSINESS_CATEGORIES.map((category) => (
                  <option key={category.value} value={category.value}>
                    {category.icon} {category.label}
                  </option>
                ))}
              </select>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowFilters(!showFilters)}
                className="px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center space-x-2"
              >
                <SlidersHorizontal className="w-4 h-4" />
                <span>Filters</span>
              </motion.button>
            </div>
          </div>

          {/* Location Bar */}
          <div className="flex items-center space-x-4">
            <div className="flex-1">
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Enter your location"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors"
                />
              </div>
            </div>

            <div className="text-sm text-gray-500">
              Sort by:
              <select
                value={sortBy}
                onChange={(e) =>
                  setSortBy(
                    e.target.value as "distance" | "rating" | "wait-time",
                  )
                }
                className="ml-2 border-none bg-transparent text-gray-700 dark:text-gray-300 focus:ring-0"
              >
                <option value="distance">Distance</option>
                <option value="rating">Rating</option>
                <option value="wait-time">Wait Time</option>
              </select>
            </div>
          </div>

          {/* Advanced Filters */}
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-600"
            >
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Maximum Wait Time: {maxWaitTime} minutes
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="180"
                    step="15"
                    value={maxWaitTime}
                    onChange={(e) => setMaxWaitTime(Number(e.target.value))}
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Minimum Rating: {minRating}+ stars
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="5"
                    step="0.5"
                    value={minRating}
                    onChange={(e) => setMinRating(Number(e.target.value))}
                    className="w-full"
                  />
                </div>
              </div>
            </motion.div>
          )}
        </motion.div>

        {/* Results Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="flex items-center justify-between mb-6"
        >
          <div>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
              Available Services
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              {filteredBusinesses.length} businesses found
              {searchQuery && ` for "${searchQuery}"`}
              {selectedCategory !== "all" &&
                ` in ${BUSINESS_CATEGORIES.find((c) => c.value === selectedCategory)?.label}`}
            </p>
          </div>
        </motion.div>

        {/* Business Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.6 }}
        >
          {filteredBusinesses.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredBusinesses.map((business, index) => (
                <BusinessCard
                  key={business.id}
                  business={business}
                  index={index}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                No businesses found
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">
                We couldn't find any businesses matching your criteria. Try
                adjusting your filters or search terms.
              </p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  setSearchQuery("");
                  setSelectedCategory("all");
                  setMinRating(0);
                  setMaxWaitTime(120);
                }}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Clear Filters
              </motion.button>
            </div>
          )}
        </motion.div>

        {/* Category Shortcuts */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="mt-12"
        >
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
            Browse by Category
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {BUSINESS_CATEGORIES.slice(0, 6).map((category, index) => (
              <motion.button
                key={category.value}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.8 + index * 0.1, duration: 0.4 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedCategory(category.value)}
                className={`p-4 rounded-xl text-center transition-all duration-200 ${
                  selectedCategory === category.value
                    ? "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border-2 border-blue-300 dark:border-blue-700"
                    : "bg-white/80 dark:bg-gray-800/80 hover:bg-gray-50 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-600"
                }`}
              >
                <div className="text-2xl mb-2">{category.icon}</div>
                <div className="text-xs font-medium text-gray-700 dark:text-gray-300">
                  {category.label}
                </div>
              </motion.button>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default UserHome;
