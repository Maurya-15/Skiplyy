import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Eye, EyeOff, User, Building2, Loader2 } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { toast } from "sonner";

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.enum(["user", "business"]),
});

type LoginFormData = z.infer<typeof loginSchema>;

const Login: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const { login, isLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || "/";

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      role: "user",
    },
  });

  const selectedRole = watch("role");

  const onSubmit = async (data: LoginFormData) => {
    try {
      await login(data.email, data.password, data.role);

      // Redirect based on role
      if (data.role === "user") {
        navigate("/home");
      } else if (data.role === "business") {
        navigate("/dashboard");
      } else {
        navigate(from, { replace: true });
      }
    } catch (error) {
      // Error is already handled in the context with toast
    }
  };

  const demoAccounts = [
    {
      email: "john@example.com",
      password: "password123",
      role: "user",
      name: "Customer Account",
    },
    {
      email: "michael@cityhospital.com",
      password: "password123",
      role: "business",
      name: "Business Owner",
    },
    {
      email: "admin@skiply.com",
      password: "admin123",
      role: "admin",
      name: "Admin Account",
    },
  ];

  const fillDemoCredentials = (account: (typeof demoAccounts)[0]) => {
    setValue("email", account.email);
    setValue("password", account.password);
    setValue("role", account.role as "user" | "business");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md"
      >
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 dark:border-gray-700/20 p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <Link to="/" className="inline-flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">S</span>
              </div>
              <span className="text-xl font-bold text-gray-900 dark:text-white">
                Skiply
              </span>
            </Link>

            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Welcome back
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Sign in to your account to continue
            </p>
          </div>

          {/* Role Selector */}
          <div className="mb-6">
            <div className="grid grid-cols-2 gap-1 p-1 bg-gray-100 dark:bg-gray-700 rounded-lg">
              <motion.button
                whileTap={{ scale: 0.95 }}
                type="button"
                onClick={() => setValue("role", "user")}
                className={`
                  flex items-center justify-center space-x-2 py-2 px-4 rounded-md transition-all
                  ${
                    selectedRole === "user"
                      ? "bg-white dark:bg-gray-600 text-blue-600 dark:text-blue-400 shadow-sm"
                      : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                  }
                `}
              >
                <User className="w-4 h-4" />
                <span className="font-medium">Customer</span>
              </motion.button>

              <motion.button
                whileTap={{ scale: 0.95 }}
                type="button"
                onClick={() => setValue("role", "business")}
                className={`
                  flex items-center justify-center space-x-2 py-2 px-4 rounded-md transition-all
                  ${
                    selectedRole === "business"
                      ? "bg-white dark:bg-gray-600 text-blue-600 dark:text-blue-400 shadow-sm"
                      : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                  }
                `}
              >
                <Building2 className="w-4 h-4" />
                <span className="font-medium">Business</span>
              </motion.button>
            </div>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Email address
              </label>
              <input
                {...register("email")}
                type="email"
                id="email"
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors"
                placeholder="Enter your email"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Password
              </label>
              <div className="relative">
                <input
                  {...register("password")}
                  type={showPassword ? "text" : "password"}
                  id="password"
                  className="w-full px-4 py-3 pr-12 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                  {errors.password.message}
                </p>
              )}
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-4 rounded-lg font-semibold hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Signing in...</span>
                </>
              ) : (
                <span>Sign In</span>
              )}
            </motion.button>
          </form>

          {/* Demo Accounts */}
          <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              Demo Accounts:
            </h3>
            <div className="space-y-2">
              {demoAccounts.map((account, index) => (
                <button
                  key={index}
                  onClick={() => fillDemoCredentials(account)}
                  className="w-full text-left p-2 text-xs bg-white dark:bg-gray-600 rounded border hover:bg-gray-50 dark:hover:bg-gray-500 transition-colors"
                >
                  <div className="font-medium text-gray-900 dark:text-white">
                    {account.name}
                  </div>
                  <div className="text-gray-500 dark:text-gray-400">
                    {account.email}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Footer Links */}
          <div className="mt-6 text-center space-y-2">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Don't have an account?{" "}
              <Link
                to={
                  selectedRole === "user" ? "/signup-user" : "/signup-business"
                }
                className="text-blue-600 dark:text-blue-400 font-medium hover:underline"
              >
                Sign up
              </Link>
            </p>

            <Link
              to="/"
              className="inline-block text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
            >
              ← Back to home
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
