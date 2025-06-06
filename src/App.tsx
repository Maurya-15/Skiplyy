import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Context Providers
import { AuthProvider } from "@/contexts/AuthContext";
import { AppProvider } from "@/contexts/AppContext";

// Components
import { Navigation } from "@/components/Navigation";
import { ProtectedRoute } from "@/components/ProtectedRoute";

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

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <AppProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <div className="min-h-screen">
              <Navigation />
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<Landing />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup-user" element={<SignupUser />} />
                <Route path="/signup-business" element={<SignupBusiness />} />

                {/* User Routes */}
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

                {/* Business Routes */}
                <Route
                  path="/dashboard"
                  element={
                    <ProtectedRoute allowedRoles={["business"]}>
                      <BusinessDashboard />
                    </ProtectedRoute>
                  }
                />

                {/* Admin Routes */}
                <Route
                  path="/admin"
                  element={
                    <ProtectedRoute allowedRoles={["admin"]}>
                      <AdminDashboard />
                    </ProtectedRoute>
                  }
                />

                {/* Catch-all route - must be last */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </div>
          </BrowserRouter>
        </AppProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
