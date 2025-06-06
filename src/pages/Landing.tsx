import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LocationSearch } from "@/components/LocationSearch";
import { CategoryFilter } from "@/components/CategoryFilter";
import { BusinessCard } from "@/components/BusinessCard";
import { useApp } from "@/contexts/AppContext";
import { useAuth } from "@/contexts/AuthContext";
import { ArrowRight, Clock, Users, CheckCircle, Star } from "lucide-react";
import { motion } from "framer-motion";

export default function Landing() {
  const { nearbyBusinesses, isLoading } = useApp();
  const { isAuthenticated, user } = useAuth();

  const features = [
    {
      icon: <Clock className="w-6 h-6 text-blue-500" />,
      title: "Real-time Queue Updates",
      description: "See live wait times and your position in the queue",
    },
    {
      icon: <Users className="w-6 h-6 text-green-500" />,
      title: "Smart Booking System",
      description: "Book your spot in advance and skip the physical waiting",
    },
    {
      icon: <CheckCircle className="w-6 h-6 text-purple-500" />,
      title: "Easy Management",
      description: "Track all your bookings in one convenient dashboard",
    },
  ];

  const stats = [
    { number: "10,000+", label: "Happy Customers" },
    { number: "500+", label: "Partner Businesses" },
    { number: "50,000+", label: "Queues Managed" },
    {
      number: "4.8",
      label: "Average Rating",
      icon: <Star className="w-4 h-4" />,
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Badge className="mb-4 px-4 py-2 text-sm bg-primary/10 text-primary border-primary/20">
                🚀 Smart Queue Management Platform
              </Badge>

              <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6 leading-tight">
                Skip the Wait,
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  {" "}
                  Book Your Spot
                </span>
              </h1>

              <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
                Join thousands of people who save time every day by booking
                their spot in queues for hospitals, salons, banks, restaurants,
                and government offices.
              </p>
            </motion.div>

            {/* Search Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-border/50 max-w-2xl mx-auto mb-8"
            >
              <div className="space-y-4">
                <div className="text-left">
                  <label className="text-sm font-medium text-foreground">
                    Your Location
                  </label>
                  <div className="mt-2">
                    <LocationSearch />
                  </div>
                </div>

                <div className="text-left">
                  <label className="text-sm font-medium text-foreground">
                    Service Category
                  </label>
                  <div className="mt-2">
                    <CategoryFilter />
                  </div>
                </div>

                <Button size="lg" className="w-full">
                  <Link
                    to={
                      isAuthenticated
                        ? user?.role === "user"
                          ? "/home"
                          : "/dashboard"
                        : "/signup-user"
                    }
                    className="flex items-center"
                  >
                    Explore Nearby Queues
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Link>
                </Button>
              </div>
            </motion.div>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-4"
            >
              {!isAuthenticated ? (
                <>
                  <Button asChild size="lg" className="px-8">
                    <Link to="/signup-user">Get Started Free</Link>
                  </Button>
                  <Button asChild variant="outline" size="lg" className="px-8">
                    <Link to="/login">Sign In</Link>
                  </Button>
                  <Button asChild variant="ghost" size="lg">
                    <Link to="/signup-business">For Businesses</Link>
                  </Button>
                </>
              ) : (
                <Button asChild size="lg" className="px-8">
                  <Link to={user?.role === "user" ? "/home" : "/dashboard"}>
                    Go to Dashboard
                  </Link>
                </Button>
              )}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-primary/5">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 + index * 0.1 }}
                className="text-center"
              >
                <div className="flex items-center justify-center space-x-2 mb-2">
                  <span className="text-3xl font-bold text-primary">
                    {stat.number}
                  </span>
                  {stat.icon}
                </div>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Why Choose Skiply?
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Experience the future of queue management with our smart,
              efficient, and user-friendly platform.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 1 + index * 0.2 }}
              >
                <Card className="h-full text-center p-6 hover:shadow-lg transition-shadow bg-card/50 backdrop-blur-sm">
                  <CardContent className="space-y-4">
                    <div className="flex justify-center">{feature.icon}</div>
                    <h3 className="text-xl font-semibold text-foreground">
                      {feature.title}
                    </h3>
                    <p className="text-muted-foreground">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Businesses */}
      {nearbyBusinesses.length > 0 && (
        <section className="py-20 bg-muted/30">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.4 }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                Popular Services Near You
              </h2>
              <p className="text-lg text-muted-foreground">
                Join the queue at these top-rated businesses in your area
              </p>
            </motion.div>

            {isLoading ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <Card key={i} className="h-64 animate-pulse bg-muted/50" />
                ))}
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {nearbyBusinesses.slice(0, 6).map((business, index) => (
                  <BusinessCard
                    key={business.id}
                    business={business}
                    index={index}
                  />
                ))}
              </div>
            )}

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.8 }}
              className="text-center mt-12"
            >
              <Button asChild size="lg" variant="outline">
                <Link to={isAuthenticated ? "/home" : "/signup-user"}>
                  View All Businesses
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Link>
              </Button>
            </motion.div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 2 }}
            className="max-w-3xl mx-auto"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Ready to Save Time and Skip the Wait?
            </h2>
            <p className="text-xl text-blue-100 mb-8">
              Join thousands of satisfied users who never wait in line anymore.
            </p>
            <div className="space-y-4 sm:space-y-0 sm:space-x-4 sm:flex sm:justify-center">
              {!isAuthenticated ? (
                <>
                  <Button
                    asChild
                    size="lg"
                    variant="secondary"
                    className="bg-white text-blue-600 hover:bg-blue-50"
                  >
                    <Link to="/signup-user">Start Booking Now</Link>
                  </Button>
                  <Button
                    asChild
                    size="lg"
                    variant="outline"
                    className="border-white text-white hover:bg-white hover:text-blue-600"
                  >
                    <Link to="/signup-business">List Your Business</Link>
                  </Button>
                </>
              ) : (
                <Button
                  asChild
                  size="lg"
                  variant="secondary"
                  className="bg-white text-blue-600 hover:bg-blue-50"
                >
                  <Link to={user?.role === "user" ? "/home" : "/dashboard"}>
                    Go to Your Dashboard
                  </Link>
                </Button>
              )}
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
