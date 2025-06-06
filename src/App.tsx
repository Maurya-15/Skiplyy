import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "sonner";

// Context Providers
import { AuthProvider } from "./contexts/AuthContext";
import { ThemeProvider } from "./contexts/ThemeContext";

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

// Lazy load other pages for better performance
const QueueTracker = React.lazy(() => import("./pages/QueueTracker"));
const UserProfile = React.lazy(() => import("./pages/UserProfile"));
const BusinessDashboard = React.lazy(() => import("./pages/BusinessDashboard"));
const AdminDashboard = React.lazy(() => import("./pages/AdminDashboard"));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: 1,
    },
  },
});

const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AuthProvider>
          <Router>
            <div className="min-h-screen bg-background text-foreground">
              <Navigation />

              <React.Suspense
                fallback={
                  <div className="min-h-screen flex items-center justify-center">
                    <div className="flex flex-col items-center space-y-4">
                      <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
                      <p className="text-gray-600 dark:text-gray-400">
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
                  <Route path="/signup-business" element={<SignupBusiness />} />

                  {/* Protected User Routes */}
                  <Route
                    path="/home"
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
                    path="/queue/:id"
                    element={
                      <ProtectedRoute allowedRoles={["user"]}>
                        <QueueTracker />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/profile"
                    element={
                      <ProtectedRoute allowedRoles={["user"]}>
                        <UserProfile />
                      </ProtectedRoute>
                    }
                  />

                  {/* Protected Business Routes */}
                  <Route
                    path="/dashboard"
                    element={
                      <ProtectedRoute allowedRoles={["business"]}>
                        <BusinessDashboard />
                      </ProtectedRoute>
                    }
                  />

                  {/* Protected Admin Routes */}
                  <Route
                    path="/admin"
                    element={
                      <ProtectedRoute allowedRoles={["admin"]}>
                        <AdminDashboard />
                      </ProtectedRoute>
                    }
                  />

                  {/* 404 Route */}
                  <Route
                    path="*"
                    element={
                      <div className="min-h-screen flex items-center justify-center">
                        <div className="text-center">
                          <div className="text-6xl mb-4">🔍</div>
                          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
                            Page Not Found
                          </h1>
                          <p className="text-gray-600 dark:text-gray-400 mb-6">
                            The page you're looking for doesn't exist.
                          </p>
                          <a
                            href="/"
                            className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                          >
                            Go Home
                          </a>
                        </div>
                      </div>
                    }
                  />
                </Routes>
              </React.Suspense>

              {/* Toast Notifications */}
              <Toaster
                position="top-right"
                toastOptions={{
                  duration: 4000,
                  style: {
                    background: "var(--background)",
                    color: "var(--foreground)",
                    border: "1px solid var(--border)",
                  },
                }}
              />
            </div>
          </Router>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;
