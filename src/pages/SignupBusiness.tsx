import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Eye,
  EyeOff,
  User,
  Mail,
  Building2,
  MapPin,
  Lock,
  Loader2,
  Plus,
  Trash2,
  Clock,
  DollarSign,
  BarChart3,
  Users,
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { BUSINESS_CATEGORIES } from "../data/mockData";
import { BusinessCategory } from "../types";

const signupSchema = z
  .object({
    ownerName: z.string().min(2, "Owner name must be at least 2 characters"),
    businessName: z
      .string()
      .min(2, "Business name must be at least 2 characters"),
    email: z.string().email("Please enter a valid email address"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        "Password must contain at least one uppercase letter, one lowercase letter, and one number",
      ),
    confirmPassword: z.string(),
    category: z.string().min(1, "Please select a business category"),
    address: z.string().min(5, "Please enter a complete address"),
    description: z.string().optional(),
    departments: z
      .array(z.string().min(1, "Department name is required"))
      .min(1, "At least one department is required"),
    openingHours: z.object({
      monday: z.object({
        start: z.string(),
        end: z.string(),
        closed: z.boolean(),
      }),
      tuesday: z.object({
        start: z.string(),
        end: z.string(),
        closed: z.boolean(),
      }),
      wednesday: z.object({
        start: z.string(),
        end: z.string(),
        closed: z.boolean(),
      }),
      thursday: z.object({
        start: z.string(),
        end: z.string(),
        closed: z.boolean(),
      }),
      friday: z.object({
        start: z.string(),
        end: z.string(),
        closed: z.boolean(),
      }),
      saturday: z.object({
        start: z.string(),
        end: z.string(),
        closed: z.boolean(),
      }),
      sunday: z.object({
        start: z.string(),
        end: z.string(),
        closed: z.boolean(),
      }),
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

type SignupFormData = z.infer<typeof signupSchema>;

const SignupBusiness: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const { signupBusiness, isLoading } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors },
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      ownerName: "",
      businessName: "",
      email: "",
      password: "",
      confirmPassword: "",
      category: "",
      address: "",
      description: "",
      departments: ["General Service"],
      openingHours: {
        monday: { start: "09:00", end: "17:00", closed: false },
        tuesday: { start: "09:00", end: "17:00", closed: false },
        wednesday: { start: "09:00", end: "17:00", closed: false },
        thursday: { start: "09:00", end: "17:00", closed: false },
        friday: { start: "09:00", end: "17:00", closed: false },
        saturday: { start: "09:00", end: "17:00", closed: false },
        sunday: { start: "09:00", end: "17:00", closed: true },
      },
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "departments",
  });

  const password = watch("password");

  const onSubmit = async (data: SignupFormData) => {
    try {
      await signupBusiness({
        ownerName: data.ownerName,
        businessName: data.businessName,
        email: data.email,
        password: data.password,
        category: data.category as BusinessCategory,
        address: data.address,
        description: data.description,
        departments: data.departments,
        openingHours: data.openingHours,
      });
      navigate("/dashboard");
    } catch (error) {
      // Error is already handled in the context with toast
    }
  };

  const benefits = [
    {
      icon: <Users className="w-6 h-6 text-blue-500" />,
      title: "Reduce Wait Times",
      description: "Help customers book ahead and reduce crowding",
    },
    {
      icon: <BarChart3 className="w-6 h-6 text-green-500" />,
      title: "Analytics Dashboard",
      description: "Track queue metrics and optimize efficiency",
    },
    {
      icon: <DollarSign className="w-6 h-6 text-purple-500" />,
      title: "Increase Revenue",
      description: "Better customer experience leads to more business",
    },
    {
      icon: <Clock className="w-6 h-6 text-orange-500" />,
      title: "Save Time",
      description: "Automated queue management saves staff time",
    },
  ];

  const getPasswordStrength = (password: string) => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/\d/.test(password)) strength++;
    if (/[^a-zA-Z\d]/.test(password)) strength++;
    return strength;
  };

  const passwordStrength = getPasswordStrength(password);

  const days = [
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
    "sunday",
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-5 gap-12">
          {/* Left Side - Benefits */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="lg:col-span-2 hidden lg:block"
          >
            <div className="sticky top-8 space-y-6">
              <div>
                <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
                  Transform Your Business with Smart Queue Management
                </h1>
                <p className="text-xl text-gray-600 dark:text-gray-300">
                  Join hundreds of businesses that have revolutionized their
                  customer experience with Skiply.
                </p>
              </div>

              <div className="grid gap-6">
                {benefits.map((benefit, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 + index * 0.1, duration: 0.6 }}
                    className="flex items-start space-x-4"
                  >
                    <div className="flex-shrink-0">{benefit.icon}</div>
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                        {benefit.title}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-300 text-sm">
                        {benefit.description}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>

              <div className="p-6 bg-gradient-to-r from-blue-500/10 to-purple-500/10 dark:from-blue-500/20 dark:to-purple-500/20 rounded-2xl border border-blue-200/50 dark:border-blue-700/50">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                  🚀 Launch Special
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Get started with Skiply for free during our launch period. No
                  setup fees, no monthly charges for the first 3 months!
                </p>
              </div>
            </div>
          </motion.div>

          {/* Right Side - Signup Form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="lg:col-span-3"
          >
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 dark:border-gray-700/20 p-8">
              {/* Header */}
              <div className="text-center mb-8">
                <Link
                  to="/"
                  className="inline-flex items-center space-x-3 mb-6"
                >
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-lg">S</span>
                  </div>
                  <span className="text-xl font-bold text-gray-900 dark:text-white">
                    Skiply
                  </span>
                </Link>

                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  Register Your Business
                </h2>
                <p className="text-gray-600 dark:text-gray-400">
                  Start managing queues efficiently with Skiply
                </p>
              </div>

              {/* Signup Form */}
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* Basic Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Basic Information
                  </h3>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label
                        htmlFor="ownerName"
                        className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                      >
                        Owner Name
                      </label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <input
                          {...register("ownerName")}
                          type="text"
                          id="ownerName"
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors"
                          placeholder="Your full name"
                        />
                      </div>
                      {errors.ownerName && (
                        <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                          {errors.ownerName.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <label
                        htmlFor="businessName"
                        className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                      >
                        Business Name
                      </label>
                      <div className="relative">
                        <Building2 className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <input
                          {...register("businessName")}
                          type="text"
                          id="businessName"
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors"
                          placeholder="Your business name"
                        />
                      </div>
                      {errors.businessName && (
                        <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                          {errors.businessName.message}
                        </p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                    >
                      Business Email
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <input
                        {...register("email")}
                        type="email"
                        id="email"
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors"
                        placeholder="business@example.com"
                      />
                    </div>
                    {errors.email && (
                      <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                        {errors.email.message}
                      </p>
                    )}
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label
                        htmlFor="category"
                        className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                      >
                        Business Category
                      </label>
                      <select
                        {...register("category")}
                        id="category"
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors"
                      >
                        <option value="">Select category</option>
                        {BUSINESS_CATEGORIES.map((category) => (
                          <option key={category.value} value={category.value}>
                            {category.icon} {category.label}
                          </option>
                        ))}
                      </select>
                      {errors.category && (
                        <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                          {errors.category.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <label
                        htmlFor="address"
                        className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                      >
                        Business Address
                      </label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <input
                          {...register("address")}
                          type="text"
                          id="address"
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors"
                          placeholder="Complete address"
                        />
                      </div>
                      {errors.address && (
                        <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                          {errors.address.message}
                        </p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="description"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                    >
                      Business Description (Optional)
                    </label>
                    <textarea
                      {...register("description")}
                      id="description"
                      rows={3}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors"
                      placeholder="Brief description of your business..."
                    />
                  </div>
                </div>

                {/* Departments */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Departments/Services
                  </h3>

                  <div className="space-y-3">
                    {fields.map((field, index) => (
                      <div
                        key={field.id}
                        className="flex items-center space-x-3"
                      >
                        <input
                          {...register(`departments.${index}` as const)}
                          type="text"
                          className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors"
                          placeholder="Department name"
                        />
                        {fields.length > 1 && (
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            type="button"
                            onClick={() => remove(index)}
                            className="p-3 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </motion.button>
                        )}
                      </div>
                    ))}

                    {errors.departments && (
                      <p className="text-sm text-red-600 dark:text-red-400">
                        {errors.departments.message ||
                          errors.departments.root?.message}
                      </p>
                    )}

                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      type="button"
                      onClick={() => append("")}
                      className="flex items-center space-x-2 px-4 py-2 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg text-gray-600 dark:text-gray-400 hover:border-blue-500 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Add Department</span>
                    </motion.button>
                  </div>
                </div>

                {/* Operating Hours */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Operating Hours
                  </h3>

                  <div className="grid gap-3">
                    {days.map((day) => (
                      <div key={day} className="flex items-center space-x-4">
                        <div className="w-20 text-sm font-medium text-gray-700 dark:text-gray-300 capitalize">
                          {day}
                        </div>

                        <div className="flex items-center space-x-2">
                          <input
                            {...register(`openingHours.${day}.closed` as const)}
                            type="checkbox"
                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          />
                          <span className="text-sm text-gray-600 dark:text-gray-400">
                            Closed
                          </span>
                        </div>

                        <div className="flex items-center space-x-2 flex-1">
                          <input
                            {...register(`openingHours.${day}.start` as const)}
                            type="time"
                            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors"
                          />
                          <span className="text-gray-500">to</span>
                          <input
                            {...register(`openingHours.${day}.end` as const)}
                            type="time"
                            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Password */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Account Security
                  </h3>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label
                        htmlFor="password"
                        className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                      >
                        Password
                      </label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <input
                          {...register("password")}
                          type={showPassword ? "text" : "password"}
                          id="password"
                          className="w-full pl-10 pr-12 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors"
                          placeholder="Create a strong password"
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

                      {password && (
                        <div className="mt-2">
                          <div className="flex space-x-1">
                            {[1, 2, 3, 4, 5].map((level) => (
                              <div
                                key={level}
                                className={`h-1 flex-1 rounded ${
                                  level <= passwordStrength
                                    ? passwordStrength < 3
                                      ? "bg-red-400"
                                      : passwordStrength < 4
                                        ? "bg-yellow-400"
                                        : "bg-green-400"
                                    : "bg-gray-200 dark:bg-gray-600"
                                }`}
                              />
                            ))}
                          </div>
                        </div>
                      )}

                      {errors.password && (
                        <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                          {errors.password.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <label
                        htmlFor="confirmPassword"
                        className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                      >
                        Confirm Password
                      </label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <input
                          {...register("confirmPassword")}
                          type={showConfirmPassword ? "text" : "password"}
                          id="confirmPassword"
                          className="w-full pl-10 pr-12 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors"
                          placeholder="Confirm your password"
                        />
                        <button
                          type="button"
                          onClick={() =>
                            setShowConfirmPassword(!showConfirmPassword)
                          }
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                        >
                          {showConfirmPassword ? (
                            <EyeOff className="w-4 h-4" />
                          ) : (
                            <Eye className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                      {errors.confirmPassword && (
                        <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                          {errors.confirmPassword.message}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 px-4 rounded-lg font-semibold hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Creating account...</span>
                    </>
                  ) : (
                    <span>Create Business Account</span>
                  )}
                </motion.button>
              </form>

              {/* Footer Links */}
              <div className="mt-6 text-center space-y-2">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Already have an account?{" "}
                  <Link
                    to="/login"
                    className="text-blue-600 dark:text-blue-400 font-medium hover:underline"
                  >
                    Sign in
                  </Link>
                </p>

                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Are you a customer?{" "}
                  <Link
                    to="/signup-user"
                    className="text-blue-600 dark:text-blue-400 font-medium hover:underline"
                  >
                    Sign up here
                  </Link>
                </p>

                <Link
                  to="/"
                  className="inline-block text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
                >
                  ← Back to home
                </Link>
              </div>

              {/* Terms */}
              <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-600">
                <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
                  By creating an account, you agree to our{" "}
                  <a
                    href="#"
                    className="text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    Terms of Service
                  </a>{" "}
                  and{" "}
                  <a
                    href="#"
                    className="text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    Privacy Policy
                  </a>
                  .
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default SignupBusiness;
