import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/contexts/AuthContext";
import { businessAPI, queueAPI } from "@/lib/api";
import { Business, QueueBooking, Department } from "@/lib/types";
import { QUEUE_STATUS_COLORS } from "@/lib/constants";
import {
  Users,
  Clock,
  TrendingUp,
  Settings,
  Plus,
  Eye,
  Check,
  X,
  QrCode,
  BarChart3,
  Calendar,
  Building2,
} from "lucide-react";
import { motion } from "framer-motion";

export default function BusinessDashboard() {
  const { user } = useAuth();
  const [business, setBusiness] = useState<Business | null>(null);
  const [queueBookings, setQueueBookings] = useState<QueueBooking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [newDepartment, setNewDepartment] = useState({
    name: "",
    estimatedWaitTime: 30,
    maxQueueSize: 15,
  });

  useEffect(() => {
    const loadDashboardData = async () => {
      if (!user) return;

      setIsLoading(true);
      try {
        // Load business data
        const businessData = await businessAPI.getByOwnerId(user.id);
        setBusiness(businessData);

        if (businessData) {
          // Load queue bookings
          const bookings = await queueAPI.getBusinessQueue(businessData.id);
          setQueueBookings(bookings);
        }
      } catch (error) {
        console.error("Failed to load dashboard data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadDashboardData();
  }, [user]);

  const handleToggleAcceptingBookings = async () => {
    if (!business) return;

    try {
      const updatedBusiness = await businessAPI.updateBusiness(business.id, {
        isAcceptingBookings: !business.isAcceptingBookings,
      });
      setBusiness(updatedBusiness);
    } catch (error) {
      console.error("Failed to update booking status:", error);
    }
  };

  const handleAddDepartment = () => {
    if (!business || !newDepartment.name.trim()) return;

    const department: Department = {
      id: `dept_${Date.now()}`,
      name: newDepartment.name,
      estimatedWaitTime: newDepartment.estimatedWaitTime,
      maxQueueSize: newDepartment.maxQueueSize,
      currentQueueSize: 0,
      isActive: true,
    };

    setBusiness({
      ...business,
      departments: [...business.departments, department],
    });

    setNewDepartment({
      name: "",
      estimatedWaitTime: 30,
      maxQueueSize: 15,
    });
  };

  const handleApproveBooking = async (bookingId: string) => {
    // In real app, would call API to approve booking
    setQueueBookings((bookings) =>
      bookings.map((b) =>
        b.id === bookingId ? { ...b, status: "in-progress" as const } : b,
      ),
    );
  };

  const handleRejectBooking = async (bookingId: string) => {
    // In real app, would call API to reject booking
    setQueueBookings((bookings) =>
      bookings.map((b) =>
        b.id === bookingId ? { ...b, status: "cancelled" as const } : b,
      ),
    );
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
      <div className="min-h-screen flex items-center justify-center px-4">
        <Card className="max-w-md p-8 text-center">
          <div className="space-y-4">
            <Building2 className="w-16 h-16 text-muted-foreground mx-auto" />
            <h2 className="text-xl font-semibold">No Business Found</h2>
            <p className="text-muted-foreground">
              You don't have a business registered with this account.
            </p>
            <Button>Register Your Business</Button>
          </div>
        </Card>
      </div>
    );
  }

  const todayBookings = queueBookings.filter(
    (booking) =>
      new Date(booking.bookedAt).toDateString() === new Date().toDateString(),
  );

  const activeBookings = queueBookings.filter(
    (booking) =>
      booking.status === "waiting" || booking.status === "in-progress",
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
        <div className="space-y-6">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0"
          >
            <div>
              <h1 className="text-3xl font-bold text-foreground">
                Business Dashboard
              </h1>
              <p className="text-muted-foreground mt-1">
                Manage your queues and bookings
              </p>
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Label htmlFor="accepting-bookings">Accepting Bookings</Label>
                <Switch
                  id="accepting-bookings"
                  checked={business.isAcceptingBookings}
                  onCheckedChange={handleToggleAcceptingBookings}
                />
              </div>
              <Badge
                variant={
                  business.isAcceptingBookings ? "default" : "destructive"
                }
                className="px-3 py-1"
              >
                {business.isAcceptingBookings ? "Open" : "Closed"}
              </Badge>
            </div>
          </motion.div>

          {/* Stats Cards */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            <Card className="bg-card/50 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Today's Bookings
                    </p>
                    <p className="text-3xl font-bold">{todayBookings.length}</p>
                  </div>
                  <Calendar className="w-8 h-8 text-blue-500" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card/50 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Active Queue
                    </p>
                    <p className="text-3xl font-bold">{totalQueueSize}</p>
                  </div>
                  <Users className="w-8 h-8 text-green-500" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card/50 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Avg. Wait Time
                    </p>
                    <p className="text-3xl font-bold">{averageWaitTime}m</p>
                  </div>
                  <Clock className="w-8 h-8 text-orange-500" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card/50 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Rating</p>
                    <p className="text-3xl font-bold">
                      {business.rating.toFixed(1)}
                    </p>
                  </div>
                  <TrendingUp className="w-8 h-8 text-purple-500" />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Main Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <Tabs defaultValue="overview" className="space-y-6">
              <TabsList className="grid w-full grid-cols-5">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="queue">Live Queue</TabsTrigger>
                <TabsTrigger value="departments">Departments</TabsTrigger>
                <TabsTrigger value="analytics">Analytics</TabsTrigger>
                <TabsTrigger value="settings">Settings</TabsTrigger>
              </TabsList>

              {/* Overview Tab */}
              <TabsContent value="overview" className="space-y-6">
                <div className="grid lg:grid-cols-2 gap-6">
                  {/* Recent Bookings */}
                  <Card className="bg-card/50 backdrop-blur-sm">
                    <CardHeader>
                      <CardTitle>Recent Bookings</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {todayBookings.slice(0, 5).map((booking) => (
                          <div
                            key={booking.id}
                            className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
                          >
                            <div>
                              <p className="font-medium">
                                #{booking.tokenNumber} - {booking.userName}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                {
                                  business.departments.find(
                                    (d) => d.id === booking.departmentId,
                                  )?.name
                                }
                              </p>
                            </div>
                            <Badge
                              className={`${QUEUE_STATUS_COLORS[booking.status]} border`}
                              variant="outline"
                            >
                              {booking.status}
                            </Badge>
                          </div>
                        ))}
                        {todayBookings.length === 0 && (
                          <p className="text-muted-foreground text-center py-4">
                            No bookings today
                          </p>
                        )}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Department Status */}
                  <Card className="bg-card/50 backdrop-blur-sm">
                    <CardHeader>
                      <CardTitle>Department Status</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {business.departments.map((dept) => (
                          <div
                            key={dept.id}
                            className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
                          >
                            <div>
                              <p className="font-medium">{dept.name}</p>
                              <p className="text-sm text-muted-foreground">
                                {dept.currentQueueSize}/{dept.maxQueueSize} •{" "}
                                {dept.estimatedWaitTime}m wait
                              </p>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Badge
                                variant={
                                  dept.isActive ? "default" : "secondary"
                                }
                              >
                                {dept.isActive ? "Active" : "Inactive"}
                              </Badge>
                              <div
                                className={`w-3 h-3 rounded-full ${
                                  dept.currentQueueSize >= dept.maxQueueSize
                                    ? "bg-red-500"
                                    : dept.currentQueueSize >
                                        dept.maxQueueSize * 0.7
                                      ? "bg-yellow-500"
                                      : "bg-green-500"
                                }`}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              {/* Live Queue Tab */}
              <TabsContent value="queue" className="space-y-6">
                <Card className="bg-card/50 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span>Live Queue ({activeBookings.length})</span>
                      <Button size="sm">
                        <QrCode className="w-4 h-4 mr-2" />
                        QR Scanner
                      </Button>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {activeBookings.map((booking) => (
                        <div
                          key={booking.id}
                          className="flex items-center justify-between p-4 border rounded-lg"
                        >
                          <div className="flex items-center space-x-4">
                            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold">
                              #{booking.tokenNumber}
                            </div>
                            <div>
                              <p className="font-medium">{booking.userName}</p>
                              <p className="text-sm text-muted-foreground">
                                {booking.userPhone} •
                                {
                                  business.departments.find(
                                    (d) => d.id === booking.departmentId,
                                  )?.name
                                }
                              </p>
                              {booking.notes && (
                                <p className="text-xs text-muted-foreground mt-1">
                                  Note: {booking.notes}
                                </p>
                              )}
                            </div>
                          </div>

                          <div className="flex items-center space-x-2">
                            <Badge
                              className={`${QUEUE_STATUS_COLORS[booking.status]} border`}
                              variant="outline"
                            >
                              {booking.status}
                            </Badge>
                            {booking.status === "waiting" && (
                              <div className="flex space-x-1">
                                <Button
                                  size="sm"
                                  onClick={() =>
                                    handleApproveBooking(booking.id)
                                  }
                                  className="bg-green-600 hover:bg-green-700"
                                >
                                  <Check className="w-4 h-4" />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="destructive"
                                  onClick={() =>
                                    handleRejectBooking(booking.id)
                                  }
                                >
                                  <X className="w-4 h-4" />
                                </Button>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                      {activeBookings.length === 0 && (
                        <div className="text-center py-8">
                          <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                          <h3 className="text-lg font-semibold">
                            No Active Queue
                          </h3>
                          <p className="text-muted-foreground">
                            All caught up! No customers in queue right now.
                          </p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Departments Tab */}
              <TabsContent value="departments" className="space-y-6">
                <div className="grid lg:grid-cols-2 gap-6">
                  {/* Add Department */}
                  <Card className="bg-card/50 backdrop-blur-sm">
                    <CardHeader>
                      <CardTitle>Add New Department</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <Label htmlFor="dept-name">Department Name</Label>
                        <Input
                          id="dept-name"
                          value={newDepartment.name}
                          onChange={(e) =>
                            setNewDepartment({
                              ...newDepartment,
                              name: e.target.value,
                            })
                          }
                          placeholder="e.g., Consultation, X-Ray"
                        />
                      </div>

                      <div>
                        <Label htmlFor="wait-time">
                          Estimated Wait Time (minutes)
                        </Label>
                        <Input
                          id="wait-time"
                          type="number"
                          value={newDepartment.estimatedWaitTime}
                          onChange={(e) =>
                            setNewDepartment({
                              ...newDepartment,
                              estimatedWaitTime: parseInt(e.target.value),
                            })
                          }
                        />
                      </div>

                      <div>
                        <Label htmlFor="max-queue">Max Queue Size</Label>
                        <Input
                          id="max-queue"
                          type="number"
                          value={newDepartment.maxQueueSize}
                          onChange={(e) =>
                            setNewDepartment({
                              ...newDepartment,
                              maxQueueSize: parseInt(e.target.value),
                            })
                          }
                        />
                      </div>

                      <Button onClick={handleAddDepartment} className="w-full">
                        <Plus className="w-4 h-4 mr-2" />
                        Add Department
                      </Button>
                    </CardContent>
                  </Card>

                  {/* Existing Departments */}
                  <Card className="bg-card/50 backdrop-blur-sm">
                    <CardHeader>
                      <CardTitle>Existing Departments</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {business.departments.map((dept) => (
                          <div
                            key={dept.id}
                            className="p-3 border rounded-lg space-y-2"
                          >
                            <div className="flex items-center justify-between">
                              <h4 className="font-medium">{dept.name}</h4>
                              <Switch checked={dept.isActive} />
                            </div>
                            <div className="grid grid-cols-2 gap-2 text-sm text-muted-foreground">
                              <span>Wait: {dept.estimatedWaitTime}m</span>
                              <span>Max: {dept.maxQueueSize}</span>
                              <span>Current: {dept.currentQueueSize}</span>
                              <span>
                                Available:{" "}
                                {dept.maxQueueSize - dept.currentQueueSize}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              {/* Analytics Tab */}
              <TabsContent value="analytics" className="space-y-6">
                <Card className="bg-card/50 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <BarChart3 className="w-5 h-5 mr-2" />
                      Analytics & Reports
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
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
                                todayBookings.filter(
                                  (b) => b.status === "completed",
                                ).length
                              }
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span>Cancelled:</span>
                            <span className="font-medium">
                              {
                                todayBookings.filter(
                                  (b) => b.status === "cancelled",
                                ).length
                              }
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <h4 className="font-medium">Peak Hours</h4>
                        <div className="space-y-1 text-sm text-muted-foreground">
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
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Settings Tab */}
              <TabsContent value="settings" className="space-y-6">
                <div className="grid lg:grid-cols-2 gap-6">
                  <Card className="bg-card/50 backdrop-blur-sm">
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <Settings className="w-5 h-5 mr-2" />
                        Business Settings
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <Label htmlFor="business-name">Business Name</Label>
                        <Input id="business-name" value={business.name} />
                      </div>

                      <div>
                        <Label htmlFor="business-address">Address</Label>
                        <Input id="business-address" value={business.address} />
                      </div>

                      <div>
                        <Label htmlFor="business-description">
                          Description
                        </Label>
                        <Textarea
                          id="business-description"
                          value={business.description || ""}
                          rows={3}
                        />
                      </div>

                      <Button>Save Changes</Button>
                    </CardContent>
                  </Card>

                  <Card className="bg-card/50 backdrop-blur-sm">
                    <CardHeader>
                      <CardTitle>Queue Settings</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="auto-approve">
                          Auto-approve bookings
                        </Label>
                        <Switch id="auto-approve" />
                      </div>

                      <div className="flex items-center justify-between">
                        <Label htmlFor="notifications">SMS notifications</Label>
                        <Switch id="notifications" />
                      </div>

                      <div className="flex items-center justify-between">
                        <Label htmlFor="email-alerts">Email alerts</Label>
                        <Switch id="email-alerts" defaultChecked />
                      </div>

                      <div>
                        <Label htmlFor="buffer-time">
                          Buffer time between appointments (minutes)
                        </Label>
                        <Input
                          id="buffer-time"
                          type="number"
                          defaultValue="5"
                        />
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
