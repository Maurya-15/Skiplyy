import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence, useInView } from "framer-motion";
import {
  MapPin,
  Search,
  ArrowRight,
  Clock,
  Users,
  Star,
  CheckCircle,
  Zap,
  Shield,
  Heart,
  Play,
  ChevronDown,
  Sparkles,
  Globe,
  Smartphone,
  Brain,
  Target,
  Rocket,
  Waves,
} from "lucide-react";
import { mockBusinesses, BUSINESS_CATEGORIES } from "../data/mockData";
import { useAuth } from "../contexts/AuthContext";

const Landing: React.FC = () => {
  const { isAuthenticated, user } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [location, setLocation] = useState("New York, NY");
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const heroRef = useRef(null);
  const featuresRef = useRef(null);
  const isHeroInView = useInView(heroRef);
  const isFeaturesInView = useInView(featuresRef);

  // Handle mouse movement for interactive elements
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // Auto-rotate testimonials
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const filteredBusinesses =
    selectedCategory === "all"
      ? mockBusinesses.slice(0, 6)
      : mockBusinesses
          .filter((b) => b.category === selectedCategory)
          .slice(0, 6);

  const features = [
    {
      icon: <Brain className="w-8 h-8" />,
      title: "AI-Powered Predictions",
      description: "Smart algorithms predict optimal booking times",
      color: "from-purple-500 to-pink-500",
      delay: 0.1,
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: "Lightning Fast",
      description: "Book your spot in under 10 seconds",
      color: "from-yellow-500 to-orange-500",
      delay: 0.2,
    },
    {
      icon: <Globe className="w-8 h-8" />,
      title: "Global Network",
      description: "Connected to 50+ cities worldwide",
      color: "from-blue-500 to-cyan-500",
      delay: 0.3,
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Bank-Level Security",
      description: "Your data is protected with enterprise security",
      color: "from-green-500 to-emerald-500",
      delay: 0.4,
    },
    {
      icon: <Smartphone className="w-8 h-8" />,
      title: "Mobile First",
      description: "Seamless experience across all devices",
      color: "from-indigo-500 to-purple-500",
      delay: 0.5,
    },
    {
      icon: <Target className="w-8 h-8" />,
      title: "99.9% Accuracy",
      description: "Precise wait time predictions every time",
      color: "from-red-500 to-rose-500",
      delay: 0.6,
    },
  ];

  const stats = [
    {
      number: "2.5M+",
      label: "Active Users",
      icon: <Users className="w-6 h-6" />,
    },
    {
      number: "15,000+",
      label: "Partner Businesses",
      icon: <Building2 className="w-6 h-6" />,
    },
    {
      number: "50M+",
      label: "Queues Managed",
      icon: <Clock className="w-6 h-6" />,
    },
    {
      number: "4.9★",
      label: "User Rating",
      icon: <Star className="w-6 h-6" />,
    },
  ];

  const testimonials = [
    {
      text: "Skiply transformed how our hospital manages patient flow. 40% reduction in wait times!",
      author: "Dr. Sarah Chen",
      role: "Chief Medical Officer",
      company: "Metro General Hospital",
      image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
    },
    {
      text: "Our salon bookings increased 300% since using Skiply. Customers love the convenience!",
      author: "Maria Rodriguez",
      role: "Owner",
      company: "Luxe Beauty Salon",
      image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Maria",
    },
    {
      text: "No more standing in bank queues. Skiply made banking a pleasant experience again.",
      author: "James Thompson",
      role: "Premium Customer",
      company: "First National Bank",
      image: "https://api.dicebear.com/7.x/avataaars/svg?seed=James",
    },
  ];

  const categories = [
    { icon: "🏥", name: "Healthcare", count: "5,200+" },
    { icon: "💇‍♀️", name: "Beauty & Spa", count: "3,100+" },
    { icon: "🏦", name: "Banking", count: "2,800+" },
    { icon: "🍽️", name: "Restaurants", count: "4,500+" },
    { icon: "🏛️", name: "Government", count: "1,200+" },
    { icon: "💊", name: "Pharmacy", count: "2,400+" },
  ];

  return (
    <div className="min-h-screen overflow-hidden">
      {/* Floating Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute w-96 h-96 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-full blur-3xl"
          animate={{
            x: mousePosition.x / 20,
            y: mousePosition.y / 20,
          }}
          style={{
            left: "10%",
            top: "20%",
          }}
        />
        <motion.div
          className="absolute w-80 h-80 bg-gradient-to-r from-pink-500/10 to-yellow-500/10 rounded-full blur-3xl"
          animate={{
            x: -mousePosition.x / 30,
            y: -mousePosition.y / 30,
          }}
          style={{
            right: "10%",
            bottom: "20%",
          }}
        />
      </div>

      {/* Hero Section with Unique Layout */}
      <section
        ref={heroRef}
        className="relative min-h-screen flex items-center justify-center"
      >
        {/* Animated Grid Background */}
        <div className="absolute inset-0 opacity-20">
          <div className="grid grid-cols-20 grid-rows-20 h-full w-full">
            {Array.from({ length: 400 }).map((_, i) => (
              <motion.div
                key={i}
                className="border border-blue-200/20 dark:border-blue-800/20"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.001, duration: 0.5 }}
              />
            ))}
          </div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            {/* Floating Badge */}
            <motion.div
              initial={{ opacity: 0, y: -50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="inline-flex items-center px-6 py-3 mb-8 bg-gradient-to-r from-blue-500/10 to-purple-500/10 backdrop-blur-sm border border-white/20 rounded-full"
            >
              <Sparkles className="w-4 h-4 text-blue-500 mr-2" />
              <span className="text-sm font-medium bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                The Future of Queue Management
              </span>
            </motion.div>

            {/* Main Hero Title with Typewriter Effect */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.4 }}
              className="mb-8"
            >
              <h1 className="text-6xl md:text-8xl lg:text-9xl font-black mb-6">
                <span className="block text-gray-900 dark:text-white">
                  SKIP
                </span>
                <span className="block bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent animate-pulse">
                  WAIT
                </span>
                <span className="block text-gray-900 dark:text-white">
                  TIME
                </span>
              </h1>
            </motion.div>

            {/* Interactive Search Bar */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="max-w-4xl mx-auto mb-12"
            >
              <div className="relative bg-white/90 dark:bg-gray-900/90 backdrop-blur-lg rounded-3xl p-6 shadow-2xl border border-white/20">
                <div className="grid md:grid-cols-3 gap-4">
                  {/* Location Input with Icon */}
                  <div className="relative group">
                    <MapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 group-hover:text-blue-500 transition-colors" />
                    <input
                      type="text"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      className="w-full pl-12 pr-4 py-4 border-0 rounded-2xl bg-gray-50 dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all text-gray-900 dark:text-white placeholder-gray-500"
                      placeholder="Where are you?"
                    />
                  </div>

                  {/* Category Dropdown */}
                  <div className="relative">
                    <select
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className="w-full px-4 py-4 border-0 rounded-2xl bg-gray-50 dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 focus:outline-none appearance-none text-gray-900 dark:text-white"
                    >
                      <option value="all">All Services</option>
                      {BUSINESS_CATEGORIES.map((category) => (
                        <option key={category.value} value={category.value}>
                          {category.icon} {category.label}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
                  </div>

                  {/* Search Button */}
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 px-8 rounded-2xl font-bold text-lg shadow-xl hover:shadow-2xl transition-all duration-300 flex items-center justify-center space-x-2"
                  >
                    <Rocket className="w-5 h-5" />
                    <span>Find & Book</span>
                  </motion.button>
                </div>
              </div>
            </motion.div>

            {/* Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6 mb-16"
            >
              {!isAuthenticated ? (
                <>
                  <Link to="/signup-user">
                    <motion.button
                      whileHover={{
                        scale: 1.05,
                        boxShadow: "0 20px 40px rgba(59, 130, 246, 0.3)",
                      }}
                      whileTap={{ scale: 0.95 }}
                      className="px-10 py-5 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl font-bold text-xl shadow-xl transition-all duration-300"
                    >
                      Start Free Today
                    </motion.button>
                  </Link>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setIsVideoPlaying(true)}
                    className="flex items-center space-x-3 px-8 py-4 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-2xl font-semibold hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-300"
                  >
                    <Play className="w-5 h-5" />
                    <span>Watch Demo</span>
                  </motion.button>
                </>
              ) : (
                <Link
                  to={
                    user?.role === "user"
                      ? "/user-home"
                      : user?.role === "business"
                        ? "/business-dashboard"
                        : "/admin-dashboard"
                  }
                >
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-10 py-5 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl font-bold text-xl shadow-xl transition-all duration-300 flex items-center space-x-3"
                  >
                    <span>Go to Dashboard</span>
                    <ArrowRight className="w-5 h-5" />
                  </motion.button>
                </Link>
              )}
            </motion.div>

            {/* Live Stats Counter */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-8"
            >
              {stats.map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.2 + index * 0.1 }}
                  className="text-center group"
                >
                  <div className="flex items-center justify-center mb-2 text-blue-500">
                    {stat.icon}
                  </div>
                  <div className="text-3xl md:text-4xl font-black text-gray-900 dark:text-white mb-1 group-hover:scale-110 transition-transform">
                    {stat.number}
                  </div>
                  <div className="text-gray-600 dark:text-gray-400 font-medium">
                    {stat.label}
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="flex flex-col items-center space-y-2 text-gray-400"
          >
            <span className="text-sm font-medium">Discover More</span>
            <ChevronDown className="w-6 h-6" />
          </motion.div>
        </motion.div>
      </section>

      {/* Revolutionary Features Section */}
      <section
        ref={featuresRef}
        className="relative py-32 bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-blue-900/20"
      >
        {/* Floating Particles */}
        <div className="absolute inset-0 overflow-hidden">
          {Array.from({ length: 50 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-blue-500/20 rounded-full"
              animate={{
                y: [0, -100, 0],
                x: [0, Math.random() * 100 - 50, 0],
                opacity: [0, 1, 0],
              }}
              transition={{
                duration: Math.random() * 10 + 10,
                repeat: Infinity,
                delay: Math.random() * 5,
              }}
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
            />
          ))}
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <h2 className="text-5xl md:text-7xl font-black text-gray-900 dark:text-white mb-6">
              WHY{" "}
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                SKIPLY
              </span>
              ?
            </h2>
            <p className="text-2xl text-gray-600 dark:text-gray-300 max-w-4xl mx-auto">
              We're not just another booking app. We're revolutionizing how the
              world manages time.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: feature.delay, duration: 0.6 }}
                viewport={{ once: true }}
                whileHover={{
                  scale: 1.05,
                  rotateY: 5,
                  rotateX: 5,
                }}
                className="relative group perspective-1000"
              >
                <div className="relative bg-white/90 dark:bg-gray-800/90 backdrop-blur-lg p-8 rounded-3xl shadow-xl border border-white/20 overflow-hidden">
                  {/* Gradient Background */}
                  <div
                    className={`absolute inset-0 bg-gradient-to-r ${feature.color} opacity-5 group-hover:opacity-10 transition-opacity`}
                  />

                  {/* Icon */}
                  <div className={`flex justify-center mb-6`}>
                    <div
                      className={`p-4 rounded-2xl bg-gradient-to-r ${feature.color} text-white shadow-lg group-hover:scale-110 transition-transform`}
                    >
                      {feature.icon}
                    </div>
                  </div>

                  {/* Content */}
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 text-center">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 text-center text-lg">
                    {feature.description}
                  </p>

                  {/* Hover Effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity rounded-3xl" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Carousel */}
      <section className="py-32 bg-gradient-to-r from-blue-600 to-purple-600 relative overflow-hidden">
        {/* Animated Waves */}
        <div className="absolute inset-0">
          <Waves className="absolute bottom-0 left-0 w-full h-20 text-white/10" />
          <Waves className="absolute top-0 right-0 w-full h-20 text-white/10 transform rotate-180" />
        </div>

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-5xl md:text-6xl font-black text-white mb-6">
              LOVED BY MILLIONS
            </h2>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto">
              Real stories from real people who transformed their waiting
              experience
            </p>
          </motion.div>

          <div className="relative">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentTestimonial}
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ duration: 0.5 }}
                className="bg-white/10 backdrop-blur-lg rounded-3xl p-12 border border-white/20"
              >
                <div className="text-center">
                  <img
                    src={testimonials[currentTestimonial].image}
                    alt={testimonials[currentTestimonial].author}
                    className="w-20 h-20 rounded-full mx-auto mb-6 shadow-xl"
                  />
                  <blockquote className="text-2xl md:text-3xl text-white font-light italic mb-8 leading-relaxed">
                    "{testimonials[currentTestimonial].text}"
                  </blockquote>
                  <div className="text-white">
                    <div className="font-bold text-xl">
                      {testimonials[currentTestimonial].author}
                    </div>
                    <div className="text-blue-200">
                      {testimonials[currentTestimonial].role}
                    </div>
                    <div className="text-blue-300 text-sm">
                      {testimonials[currentTestimonial].company}
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Testimonial Dots */}
            <div className="flex justify-center mt-8 space-x-3">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentTestimonial(index)}
                  className={`w-3 h-3 rounded-full transition-all ${
                    index === currentTestimonial
                      ? "bg-white scale-125"
                      : "bg-white/50 hover:bg-white/75"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Categories Showcase */}
      <section className="py-32 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <h2 className="text-5xl md:text-6xl font-black text-gray-900 dark:text-white mb-6">
              EVERYWHERE YOU{" "}
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                NEED
              </span>
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              From hospitals to salons, banks to restaurants - we've got you
              covered
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {categories.map((category, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.05, y: -10 }}
                className="bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-lg border border-gray-200 dark:border-gray-700 text-center group cursor-pointer"
              >
                <div className="text-6xl mb-4 group-hover:scale-110 transition-transform">
                  {category.icon}
                </div>
                <h3 className="font-bold text-gray-900 dark:text-white mb-2">
                  {category.name}
                </h3>
                <p className="text-blue-600 dark:text-blue-400 font-semibold">
                  {category.count}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0">
          <div
            className={
              'absolute inset-0 bg-[url(\'data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.05"%3E%3Ccircle cx="7" cy="7" r="1"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\')] opacity-50'
            }
          />
        </div>

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-5xl md:text-7xl font-black text-white mb-8">
              READY TO{" "}
              <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                TRANSFORM
              </span>
              <br />
              YOUR EXPERIENCE?
            </h2>
            <p className="text-2xl text-blue-100 mb-12 max-w-3xl mx-auto">
              Join millions who never wait in line anymore. The future is here.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center space-y-6 sm:space-y-0 sm:space-x-8">
              {!isAuthenticated ? (
                <>
                  <Link to="/signup-user">
                    <motion.button
                      whileHover={{
                        scale: 1.05,
                        boxShadow: "0 25px 50px rgba(59, 130, 246, 0.4)",
                      }}
                      whileTap={{ scale: 0.95 }}
                      className="px-12 py-6 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-2xl font-bold text-2xl shadow-2xl transition-all duration-300"
                    >
                      Start Free Today
                    </motion.button>
                  </Link>
                  <Link to="/signup-business">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-12 py-6 border-2 border-white text-white rounded-2xl font-bold text-2xl hover:bg-white hover:text-gray-900 transition-all duration-300"
                    >
                      List Your Business
                    </motion.button>
                  </Link>
                </>
              ) : (
                <Link
                  to={
                    user?.role === "user"
                      ? "/user-home"
                      : user?.role === "business"
                        ? "/business-dashboard"
                        : "/admin-dashboard"
                  }
                >
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-12 py-6 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-2xl font-bold text-2xl shadow-2xl transition-all duration-300"
                  >
                    Go to Dashboard
                  </motion.button>
                </Link>
              )}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-12">
            <div className="md:col-span-2">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center">
                  <span className="text-white font-bold text-2xl">S</span>
                </div>
                <span className="text-3xl font-black">SKIPLY</span>
              </div>
              <p className="text-gray-400 mb-6 text-lg leading-relaxed">
                Revolutionizing queue management for the modern world. Save
                time, skip the wait, live better.
              </p>
              <div className="flex space-x-4">
                {/* Social Media Icons would go here */}
              </div>
            </div>

            <div>
              <h3 className="font-bold text-xl mb-6">For Users</h3>
              <ul className="space-y-3 text-gray-400">
                <li>
                  <Link
                    to="/user-home"
                    className="hover:text-white transition-colors"
                  >
                    Browse Services
                  </Link>
                </li>
                <li>
                  <Link
                    to="/signup-user"
                    className="hover:text-white transition-colors"
                  >
                    Sign Up
                  </Link>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    How it Works
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Mobile App
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-bold text-xl mb-6">For Businesses</h3>
              <ul className="space-y-3 text-gray-400">
                <li>
                  <Link
                    to="/signup-business"
                    className="hover:text-white transition-colors"
                  >
                    Register Business
                  </Link>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Pricing
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Features
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    API
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-16 pt-8 text-center text-gray-400">
            <p className="text-lg">
              &copy; 2024 Skiply. All rights reserved. Built with ❤️ for a
              better tomorrow.
            </p>
          </div>
        </div>
      </footer>

      {/* Video Modal */}
      <AnimatePresence>
        {isVideoPlaying && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
            onClick={() => setIsVideoPlaying(false)}
          >
            <motion.div
              initial={{ scale: 0.5 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.5 }}
              className="bg-white rounded-3xl p-8 max-w-4xl w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="aspect-video bg-gray-200 rounded-2xl flex items-center justify-center">
                <p className="text-gray-600 text-xl">Demo Video Coming Soon!</p>
              </div>
              <button
                onClick={() => setIsVideoPlaying(false)}
                className="mt-6 px-6 py-3 bg-gray-900 text-white rounded-xl hover:bg-gray-800 transition-colors"
              >
                Close
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Landing;
