import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Users,
  Building2,
  Calendar,
  TrendingUp,
  Search,
  Trash2,
  Eye,
  Shield,
  BarChart3,
  AlertTriangle,
  CheckCircle,
  Filter,
  Download,
} from "lucide-react";
import {
  mockUsers,
  mockBusinesses,
  mockBookings,
  BUSINESS_CATEGORIES,
} from "../data/mockData";

const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [searchQuery, setSearchQuery] = useState("");

  // Calculate statistics
  const totalUsers = mockUsers.length;
  const totalBusinesses = mockBusinesses.length;
  const totalBookings = mockBookings.length;
  const activeBookings = mockBookings.filter(
    (b) =>
      b.status === "waiting" ||
      b.status === "approved" ||
      b.status === "in-progress",
  ).length;

  const usersByRole = {
    user: mockUsers.filter((u) => u.role === "user").length,
    business: mockUsers.filter((u) => u.role === "business").length,
    admin: mockUsers.filter((u) => u.role === "admin").length,
  };

  const businessesByCategory = BUSINESS_CATEGORIES.map((category) => ({
    category: category.label,
    count: mockBusinesses.filter((b) => b.category === category.value).length,
    icon: category.icon,
  }));

  const recentActivity = [
    ...mockUsers.slice(-5).map((user) => ({
      type: "user",
      action: "registered",
      entity: user.name,
      date: new Date(user.createdAt),
      id: user.id,
    })),
    ...mockBusinesses.slice(-5).map((business) => ({
      type: "business",
      action: "registered",
      entity: business.name,
      date: new Date(business.createdAt),
      id: business.id,
    })),
  ]
    .sort((a, b) => b.date.getTime() - a.date.getTime())
    .slice(0, 10);

  const filteredUsers = mockUsers.filter(
    (user) =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const filteredBusinesses = mockBusinesses.filter(
    (business) =>
      business.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      business.address.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const handleDeleteUser = (userId: string) => {
    if (confirm("Are you sure you want to delete this user?")) {
      console.log("Deleting user:", userId);
      // In a real app, this would make an API call
    }
  };

  const handleDeleteBusiness = (businessId: string) => {
    if (confirm("Are you sure you want to delete this business?")) {
      console.log("Deleting business:", businessId);
      // In a real app, this would make an API call
    }
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
            ? "bg-red-600 text-white shadow-lg"
            : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
        }
      `}
    >
      {icon}
      <span>{label}</span>
    </motion.button>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50/50 via-white to-orange-50/50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
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
              Admin Dashboard
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Platform overview and management
            </p>
          </div>

          <div className="flex items-center space-x-2 mt-4 sm:mt-0">
            <Shield className="w-5 h-5 text-red-500" />
            <span className="px-3 py-1 bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 rounded-full text-sm font-medium">
              Admin Access
            </span>
          </div>
        </motion.div>

        {/* Security Alert */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.6 }}
          className="mb-8"
        >
          <div className="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-xl p-4">
            <div className="flex items-center space-x-3">
              <AlertTriangle className="w-5 h-5 text-orange-600 dark:text-orange-400" />
              <div>
                <h3 className="font-semibold text-orange-800 dark:text-orange-200">
                  Administrative Privileges Active
                </h3>
                <p className="text-orange-700 dark:text-orange-300 text-sm">
                  You have full access to platform data. Please use these tools
                  responsibly.
                </p>
              </div>
            </div>
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
            title="Total Users"
            value={totalUsers}
            icon={<Users className="w-6 h-6 text-blue-600" />}
            trend="+12% this month"
            color="bg-blue-100 dark:bg-blue-900/30"
          />
          <StatCard
            title="Businesses"
            value={totalBusinesses}
            icon={<Building2 className="w-6 h-6 text-green-600" />}
            trend="+8% this month"
            color="bg-green-100 dark:bg-green-900/30"
          />
          <StatCard
            title="Total Bookings"
            value={totalBookings}
            icon={<Calendar className="w-6 h-6 text-orange-600" />}
            trend="+25% this month"
            color="bg-orange-100 dark:bg-orange-900/30"
          />
          <StatCard
            title="Active Queues"
            value={activeBookings}
            icon={<TrendingUp className="w-6 h-6 text-purple-600" />}
            trend="Live count"
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
            id="users"
            label="Users"
            icon={<Users className="w-4 h-4" />}
          />
          <TabButton
            id="businesses"
            label="Businesses"
            icon={<Building2 className="w-4 h-4" />}
          />
          <TabButton
            id="bookings"
            label="Bookings"
            icon={<Calendar className="w-4 h-4" />}
          />
          <TabButton
            id="analytics"
            label="Analytics"
            icon={<TrendingUp className="w-4 h-4" />}
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
              {/* Recent Activity */}
              <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 dark:border-gray-700/20 p-6">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                  Recent Activity
                </h3>
                <div className="space-y-4">
                  {recentActivity.map((activity, index) => (
                    <div
                      key={index}
                      className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg"
                    >
                      {activity.type === "user" ? (
                        <Users className="w-4 h-4 text-blue-500" />
                      ) : (
                        <Building2 className="w-4 h-4 text-green-500" />
                      )}
                      <div className="flex-1">
                        <p className="text-sm">
                          <span className="font-medium">{activity.entity}</span>{" "}
                          {activity.action}
                        </p>
                        <p className="text-xs text-gray-500">
                          {activity.date.toLocaleDateString()}
                        </p>
                      </div>
                      <span className="px-2 py-1 bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 text-xs rounded-full">
                        {activity.type}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Business Categories */}
              <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 dark:border-gray-700/20 p-6">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                  Business Categories
                </h3>
                <div className="space-y-3">
                  {businessesByCategory.map((cat) => (
                    <div
                      key={cat.category}
                      className="flex items-center justify-between"
                    >
                      <div className="flex items-center space-x-2">
                        <span className="text-lg">{cat.icon}</span>
                        <span className="text-sm">{cat.category}</span>
                      </div>
                      <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm rounded-full">
                        {cat.count}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* User Distribution */}
              <div className="lg:col-span-2 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 dark:border-gray-700/20 p-6">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                  User Distribution
                </h3>
                <div className="grid grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                      {usersByRole.user}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      Customers
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-600 dark:text-green-400">
                      {usersByRole.business}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      Business Owners
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-red-600 dark:text-red-400">
                      {usersByRole.admin}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      Administrators
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "users" && (
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 dark:border-gray-700/20 p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                  User Management ({totalUsers})
                </h3>
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="text"
                      placeholder="Search users..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white w-64"
                    />
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Download className="w-4 h-4" />
                    <span>Export</span>
                  </motion.button>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200 dark:border-gray-600">
                      <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">
                        Name
                      </th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">
                        Email
                      </th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">
                        Role
                      </th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">
                        Joined
                      </th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.slice(0, 10).map((user) => (
                      <tr
                        key={user.id}
                        className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50"
                      >
                        <td className="py-3 px-4">
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-xs font-semibold">
                              {user.name.charAt(0).toUpperCase()}
                            </div>
                            <span className="font-medium">{user.name}</span>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-gray-600 dark:text-gray-400">
                          {user.email}
                        </td>
                        <td className="py-3 px-4">
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${
                              user.role === "admin"
                                ? "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300"
                                : user.role === "business"
                                  ? "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300"
                                  : "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300"
                            }`}
                          >
                            {user.role}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-gray-600 dark:text-gray-400">
                          {new Date(user.createdAt).toLocaleDateString()}
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex space-x-2">
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded"
                            >
                              <Eye className="w-4 h-4" />
                            </motion.button>
                            {user.role !== "admin" && (
                              <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => handleDeleteUser(user.id)}
                                className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded"
                              >
                                <Trash2 className="w-4 h-4" />
                              </motion.button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === "businesses" && (
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 dark:border-gray-700/20 p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Business Management ({totalBusinesses})
                </h3>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Search businesses..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white w-64"
                  />
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200 dark:border-gray-600">
                      <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">
                        Business
                      </th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">
                        Category
                      </th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">
                        Rating
                      </th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">
                        Status
                      </th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredBusinesses.slice(0, 10).map((business) => {
                      const category = BUSINESS_CATEGORIES.find(
                        (c) => c.value === business.category,
                      );
                      return (
                        <tr
                          key={business.id}
                          className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50"
                        >
                          <td className="py-3 px-4">
                            <div>
                              <div className="font-medium">{business.name}</div>
                              <div className="text-sm text-gray-600 dark:text-gray-400">
                                {business.address}
                              </div>
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex items-center space-x-1">
                              <span>{category?.icon}</span>
                              <span className="text-sm">{category?.label}</span>
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex items-center space-x-1">
                              <span className="font-medium">
                                {business.rating.toFixed(1)}
                              </span>
                              <span className="text-gray-500 text-sm">
                                ({business.totalReviews})
                              </span>
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-medium ${
                                business.isAcceptingBookings
                                  ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
                                  : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300"
                              }`}
                            >
                              {business.isAcceptingBookings
                                ? "Active"
                                : "Inactive"}
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex space-x-2">
                              <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded"
                              >
                                <Eye className="w-4 h-4" />
                              </motion.button>
                              <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() =>
                                  handleDeleteBusiness(business.id)
                                }
                                className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded"
                              >
                                <Trash2 className="w-4 h-4" />
                              </motion.button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === "bookings" && (
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 dark:border-gray-700/20 p-6">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                Recent Bookings ({totalBookings})
              </h3>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200 dark:border-gray-600">
                      <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">
                        Token
                      </th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">
                        Customer
                      </th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">
                        Business
                      </th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">
                        Status
                      </th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">
                        Date
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {mockBookings.slice(0, 15).map((booking) => {
                      const business = mockBusinesses.find(
                        (b) => b.id === booking.businessId,
                      );
                      return (
                        <tr
                          key={booking.id}
                          className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50"
                        >
                          <td className="py-3 px-4 font-medium">
                            #{booking.tokenNumber}
                          </td>
                          <td className="py-3 px-4">{booking.customerName}</td>
                          <td className="py-3 px-4">
                            {business?.name || "Unknown"}
                          </td>
                          <td className="py-3 px-4">
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${
                                booking.status === "completed"
                                  ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
                                  : booking.status === "cancelled"
                                    ? "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300"
                                    : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300"
                              }`}
                            >
                              {booking.status}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-gray-600 dark:text-gray-400">
                            {new Date(booking.bookedAt).toLocaleDateString()}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === "analytics" && (
            <div className="grid lg:grid-cols-2 gap-8">
              <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 dark:border-gray-700/20 p-6">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center">
                  <BarChart3 className="w-6 h-6 mr-3" />
                  Platform Metrics
                </h3>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <h4 className="font-medium">Growth Rate</h4>
                      <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                        +18%
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Monthly user growth
                      </p>
                    </div>
                    <div className="space-y-2">
                      <h4 className="font-medium">Retention</h4>
                      <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                        89%
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        User retention rate
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-medium">Popular Categories</h4>
                    <div className="space-y-1">
                      {businessesByCategory.slice(0, 3).map((cat) => (
                        <div
                          key={cat.category}
                          className="flex justify-between text-sm"
                        >
                          <span>{cat.category}</span>
                          <span className="font-medium">
                            {cat.count} businesses
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 dark:border-gray-700/20 p-6">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                  System Health
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span>API Response Time</span>
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span className="text-sm">142ms</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span>Database Performance</span>
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span className="text-sm">Optimal</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span>Server Uptime</span>
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span className="text-sm">99.9%</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span>Active Connections</span>
                    <span className="text-sm font-medium">
                      {activeBookings} users
                    </span>
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

export default AdminDashboard;
