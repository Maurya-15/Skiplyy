import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { QueueBookingModal } from "@/components/QueueBookingModal";
import { businessAPI } from "@/lib/api";
import { Business, QueueBooking } from "@/lib/types";
import { BUSINESS_CATEGORIES } from "@/lib/constants";
import {
  Star,
  MapPin,
  Clock,
  Users,
  Phone,
  Globe,
  Calendar,
  ArrowLeft,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { motion } from "framer-motion";

export default function BusinessDetail() {
  const { id } = useParams<{ id: string }>();
  const [business, setBusiness] = useState<Business | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);

  useEffect(() => {
    const loadBusiness = async () => {
      if (!id) return;

      setIsLoading(true);
      try {
        const businessData = await businessAPI.getById(id);
        setBusiness(businessData);
      } catch (error) {
        console.error("Failed to load business:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadBusiness();
  }, [id]);

  const handleBookingSuccess = (booking: QueueBooking) => {
    // Could show success toast or redirect
    console.log("Booking successful:", booking);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!business) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="p-12 text-center max-w-md">
          <div className="space-y-4">
            <div className="text-6xl">😔</div>
            <h2 className="text-xl font-semibold">Business Not Found</h2>
            <p className="text-muted-foreground">
              The business you're looking for doesn't exist or has been removed.
            </p>
            <Button asChild>
              <Link to="/home">Back to Home</Link>
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  const category = BUSINESS_CATEGORIES.find(
    (c) => c.value === business.category,
  );
  const totalQueueSize = business.departments.reduce(
    (sum, dept) => sum + dept.currentQueueSize,
    0,
  );
  const averageWaitTime =
    business.departments.length > 0
      ? Math.round(
          business.departments.reduce(
            (sum, dept) => sum + dept.estimatedWaitTime,
            0,
          ) / business.departments.length,
        )
      : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50/50 via-white to-purple-50/50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
          className="mb-6"
        >
          <Button variant="ghost" asChild>
            <Link to="/home">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Search
            </Link>
          </Button>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Business Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Card className="overflow-hidden bg-card/50 backdrop-blur-sm">
                <div className="h-48 bg-gradient-to-r from-blue-500 to-purple-600 relative">
                  <div className="absolute inset-0 bg-black/20"></div>
                  <div className="absolute bottom-4 left-6 text-white">
                    <div className="flex items-center space-x-3 mb-2">
                      <span className="text-3xl">{category?.icon}</span>
                      <Badge
                        variant="secondary"
                        className="bg-white/20 text-white border-white/30"
                      >
                        {category?.label}
                      </Badge>
                    </div>
                    <h1 className="text-3xl font-bold">{business.name}</h1>
                  </div>
                </div>

                <CardContent className="p-6">
                  <div className="space-y-4">
                    {/* Rating and Location */}
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-1">
                          <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                          <span className="font-semibold text-lg">
                            {business.rating.toFixed(1)}
                          </span>
                          <span className="text-muted-foreground">
                            ({business.totalReviews} reviews)
                          </span>
                        </div>
                        <div className="flex items-center space-x-1 text-muted-foreground">
                          <MapPin className="w-4 h-4" />
                          <span className="text-sm">{business.address}</span>
                        </div>
                      </div>

                      <div className="flex items-center space-x-4 text-sm">
                        <div className="flex items-center space-x-1">
                          <Users className="w-4 h-4 text-blue-500" />
                          <span>{totalQueueSize} in queue</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Clock className="w-4 h-4 text-green-500" />
                          <span>~{averageWaitTime} min wait</span>
                        </div>
                      </div>
                    </div>

                    {/* Description */}
                    {business.description && (
                      <div>
                        <p className="text-muted-foreground">
                          {business.description}
                        </p>
                      </div>
                    )}

                    {/* Status */}
                    <div className="flex items-center justify-between">
                      <div
                        className={`flex items-center space-x-2 ${
                          business.isAcceptingBookings
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      >
                        {business.isAcceptingBookings ? (
                          <CheckCircle className="w-5 h-5" />
                        ) : (
                          <XCircle className="w-5 h-5" />
                        )}
                        <span className="font-medium">
                          {business.isAcceptingBookings
                            ? "Accepting Bookings"
                            : "Closed for Bookings"}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Departments/Services */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Card className="bg-card/50 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Calendar className="w-5 h-5 mr-2" />
                    Available Services
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {business.departments.map((department, index) => (
                      <motion.div
                        key={department.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                        className={`p-4 border rounded-lg transition-colors ${
                          department.isActive &&
                          department.currentQueueSize < department.maxQueueSize
                            ? "hover:bg-accent cursor-pointer border-border"
                            : "opacity-50 border-muted"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <h3 className="font-semibold text-lg">
                              {department.name}
                            </h3>
                            <div className="flex items-center space-x-4 mt-2">
                              <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                                <Clock className="w-3 h-3" />
                                <span>
                                  {department.estimatedWaitTime} min wait
                                </span>
                              </div>
                              <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                                <Users className="w-3 h-3" />
                                <span>
                                  {department.currentQueueSize}/
                                  {department.maxQueueSize} spots
                                </span>
                              </div>
                            </div>
                          </div>

                          <div className="text-right">
                            {department.isActive ? (
                              department.currentQueueSize <
                              department.maxQueueSize ? (
                                <Badge
                                  variant="default"
                                  className="bg-green-100 text-green-800 border-green-200"
                                >
                                  Available
                                </Badge>
                              ) : (
                                <Badge variant="destructive">Full</Badge>
                              )
                            ) : (
                              <Badge variant="secondary">Closed</Badge>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Contact Info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <Card className="bg-card/50 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle>Contact Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <MapPin className="w-4 h-4 text-muted-foreground" />
                      <span>{business.address}</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Phone className="w-4 h-4 text-muted-foreground" />
                      <span>+1 (555) 123-4567</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Globe className="w-4 h-4 text-muted-foreground" />
                      <span>www.business-website.com</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Booking Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <Card className="sticky top-24 bg-card/50 backdrop-blur-sm">
                <CardHeader className="text-center">
                  <CardTitle className="text-xl">Book Your Spot</CardTitle>
                  <p className="text-muted-foreground">
                    Skip the wait and reserve your place in line
                  </p>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center space-y-2">
                    <div className="text-3xl font-bold text-primary">
                      ~{averageWaitTime} min
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Average wait time
                    </p>
                  </div>

                  <Separator />

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>People in queue:</span>
                      <span className="font-medium">{totalQueueSize}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Available services:</span>
                      <span className="font-medium">
                        {business.departments.filter((d) => d.isActive).length}
                      </span>
                    </div>
                  </div>

                  <Button
                    className="w-full"
                    size="lg"
                    onClick={() => setIsBookingModalOpen(true)}
                    disabled={
                      !business.isAcceptingBookings ||
                      business.departments.every(
                        (d) =>
                          !d.isActive || d.currentQueueSize >= d.maxQueueSize,
                      )
                    }
                  >
                    {!business.isAcceptingBookings
                      ? "Closed for Bookings"
                      : business.departments.every(
                            (d) =>
                              !d.isActive ||
                              d.currentQueueSize >= d.maxQueueSize,
                          )
                        ? "All Services Full"
                        : "Book My Spot"}
                  </Button>

                  <p className="text-xs text-muted-foreground text-center">
                    No booking fees • Cancel anytime
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            {/* Recent Reviews */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              <Card className="bg-card/50 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-lg">Recent Reviews</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      {
                        name: "Sarah M.",
                        rating: 5,
                        comment:
                          "Great service! The queue system saved me so much time.",
                      },
                      {
                        name: "John D.",
                        rating: 4,
                        comment: "Very organized and professional staff.",
                      },
                      {
                        name: "Emily R.",
                        rating: 5,
                        comment:
                          "Love being able to book ahead. Highly recommend!",
                      },
                    ].map((review, index) => (
                      <div key={index} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="font-medium text-sm">
                            {review.name}
                          </span>
                          <div className="flex items-center">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`w-3 h-3 ${
                                  i < review.rating
                                    ? "fill-yellow-400 text-yellow-400"
                                    : "text-gray-300"
                                }`}
                              />
                            ))}
                          </div>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {review.comment}
                        </p>
                        {index < 2 && <Separator className="my-3" />}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Booking Modal */}
      <QueueBookingModal
        business={business}
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
        onSuccess={handleBookingSuccess}
      />
    </div>
  );
}
