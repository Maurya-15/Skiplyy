import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star, MapPin, Clock, Users } from "lucide-react";
import { Business } from "@/lib/types";
import { BUSINESS_CATEGORIES } from "@/lib/constants";
import { motion } from "framer-motion";

interface BusinessCardProps {
  business: Business;
  index?: number;
}

export function BusinessCard({ business, index = 0 }: BusinessCardProps) {
  const category = BUSINESS_CATEGORIES.find(
    (c) => c.value === business.category,
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
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
    >
      <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 group bg-card/50 backdrop-blur-sm border border-border/50">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-3">
              <div className="text-2xl">{category?.icon}</div>
              <div>
                <h3 className="font-semibold text-lg group-hover:text-primary transition-colors">
                  {business.name}
                </h3>
                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                  <MapPin className="w-3 h-3" />
                  <span className="truncate max-w-[200px]">
                    {business.address}
                  </span>
                </div>
              </div>
            </div>
            <Badge variant="secondary" className="text-xs">
              {category?.label}
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Rating */}
          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-1">
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              <span className="font-medium">{business.rating.toFixed(1)}</span>
            </div>
            <span className="text-sm text-muted-foreground">
              ({business.totalReviews} reviews)
            </span>
          </div>

          {/* Queue Info */}
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="flex items-center space-x-2">
              <Users className="w-4 h-4 text-blue-500" />
              <div>
                <div className="font-medium">{totalQueueSize} in queue</div>
                <div className="text-muted-foreground text-xs">
                  Current wait
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Clock className="w-4 h-4 text-green-500" />
              <div>
                <div className="font-medium">{averageWaitTime} min</div>
                <div className="text-muted-foreground text-xs">Est. time</div>
              </div>
            </div>
          </div>

          {/* Departments */}
          <div className="space-y-2">
            <h4 className="text-sm font-medium">Available Services:</h4>
            <div className="flex flex-wrap gap-1">
              {business.departments.slice(0, 3).map((dept) => (
                <Badge key={dept.id} variant="outline" className="text-xs">
                  {dept.name}
                </Badge>
              ))}
              {business.departments.length > 3 && (
                <Badge variant="outline" className="text-xs">
                  +{business.departments.length - 3} more
                </Badge>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-2 pt-2">
            <Button asChild variant="outline" size="sm" className="flex-1">
              <Link to={`/business/${business.id}`}>View Details</Link>
            </Button>
            <Button asChild size="sm" className="flex-1">
              <Link to={`/business/${business.id}`}>Book Now</Link>
            </Button>
          </div>

          {/* Status Indicator */}
          <div className="flex items-center justify-center pt-2">
            <div
              className={`flex items-center space-x-2 text-xs ${
                business.isAcceptingBookings ? "text-green-600" : "text-red-600"
              }`}
            >
              <div
                className={`w-2 h-2 rounded-full ${
                  business.isAcceptingBookings ? "bg-green-500" : "bg-red-500"
                }`}
              />
              <span>
                {business.isAcceptingBookings
                  ? "Accepting bookings"
                  : "Closed for bookings"}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
