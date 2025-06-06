import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { queueAPI, businessAPI } from "@/lib/api";
import { QueueStatus, Business, QueueBooking } from "@/lib/types";
import {
  Clock,
  Users,
  MapPin,
  Phone,
  CheckCircle,
  XCircle,
  RefreshCw,
  AlertTriangle,
} from "lucide-react";
import { motion } from "framer-motion";

export default function QueueTracker() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [queueStatus, setQueueStatus] = useState<QueueStatus | null>(null);
  const [business, setBusiness] = useState<Business | null>(null);
  const [booking, setBooking] = useState<QueueBooking | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  useEffect(() => {
    const loadQueueData = async () => {
      if (!id) return;

      setIsLoading(true);
      try {
        // In a real app, you'd get the booking first then the queue status
        const status = await queueAPI.getQueueStatus(id);
        setQueueStatus(status);
        setLastUpdated(new Date());

        // Mock booking data - in real app this would come from the API
        const mockBooking: QueueBooking = {
          id: id,
          userId: "user1",
          businessId: "1",
          departmentId: "d1",
          tokenNumber: status.tokenNumber,
          status: "waiting",
          estimatedWaitTime: status.estimatedWaitTime,
          bookedAt: new Date().toISOString(),
          userName: "John Doe",
          userPhone: "555-0123",
        };
        setBooking(mockBooking);

        // Load business data
        const businessData = await businessAPI.getById(mockBooking.businessId);
        setBusiness(businessData);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to load queue status",
        );
      } finally {
        setIsLoading(false);
      }
    };

    loadQueueData();

    // Set up auto-refresh every 30 seconds
    const interval = setInterval(loadQueueData, 30000);
    return () => clearInterval(interval);
  }, [id]);

  const handleCancelBooking = async () => {
    if (!booking) return;

    try {
      await queueAPI.cancelBooking(booking.id);
      navigate("/home");
    } catch (error) {
      console.error("Failed to cancel booking:", error);
    }
  };

  const handleRefresh = () => {
    setIsLoading(true);
    window.location.reload();
  };

  const getProgressPercentage = () => {
    if (!queueStatus) return 0;
    if (queueStatus.peopleAhead === 0) return 100;
    return Math.max(
      0,
      100 -
        (queueStatus.currentPosition /
          (queueStatus.peopleAhead + queueStatus.currentPosition)) *
          100,
    );
  };

  const getStatusColor = () => {
    if (!queueStatus) return "gray";
    if (queueStatus.currentPosition <= 1) return "green";
    if (queueStatus.currentPosition <= 3) return "yellow";
    return "blue";
  };

  const getStatusMessage = () => {
    if (!queueStatus) return "";
    if (queueStatus.currentPosition <= 1)
      return "It's almost your turn! Please be ready.";
    if (queueStatus.currentPosition <= 3)
      return "You're next in line! Please stay nearby.";
    return `You have ${queueStatus.peopleAhead} people ahead of you.`;
  };

  if (isLoading && !queueStatus) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground">Loading queue status...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <Card className="max-w-md p-8 text-center">
          <div className="space-y-4">
            <AlertTriangle className="w-16 h-16 text-red-500 mx-auto" />
            <h2 className="text-xl font-semibold">Error Loading Queue</h2>
            <p className="text-muted-foreground">{error}</p>
            <Button onClick={handleRefresh}>Try Again</Button>
          </div>
        </Card>
      </div>
    );
  }

  if (!queueStatus || !booking || !business) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <Card className="max-w-md p-8 text-center">
          <div className="space-y-4">
            <XCircle className="w-16 h-16 text-red-500 mx-auto" />
            <h2 className="text-xl font-semibold">Booking Not Found</h2>
            <p className="text-muted-foreground">
              The booking you're looking for doesn't exist or has been
              cancelled.
            </p>
            <Button onClick={() => navigate("/home")}>Back to Home</Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50/50 via-white to-purple-50/50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-2xl mx-auto space-y-6">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center space-y-2"
          >
            <h1 className="text-3xl font-bold text-foreground">
              Queue Tracker
            </h1>
            <p className="text-muted-foreground">
              Real-time updates for your booking
            </p>
          </motion.div>

          {/* Status Alert */}
          {queueStatus.currentPosition <= 1 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              <Alert className="border-green-200 bg-green-50 dark:bg-green-950/20">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-green-800 dark:text-green-200">
                  🎉 It's your turn! Please proceed to the service counter.
                </AlertDescription>
              </Alert>
            </motion.div>
          )}

          {/* Current Status Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Card className="overflow-hidden bg-card/50 backdrop-blur-sm">
              <CardHeader className="text-center bg-gradient-to-r from-blue-500 to-purple-600 text-white">
                <div className="space-y-2">
                  <div className="text-6xl font-bold">
                    #{queueStatus.tokenNumber}
                  </div>
                  <CardTitle className="text-xl">Your Token Number</CardTitle>
                </div>
              </CardHeader>

              <CardContent className="p-6 space-y-6">
                {/* Progress Bar */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span>Queue Progress</span>
                    <span className="font-medium">
                      {Math.round(getProgressPercentage())}%
                    </span>
                  </div>
                  <Progress value={getProgressPercentage()} className="h-3" />
                </div>

                {/* Current Position */}
                <div className="text-center space-y-2">
                  <div
                    className={`text-4xl font-bold ${
                      getStatusColor() === "green"
                        ? "text-green-600"
                        : getStatusColor() === "yellow"
                          ? "text-yellow-600"
                          : "text-blue-600"
                    }`}
                  >
                    Position #{queueStatus.currentPosition}
                  </div>
                  <p className="text-muted-foreground">{getStatusMessage()}</p>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 bg-muted/50 rounded-lg">
                    <Users className="w-6 h-6 mx-auto mb-2 text-blue-500" />
                    <div className="text-2xl font-bold">
                      {queueStatus.peopleAhead}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Ahead of you
                    </div>
                  </div>

                  <div className="text-center p-3 bg-muted/50 rounded-lg">
                    <Clock className="w-6 h-6 mx-auto mb-2 text-green-500" />
                    <div className="text-2xl font-bold">
                      {queueStatus.estimatedWaitTime}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Minutes left
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Business Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <Card className="bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MapPin className="w-5 h-5 mr-2" />
                  Business Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <h3 className="font-semibold text-lg">{business.name}</h3>
                  <p className="text-muted-foreground">{business.address}</p>
                </div>

                <div className="flex items-center space-x-3 text-sm">
                  <Phone className="w-4 h-4 text-muted-foreground" />
                  <span>+1 (555) 123-4567</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    Department:
                  </span>
                  <Badge variant="outline">
                    {
                      business.departments.find(
                        (d) => d.id === booking.departmentId,
                      )?.name
                    }
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Booking Details */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <Card className="bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle>Booking Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Booked for:</span>
                    <div className="font-medium">{booking.userName}</div>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Phone:</span>
                    <div className="font-medium">{booking.userPhone}</div>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Booked at:</span>
                    <div className="font-medium">
                      {new Date(booking.bookedAt).toLocaleTimeString()}
                    </div>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Status:</span>
                    <Badge variant="outline" className="ml-2">
                      {booking.status}
                    </Badge>
                  </div>
                </div>

                {booking.notes && (
                  <div>
                    <span className="text-muted-foreground text-sm">
                      Notes:
                    </span>
                    <p className="text-sm mt-1">{booking.notes}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="flex space-x-3"
          >
            <Button
              variant="outline"
              onClick={handleRefresh}
              disabled={isLoading}
              className="flex-1"
            >
              <RefreshCw
                className={`w-4 h-4 mr-2 ${isLoading ? "animate-spin" : ""}`}
              />
              Refresh
            </Button>

            <Button
              variant="destructive"
              onClick={handleCancelBooking}
              className="flex-1"
            >
              <XCircle className="w-4 h-4 mr-2" />
              Cancel Booking
            </Button>
          </motion.div>

          {/* Last Updated */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 1 }}
            className="text-center text-xs text-muted-foreground"
          >
            Last updated: {lastUpdated.toLocaleTimeString()}
          </motion.div>

          {/* Tips */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.2 }}
          >
            <Card className="bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800">
              <CardContent className="p-4">
                <h4 className="font-medium text-blue-800 dark:text-blue-200 mb-2">
                  💡 Tips
                </h4>
                <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
                  <li>• Stay nearby when you're in the top 3 positions</li>
                  <li>• Enable notifications to get alerts</li>
                  <li>• You can cancel your booking anytime if plans change</li>
                  <li>• This page refreshes automatically every 30 seconds</li>
                </ul>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
