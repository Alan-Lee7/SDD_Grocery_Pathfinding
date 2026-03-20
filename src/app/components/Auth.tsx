import { useState } from "react";
import { Mail, Lock, User, ShoppingBag, ArrowRight, Check } from "lucide-react";

interface AuthProps {
  onAuthSuccess: (user: { email: string; name: string }) => void;
}

export function Auth({ onAuthSuccess }: AuthProps) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");

    // Validation
    if (!email || !password) {
      setError("Please fill in all fields");
      return;
    }

    if (!email.includes("@")) {
      setError("Please enter a valid email address");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    if (isSignUp) {
      if (!name) {
        setError("Please enter your name");
        return;
      }
      if (password !== confirmPassword) {
        setError("Passwords do not match");
        return;
      }
    }

    setIsLoading(true);
    
    setTimeout(() => {
      // Get existing users from localStorage
      const usersData = localStorage.getItem("shopRouteUsers");
      const users: Record<string, { name: string; password: string }> = usersData 
        ? JSON.parse(usersData) 
        : {};

      if (isSignUp) {
        // Check if user already exists
        if (users[email.toLowerCase()]) {
          setError("An account with this email already exists");
          setIsLoading(false);
          return;
        }

        // Create new user
        users[email.toLowerCase()] = {
          name,
          password // In production, this would be hashed!
        };

        // Save to localStorage
        localStorage.setItem("shopRouteUsers", JSON.stringify(users));

        // Show success message and switch to sign in
        setSuccessMessage("Account created successfully! Please sign in to continue.");
        setIsSignUp(false);
        setPassword("");
        setConfirmPassword("");
        setIsLoading(false);
      } else {
        // Sign in - check if user exists
        const user = users[email.toLowerCase()];
        
        if (!user) {
          setError("No account found with this email. Please sign up.");
          setIsLoading(false);
          return;
        }

        if (user.password !== password) {
          setError("Incorrect password. Please try again.");
          setIsLoading(false);
          return;
        }

        // Sign in successful
        onAuthSuccess({ email, name: user.name });
        setIsLoading(false);
      }
    }, 800);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-6xl w-full grid md:grid-cols-2 gap-8 items-center">
        {/* Left Side - Branding */}
        <div className="text-center md:text-left">
          <div className="inline-flex items-center gap-3 mb-6">
            <div className="size-16 bg-blue-600 rounded-2xl flex items-center justify-center">
              <ShoppingBag className="size-9 text-white" />
            </div>
            <h1 className="text-5xl font-bold text-gray-900">ShopRoute</h1>
          </div>
          
          <p className="text-2xl text-gray-700 mb-6">
            Shop smarter, not harder
          </p>
          
          <p className="text-lg text-gray-600 mb-8">
            Transform your grocery list into an optimized shopping route. Save time, reduce backtracking, and never miss an item.
          </p>

          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="size-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                <Check className="size-6 text-green-600" />
              </div>
              <p className="text-gray-700">Supports Walmart, Target, Aldi, Sam's Club & more</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="size-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                <Check className="size-6 text-green-600" />
              </div>
              <p className="text-gray-700">Aisle-by-aisle organized shopping lists</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="size-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                <Check className="size-6 text-green-600" />
              </div>
              <p className="text-gray-700">Save & reuse your favorite lists</p>
            </div>
          </div>
        </div>

        {/* Right Side - Auth Form */}
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <div className="mb-6">
            <h2 className="text-3xl font-bold mb-2">
              {isSignUp ? "Create Account" : "Welcome Back"}
            </h2>
            <p className="text-gray-600">
              {isSignUp
                ? "Sign up to start optimizing your shopping"
                : "Sign in to continue shopping smarter"}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {isSignUp && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 size-5" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="John Doe"
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 size-5" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 size-5" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                />
              </div>
            </div>

            {isSignUp && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 size-5" />
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  />
                </div>
              </div>
            )}

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            {successMessage && (
              <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm">
                {successMessage}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed font-semibold flex items-center justify-center gap-2 transition-colors"
            >
              {isLoading ? (
                "Loading..."
              ) : (
                <>
                  {isSignUp ? "Create Account" : "Sign In"}
                  <ArrowRight className="size-5" />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={() => {
                setIsSignUp(!isSignUp);
                setError("");
                setSuccessMessage("");
              }}
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              {isSignUp
                ? "Already have an account? Sign In"
                : "Don't have an account? Sign Up"}
            </button>
          </div>

          {!isSignUp && (
            <div className="mt-4 text-center">
              <button className="text-sm text-gray-600 hover:text-gray-800">
                Forgot password?
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
