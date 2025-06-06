import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { adminAPI } from "@/lib/api";
import { User, Business, QueueBooking } from "@/lib/types";
import { BUSINESS_CATEGORIES } from "@/lib/constants";
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
} from "lucide-react";
import { motion } from "framer-motion";

export default function AdminDashboard() {
  const [users, setUsers] = useState<User[]>([]);
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [bookings, setBookings] = useState<QueueBooking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const loadAdminData = async () => {
      setIsLoading(true);
      try {
        const [usersData, businessesData, bookingsData] = await Promise.all([
          adminAPI.getAllUsers(),
          adminAPI.getAllBusinesses(),
          adminAPI.getAllBookings(),
        ]);

        setUsers(usersData);
        setBusinesses(businessesData);
        setBookings(bookingsData);
      } catch (error) {
        console.error("Failed to load admin data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadAdminData();
  }, []);

  const handleDeleteUser = async (userId: string) => {
    if (!confirm("Are you sure you want to delete this user?")) return;

    try {
      await adminAPI.deleteUser(userId);
      setUsers(users.filter((u) => u.id !== userId));
    } catch (error) {
      console.error("Failed to delete user:", error);
    }
  };

  const handleDeleteBusiness = async (businessId: string) => {
    if (!confirm("Are you sure you want to delete this business?")) return;

    try {
      await adminAPI.deleteBusiness(businessId);
      setBusinesses(businesses.filter((b) => b.id !== businessId));
    } catch (error) {
      console.error("Failed to delete business:", error);
    }
  };

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const filteredBusinesses = businesses.filter(
    (business) =>
      business.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      business.address.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  // Analytics calculations
  const totalUsers = users.length;
  const totalBusinesses = businesses.length;
  const totalBookings = bookings.length;
  const activeBookings = bookings.filter(
    (b) => b.status === "waiting" || b.status === "in-progress",
  ).length;

  const usersByRole = {
    user: users.filter((u) => u.role === "user").length,
    business: users.filter((u) => u.role === "business").length,
    admin: users.filter((u) => u.role === "admin").length,
  };

  const businessesByCategory = BUSINESS_CATEGORIES.map((category) => ({
    category: category.label,
    count: businesses.filter((b) => b.category === category.value).length,
    icon: category.icon,
  }));

  const recentActivity = [
    ...users.slice(-5).map((user) => ({
      type: "user",
      action: "registered",
      entity: user.name,
      date: new Date(user.createdAt),
    })),
    ...businesses.slice(-5).map((business) => ({
      type: "business",
      action: "registered",
      entity: business.name,
      date: new Date(business.createdAt),
    })),
  ]
    .sort((a, b) => b.date.getTime() - a.date.getTime())
    .slice(0, 10);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

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
                Admin Dashboard
              </h1>
              <p className="text-muted-foreground mt-1">
                Platform overview and management
              </p>
            </div>

            <div className="flex items-center space-x-2">
              <Shield className="w-5 h-5 text-red-500" />
              <Badge variant="destructive">Admin Access</Badge>
            </div>
          </motion.div>

          {/* Security Alert */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <Alert className="border-orange-200 bg-orange-50 dark:bg-orange-950/20">
              <AlertTriangle className="h-4 w-4 text-orange-600" />
              <AlertDescription className="text-orange-800 dark:text-orange-200">
                You have administrative privileges. Please use these tools
                responsibly and in accordance with platform policies.
              </AlertDescription>
            </Alert>
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
                    <p className="text-sm text-muted-foreground">Total Users</p>
                    <p className="text-3xl font-bold">{totalUsers}</p>
                    <p className="text-xs text-green-600">+12% this month</p>
                  </div>
                  <Users className="w-8 h-8 text-blue-500" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card/50 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Businesses</p>
                    <p className="text-3xl font-bold">{totalBusinesses}</p>
                    <p className="text-xs text-green-600">+8% this month</p>
                  </div>
                  <Building2 className="w-8 h-8 text-green-500" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card/50 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Total Bookings
                    </p>
                    <p className="text-3xl font-bold">{totalBookings}</p>
                    <p className="text-xs text-green-600">+25% this month</p>
                  </div>
                  <Calendar className="w-8 h-8 text-orange-500" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card/50 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Active Queues
                    </p>
                    <p className="text-3xl font-bold">{activeBookings}</p>
                    <p className="text-xs text-blue-600">Live count</p>
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
                <TabsTrigger value="users">Users</TabsTrigger>
                <TabsTrigger value="businesses">Businesses</TabsTrigger>
                <TabsTrigger value="bookings">Bookings</TabsTrigger>
                <TabsTrigger value="analytics">Analytics</TabsTrigger>
              </TabsList>

              {/* Overview Tab */}
              <TabsContent value="overview" className="space-y-6">
                <div className="grid lg:grid-cols-2 gap-6">
                  {/* Recent Activity */}
                  <Card className="bg-card/50 backdrop-blur-sm">
                    <CardHeader>
                      <CardTitle>Recent Activity</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {recentActivity.map((activity, index) => (
                          <div
                            key={index}
                            className="flex items-center space-x-3 p-2 rounded-lg bg-muted/50"
                          >
                            {activity.type === "user" ? (
                              <Users className="w-4 h-4 text-blue-500" />
                            ) : (
                              <Building2 className="w-4 h-4 text-green-500" />
                            )}
                            <div className="flex-1">
                              <p className="text-sm">
                                <span className="font-medium">
                                  {activity.entity}
                                </span>{" "}
                                {activity.action}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {activity.date.toLocaleDateString()}
                              </p>
                            </div>
                            <Badge variant="outline" className="text-xs">
                              {activity.type}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Category Distribution */}
                  <Card className="bg-card/50 backdrop-blur-sm">
                    <CardHeader>
                      <CardTitle>Business Categories</CardTitle>
                    </CardHeader>
                    <CardContent>
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
                            <Badge variant="outline">{cat.count}</Badge>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* User Role Distribution */}
                <Card className="bg-card/50 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle>User Distribution</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-3 gap-6">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-600">
                          {usersByRole.user}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Customers
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-600">
                          {usersByRole.business}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Business Owners
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-red-600">
                          {usersByRole.admin}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Administrators
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Users Tab */}
              <TabsContent value="users" className="space-y-6">
                <Card className="bg-card/50 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span>User Management ({totalUsers})</span>
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          placeholder="Search users..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="pl-9 w-64"
                        />
                      </div>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Name</TableHead>
                          <TableHead>Email</TableHead>
                          <TableHead>Role</TableHead>
                          <TableHead>Joined</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredUsers.slice(0, 10).map((user) => (
                          <TableRow key={user.id}>
                            <TableCell className="font-medium">
                              {user.name}
                            </TableCell>
                            <TableCell>{user.email}</TableCell>
                            <TableCell>
                              <Badge
                                variant={
                                  user.role === "admin"
                                    ? "destructive"
                                    : user.role === "business"
                                      ? "default"
                                      : "secondary"
                                }
                              >
                                {user.role}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              {new Date(user.createdAt).toLocaleDateString()}
                            </TableCell>
                            <TableCell>
                              <div className="flex space-x-2">
                                <Button size="sm" variant="outline">
                                  <Eye className="w-4 h-4" />
                                </Button>
                                {user.role !== "admin" && (
                                  <Button
                                    size="sm"
                                    variant="destructive"
                                    onClick={() => handleDeleteUser(user.id)}
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </Button>
                                )}
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Businesses Tab */}
              <TabsContent value="businesses" className="space-y-6">
                <Card className="bg-card/50 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span>Business Management ({totalBusinesses})</span>
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          placeholder="Search businesses..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="pl-9 w-64"
                        />
                      </div>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Business Name</TableHead>
                          <TableHead>Category</TableHead>
                          <TableHead>Rating</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Registered</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredBusinesses.slice(0, 10).map((business) => {
                          const category = BUSINESS_CATEGORIES.find(
                            (c) => c.value === business.category,
                          );
                          return (
                            <TableRow key={business.id}>
                              <TableCell className="font-medium">
                                {business.name}
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center space-x-1">
                                  <span>{category?.icon}</span>
                                  <span>{category?.label}</span>
                                </div>
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center space-x-1">
                                  <span>{business.rating.toFixed(1)}</span>
                                  <span className="text-muted-foreground">
                                    ({business.totalReviews})
                                  </span>
                                </div>
                              </TableCell>
                              <TableCell>
                                <Badge
                                  variant={
                                    business.isAcceptingBookings
                                      ? "default"
                                      : "secondary"
                                  }
                                >
                                  {business.isAcceptingBookings
                                    ? "Active"
                                    : "Inactive"}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                {new Date(
                                  business.createdAt,
                                ).toLocaleDateString()}
                              </TableCell>
                              <TableCell>
                                <div className="flex space-x-2">
                                  <Button size="sm" variant="outline">
                                    <Eye className="w-4 h-4" />
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="destructive"
                                    onClick={() =>
                                      handleDeleteBusiness(business.id)
                                    }
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Bookings Tab */}
              <TabsContent value="bookings" className="space-y-6">
                <Card className="bg-card/50 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle>Recent Bookings ({totalBookings})</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Token</TableHead>
                          <TableHead>Customer</TableHead>
                          <TableHead>Business</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Date</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {bookings.slice(0, 15).map((booking) => {
                          const business = businesses.find(
                            (b) => b.id === booking.businessId,
                          );
                          return (
                            <TableRow key={booking.id}>
                              <TableCell className="font-medium">
                                #{booking.tokenNumber}
                              </TableCell>
                              <TableCell>{booking.userName}</TableCell>
                              <TableCell>
                                {business?.name || "Unknown"}
                              </TableCell>
                              <TableCell>
                                <Badge
                                  variant={
                                    booking.status === "completed"
                                      ? "default"
                                      : booking.status === "cancelled"
                                        ? "destructive"
                                        : "secondary"
                                  }
                                >
                                  {booking.status}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                {new Date(
                                  booking.bookedAt,
                                ).toLocaleDateString()}
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Analytics Tab */}
              <TabsContent value="analytics" className="space-y-6">
                <div className="grid lg:grid-cols-2 gap-6">
                  <Card className="bg-card/50 backdrop-blur-sm">
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <BarChart3 className="w-5 h-5 mr-2" />
                        Platform Metrics
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <h4 className="font-medium">Growth Rate</h4>
                          <div className="text-2xl font-bold text-green-600">
                            +18%
                          </div>
                          <p className="text-sm text-muted-foreground">
                            Monthly user growth
                          </p>
                        </div>
                        <div className="space-y-2">
                          <h4 className="font-medium">Retention</h4>
                          <div className="text-2xl font-bold text-blue-600">
                            89%
                          </div>
                          <p className="text-sm text-muted-foreground">
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
                    </CardContent>
                  </Card>

                  <Card className="bg-card/50 backdrop-blur-sm">
                    <CardHeader>
                      <CardTitle>System Health</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
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
