import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  BarChart3,
  Users,
  Clock,
  TrendingUp,
  Settings,
  Plus,
  Eye,
  Check,
  X,
  QrCode,
  Building2,
  Calendar,
  DollarSign,
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { mockBusinesses, mockBookings } from "../data/mockData";

const BusinessDashboard: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("overview");

  // Find the business owned by the current user
  const business = mockBusinesses.find((b) => b.ownerId === user?.id);

  // Get bookings for this business
  const businessBookings = business
    ? mockBookings.filter((b) => b.businessId === business.id)
    : [];
  const todayBookings = businessBookings.filter(
    (booking) =>
      new Date(booking.bookedAt).toDateString() === new Date().toDateString(),
  );
  const activeBookings = businessBookings.filter(
    (booking) =>
      booking.status === "waiting" ||
      booking.status === "approved" ||
      booking.status === "in-progress",
  );

  if (!business) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🏢</div>
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
            No Business Found
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            You don't have a business registered with this account.
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Register Your Business
          </motion.button>
        </div>
      </div>
    );
  }

  const totalQueue = business.departments.reduce(
    (sum, dept) => sum + dept.currentQueueSize,
    0,
  );
  const avgWait =
    business.departments.length > 0
      ? Math.round(
          business.departments.reduce(
            (sum, dept) => sum + dept.estimatedWaitTime,
            0,
          ) / business.departments.length,
        )
      : 0;

  const handleApproveBooking = (bookingId: string) => {
    // In a real app, this would make an API call
    console.log("Approving booking:", bookingId);
  };

  const handleRejectBooking = (bookingId: string) => {
    // In a real app, this would make an API call
    console.log("Rejecting booking:", bookingId);
  };

  const StatCard: React.FC<{
    title: string;
    value: string | number;
    icon: React.ReactNode;
    trend?: string;
    color: string;
  }> = ({ title, value, icon, trend, color }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 dark:border-gray-700/20 p-6"
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
            {title}
          </p>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">
            {value}
          </p>
          {trend && (
            <p className="text-sm text-green-600 dark:text-green-400 mt-1">
              {trend}
            </p>
          )}
        </div>
        <div className={`p-3 rounded-xl ${color}`}>{icon}</div>
      </div>
    </motion.div>
  );

  const TabButton: React.FC<{
    id: string;
    label: string;
    icon: React.ReactNode;
  }> = ({ id, label, icon }) => (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => setActiveTab(id)}
      className={`
        flex items-center space-x-2 px-4 py-2 rounded-lg transition-all
        ${
          activeTab === id
            ? "bg-blue-600 text-white shadow-lg"
            : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
        }
      `}
    >
      {icon}
      <span>{label}</span>
    </motion.button>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50/50 via-white to-purple-50/50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8"
        >
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Business Dashboard
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Welcome back, {user?.name}
            </p>
          </div>

          <div className="flex items-center space-x-4 mt-4 sm:mt-0">
            <div className="flex items-center space-x-2">
              <div
                className={`w-3 h-3 rounded-full ${business.isAcceptingBookings ? "bg-green-500" : "bg-red-500"}`}
              />
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {business.isAcceptingBookings ? "Accepting Bookings" : "Closed"}
              </span>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Settings className="w-4 h-4" />
            </motion.button>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          <StatCard
            title="Today's Bookings"
            value={todayBookings.length}
            icon={<Calendar className="w-6 h-6 text-blue-600" />}
            trend="+12% from yesterday"
            color="bg-blue-100 dark:bg-blue-900/30"
          />
          <StatCard
            title="Active Queue"
            value={totalQueue}
            icon={<Users className="w-6 h-6 text-green-600" />}
            trend="Live count"
            color="bg-green-100 dark:bg-green-900/30"
          />
          <StatCard
            title="Avg. Wait Time"
            value={`${avgWait}m`}
            icon={<Clock className="w-6 h-6 text-orange-600" />}
            trend="-5m from last week"
            color="bg-orange-100 dark:bg-orange-900/30"
          />
          <StatCard
            title="Rating"
            value={business.rating.toFixed(1)}
            icon={<TrendingUp className="w-6 h-6 text-purple-600" />}
            trend={`${business.totalReviews} reviews`}
            color="bg-purple-100 dark:bg-purple-900/30"
          />
        </motion.div>

        {/* Navigation Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="flex space-x-2 mb-8 overflow-x-auto"
        >
          <TabButton
            id="overview"
            label="Overview"
            icon={<BarChart3 className="w-4 h-4" />}
          />
          <TabButton
            id="queue"
            label="Live Queue"
            icon={<Users className="w-4 h-4" />}
          />
          <TabButton
            id="departments"
            label="Departments"
            icon={<Building2 className="w-4 h-4" />}
          />
          <TabButton
            id="analytics"
            label="Analytics"
            icon={<TrendingUp className="w-4 h-4" />}
          />
          <TabButton
            id="settings"
            label="Settings"
            icon={<Settings className="w-4 h-4" />}
          />
        </motion.div>

        {/* Tab Content */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          {activeTab === "overview" && (
            <div className="grid lg:grid-cols-2 gap-8">
              {/* Recent Bookings */}
              <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 dark:border-gray-700/20 p-6">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                  Recent Bookings
                </h3>
                <div className="space-y-4">
                  {todayBookings.slice(0, 5).map((booking) => {
                    const department = business.departments.find(
                      (d) => d.id === booking.departmentId,
                    );
                    return (
                      <div
                        key={booking.id}
                        className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg"
                      >
                        <div>
                          <p className="font-medium">
                            #{booking.tokenNumber} - {booking.customerName}
                          </p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {department?.name}
                          </p>
                        </div>
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${
                            booking.status === "waiting"
                              ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300"
                              : booking.status === "approved"
                                ? "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300"
                                : booking.status === "completed"
                                  ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
                                  : "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300"
                          }`}
                        >
                          {booking.status}
                        </span>
                      </div>
                    );
                  })}
                  {todayBookings.length === 0 && (
                    <p className="text-gray-500 dark:text-gray-400 text-center py-4">
                      No bookings today
                    </p>
                  )}
                </div>
              </div>

              {/* Department Status */}
              <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 dark:border-gray-700/20 p-6">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                  Department Status
                </h3>
                <div className="space-y-4">
                  {business.departments.map((dept) => (
                    <div
                      key={dept.id}
                      className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg"
                    >
                      <div>
                        <p className="font-medium">{dept.name}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {dept.currentQueueSize}/{dept.maxQueueSize} •{" "}
                          {dept.estimatedWaitTime}m wait
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            dept.isActive
                              ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
                              : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300"
                          }`}
                        >
                          {dept.isActive ? "Active" : "Inactive"}
                        </span>
                        <div
                          className={`w-3 h-3 rounded-full ${
                            dept.currentQueueSize >= dept.maxQueueSize
                              ? "bg-red-500"
                              : dept.currentQueueSize > dept.maxQueueSize * 0.7
                                ? "bg-yellow-500"
                                : "bg-green-500"
                          }`}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === "queue" && (
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 dark:border-gray-700/20 p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Live Queue ({activeBookings.length})
                </h3>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <QrCode className="w-4 h-4" />
                  <span>QR Scanner</span>
                </motion.button>
              </div>

              <div className="space-y-4">
                {activeBookings.map((booking) => {
                  const department = business.departments.find(
                    (d) => d.id === booking.departmentId,
                  );
                  return (
                    <div
                      key={booking.id}
                      className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-600 rounded-lg"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center text-white font-bold">
                          #{booking.tokenNumber}
                        </div>
                        <div>
                          <p className="font-medium">{booking.customerName}</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {booking.customerPhone} • {department?.name}
                          </p>
                          {booking.notes && (
                            <p className="text-xs text-gray-500 mt-1">
                              Note: {booking.notes}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${
                            booking.status === "waiting"
                              ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300"
                              : booking.status === "approved"
                                ? "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300"
                                : "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
                          }`}
                        >
                          {booking.status}
                        </span>
                        {booking.status === "waiting" && (
                          <div className="flex space-x-1">
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => handleApproveBooking(booking.id)}
                              className="p-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
                            >
                              <Check className="w-4 h-4" />
                            </motion.button>
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => handleRejectBooking(booking.id)}
                              className="p-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                            >
                              <X className="w-4 h-4" />
                            </motion.button>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}

                {activeBookings.length === 0 && (
                  <div className="text-center py-12">
                    <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                      No Active Queue
                    </h4>
                    <p className="text-gray-600 dark:text-gray-400">
                      All caught up! No customers in queue right now.
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === "departments" && (
            <div className="grid lg:grid-cols-2 gap-8">
              {/* Add Department */}
              <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 dark:border-gray-700/20 p-6">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                  Add New Department
                </h3>
                <div className="space-y-4">
                  <input
                    type="text"
                    placeholder="Department name"
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                  <input
                    type="number"
                    placeholder="Estimated wait time (minutes)"
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                  <input
                    type="number"
                    placeholder="Max queue size"
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add Department</span>
                  </motion.button>
                </div>
              </div>

              {/* Existing Departments */}
              <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 dark:border-gray-700/20 p-6">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                  Existing Departments
                </h3>
                <div className="space-y-4">
                  {business.departments.map((dept) => (
                    <div
                      key={dept.id}
                      className="p-4 border border-gray-200 dark:border-gray-600 rounded-lg"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium">{dept.name}</h4>
                        <label className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            checked={dept.isActive}
                            className="rounded"
                          />
                          <span className="text-sm">Active</span>
                        </label>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-sm text-gray-600 dark:text-gray-400">
                        <span>Wait: {dept.estimatedWaitTime}m</span>
                        <span>Max: {dept.maxQueueSize}</span>
                        <span>Current: {dept.currentQueueSize}</span>
                        <span>
                          Available: {dept.maxQueueSize - dept.currentQueueSize}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === "analytics" && (
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 dark:border-gray-700/20 p-6">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center">
                <BarChart3 className="w-6 h-6 mr-3" />
                Analytics & Reports
              </h3>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <h4 className="font-medium">Today's Performance</h4>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span>Total Bookings:</span>
                      <span className="font-medium">
                        {todayBookings.length}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Completed:</span>
                      <span className="font-medium">
                        {
                          todayBookings.filter((b) => b.status === "completed")
                            .length
                        }
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Cancelled:</span>
                      <span className="font-medium">
                        {
                          todayBookings.filter((b) => b.status === "cancelled")
                            .length
                        }
                      </span>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="font-medium">Peak Hours</h4>
                  <div className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
                    <p>Morning: 9 AM - 11 AM</p>
                    <p>Afternoon: 2 PM - 4 PM</p>
                    <p>Evening: 6 PM - 8 PM</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="font-medium">Customer Satisfaction</h4>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span>Avg. Rating:</span>
                      <span className="font-medium">
                        {business.rating.toFixed(1)}/5
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Total Reviews:</span>
                      <span className="font-medium">
                        {business.totalReviews}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "settings" && (
            <div className="grid lg:grid-cols-2 gap-8">
              <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 dark:border-gray-700/20 p-6">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                  Business Information
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Business Name
                    </label>
                    <input
                      type="text"
                      defaultValue={business.name}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Address
                    </label>
                    <input
                      type="text"
                      defaultValue={business.address}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Description
                    </label>
                    <textarea
                      rows={3}
                      defaultValue={business.description}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Save Changes
                  </motion.button>
                </div>
              </div>

              <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 dark:border-gray-700/20 p-6">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                  Queue Settings
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span>Auto-approve bookings</span>
                    <input type="checkbox" className="rounded" />
                  </div>
                  <div className="flex items-center justify-between">
                    <span>SMS notifications</span>
                    <input type="checkbox" className="rounded" />
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Email alerts</span>
                    <input type="checkbox" defaultChecked className="rounded" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Buffer time (minutes)
                    </label>
                    <input
                      type="number"
                      defaultValue="5"
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default BusinessDashboard;
