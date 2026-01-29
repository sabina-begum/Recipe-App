/**
 * Copyright (c) 2024 Sabina Begum. All rights reserved.
 *
 * PROPRIETARY SOFTWARE - CONFIDENTIAL
 *
 * This file contains proprietary and confidential information.
 * Unauthorized copying, distribution, or use is strictly prohibited.
 *
 * For licensing inquiries: begumsabina81193@gmail.com
 *
 * Educational use only - Commercial use prohibited.
 */

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/useAuth";

function Login({ darkMode }: { darkMode: boolean }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { login, handleDemoLogin } = useAuth();
  const navigate = useNavigate();

  const handleSwitchToSignup = () => {
    navigate("/signup");
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!email || !password) {
      setError("Please fill in all fields");
      return;
    }

    setLoading(true);
    setError("");

    try {
      await login(email, password);
      // Navigate to home page after successful login
      navigate("/");
    } catch (error: unknown) {
      console.error("Login error:", error);
      if (
        typeof error === "object" &&
        error !== null &&
        "code" in error &&
        typeof (error as { code?: string }).code === "string"
      ) {
        const code = (error as { code: string }).code;
        if (code === "auth/user-not-found") {
          setError("No account found with this email address.");
        } else if (code === "auth/wrong-password") {
          setError("Incorrect password. Please try again.");
        } else if (code === "auth/invalid-email") {
          setError("Please enter a valid email address.");
        } else if (code === "auth/too-many-requests") {
          setError("Too many failed attempts. Please try again later.");
        } else {
          setError(
            "Failed to log in. Please check your credentials and try again.",
          );
        }
      } else {
        setError(
          "Failed to log in. Please check your credentials and try again.",
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLoginClick = async () => {
    setLoading(true);
    setError("");

    try {
      // Create a demo user object with all features
      const demoUser = {
        uid: "demo-user-123",
        email: "demo@culinaria.com",
        displayName: "Demo User",
        photoURL: null,
        // Add demo user data
        demoData: {
          favorites: [
            {
              id: "52772",
              name: "Teriyaki Chicken Casserole",
              image:
                "https://www.themealdb.com/images/media/meals/wvpsxx1468256321.jpg",
              category: "Chicken",
              area: "Japanese",
            },
            {
              id: "52959",
              name: "Baked salmon with fennel & tomatoes",
              image:
                "https://www.themealdb.com/images/media/meals/1540441275.jpg",
              category: "Seafood",
              area: "British",
            },
          ],
          mealPlan: {
            monday: {
              breakfast: "Oatmeal with berries",
              lunch: "Grilled chicken salad",
              dinner: "Pasta carbonara",
            },
            tuesday: {
              breakfast: "Smoothie bowl",
              lunch: "Quinoa bowl",
              dinner: "Salmon with vegetables",
            },
            wednesday: {
              breakfast: "Avocado toast",
              lunch: "Caesar salad",
              dinner: "Beef stir fry",
            },
          },
          shoppingList: [
            "Chicken breast",
            "Salmon fillet",
            "Quinoa",
            "Avocado",
            "Tomatoes",
            "Spinach",
            "Olive oil",
          ],
          nutritionGoals: { calories: 2000, protein: 150, carbs: 200, fat: 65 },
          preferences: {
            dietaryRestrictions: ["Vegetarian-friendly"],
            favoriteCategories: ["Chicken", "Seafood", "Italian"],
            skillLevel: "intermediate",
          },
        },
      };

      // Brief delay for "Creating..." feedback
      await new Promise((resolve) => setTimeout(resolve, 200));

      // Store demo user in localStorage for persistence
      localStorage.setItem("demoUser", JSON.stringify(demoUser));

      // Use the AuthContext function directly
      handleDemoLogin(demoUser);

      // Navigate to home page after successful demo login
      navigate("/");
    } catch {
      setError("Failed to create demo account. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={`min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 ${
        darkMode ? "bg-black text-stone-300" : "bg-stone-100 text-gray-800"
      }`}
    >
      <div
        className={`rounded-2xl shadow-2xl border-2 py-6 sm:py-8 lg:py-10 px-6 sm:px-8 lg:px-10 min-w-[500px] ${
          darkMode
            ? "bg-neutral-900 border-neutral-700"
            : "bg-white border-gray-200"
        }`}
      >
        <h2 className="text-4xl font-bold text-center mb-8 bg-gradient-to-r from-orange-500 to-amber-500 bg-clip-text text-transparent">
          Welcome Back
        </h2>

        {/* Demo Login Button */}
        <div className="text-center mb-6">
          <button
            onClick={handleDemoLoginClick}
            disabled={loading}
            className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {loading ? "Creating Demo Account..." : "🎮 Try Demo Account"}
          </button>
          <p
            className={`mt-2 text-xs ${
              darkMode ? "text-stone-400" : "text-gray-500"
            }`}
          >
            Experience all features with pre-filled data
          </p>
        </div>

        <div
          className={`text-center mb-6 ${
            darkMode ? "text-stone-400" : "text-gray-500"
          }`}
        >
          <span className="px-2">or</span>
        </div>

        <form className="space-y-6 max-w-2xl mx-auto" onSubmit={handleSubmit}>
          {error && (
            <div
              className={`p-3 rounded-lg text-sm ${
                darkMode ? "bg-red-900 text-red-200" : "bg-red-100 text-red-700"
              }`}
            >
              {error}
            </div>
          )}

          <div>
            <label
              htmlFor="email-address"
              className="block text-sm font-medium mb-2"
            >
              Email address
            </label>
            <input
              id="email-address"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`w-full px-3 py-2 rounded-lg border ${
                darkMode
                  ? "bg-neutral-800 border-neutral-600 text-stone-300"
                  : "bg-white border-gray-300 text-gray-800"
              }`}
              placeholder="Email address"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium mb-2"
            >
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`w-full px-3 py-2 rounded-lg border ${
                darkMode
                  ? "bg-neutral-800 border-neutral-600 text-stone-300"
                  : "bg-white border-gray-300 text-gray-800"
              }`}
              placeholder="Password"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-4 px-6 rounded-xl text-lg font-semibold transition-all duration-200 ${
              loading
                ? "opacity-50 cursor-not-allowed"
                : "hover:scale-105 hover:shadow-lg"
            } bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-md`}
          >
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>

        <div className="text-center mt-6">
          <p
            className={`text-sm ${
              darkMode ? "text-stone-400" : "text-gray-600"
            }`}
          >
            Don&apos;t have an account?{" "}
            <button
              onClick={handleSwitchToSignup}
              className="text-orange-500 hover:text-orange-400 font-medium"
            >
              Create one
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
