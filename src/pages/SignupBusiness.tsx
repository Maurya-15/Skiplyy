import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useAuth } from "@/contexts/AuthContext";
import { SignupBusinessForm, BusinessCategory } from "@/lib/types";
import { BUSINESS_CATEGORIES } from "@/lib/constants";
import {
  Eye,
  EyeOff,
  AlertCircle,
  Loader2,
  Building2,
  Users,
  BarChart3,
} from "lucide-react";

const signupSchema = z
  .object({
    ownerName: z.string().min(2, "Name must be at least 2 characters"),
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
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export default function SignupBusiness() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const { signupBusiness, isLoading } = useAuth();
  const navigate = useNavigate();

  const form = useForm<z.infer<typeof signupSchema>>({
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
    },
  });

  const onSubmit = async (data: z.infer<typeof signupSchema>) => {
    setError("");
    try {
      const signupData: SignupBusinessForm = {
        ownerName: data.ownerName,
        businessName: data.businessName,
        email: data.email,
        password: data.password,
        confirmPassword: data.confirmPassword,
        category: data.category as BusinessCategory,
        address: data.address,
        description: data.description,
      };
      await signupBusiness(signupData);
      navigate("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Signup failed");
    }
  };

  const benefits = [
    {
      icon: <Users className="w-6 h-6 text-blue-500" />,
      title: "Reduce Wait Times",
      description: "Help customers book spots in advance and reduce crowding",
    },
    {
      icon: <BarChart3 className="w-6 h-6 text-green-500" />,
      title: "Analytics Dashboard",
      description: "Track queue metrics and optimize your service efficiency",
    },
    {
      icon: <Building2 className="w-6 h-6 text-purple-500" />,
      title: "Professional Presence",
      description:
        "Boost your business reputation with modern queue management",
    },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 px-4 py-8">
      <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-8 items-start">
        {/* Benefits Section */}
        <div className="hidden lg:block space-y-8">
          <div>
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Transform Your Business with Smart Queue Management
            </h2>
            <p className="text-muted-foreground text-lg">
              Join hundreds of businesses that have revolutionized their
              customer experience with Skiply.
            </p>
          </div>

          <div className="space-y-6">
            {benefits.map((benefit, index) => (
              <div key={index} className="flex items-start space-x-4">
                <div className="flex-shrink-0">{benefit.icon}</div>
                <div>
                  <h3 className="font-semibold text-foreground mb-1">
                    {benefit.title}
                  </h3>
                  <p className="text-muted-foreground">{benefit.description}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 rounded-xl text-white">
            <h3 className="font-semibold mb-2">🚀 Launch Special</h3>
            <p className="text-blue-100 text-sm">
              Get started with Skiply for free during our launch period. No
              setup fees, no monthly charges for the first 3 months!
            </p>
          </div>
        </div>

        {/* Signup Form */}
        <Card className="w-full bg-card/95 backdrop-blur-sm border border-border/50 shadow-xl">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-2xl">S</span>
              </div>
            </div>
            <CardTitle className="text-2xl">Register Your Business</CardTitle>
            <CardDescription>
              Start managing queues efficiently with Skiply
            </CardDescription>
          </CardHeader>

          <CardContent>
            {error && (
              <Alert variant="destructive" className="mb-4">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="ownerName">Owner Name</Label>
                  <Input
                    id="ownerName"
                    type="text"
                    placeholder="Your full name"
                    {...form.register("ownerName")}
                    className={
                      form.formState.errors.ownerName ? "border-red-500" : ""
                    }
                  />
                  {form.formState.errors.ownerName && (
                    <p className="text-sm text-red-500">
                      {form.formState.errors.ownerName.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="businessName">Business Name</Label>
                  <Input
                    id="businessName"
                    type="text"
                    placeholder="Your business name"
                    {...form.register("businessName")}
                    className={
                      form.formState.errors.businessName ? "border-red-500" : ""
                    }
                  />
                  {form.formState.errors.businessName && (
                    <p className="text-sm text-red-500">
                      {form.formState.errors.businessName.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Business Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="business@example.com"
                  {...form.register("email")}
                  className={
                    form.formState.errors.email ? "border-red-500" : ""
                  }
                />
                {form.formState.errors.email && (
                  <p className="text-sm text-red-500">
                    {form.formState.errors.email.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Business Category</Label>
                <Select
                  onValueChange={(value) => form.setValue("category", value)}
                >
                  <SelectTrigger
                    className={
                      form.formState.errors.category ? "border-red-500" : ""
                    }
                  >
                    <SelectValue placeholder="Select your business category" />
                  </SelectTrigger>
                  <SelectContent>
                    {BUSINESS_CATEGORIES.map((category) => (
                      <SelectItem key={category.value} value={category.value}>
                        <div className="flex items-center space-x-2">
                          <span>{category.icon}</span>
                          <span>{category.label}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {form.formState.errors.category && (
                  <p className="text-sm text-red-500">
                    {form.formState.errors.category.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Business Address</Label>
                <Input
                  id="address"
                  type="text"
                  placeholder="Complete business address"
                  {...form.register("address")}
                  className={
                    form.formState.errors.address ? "border-red-500" : ""
                  }
                />
                {form.formState.errors.address && (
                  <p className="text-sm text-red-500">
                    {form.formState.errors.address.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">
                  Business Description (Optional)
                </Label>
                <Textarea
                  id="description"
                  placeholder="Brief description of your business and services"
                  {...form.register("description")}
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Create a strong password"
                      {...form.register("password")}
                      className={
                        form.formState.errors.password ? "border-red-500" : ""
                      }
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <Eye className="h-4 w-4 text-muted-foreground" />
                      )}
                    </Button>
                  </div>
                  {form.formState.errors.password && (
                    <p className="text-sm text-red-500">
                      {form.formState.errors.password.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Confirm your password"
                      {...form.register("confirmPassword")}
                      className={
                        form.formState.errors.confirmPassword
                          ? "border-red-500"
                          : ""
                      }
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <Eye className="h-4 w-4 text-muted-foreground" />
                      )}
                    </Button>
                  </div>
                  {form.formState.errors.confirmPassword && (
                    <p className="text-sm text-red-500">
                      {form.formState.errors.confirmPassword.message}
                    </p>
                  )}
                </div>
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating Account...
                  </>
                ) : (
                  "Create Business Account"
                )}
              </Button>
            </form>

            <div className="mt-6 text-center text-sm">
              <span className="text-muted-foreground">
                Already have an account?{" "}
              </span>
              <Link
                to="/login"
                className="text-primary font-medium hover:underline"
              >
                Sign in
              </Link>
            </div>

            <div className="mt-4 text-center">
              <Link
                to="/signup-user"
                className="text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                Are you a customer? Sign up here
              </Link>
            </div>

            <div className="mt-4 text-center">
              <Link
                to="/"
                className="text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                ← Back to home
              </Link>
            </div>

            <div className="mt-6 pt-4 border-t text-xs text-muted-foreground text-center">
              By creating an account, you agree to our Terms of Service and
              Privacy Policy.
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
