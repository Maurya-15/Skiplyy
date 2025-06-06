import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/contexts/AuthContext";
import { useApp } from "@/contexts/AppContext";
import { businessAPI } from "@/lib/api";
import { Business } from "@/lib/types";
import { QUEUE_STATUS_COLORS } from "@/lib/constants";
import {
  User,
  MapPin,
  Phone,
  Mail,
  Calendar,
  Clock,
  Star,
  Eye,
  Edit3,
  History,
} from "lucide-react";
import { motion } from "framer-motion";

export default function UserProfile() {
  const { user } = useAuth();
  const { userBookings } = useApp();
  const [businesses, setBusinesses] = useState<{ [key: string]: Business }>({});
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    name: user?.name || "",
    phone: user?.phone || "",
    location: user?.location || "",
  });

  useEffect(() => {
    // Load business details for bookings
    const loadBusinessDetails = async () => {
      const businessIds = [...new Set(userBookings.map((b) => b.businessId))];
      const businessData: { [key: string]: Business } = {};

      for (const id of businessIds) {
        try {
          const business = await businessAPI.getById(id);
          if (business) {
            businessData[id] = business;
          }
        } catch (error) {
          console.error(`Failed to load business ${id}:`, error);
        }
      }

      setBusinesses(businessData);
    };

    if (userBookings.length > 0) {
      loadBusinessDetails();
    }
  }, [userBookings]);

  const handleSaveProfile = () => {
    // In a real app, this would call an API to update the user profile
    console.log("Saving profile:", editForm);
    setIsEditing(false);
  };

  const activeBookings = userBookings.filter(
    (booking) =>
      booking.status === "waiting" || booking.status === "in-progress",
  );

  const completedBookings = userBookings.filter(
    (booking) =>
      booking.status === "completed" || booking.status === "cancelled",
  );

  const totalBookings = userBookings.length;
  const completionRate =
    totalBookings > 0
      ? Math.round(
          (completedBookings.filter((b) => b.status === "completed").length /
            totalBookings) *
            100,
        )
      : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50/50 via-white to-purple-50/50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center space-y-2"
          >
            <h1 className="text-3xl font-bold text-foreground">My Profile</h1>
            <p className="text-muted-foreground">
              Manage your account and view your booking history
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Profile Card */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="lg:col-span-1"
            >
              <Card className="bg-card/50 backdrop-blur-sm">
                <CardHeader className="text-center">
                  <div className="w-20 h-20 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-white font-bold text-2xl">
                      {user?.name
                        ?.split(" ")
                        .map((n) => n[0])
                        .join("")
                        .toUpperCase()}
                    </span>
                  </div>
                  <CardTitle className="text-xl">{user?.name}</CardTitle>
                  <p className="text-muted-foreground">{user?.email}</p>
                  <Badge variant="secondary" className="w-fit mx-auto">
                    {user?.role === "user" ? "Customer" : user?.role}
                  </Badge>
                </CardHeader>

                <CardContent className="space-y-4">
                  {isEditing ? (
                    <div className="space-y-3">
                      <div>
                        <Label htmlFor="name">Full Name</Label>
                        <Input
                          id="name"
                          value={editForm.name}
                          onChange={(e) =>
                            setEditForm({ ...editForm, name: e.target.value })
                          }
                        />
                      </div>
                      <div>
                        <Label htmlFor="phone">Phone</Label>
                        <Input
                          id="phone"
                          value={editForm.phone}
                          onChange={(e) =>
                            setEditForm({ ...editForm, phone: e.target.value })
                          }
                        />
                      </div>
                      <div>
                        <Label htmlFor="location">Location</Label>
                        <Input
                          id="location"
                          value={editForm.location}
                          onChange={(e) =>
                            setEditForm({
                              ...editForm,
                              location: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div className="flex space-x-2">
                        <Button
                          onClick={handleSaveProfile}
                          size="sm"
                          className="flex-1"
                        >
                          Save
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => setIsEditing(false)}
                          size="sm"
                          className="flex-1"
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <div className="flex items-center space-x-3">
                        <User className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm">{user?.name}</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Mail className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm">{user?.email}</span>
                      </div>
                      {user?.phone && (
                        <div className="flex items-center space-x-3">
                          <Phone className="w-4 h-4 text-muted-foreground" />
                          <span className="text-sm">{user.phone}</span>
                        </div>
                      )}
                      {user?.location && (
                        <div className="flex items-center space-x-3">
                          <MapPin className="w-4 h-4 text-muted-foreground" />
                          <span className="text-sm">{user.location}</span>
                        </div>
                      )}
                      <div className="flex items-center space-x-3">
                        <Calendar className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm">
                          Member since{" "}
                          {new Date(user?.createdAt || "").toLocaleDateString()}
                        </span>
                      </div>

                      <Button
                        variant="outline"
                        onClick={() => setIsEditing(true)}
                        size="sm"
                        className="w-full mt-4"
                      >
                        <Edit3 className="w-4 h-4 mr-2" />
                        Edit Profile
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Stats Card */}
              <Card className="mt-6 bg-card/50 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-lg">Your Stats</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">
                      Total Bookings
                    </span>
                    <span className="font-semibold">{totalBookings}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">
                      Active Bookings
                    </span>
                    <span className="font-semibold">
                      {activeBookings.length}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">
                      Completion Rate
                    </span>
                    <span className="font-semibold">{completionRate}%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">
                      Avg. Rating Given
                    </span>
                    <div className="flex items-center space-x-1">
                      <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                      <span className="font-semibold">4.5</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Main Content */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="lg:col-span-2"
            >
              <Tabs defaultValue="active" className="space-y-6">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger
                    value="active"
                    className="flex items-center space-x-2"
                  >
                    <Clock className="w-4 h-4" />
                    <span>Active Bookings ({activeBookings.length})</span>
                  </TabsTrigger>
                  <TabsTrigger
                    value="history"
                    className="flex items-center space-x-2"
                  >
                    <History className="w-4 h-4" />
                    <span>History ({completedBookings.length})</span>
                  </TabsTrigger>
                </TabsList>

                {/* Active Bookings */}
                <TabsContent value="active" className="space-y-4">
                  {activeBookings.length > 0 ? (
                    activeBookings.map((booking, index) => {
                      const business = businesses[booking.businessId];
                      return (
                        <motion.div
                          key={booking.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3, delay: index * 0.1 }}
                        >
                          <Card className="hover:shadow-md transition-shadow bg-card/50 backdrop-blur-sm">
                            <CardContent className="p-6">
                              <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center space-x-3">
                                  <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold">
                                    #{booking.tokenNumber}
                                  </div>
                                  <div>
                                    <h3 className="font-semibold">
                                      {business?.name || "Loading..."}
                                    </h3>
                                    <p className="text-sm text-muted-foreground">
                                      {
                                        business?.departments.find(
                                          (d) => d.id === booking.departmentId,
                                        )?.name
                                      }
                                    </p>
                                  </div>
                                </div>
                                <Badge
                                  className={`${QUEUE_STATUS_COLORS[booking.status]} border`}
                                  variant="outline"
                                >
                                  {booking.status}
                                </Badge>
                              </div>

                              <div className="grid grid-cols-2 gap-4 mb-4">
                                <div>
                                  <span className="text-sm text-muted-foreground">
                                    Booked at
                                  </span>
                                  <p className="font-medium">
                                    {new Date(
                                      booking.bookedAt,
                                    ).toLocaleString()}
                                  </p>
                                </div>
                                <div>
                                  <span className="text-sm text-muted-foreground">
                                    Est. wait time
                                  </span>
                                  <p className="font-medium">
                                    {booking.estimatedWaitTime} minutes
                                  </p>
                                </div>
                              </div>

                              {booking.notes && (
                                <div className="mb-4">
                                  <span className="text-sm text-muted-foreground">
                                    Notes
                                  </span>
                                  <p className="text-sm">{booking.notes}</p>
                                </div>
                              )}

                              <div className="flex space-x-2">
                                <Button
                                  asChild
                                  size="sm"
                                  variant="outline"
                                  className="flex-1"
                                >
                                  <Link to={`/queue/${booking.id}`}>
                                    <Eye className="w-4 h-4 mr-2" />
                                    Track Queue
                                  </Link>
                                </Button>
                                <Button
                                  asChild
                                  size="sm"
                                  variant="outline"
                                  className="flex-1"
                                >
                                  <Link to={`/business/${booking.businessId}`}>
                                    View Business
                                  </Link>
                                </Button>
                              </div>
                            </CardContent>
                          </Card>
                        </motion.div>
                      );
                    })
                  ) : (
                    <Card className="p-12 text-center">
                      <div className="space-y-4">
                        <div className="text-6xl">📋</div>
                        <h3 className="text-xl font-semibold">
                          No Active Bookings
                        </h3>
                        <p className="text-muted-foreground max-w-md mx-auto">
                          You don't have any active bookings right now. Ready to
                          skip the wait at your next appointment?
                        </p>
                        <Button asChild>
                          <Link to="/home">Find Services</Link>
                        </Button>
                      </div>
                    </Card>
                  )}
                </TabsContent>

                {/* Booking History */}
                <TabsContent value="history" className="space-y-4">
                  {completedBookings.length > 0 ? (
                    completedBookings.map((booking, index) => {
                      const business = businesses[booking.businessId];
                      return (
                        <motion.div
                          key={booking.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3, delay: index * 0.1 }}
                        >
                          <Card className="hover:shadow-md transition-shadow bg-card/50 backdrop-blur-sm">
                            <CardContent className="p-6">
                              <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center space-x-3">
                                  <div className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center text-muted-foreground font-bold">
                                    #{booking.tokenNumber}
                                  </div>
                                  <div>
                                    <h3 className="font-semibold">
                                      {business?.name || "Loading..."}
                                    </h3>
                                    <p className="text-sm text-muted-foreground">
                                      {
                                        business?.departments.find(
                                          (d) => d.id === booking.departmentId,
                                        )?.name
                                      }
                                    </p>
                                  </div>
                                </div>
                                <Badge
                                  className={`${QUEUE_STATUS_COLORS[booking.status]} border`}
                                  variant="outline"
                                >
                                  {booking.status}
                                </Badge>
                              </div>

                              <div className="grid grid-cols-2 gap-4 mb-4">
                                <div>
                                  <span className="text-sm text-muted-foreground">
                                    Date
                                  </span>
                                  <p className="font-medium">
                                    {new Date(
                                      booking.bookedAt,
                                    ).toLocaleDateString()}
                                  </p>
                                </div>
                                <div>
                                  <span className="text-sm text-muted-foreground">
                                    Time
                                  </span>
                                  <p className="font-medium">
                                    {new Date(
                                      booking.bookedAt,
                                    ).toLocaleTimeString()}
                                  </p>
                                </div>
                              </div>

                              {booking.status === "completed" && (
                                <div className="flex items-center justify-between pt-4 border-t">
                                  <span className="text-sm text-muted-foreground">
                                    Rate your experience:
                                  </span>
                                  <div className="flex space-x-1">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                      <button
                                        key={star}
                                        className="text-yellow-400 hover:text-yellow-500"
                                      >
                                        <Star className="w-4 h-4 fill-current" />
                                      </button>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </CardContent>
                          </Card>
                        </motion.div>
                      );
                    })
                  ) : (
                    <Card className="p-12 text-center">
                      <div className="space-y-4">
                        <div className="text-6xl">📚</div>
                        <h3 className="text-xl font-semibold">
                          No Booking History
                        </h3>
                        <p className="text-muted-foreground max-w-md mx-auto">
                          Your completed and cancelled bookings will appear
                          here.
                        </p>
                      </div>
                    </Card>
                  )}
                </TabsContent>
              </Tabs>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
