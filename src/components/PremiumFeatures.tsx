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

import React, { useState, useCallback } from "react";
import { useAuth } from "../contexts/useAuth";
import {
  Crown,
  Star,
  Zap,
  Shield,
  Download,
  Users,
  ChefHat,
  Sparkles,
  Check,
  X,
  ArrowRight,
} from "lucide-react";

interface PremiumFeaturesProps {
  darkMode: boolean;
  onClose: () => void;
}
interface Plan {
  name: string;
  price: number;
  period: string;
  popular: boolean;
  savings?: string;
}
interface Feature {
  icon: React.ReactNode;
  title: string;
  description: string;
  premium: boolean;
}

const PremiumFeatures: React.FC<PremiumFeaturesProps> = ({
  darkMode,
  onClose,
}) => {
  const { currentUser } = useAuth();
  const [selectedPlan, setSelectedPlan] = useState<string>("monthly");
  const [loading, setLoading] = useState<boolean>(false);

  const plans: Record<string, Plan> = {
    monthly: {
      name: "Monthly",
      price: 9.99,
      period: "month",
      popular: false,
    },
    yearly: {
      name: "Yearly",
      price: 99.99,
      period: "year",
      popular: true,
      savings: "Save 17%",
    },
    lifetime: {
      name: "Lifetime",
      price: 299.99,
      period: "one-time",
      popular: false,
      savings: "Best Value",
    },
  };

  const features: Feature[] = [
    {
      icon: <Crown className="w-5 h-5" />,
      title: "Exclusive Chef Recipes",
      description: "Access to premium recipes from world-renowned chefs",
      premium: true,
    },
    {
      icon: <Zap className="w-5 h-5" />,
      title: "Advanced AI Features",
      description:
        "Unlimited AI recipe generation and personalized recommendations",
      premium: true,
    },
    {
      icon: <Download className="w-5 h-5" />,
      title: "Offline Access",
      description: "Download recipes and cook offline without internet",
      premium: true,
    },
    {
      icon: <Users className="w-5 h-5" />,
      title: "Family Sharing",
      description: "Share premium features with up to 5 family members",
      premium: true,
    },
    {
      icon: <ChefHat className="w-5 h-5" />,
      title: "Video Tutorials",
      description: "HD cooking videos and step-by-step instructions",
      premium: true,
    },
    {
      icon: <Sparkles className="w-5 h-5" />,
      title: "Advanced Analytics",
      description: "Detailed cooking analytics and progress tracking",
      premium: true,
    },
    {
      icon: <Shield className="w-5 h-5" />,
      title: "Ad-Free Experience",
      description: "Enjoy cooking without any advertisements",
      premium: true,
    },
    {
      icon: <Star className="w-5 h-5" />,
      title: "Priority Support",
      description: "24/7 priority customer support",
      premium: true,
    },
  ];

  const handleSubscribe = useCallback(async () => {
    if (!currentUser) {
      alert("Please log in to subscribe to premium features");
      return;
    }

    setLoading(true);
    try {
      // Brief delay for loading feedback before persisting
      await new Promise((resolve) => setTimeout(resolve, 300));

      // Update user premium status in localStorage
      const userData = JSON.parse(
        localStorage.getItem(`user_${currentUser.uid}`) || "{}",
      );
      userData.premium = {
        plan: selectedPlan,
        startDate: new Date().toISOString(),
        endDate:
          selectedPlan === "lifetime"
            ? null
            : new Date(
                Date.now() +
                  (selectedPlan === "yearly" ? 365 : 30) * 24 * 60 * 60 * 1000,
              ).toISOString(),
      };
      localStorage.setItem(`user_${currentUser.uid}`, JSON.stringify(userData));

      alert("Welcome to CULINARIA Premium! 🎉");
      onClose();
    } catch (error) {
      console.error("Subscription error:", error);
      alert("Subscription failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [currentUser, selectedPlan, onClose]);

  return (
    <div
      className={`fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4`}
    >
      <div
        className={`max-w-4xl w-full max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl ${
          darkMode ? "bg-neutral-900 text-white" : "bg-white text-gray-900"
        }`}
      >
        {/* Header */}
        <div
          className={`p-6 border-b ${
            darkMode ? "border-neutral-700" : "border-gray-200"
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-full bg-gradient-to-r from-orange-500 to-amber-500">
                <Crown className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">Upgrade to Premium</h2>
                <p
                  className={`text-sm ${
                    darkMode ? "text-stone-300" : "text-gray-600"
                  }`}
                >
                  Unlock the full potential of{" "}
                  <span className="bg-gradient-to-r from-green-600 to-emerald-700 dark:from-green-400 dark:to-emerald-500 bg-clip-text text-transparent font-semibold">
                    CULINARIA
                  </span>
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className={`p-2 rounded-full hover:bg-gray-100 ${
                darkMode ? "hover:bg-neutral-800" : "hover:bg-gray-100"
              }`}
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="p-6">
          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            {features.map((feature: Feature, index: number) => (
              <div
                key={index}
                className={`p-4 rounded-lg border ${
                  darkMode
                    ? "bg-neutral-800 border-neutral-700"
                    : "bg-orange-50 border-orange-200"
                }`}
              >
                <div className="flex items-start space-x-3">
                  <div
                    className={`p-2 rounded-full ${
                      feature.premium
                        ? "bg-gradient-to-r from-orange-500 to-amber-500"
                        : "bg-neutral-700"
                    }`}
                  >
                    <div className="text-white">{feature.icon}</div>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold mb-1">{feature.title}</h3>
                    <p
                      className={`text-sm ${
                        darkMode ? "text-stone-300" : "text-gray-600"
                      }`}
                    >
                      {feature.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pricing Plans */}
          <div className="mb-8">
            <h3 className="text-xl font-bold mb-4">Choose Your Plan</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {Object.entries(plans).map(([key, plan]: [string, Plan]) => (
                <div
                  key={key}
                  className={`relative p-6 rounded-lg border-2 cursor-pointer transition-all ${
                    selectedPlan === key
                      ? "border-orange-500 bg-orange-50 dark:bg-neutral-800"
                      : darkMode
                        ? "border-neutral-700 bg-neutral-800 hover:border-neutral-600"
                        : "border-gray-200 bg-white hover:border-gray-300"
                  }`}
                  onClick={() => setSelectedPlan(key)}
                >
                  {plan.popular && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                      <span className="bg-orange-500 text-white px-3 py-1 rounded-full text-xs font-medium">
                        {plan.savings}
                      </span>
                    </div>
                  )}

                  <div className="text-center">
                    <h4 className="font-bold text-lg mb-2">{plan.name}</h4>
                    <div className="mb-4">
                      <span className="text-3xl font-bold">${plan.price}</span>
                      <span
                        className={`text-sm ${
                          darkMode ? "text-stone-400" : "text-gray-500"
                        }`}
                      >
                        /{plan.period}
                      </span>
                    </div>

                    {plan.savings && !plan.popular && (
                      <p className="text-sm text-orange-600 font-medium mb-4">
                        {plan.savings}
                      </p>
                    )}

                    <div className="space-y-2 text-sm">
                      <div className="flex items-center justify-center space-x-2">
                        <Check className="w-4 h-4 text-green-500" />
                        <span>All Premium Features</span>
                      </div>
                      {key === "yearly" && (
                        <div className="flex items-center justify-center space-x-2">
                          <Check className="w-4 h-4 text-green-500" />
                          <span>2 Months Free</span>
                        </div>
                      )}
                      {key === "lifetime" && (
                        <div className="flex items-center justify-center space-x-2">
                          <Check className="w-4 h-4 text-green-500" />
                          <span>One-time Payment</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Comparison Table */}
          <div className="mb-8">
            <h3 className="text-xl font-bold mb-4">Feature Comparison</h3>
            <div
              className={`overflow-x-auto rounded-lg border ${
                darkMode ? "border-neutral-700" : "border-gray-200"
              }`}
            >
              <table className="w-full">
                <thead
                  className={`${darkMode ? "bg-neutral-800" : "bg-gray-50"}`}
                >
                  <tr>
                    <th
                      className={`px-4 py-3 text-left font-medium ${
                        darkMode ? "text-stone-300" : "text-gray-700"
                      }`}
                    >
                      Feature
                    </th>
                    <th
                      className={`px-4 py-3 text-center font-medium ${
                        darkMode ? "text-stone-300" : "text-gray-700"
                      }`}
                    >
                      Free
                    </th>
                    <th
                      className={`px-4 py-3 text-center font-medium ${
                        darkMode ? "text-orange-400" : "text-orange-600"
                      }`}
                    >
                      Premium
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    className={`border-t ${
                      darkMode ? "border-neutral-700" : "border-gray-200"
                    }`}
                  >
                    <td className="px-4 py-3">Recipe Access</td>
                    <td className="px-4 py-3 text-center">Limited</td>
                    <td className="px-4 py-3 text-center font-medium text-green-600">
                      Unlimited
                    </td>
                  </tr>
                  <tr
                    className={`border-t ${
                      darkMode ? "border-neutral-700" : "border-gray-200"
                    }`}
                  >
                    <td className="px-4 py-3">AI Features</td>
                    <td className="px-4 py-3 text-center">5/day</td>
                    <td className="px-4 py-3 text-center font-medium text-green-600">
                      Unlimited
                    </td>
                  </tr>
                  <tr
                    className={`border-t ${
                      darkMode ? "border-neutral-700" : "border-gray-200"
                    }`}
                  >
                    <td className="px-4 py-3">Offline Access</td>
                    <td className="px-4 py-3 text-center">
                      <X className="w-4 h-4 text-red-500 mx-auto" />
                    </td>
                    <td className="px-4 py-3 text-center">
                      <Check className="w-4 h-4 text-green-500 mx-auto" />
                    </td>
                  </tr>
                  <tr
                    className={`border-t ${
                      darkMode ? "border-neutral-700" : "border-gray-200"
                    }`}
                  >
                    <td className="px-4 py-3">Video Tutorials</td>
                    <td className="px-4 py-3 text-center">
                      <X className="w-4 h-4 text-red-500 mx-auto" />
                    </td>
                    <td className="px-4 py-3 text-center">
                      <Check className="w-4 h-4 text-green-500 mx-auto" />
                    </td>
                  </tr>
                  <tr
                    className={`border-t ${
                      darkMode ? "border-neutral-700" : "border-gray-200"
                    }`}
                  >
                    <td className="px-4 py-3">Ad-Free Experience</td>
                    <td className="px-4 py-3 text-center">
                      <X className="w-4 h-4 text-red-500 mx-auto" />
                    </td>
                    <td className="px-4 py-3 text-center">
                      <Check className="w-4 h-4 text-green-500 mx-auto" />
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* CTA */}
          <div className="text-center">
            <button
              onClick={handleSubscribe}
              disabled={loading}
              className={`inline-flex items-center space-x-2 px-8 py-4 rounded-lg font-bold text-lg transition-all ${
                loading
                  ? "bg-neutral-600 cursor-not-allowed"
                  : "bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white shadow-lg hover:shadow-xl transform hover:scale-105"
              }`}
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <span>Upgrade Now</span>
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
            <p
              className={`text-sm mt-3 ${
                darkMode ? "text-stone-400" : "text-gray-600"
              }`}
            >
              Cancel anytime. 30-day money-back guarantee.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PremiumFeatures;
