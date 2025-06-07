import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { Toaster } from "sonner";

// Context Providers
import { AuthProvider } from "./contexts/AuthContext";
import { ThemeProvider } from "./contexts/ThemeContext";
import { NotificationProvider } from "./contexts/NotificationContext";
import { AppProvider } from "./contexts/AppContext";

// Components
import { Navigation } from "./components/Navigation";
import { ProtectedRoute } from "./components/ProtectedRoute";

// Pages
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import SignupUser from "./pages/SignupUser";
import SignupBusiness from "./pages/SignupBusiness";
import UserHome from "./pages/UserHome";
import BusinessDetail from "./pages/BusinessDetail";
import QueueTracker from "./pages/QueueTracker";
import UserProfile from "./pages/UserProfile";
import BusinessDashboard from "./pages/BusinessDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import NotFound from "./pages/NotFound";

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppProvider>
          <NotificationProvider>
            <Router>
              <div className="min-h-screen bg-background text-foreground">
                <Navigation />

                <React.Suspense
                  fallback={
                    <div className="min-h-screen flex items-center justify-center">
                      <div className="flex flex-col items-center space-y-4">
                        <div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
                        <p className="text-muted-foreground animate-pulse">
                          Loading...
                        </p>
                      </div>
                    </div>
                  }
                >
                  <Routes>
                    {/* Public Routes */}
                    <Route path="/" element={<Landing />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/signup-user" element={<SignupUser />} />
                    <Route
                      path="/signup-business"
                      element={<SignupBusiness />}
                    />

                    {/* Legacy route redirects */}
                    <Route
                      path="/home"
                      element={<Navigate to="/user-home" replace />}
                    />
                    <Route
                      path="/dashboard"
                      element={<Navigate to="/business-dashboard" replace />}
                    />
                    <Route
                      path="/admin"
                      element={<Navigate to="/admin-dashboard" replace />}
                    />

                    {/* Protected User Routes */}
                    <Route
                      path="/user-home"
                      element={
                        <ProtectedRoute allowedRoles={["user"]}>
                          <UserHome />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/business/:id"
                      element={
                        <ProtectedRoute allowedRoles={["user"]}>
                          <BusinessDetail />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/queue-tracker"
                      element={
                        <ProtectedRoute allowedRoles={["user"]}>
                          <QueueTracker />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/user-profile"
                      element={
                        <ProtectedRoute
                          allowedRoles={["user", "business", "admin"]}
                        >
                          <UserProfile />
                        </ProtectedRoute>
                      }
                    />

                    {/* Protected Business Routes */}
                    <Route
                      path="/business-dashboard"
                      element={
                        <ProtectedRoute allowedRoles={["business"]}>
                          <BusinessDashboard />
                        </ProtectedRoute>
                      }
                    />

                    {/* Protected Admin Routes */}
                    <Route
                      path="/admin-dashboard"
                      element={
                        <ProtectedRoute allowedRoles={["admin"]}>
                          <AdminDashboard />
                        </ProtectedRoute>
                      }
                    />

                    {/* 404 Route */}
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </React.Suspense>

                {/* Enhanced Toast Notifications */}
                <Toaster
                  position="top-right"
                  expand={true}
                  richColors
                  closeButton
                  toastOptions={{
                    duration: 4000,
                    className: "glass border-0",
                    style: {
                      background: "var(--background)",
                      color: "var(--foreground)",
                      border: "1px solid var(--border)",
                    },
                  }}
                />
              </div>
            </Router>
          </NotificationProvider>
        </AppProvider>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;
