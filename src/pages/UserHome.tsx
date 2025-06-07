import React, { useState, useEffect, useMemo } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Badge } from "../components/ui/badge";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { Switch } from "../components/ui/switch";
import { Slider } from "../components/ui/slider";
import {
  Search,
  Filter,
  MapPin,
  Star,
  Clock,
  Users,
  SlidersHorizontal,
  Grid3X3,
  List,
  Bookmark,
  TrendingUp,
  Eye,
  Navigation,
} from "lucide-react";
import { EnhancedBusinessCard } from "../components/EnhancedBusinessCard";
import { LocationSearch } from "../components/LocationSearch";
import { CategoryFilter } from "../components/CategoryFilter";
import {
  mockBusinesses,
  BUSINESS_CATEGORIES,
  getBookingsByUserId,
} from "../data/mockData";
import { useAuth } from "../contexts/AuthContext";
import { useNotifications } from "../contexts/NotificationContext";
import { Business, BusinessCategory, SearchFilters } from "../types";
import { cn } from "../lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

const UserHome: React.FC = () => {
  const { user } = useAuth();
  const { addNotification } = useNotifications();
  const [businesses, setBusinesses] = useState<Business[]>(mockBusinesses);
  const [filteredBusinesses, setFilteredBusinesses] =
    useState<Business[]>(mockBusinesses);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<
    BusinessCategory | "all"
  >("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showFilters, setShowFilters] = useState(false);
  const [bookmarkedBusinesses, setBookmarkedBusinesses] = useState<string[]>(
    user?.bookmarks || [],
  );
  const [recentlyViewed, setRecentlyViewed] = useState<string[]>([]);

  // Advanced filters
  const [filters, setFilters] = useState<SearchFilters>({
    openNow: false,
    rating: 0,
    sortBy: "distance",
    radius: 10,
  });

  // Auto-detect location on component mount
  useEffect(() => {
    if (navigator.geolocation && !selectedLocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          // Mock reverse geocoding
          setSelectedLocation(
            `${latitude.toFixed(2)}, ${longitude.toFixed(2)}`,
          );

          addNotification({
            userId: user?.id || "",
            type: "system_update",
            title: "Location Detected",
            message:
              "We found your location and are showing nearby businesses.",
            isRead: false,
          });
        },
        (error) => {
          console.log("Location detection failed:", error);
        },
      );
    }
  }, [selectedLocation, user, addNotification]);

  // Filter businesses based on search criteria
  useEffect(() => {
    let filtered = [...businesses];

    // Text search
    if (searchQuery) {
      filtered = filtered.filter(
        (business) =>
          business.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          business.description
            ?.toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          business.address.toLowerCase().includes(searchQuery.toLowerCase()),
      );
    }

    // Category filter
    if (selectedCategory !== "all") {
      filtered = filtered.filter(
        (business) => business.category === selectedCategory,
      );
    }

    // Location filter (mock implementation)
    if (selectedLocation) {
      // In a real app, this would calculate actual distance
      filtered = filtered.slice(); // Keep all for demo
    }

    // Rating filter
    if (filters.rating > 0) {
      filtered = filtered.filter(
        (business) => business.rating >= filters.rating,
      );
    }

    // Open now filter
    if (filters.openNow) {
      filtered = filtered.filter((business) => isBusinessOpen(business));
    }

    // Sort businesses
    filtered.sort((a, b) => {
      switch (filters.sortBy) {
        case "rating":
          return b.rating - a.rating;
        case "wait_time":
          return getAverageWaitTime(a) - getAverageWaitTime(b);
        case "popularity":
          return b.totalReviews - a.totalReviews;
        case "distance":
        default:
          return 0; // Mock sorting
      }
    });

    setFilteredBusinesses(filtered);
  }, [businesses, searchQuery, selectedCategory, selectedLocation, filters]);

  const isBusinessOpen = (business: Business) => {
    const now = new Date();
    const dayOfWeek = now
      .toLocaleDateString("en-US", { weekday: "long" })
      .toLowerCase();
    const currentTime = now.toTimeString().slice(0, 5);

    const todayHours = business.openingHours[dayOfWeek];
    if (!todayHours || todayHours.closed) return false;

    return currentTime >= todayHours.start && currentTime <= todayHours.end;
  };

  const getAverageWaitTime = (business: Business) => {
    return (
      business.departments.reduce(
        (total, dept) => total + dept.estimatedWaitTime,
        0,
      ) / business.departments.length
    );
  };

  const handleBookmarkToggle = (businessId: string) => {
    setBookmarkedBusinesses((prev) => {
      const isBookmarked = prev.includes(businessId);
      const updated = isBookmarked
        ? prev.filter((id) => id !== businessId)
        : [...prev, businessId];

      toast.success(
        isBookmarked ? "Removed from bookmarks" : "Added to bookmarks",
      );
      return updated;
    });
  };

  const handleLocationSelect = (location: string) => {
    setSelectedLocation(location);
    toast.success(`Location set to ${location}`);
  };

  const clearAllFilters = () => {
    setSearchQuery("");
    setSelectedCategory("all");
    setFilters({
      openNow: false,
      rating: 0,
      sortBy: "distance",
      radius: 10,
    });
    toast.success("All filters cleared");
  };

  // Get trending and recommended businesses
  const trendingBusinesses = useMemo(() => {
    return businesses
      .filter((business) => business.totalReviews > 500)
      .sort((a, b) => b.rating - a.rating)
      .slice(0, 3);
  }, [businesses]);

  const recentlyViewedBusinesses = useMemo(() => {
    return businesses.filter((business) =>
      recentlyViewed.includes(business.id),
    );
  }, [businesses, recentlyViewed]);

  const bookmarkedBusinessData = useMemo(() => {
    return businesses.filter((business) =>
      bookmarkedBusinesses.includes(business.id),
    );
  }, [businesses, bookmarkedBusinesses]);

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="relative bg-gradient-primary text-white py-16">
        <div className="absolute inset-0 pattern-dots opacity-10" />
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <h1 className="text-4xl md:text-6xl font-bold mb-4">
              Skip the Wait, Not the Care
            </h1>
            <p className="text-xl md:text-2xl opacity-90 max-w-2xl mx-auto">
              Book your spot in line at hospitals, salons, banks, and more.
              Real-time queue tracking at your fingertips.
            </p>
          </motion.div>

          {/* Search Bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="max-w-4xl mx-auto"
          >
            <Card className="glass-strong border-0 shadow-2xl">
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Search Input */}
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                    <Input
                      placeholder="Search businesses, services..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 h-12 form-input"
                    />
                  </div>

                  {/* Location Search */}
                  <LocationSearch
                    onLocationSelect={handleLocationSelect}
                    placeholder="Your location"
                    className="h-12"
                  />

                  {/* Search Button */}
                  <Button
                    className="h-12 btn-gradient"
                    onClick={() => toast.success("Search updated!")}
                  >
                    <Search className="w-4 h-4 mr-2" />
                    Find Businesses
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Category Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-8"
        >
          <CategoryFilter
            categories={BUSINESS_CATEGORIES}
            selectedCategory={selectedCategory}
            onCategorySelect={setSelectedCategory}
          />
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Advanced Filters */}
            <Card className="glass-strong border-0">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <SlidersHorizontal className="w-4 h-4" />
                    Filters
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearAllFilters}
                    className="text-xs"
                  >
                    Clear All
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Open Now Toggle */}
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium">Open Now</label>
                  <Switch
                    checked={filters.openNow}
                    onCheckedChange={(checked) =>
                      setFilters((prev) => ({ ...prev, openNow: checked }))
                    }
                  />
                </div>

                {/* Rating Filter */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Minimum Rating</label>
                  <div className="flex items-center gap-2">
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <Slider
                      value={[filters.rating]}
                      onValueChange={([value]) =>
                        setFilters((prev) => ({ ...prev, rating: value }))
                      }
                      max={5}
                      min={0}
                      step={0.5}
                      className="flex-1"
                    />
                    <span className="text-sm font-medium w-8">
                      {filters.rating}+
                    </span>
                  </div>
                </div>

                {/* Distance Filter */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Distance</label>
                  <div className="flex items-center gap-2">
                    <Navigation className="w-4 h-4 text-muted-foreground" />
                    <Slider
                      value={[filters.radius || 10]}
                      onValueChange={([value]) =>
                        setFilters((prev) => ({ ...prev, radius: value }))
                      }
                      max={50}
                      min={1}
                      step={1}
                      className="flex-1"
                    />
                    <span className="text-sm font-medium w-12">
                      {filters.radius}km
                    </span>
                  </div>
                </div>

                {/* Sort By */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Sort By</label>
                  <Select
                    value={filters.sortBy}
                    onValueChange={(value: any) =>
                      setFilters((prev) => ({ ...prev, sortBy: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="distance">Distance</SelectItem>
                      <SelectItem value="rating">Rating</SelectItem>
                      <SelectItem value="wait_time">Wait Time</SelectItem>
                      <SelectItem value="popularity">Popularity</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card className="glass-strong border-0">
              <CardHeader>
                <CardTitle className="text-lg">Your Activity</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Bookmarks</span>
                  <Badge variant="secondary">
                    {bookmarkedBusinesses.length}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Recent Bookings</span>
                  <Badge variant="secondary">
                    {getBookingsByUserId(user?.id || "").length}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Recently Viewed</span>
                  <Badge variant="secondary">{recentlyViewed.length}</Badge>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6">
            {/* Results Header */}
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-semibold">
                  {selectedCategory === "all"
                    ? "All Businesses"
                    : BUSINESS_CATEGORIES.find(
                        (cat) => cat.value === selectedCategory,
                      )?.label}
                </h2>
                <p className="text-muted-foreground">
                  {filteredBusinesses.length} businesses found
                  {selectedLocation && ` near ${selectedLocation}`}
                </p>
              </div>

              {/* View Mode Toggle */}
              <div className="flex items-center gap-2">
                <Button
                  variant={viewMode === "grid" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("grid")}
                >
                  <Grid3X3 className="w-4 h-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("list")}
                >
                  <List className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Special Sections */}
            <Tabs defaultValue="all" className="w-full">
              <TabsList className="grid w-full grid-cols-4 glass">
                <TabsTrigger value="all">
                  All ({filteredBusinesses.length})
                </TabsTrigger>
                <TabsTrigger value="trending">
                  Trending ({trendingBusinesses.length})
                </TabsTrigger>
                <TabsTrigger value="bookmarks">
                  Bookmarks ({bookmarkedBusinessData.length})
                </TabsTrigger>
                <TabsTrigger value="recent">
                  Recent ({recentlyViewedBusinesses.length})
                </TabsTrigger>
              </TabsList>

              <TabsContent value="all" className="mt-6">
                <BusinessGrid
                  businesses={filteredBusinesses}
                  viewMode={viewMode}
                  bookmarkedBusinesses={bookmarkedBusinesses}
                  onBookmarkToggle={handleBookmarkToggle}
                />
              </TabsContent>

              <TabsContent value="trending" className="mt-6">
                <div className="mb-4 p-4 rounded-lg bg-gradient-secondary/10 border border-pink-200 dark:border-pink-800">
                  <div className="flex items-center gap-2 text-pink-700 dark:text-pink-300 mb-1">
                    <TrendingUp className="w-4 h-4" />
                    <span className="font-medium">Trending Now</span>
                  </div>
                  <p className="text-sm text-pink-600 dark:text-pink-400">
                    Most popular businesses based on reviews and bookings
                  </p>
                </div>
                <BusinessGrid
                  businesses={trendingBusinesses}
                  viewMode={viewMode}
                  bookmarkedBusinesses={bookmarkedBusinesses}
                  onBookmarkToggle={handleBookmarkToggle}
                />
              </TabsContent>

              <TabsContent value="bookmarks" className="mt-6">
                {bookmarkedBusinessData.length > 0 ? (
                  <BusinessGrid
                    businesses={bookmarkedBusinessData}
                    viewMode={viewMode}
                    bookmarkedBusinesses={bookmarkedBusinesses}
                    onBookmarkToggle={handleBookmarkToggle}
                  />
                ) : (
                  <div className="text-center py-12">
                    <Bookmark className="w-16 h-16 mx-auto mb-4 text-muted-foreground/50" />
                    <h3 className="text-lg font-medium text-muted-foreground mb-2">
                      No bookmarks yet
                    </h3>
                    <p className="text-sm text-muted-foreground/75">
                      Bookmark businesses to save them for later
                    </p>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="recent" className="mt-6">
                {recentlyViewedBusinesses.length > 0 ? (
                  <BusinessGrid
                    businesses={recentlyViewedBusinesses}
                    viewMode={viewMode}
                    bookmarkedBusinesses={bookmarkedBusinesses}
                    onBookmarkToggle={handleBookmarkToggle}
                  />
                ) : (
                  <div className="text-center py-12">
                    <Eye className="w-16 h-16 mx-auto mb-4 text-muted-foreground/50" />
                    <h3 className="text-lg font-medium text-muted-foreground mb-2">
                      No recent views
                    </h3>
                    <p className="text-sm text-muted-foreground/75">
                      Businesses you view will appear here
                    </p>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
};

// Business Grid Component
interface BusinessGridProps {
  businesses: Business[];
  viewMode: "grid" | "list";
  bookmarkedBusinesses: string[];
  onBookmarkToggle: (businessId: string) => void;
}

const BusinessGrid: React.FC<BusinessGridProps> = ({
  businesses,
  viewMode,
  bookmarkedBusinesses,
  onBookmarkToggle,
}) => {
  if (businesses.length === 0) {
    return (
      <div className="text-center py-12">
        <Search className="w-16 h-16 mx-auto mb-4 text-muted-foreground/50" />
        <h3 className="text-lg font-medium text-muted-foreground mb-2">
          No businesses found
        </h3>
        <p className="text-sm text-muted-foreground/75">
          Try adjusting your search criteria or filters
        </p>
      </div>
    );
  }

  return (
    <motion.div
      className={cn(
        "grid gap-6",
        viewMode === "grid"
          ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3"
          : "grid-cols-1",
      )}
      layout
    >
      <AnimatePresence>
        {businesses.map((business, index) => (
          <motion.div
            key={business.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ delay: index * 0.05 }}
          >
            <EnhancedBusinessCard
              business={business}
              isBookmarked={bookmarkedBusinesses.includes(business.id)}
              onBookmarkToggle={onBookmarkToggle}
              variant={viewMode === "list" ? "compact" : "default"}
            />
          </motion.div>
        ))}
      </AnimatePresence>
    </motion.div>
  );
};

export default UserHome;
