import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
  Edit,
  Save,
  Camera,
  MapPin,
  Phone,
  Mail,
  Globe,
  Star,
  ChevronDown,
  ChevronUp,
  AlertCircle,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../components/ui/dialog";
import { Label } from "../components/ui/label";
import { Switch } from "../components/ui/switch";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import { Progress } from "../components/ui/progress";
import { useAuth } from "../contexts/AuthContext";
import {
  mockBusinesses,
  mockBookings,
  BUSINESS_CATEGORIES,
} from "../data/mockData";
import { toast } from "sonner";

interface OpeningHours {
  [key: string]: {
    start: string;
    end: string;
    closed: boolean;
  };
}

interface TimeSlot {
  id: string;
  time: string;
  date: string;
  available: boolean;
  capacity: number;
  booked: number;
}

const BusinessDashboard: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("overview");
  const [editingProfile, setEditingProfile] = useState(false);
  const [editingHours, setEditingHours] = useState(false);

  // Find the business owned by the current user
  const [business, setBusiness] = useState(
    mockBusinesses.find((b) => b.ownerId === user?.id),
  );

  const [businessForm, setBusinessForm] = useState({
    name: business?.name || "",
    description: business?.description || "",
    address: business?.address || "",
    phone: business?.contact?.phone || "",
    email: business?.contact?.email || "",
    website: business?.contact?.website || "",
    category: business?.category || "hospital",
  });

  const [openingHours, setOpeningHours] = useState<OpeningHours>(
    business?.openingHours || {
      monday: { start: "09:00", end: "17:00", closed: false },
      tuesday: { start: "09:00", end: "17:00", closed: false },
      wednesday: { start: "09:00", end: "17:00", closed: false },
      thursday: { start: "09:00", end: "17:00", closed: false },
      friday: { start: "09:00", end: "17:00", closed: false },
      saturday: { start: "09:00", end: "15:00", closed: false },
      sunday: { start: "00:00", end: "00:00", closed: true },
    },
  );

  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0],
  );
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);

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

  const revenue = businessBookings
    .filter((b) => b.paymentStatus === "paid" && b.amount)
    .reduce((sum, b) => sum + (b.amount || 0), 0);

  // Generate time slots for selected date
  useEffect(() => {
    if (selectedDate && business) {
      const date = new Date(selectedDate);
      const dayNames = [
        "sunday",
        "monday",
        "tuesday",
        "wednesday",
        "thursday",
        "friday",
        "saturday",
      ];
      const dayName = dayNames[date.getDay()];
      const dayHours = openingHours[dayName];

      if (!dayHours || dayHours.closed) {
        setTimeSlots([]);
        return;
      }

      const slots: TimeSlot[] = [];
      const startTime = new Date(`${selectedDate}T${dayHours.start}`);
      const endTime = new Date(`${selectedDate}T${dayHours.end}`);

      while (startTime < endTime) {
        const timeString = startTime.toTimeString().slice(0, 5);
        const existingBookings = businessBookings.filter(
          (b) =>
            b.scheduledDate === selectedDate && b.scheduledTime === timeString,
        ).length;

        slots.push({
          id: `slot-${timeString}`,
          time: timeString,
          date: selectedDate,
          available: existingBookings < 4, // Assuming max 4 bookings per slot
          capacity: 4,
          booked: existingBookings,
        });

        startTime.setMinutes(startTime.getMinutes() + 30); // 30-minute slots
      }

      setTimeSlots(slots);
    }
  }, [selectedDate, openingHours, business]);

  const handleSaveProfile = () => {
    if (business) {
      setBusiness({
        ...business,
        name: businessForm.name,
        description: businessForm.description,
        address: businessForm.address,
        category: businessForm.category as any,
        contact: {
          ...business.contact,
          phone: businessForm.phone,
          email: businessForm.email,
          website: businessForm.website,
        },
      });
      setEditingProfile(false);
      toast.success("Business profile updated successfully!");
    }
  };

  const handleSaveHours = () => {
    if (business) {
      setBusiness({
        ...business,
        openingHours,
      });
      setEditingHours(false);
      toast.success("Opening hours updated successfully!");
    }
  };

  const handleHourChange = (
    day: string,
    field: string,
    value: string | boolean,
  ) => {
    setOpeningHours((prev) => ({
      ...prev,
      [day]: {
        ...prev[day],
        [field]: value,
      },
    }));
  };

  const getDayStats = (date: string) => {
    const dayBookings = businessBookings.filter(
      (b) => b.scheduledDate === date,
    );
    return {
      total: dayBookings.length,
      completed: dayBookings.filter((b) => b.status === "completed").length,
      pending: dayBookings.filter(
        (b) => b.status === "waiting" || b.status === "approved",
      ).length,
      revenue: dayBookings
        .filter((b) => b.paymentStatus === "paid" && b.amount)
        .reduce((sum, b) => sum + (b.amount || 0), 0),
    };
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "waiting":
        return "bg-yellow-100 text-yellow-800";
      case "approved":
        return "bg-blue-100 text-blue-800";
      case "in-progress":
        return "bg-purple-100 text-purple-800";
      case "completed":
        return "bg-green-100 text-green-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (!business) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-blue-900/20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <Building2 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
            No Business Profile Found
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Complete your business registration to access the dashboard.
          </p>
          <Button>Complete Registration</Button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-blue-900/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
              {business.name}
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Manage your business and track performance
            </p>
          </div>
          <div className="flex items-center space-x-4 mt-4 md:mt-0">
            <Badge variant={business.isVerified ? "default" : "secondary"}>
              {business.isVerified ? "Verified" : "Pending Verification"}
            </Badge>
            <Button variant="outline">
              <QrCode className="w-4 h-4 mr-2" />
              QR Code
            </Button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.02 }}
          >
            <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white border-0">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-100">Today's Bookings</p>
                    <p className="text-3xl font-bold">{todayBookings.length}</p>
                  </div>
                  <Calendar className="w-8 h-8 text-blue-200" />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            whileHover={{ scale: 1.02 }}
          >
            <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white border-0">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-green-100">Active Bookings</p>
                    <p className="text-3xl font-bold">
                      {activeBookings.length}
                    </p>
                  </div>
                  <Users className="w-8 h-8 text-green-200" />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            whileHover={{ scale: 1.02 }}
          >
            <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white border-0">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-purple-100">Total Revenue</p>
                    <p className="text-3xl font-bold">
                      ${revenue.toLocaleString()}
                    </p>
                  </div>
                  <DollarSign className="w-8 h-8 text-purple-200" />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            whileHover={{ scale: 1.02 }}
          >
            <Card className="bg-gradient-to-br from-orange-500 to-orange-600 text-white border-0">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-orange-100">Rating</p>
                    <p className="text-3xl font-bold">{business.rating}</p>
                  </div>
                  <Star className="w-8 h-8 text-orange-200 fill-current" />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Main Content Tabs */}
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-6"
        >
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-5 lg:w-auto">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="bookings">Bookings</TabsTrigger>
            <TabsTrigger value="schedule">Schedule</TabsTrigger>
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Bookings */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>Recent Bookings</span>
                    <Button variant="outline" size="sm">
                      <Eye className="w-4 h-4 mr-2" />
                      View All
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {todayBookings.slice(0, 5).map((booking) => (
                    <div
                      key={booking.id}
                      className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
                    >
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">
                          {booking.customerName}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Token #{booking.tokenNumber} •{" "}
                          {booking.scheduledTime || "No time set"}
                        </p>
                      </div>
                      <Badge className={getStatusColor(booking.status)}>
                        {booking.status}
                      </Badge>
                    </div>
                  ))}
                  {todayBookings.length === 0 && (
                    <p className="text-gray-500 dark:text-gray-400 text-center py-8">
                      No bookings for today
                    </p>
                  )}
                </CardContent>
              </Card>

              {/* Performance Metrics */}
              <Card>
                <CardHeader>
                  <CardTitle>Performance Metrics</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium">
                        Booking Completion Rate
                      </span>
                      <span className="text-sm font-medium">87%</span>
                    </div>
                    <Progress value={87} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium">
                        Customer Satisfaction
                      </span>
                      <span className="text-sm font-medium">
                        {business.rating}/5.0
                      </span>
                    </div>
                    <Progress
                      value={(business.rating / 5) * 100}
                      className="h-2"
                    />
                  </div>
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium">
                        Average Wait Time
                      </span>
                      <span className="text-sm font-medium">12 min</span>
                    </div>
                    <Progress value={75} className="h-2" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <Button className="h-16 flex flex-col items-center justify-center space-y-2">
                    <Plus className="w-5 h-5" />
                    <span>Add Service</span>
                  </Button>
                  <Button
                    variant="outline"
                    className="h-16 flex flex-col items-center justify-center space-y-2"
                  >
                    <Settings className="w-5 h-5" />
                    <span>Settings</span>
                  </Button>
                  <Button
                    variant="outline"
                    className="h-16 flex flex-col items-center justify-center space-y-2"
                  >
                    <BarChart3 className="w-5 h-5" />
                    <span>Reports</span>
                  </Button>
                  <Button
                    variant="outline"
                    className="h-16 flex flex-col items-center justify-center space-y-2"
                  >
                    <QrCode className="w-5 h-5" />
                    <span>QR Code</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Bookings Tab */}
          <TabsContent value="bookings" className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Booking Management
              </h2>
              <div className="flex items-center space-x-4 mt-4 md:mt-0">
                <Select defaultValue="today">
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="today">Today</SelectItem>
                    <SelectItem value="week">This Week</SelectItem>
                    <SelectItem value="month">This Month</SelectItem>
                  </SelectContent>
                </Select>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Manual Booking
                </Button>
              </div>
            </div>

            <Card>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 dark:bg-gray-800">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          Token
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          Customer
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          Service
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          Time
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                      {businessBookings.slice(0, 15).map((booking) => (
                        <motion.tr
                          key={booking.id}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="hover:bg-gray-50 dark:hover:bg-gray-800"
                        >
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                            #{booking.tokenNumber}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div>
                              <div className="text-sm font-medium text-gray-900 dark:text-white">
                                {booking.customerName}
                              </div>
                              <div className="text-sm text-gray-500 dark:text-gray-400">
                                {booking.customerPhone}
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                            General Service
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                            {booking.scheduledTime || "Not scheduled"}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <Badge className={getStatusColor(booking.status)}>
                              {booking.status}
                            </Badge>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                            {booking.status === "waiting" && (
                              <Button
                                size="sm"
                                onClick={() =>
                                  toast.success("Booking approved")
                                }
                              >
                                <Check className="w-4 h-4" />
                              </Button>
                            )}
                            {booking.status === "approved" && (
                              <Button
                                size="sm"
                                onClick={() => toast.success("Service started")}
                              >
                                <Clock className="w-4 h-4" />
                              </Button>
                            )}
                            <Button size="sm" variant="outline">
                              <Eye className="w-4 h-4" />
                            </Button>
                          </td>
                        </motion.tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Schedule Tab */}
          <TabsContent value="schedule" className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Schedule Management
              </h2>
              <div className="flex items-center space-x-4 mt-4 md:mt-0">
                <Input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-40"
                />
                <Button onClick={() => setEditingHours(true)}>
                  <Settings className="w-4 h-4 mr-2" />
                  Edit Hours
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Time Slots */}
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle>
                      Available Time Slots -{" "}
                      {new Date(selectedDate).toLocaleDateString()}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {timeSlots.length > 0 ? (
                      <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                        {timeSlots.map((slot) => (
                          <motion.div
                            key={slot.id}
                            whileHover={{ scale: 1.05 }}
                            className={`p-3 rounded-lg border text-center cursor-pointer transition-colors ${
                              slot.available
                                ? "border-green-200 bg-green-50 text-green-800 hover:bg-green-100"
                                : "border-red-200 bg-red-50 text-red-800"
                            }`}
                          >
                            <div className="font-medium">{slot.time}</div>
                            <div className="text-xs mt-1">
                              {slot.booked}/{slot.capacity}
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                        <Calendar className="w-12 h-12 mx-auto mb-4 opacity-50" />
                        <p>Business is closed on this day</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Day Summary */}
              <Card>
                <CardHeader>
                  <CardTitle>Day Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {(() => {
                    const stats = getDayStats(selectedDate);
                    return (
                      <>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600 dark:text-gray-400">
                            Total Bookings
                          </span>
                          <span className="font-medium">{stats.total}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600 dark:text-gray-400">
                            Completed
                          </span>
                          <span className="font-medium text-green-600">
                            {stats.completed}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600 dark:text-gray-400">
                            Pending
                          </span>
                          <span className="font-medium text-yellow-600">
                            {stats.pending}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600 dark:text-gray-400">
                            Revenue
                          </span>
                          <span className="font-medium">${stats.revenue}</span>
                        </div>
                      </>
                    );
                  })()}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Profile Tab */}
          <TabsContent value="profile" className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Business Profile
              </h2>
              <Button
                onClick={() => setEditingProfile(true)}
                disabled={editingProfile}
              >
                <Edit className="w-4 h-4 mr-2" />
                Edit Profile
              </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Basic Information */}
              <Card>
                <CardHeader>
                  <CardTitle>Basic Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Business Name</Label>
                    {editingProfile ? (
                      <Input
                        id="name"
                        value={businessForm.name}
                        onChange={(e) =>
                          setBusinessForm({
                            ...businessForm,
                            name: e.target.value,
                          })
                        }
                      />
                    ) : (
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {business.name}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="category">Category</Label>
                    {editingProfile ? (
                      <Select
                        value={businessForm.category}
                        onValueChange={(value) =>
                          setBusinessForm({ ...businessForm, category: value })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {BUSINESS_CATEGORIES.map((cat) => (
                            <SelectItem key={cat.value} value={cat.value}>
                              {cat.icon} {cat.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    ) : (
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {
                          BUSINESS_CATEGORIES.find(
                            (c) => c.value === business.category,
                          )?.label
                        }
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    {editingProfile ? (
                      <Textarea
                        id="description"
                        value={businessForm.description}
                        onChange={(e) =>
                          setBusinessForm({
                            ...businessForm,
                            description: e.target.value,
                          })
                        }
                        rows={3}
                      />
                    ) : (
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {business.description}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="address">Address</Label>
                    {editingProfile ? (
                      <Textarea
                        id="address"
                        value={businessForm.address}
                        onChange={(e) =>
                          setBusinessForm({
                            ...businessForm,
                            address: e.target.value,
                          })
                        }
                        rows={2}
                      />
                    ) : (
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {business.address}
                      </p>
                    )}
                  </div>

                  {editingProfile && (
                    <div className="flex space-x-2">
                      <Button onClick={handleSaveProfile}>
                        <Save className="w-4 h-4 mr-2" />
                        Save Changes
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => setEditingProfile(false)}
                      >
                        Cancel
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Contact Information */}
              <Card>
                <CardHeader>
                  <CardTitle>Contact Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone</Label>
                    {editingProfile ? (
                      <Input
                        id="phone"
                        value={businessForm.phone}
                        onChange={(e) =>
                          setBusinessForm({
                            ...businessForm,
                            phone: e.target.value,
                          })
                        }
                      />
                    ) : (
                      <div className="flex items-center space-x-2">
                        <Phone className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          {business.contact?.phone || "Not provided"}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    {editingProfile ? (
                      <Input
                        id="email"
                        type="email"
                        value={businessForm.email}
                        onChange={(e) =>
                          setBusinessForm({
                            ...businessForm,
                            email: e.target.value,
                          })
                        }
                      />
                    ) : (
                      <div className="flex items-center space-x-2">
                        <Mail className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          {business.contact?.email || "Not provided"}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="website">Website</Label>
                    {editingProfile ? (
                      <Input
                        id="website"
                        value={businessForm.website}
                        onChange={(e) =>
                          setBusinessForm({
                            ...businessForm,
                            website: e.target.value,
                          })
                        }
                      />
                    ) : (
                      <div className="flex items-center space-x-2">
                        <Globe className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          {business.contact?.website || "Not provided"}
                        </span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Opening Hours */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Opening Hours</span>
                  <Button
                    variant="outline"
                    onClick={() => setEditingHours(true)}
                    disabled={editingHours}
                  >
                    <Edit className="w-4 h-4 mr-2" />
                    Edit Hours
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {Object.entries(openingHours).map(([day, hours]) => (
                    <div
                      key={day}
                      className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg"
                    >
                      <div className="flex items-center space-x-4">
                        <span className="font-medium capitalize w-20">
                          {day}
                        </span>
                        {editingHours && (
                          <Switch
                            checked={!hours.closed}
                            onCheckedChange={(checked) =>
                              handleHourChange(day, "closed", !checked)
                            }
                          />
                        )}
                      </div>

                      {hours.closed ? (
                        <span className="text-red-600 font-medium">Closed</span>
                      ) : editingHours ? (
                        <div className="flex items-center space-x-2">
                          <Input
                            type="time"
                            value={hours.start}
                            onChange={(e) =>
                              handleHourChange(day, "start", e.target.value)
                            }
                            className="w-24"
                          />
                          <span>to</span>
                          <Input
                            type="time"
                            value={hours.end}
                            onChange={(e) =>
                              handleHourChange(day, "end", e.target.value)
                            }
                            className="w-24"
                          />
                        </div>
                      ) : (
                        <span className="text-gray-600 dark:text-gray-400">
                          {hours.start} - {hours.end}
                        </span>
                      )}
                    </div>
                  ))}

                  {editingHours && (
                    <div className="flex space-x-2">
                      <Button onClick={handleSaveHours}>
                        <Save className="w-4 h-4 mr-2" />
                        Save Hours
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => setEditingHours(false)}
                      >
                        Cancel
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Business Analytics
              </h2>
              <Select defaultValue="30d">
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7d">Last 7 days</SelectItem>
                  <SelectItem value="30d">Last 30 days</SelectItem>
                  <SelectItem value="90d">Last 90 days</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Customer Metrics</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      Total Customers
                    </span>
                    <span className="font-medium">
                      {businessBookings.length}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      Repeat Customers
                    </span>
                    <span className="font-medium">67%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      Customer Satisfaction
                    </span>
                    <span className="font-medium">{business.rating}/5.0</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Booking Trends</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      Peak Hours
                    </span>
                    <span className="font-medium">2:00 PM - 4:00 PM</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      Busiest Day
                    </span>
                    <span className="font-medium">Wednesday</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      No-show Rate
                    </span>
                    <span className="font-medium">8%</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Financial Overview</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      Total Revenue
                    </span>
                    <span className="font-medium">
                      ${revenue.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      Average Booking Value
                    </span>
                    <span className="font-medium">
                      ${Math.round(revenue / businessBookings.length || 0)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      Growth Rate
                    </span>
                    <span className="font-medium text-green-600">+12.5%</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default BusinessDashboard;
