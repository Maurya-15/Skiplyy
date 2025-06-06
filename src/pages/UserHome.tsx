import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LocationSearch } from "@/components/LocationSearch";
import { CategoryFilter } from "@/components/CategoryFilter";
import { BusinessCard } from "@/components/BusinessCard";
import { useApp } from "@/contexts/AppContext";
import { useAuth } from "@/contexts/AuthContext";
import { Search, MapPin, Filter, Clock, Calendar } from "lucide-react";
import { motion } from "framer-motion";

export default function UserHome() {
  const { user } = useAuth();
  const {
    businesses,
    userBookings,
    selectedLocation,
    selectedCategory,
    isLoading,
  } = useApp();
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  const filteredBusinesses = businesses.filter(
    (business) =>
      business.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      business.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
      business.description?.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const activeBookings = userBookings.filter(
    (booking) =>
      booking.status === "waiting" || booking.status === "in-progress",
  );

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50/50 via-white to-purple-50/50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-foreground">
                {getGreeting()}, {user?.name}! 👋
              </h1>
              <p className="text-muted-foreground mt-1">
                Find and book your spot in queues near you
              </p>
            </div>
            <div className="text-right">
              <div className="flex items-center text-sm text-muted-foreground">
                <MapPin className="w-4 h-4 mr-1" />
                {selectedLocation}
              </div>
            </div>
          </div>

          {/* Active Bookings */}
          {activeBookings.length > 0 && (
            <Card className="mb-6 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20 border-blue-200 dark:border-blue-800">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center text-blue-700 dark:text-blue-300">
                  <Clock className="w-5 h-5 mr-2" />
                  Your Active Bookings ({activeBookings.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-3">
                  {activeBookings.slice(0, 2).map((booking) => (
                    <div
                      key={booking.id}
                      className="flex items-center justify-between p-3 bg-white/50 dark:bg-gray-800/50 rounded-lg border"
                    >
                      <div>
                        <p className="font-medium">
                          Token #{booking.tokenNumber}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {
                            businesses.find((b) => b.id === booking.businessId)
                              ?.name
                          }
                        </p>
                      </div>
                      <div className="text-right">
                        <Badge
                          variant={
                            booking.status === "waiting"
                              ? "secondary"
                              : "default"
                          }
                        >
                          {booking.status}
                        </Badge>
                        <p className="text-xs text-muted-foreground mt-1">
                          ~{booking.estimatedWaitTime} min wait
                        </p>
                      </div>
                    </div>
                  ))}
                  {activeBookings.length > 2 && (
                    <Button variant="ghost" size="sm" className="mt-2">
                      View all active bookings ({activeBookings.length})
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </motion.div>

        {/* Search and Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-8"
        >
          <Card className="bg-card/50 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="space-y-4">
                {/* Search Bar */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder="Search businesses, services, or locations..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9 pr-4 h-12"
                  />
                </div>

                {/* Filters Row */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
                  <div className="flex-1">
                    <label className="text-sm font-medium text-foreground block mb-2">
                      Location
                    </label>
                    <LocationSearch />
                  </div>

                  <div className="flex-1">
                    <label className="text-sm font-medium text-foreground block mb-2">
                      Category
                    </label>
                    <CategoryFilter />
                  </div>

                  <Button
                    variant="outline"
                    onClick={() => setShowFilters(!showFilters)}
                    className="sm:mt-6"
                  >
                    <Filter className="w-4 h-4 mr-2" />
                    More Filters
                  </Button>
                </div>

                {/* Advanced Filters */}
                {showFilters && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="pt-4 border-t space-y-4"
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <label className="text-sm font-medium text-foreground block mb-2">
                          Max Wait Time
                        </label>
                        <select className="w-full p-2 border rounded-md">
                          <option value="">Any</option>
                          <option value="15">Under 15 min</option>
                          <option value="30">Under 30 min</option>
                          <option value="60">Under 1 hour</option>
                        </select>
                      </div>

                      <div>
                        <label className="text-sm font-medium text-foreground block mb-2">
                          Rating
                        </label>
                        <select className="w-full p-2 border rounded-md">
                          <option value="">Any</option>
                          <option value="4">4+ stars</option>
                          <option value="4.5">4.5+ stars</option>
                        </select>
                      </div>

                      <div>
                        <label className="text-sm font-medium text-foreground block mb-2">
                          Availability
                        </label>
                        <select className="w-full p-2 border rounded-md">
                          <option value="">All</option>
                          <option value="accepting">Accepting bookings</option>
                          <option value="low-queue">Low queue</option>
                        </select>
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Results Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-semibold text-foreground">
                Available Services
              </h2>
              <p className="text-muted-foreground">
                {filteredBusinesses.length} businesses found
                {searchQuery && ` for "${searchQuery}"`}
              </p>
            </div>

            <div className="flex items-center space-x-2">
              <span className="text-sm text-muted-foreground">Sort by:</span>
              <select className="text-sm border rounded px-3 py-1">
                <option value="relevance">Relevance</option>
                <option value="rating">Rating</option>
                <option value="wait-time">Wait Time</option>
                <option value="distance">Distance</option>
              </select>
            </div>
          </div>

          {/* Business Grid */}
          {isLoading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <Card key={i} className="h-80 animate-pulse bg-muted/50" />
              ))}
            </div>
          ) : filteredBusinesses.length > 0 ? (
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
            <Card className="p-12 text-center">
              <div className="space-y-4">
                <div className="text-6xl">🔍</div>
                <h3 className="text-xl font-semibold text-foreground">
                  No businesses found
                </h3>
                <p className="text-muted-foreground max-w-md mx-auto">
                  We couldn't find any businesses matching your criteria. Try
                  adjusting your filters or search in a different location.
                </p>
                <Button
                  variant="outline"
                  onClick={() => {
                    setSearchQuery("");
                    setShowFilters(false);
                  }}
                >
                  Clear Filters
                </Button>
              </div>
            </Card>
          )}
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-12"
        >
          <Card className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-950/20 dark:to-blue-950/20">
            <CardContent className="p-6">
              <div className="flex flex-col sm:flex-row items-center justify-between">
                <div className="mb-4 sm:mb-0">
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    Quick Actions
                  </h3>
                  <p className="text-muted-foreground">
                    Manage your bookings and preferences
                  </p>
                </div>
                <div className="flex space-x-3">
                  <Button variant="outline">
                    <Calendar className="w-4 h-4 mr-2" />
                    My Bookings
                  </Button>
                  <Button>
                    <MapPin className="w-4 h-4 mr-2" />
                    Change Location
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
