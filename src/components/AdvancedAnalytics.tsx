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

import React, { useState, useCallback, useMemo, useEffect } from "react";
import { useAuth } from "../contexts/useAuth";
import {
  TrendingUp,
  Clock,
  ChefHat,
  Star,
  Target,
  Zap,
  Award,
  BarChart3,
} from "lucide-react";

interface CookingStats {
  totalRecipesCooked: number;
  totalCookingTime: number;
  averageRating: number;
  favoriteCuisine: string;
  mostCookedRecipe: string;
  weeklyGoal: number;
  weeklyProgress: number;
  monthlyTrend: string;
  cookingStreak: number;
  [key: string]: unknown;
}
interface SearchPattern {
  query: string;
  count: number;
}
interface PeakCookingTime {
  hour: number;
  count: number;
}
interface DeviceUsage {
  mobile: number;
  desktop: number;
  tablet: number;
}
interface UserBehavior {
  searchPatterns: SearchPattern[];
  peakCookingTimes: PeakCookingTime[];
  deviceUsage: DeviceUsage;
  sessionDuration: number;
  bounceRate: number;
  [key: string]: unknown;
}
interface Preferences {
  dietaryRestrictions: string[];
  spiceLevel: string;
  cookingSkill: string;
  preferredCuisines: string[];
  mealTypes: string[];
  timeConstraints: string;
  [key: string]: unknown;
}
interface Achievement {
  id: number;
  name: string;
  description: string;
  earned: boolean;
  date?: string;
  progress?: number;
}
interface Recommendation {
  type: string;
  title: string;
  reason: string;
  confidence: number;
}
interface AnalyticsData {
  cookingStats: CookingStats;
  userBehavior: UserBehavior;
  preferences: Preferences;
  achievements: Achievement[];
  recommendations: Recommendation[];
  [key: string]: unknown;
}
interface AdvancedAnalyticsProps {
  darkMode: boolean;
}

const AdvancedAnalytics: React.FC<AdvancedAnalyticsProps> = ({ darkMode }) => {
  const { currentUser } = useAuth();
  const [analytics, setAnalytics] = useState<AnalyticsData>({
    cookingStats: {} as CookingStats,
    userBehavior: {} as UserBehavior,
    preferences: {} as Preferences,
    achievements: [],
    recommendations: [],
  });
  const [loading, setLoading] = useState<boolean>(true);
  const [timeRange, setTimeRange] = useState<string>("30d");

  

  const loadAnalytics = useCallback(async () => {
    setLoading(true);
    try {
      const stored = JSON.parse(
        localStorage.getItem(`analytics_${currentUser?.uid}`) || "null",
      );
  
      if (stored) {
        setAnalytics(stored);
      } else {
        setAnalytics({} as AnalyticsData);
      }
    } catch (error) {
      console.error("Error loading analytics:", error);
      setAnalytics({} as AnalyticsData);
    } finally {
      setLoading(false);
    }
  }, [currentUser]);

  useEffect(() => {
    if (currentUser) {
      loadAnalytics();
    }
  }, [currentUser, loadAnalytics]);

  // Track user interaction (for future use) - currently unused
  // const trackInteraction = useCallback(
  //   (action, data) => {
  //     if (!currentUser) return;

  //     const interaction = {
  //       action,
  //       data,
  //       timestamp: new Date().toISOString(),
  //       userId: currentUser.uid,
  //     };

  //     // Store in localStorage
  //     const interactions = JSON.parse(
  //       localStorage.getItem(`interactions_${currentUser.uid}`) || "[]"
  //     );
  //     interactions.push(interaction);
  //     localStorage.setItem(
  //       `interactions_${currentUser.uid}`,
  //       JSON.stringify(interactions)
  //     );

  //     // Update analytics
  //     updateAnalytics(action, data);
  //   },
  //   [currentUser, updateAnalytics]
  // );

  // Update analytics based on interaction (commented out for future use)
  // const updateAnalytics = useCallback((action, data) => {
  //   setAnalytics((prev) => {
  //     const updated = { ...prev };

  //     switch (action) {
  //       case "recipe_viewed":
  //         updated.cookingStats.totalRecipesViewed =
  //           (updated.cookingStats.totalRecipesViewed || 0) + 1;
  //         break;
  //       case "recipe_cooked":
  //         updated.cookingStats.totalRecipesCooked =
  //           (updated.cookingStats.totalRecipesCooked || 0) + 1;
  //         updated.cookingStats.weeklyProgress =
  //           (updated.cookingStats.weeklyProgress || 0) + 1;
  //         break;
  //       case "recipe_rated":
  //         // Update average rating
  //         break;
  //       case "search_performed": {
  //         const searchQuery = data.query.toLowerCase();
  //         const existingSearch = updated.userBehavior.searchPatterns?.find(
  //           (s) => s.query === searchQuery
  //         );
  //         if (existingSearch) {
  //           existingSearch.count++;
  //         } else {
  //           updated.userBehavior.searchPatterns = [
  //             ...(updated.userBehavior.searchPatterns || []),
  //             { query: searchQuery, count: 1 },
  //           ];
  //         }
  //         break;
  //       }
  //       default:
  //         break;
  //     }

  //     return updated;
  //   });
  // }, []);

  // Calculate cooking efficiency score
  const cookingEfficiencyScore = useMemo(() => {
    const { cookingStats } = analytics;
    const recipesPerHour =
      cookingStats.totalRecipesCooked / (cookingStats.totalCookingTime || 1);
    const ratingBonus = (cookingStats.averageRating - 3) * 0.2;
    const streakBonus = Math.min(cookingStats.cookingStreak / 10, 0.3);

    return Math.min(
      100,
      Math.round((recipesPerHour * 10 + ratingBonus + streakBonus) * 100)
    );
  }, [analytics]);

  // Get cooking insights
  const cookingInsights = useMemo(() => {
    const insights = [];
    const { cookingStats, userBehavior } = analytics;

    if (cookingStats.weeklyProgress >= cookingStats.weeklyGoal) {
      insights.push({
        type: "success",
        icon: <Target className="w-4 h-4" />,
        title: "Goal Achieved!",
        message: `You've met your weekly cooking goal of ${cookingStats.weeklyGoal} recipes`,
      });
    }

    if (cookingStats.cookingStreak >= 7) {
      insights.push({
        type: "success",
        icon: <TrendingUp className="w-4 h-4" />,
        title: "Cooking Streak!",
        message: `You've been cooking for ${cookingStats.cookingStreak} days straight`,
      });
    }

    if (userBehavior.sessionDuration > 10) {
      insights.push({
        type: "info",
        icon: <Clock className="w-4 h-4" />,
        title: "Engaged User",
        message: "You spend more time exploring recipes than average users",
      });
    }

    return insights;
  }, [analytics]);

  if (loading) {
    return (
      <div
        className={`flex items-center justify-center p-8 ${
          darkMode ? "text-gray-300" : "text-gray-600"
        }`}
      >
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
        <span className="ml-3">Loading analytics...</span>
      </div>
    );
  }

  return (
    <div
      className={`advanced-analytics space-y-6 ${
        darkMode ? "text-gray-100" : "text-gray-800"
      }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 shadow-lg">
            <BarChart3 className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2
              className={`text-2xl font-bold ${
                darkMode ? "text-white" : "text-gray-900"
              }`}
            >
              Your Cooking Analytics
            </h2>
            <p
              className={`text-sm ${
                darkMode ? "text-gray-300" : "text-gray-600"
              }`}
            >
              Track your culinary journey and discover insights
            </p>
          </div>
        </div>

        <select
          value={timeRange}
          onChange={(e) => setTimeRange(e.target.value)}
          className={`px-3 py-2 rounded-lg border ${
            darkMode
              ? "bg-gray-800 border-gray-600 text-white"
              : "bg-white border-gray-300 text-gray-900"
          }`}
        >
          <option value="7d">Last 7 days</option>
          <option value="30d">Last 30 days</option>
          <option value="90d">Last 90 days</option>
          <option value="1y">Last year</option>
        </select>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div
          className={`p-4 rounded-lg border ${
            darkMode
              ? "bg-gray-800 border-gray-600"
              : "bg-white border-gray-200"
          }`}
        >
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-full bg-orange-100 dark:bg-orange-900">
              <ChefHat className="w-5 h-5 text-orange-600 dark:text-orange-400" />
            </div>
            <div>
              <p
                className={`text-sm ${
                  darkMode ? "text-gray-400" : "text-gray-600"
                }`}
              >
                Recipes Cooked
              </p>
              <p className="text-2xl font-bold">
                {analytics.cookingStats.totalRecipesCooked}
              </p>
            </div>
          </div>
        </div>

        <div
          className={`p-4 rounded-lg border ${
            darkMode
              ? "bg-gray-800 border-gray-600"
              : "bg-white border-gray-200"
          }`}
        >
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-full bg-green-100 dark:bg-green-900">
              <Clock className="w-5 h-5 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <p
                className={`text-sm ${
                  darkMode ? "text-gray-400" : "text-gray-600"
                }`}
              >
                Cooking Hours
              </p>
              <p className="text-2xl font-bold">
                {analytics.cookingStats.totalCookingTime}
              </p>
            </div>
          </div>
        </div>

        <div
          className={`p-4 rounded-lg border ${
            darkMode
              ? "bg-gray-800 border-gray-600"
              : "bg-white border-gray-200"
          }`}
        >
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-full bg-yellow-100 dark:bg-yellow-900">
              <Star className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
            </div>
            <div>
              <p
                className={`text-sm ${
                  darkMode ? "text-gray-400" : "text-gray-600"
                }`}
              >
                Avg Rating
              </p>
              <p className="text-2xl font-bold">
                {analytics.cookingStats.averageRating}
              </p>
            </div>
          </div>
        </div>

        <div
          className={`p-4 rounded-lg border ${
            darkMode
              ? "bg-gray-800 border-gray-600"
              : "bg-white border-gray-200"
          }`}
        >
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-full bg-purple-100 dark:bg-purple-900">
              <Zap className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <p
                className={`text-sm ${
                  darkMode ? "text-gray-400" : "text-gray-600"
                }`}
              >
                Efficiency
              </p>
              <p className="text-2xl font-bold">{cookingEfficiencyScore}%</p>
            </div>
          </div>
        </div>
      </div>

      {/* Insights */}
      {cookingInsights.length > 0 && (
        <div
          className={`p-4 rounded-lg border ${
            darkMode
              ? "bg-gray-800 border-gray-600"
              : "bg-orange-50 border-orange-200"
          }`}
        >
          <h3
            className={`font-semibold mb-3 ${
              darkMode ? "text-white" : "text-gray-900"
            }`}
          >
            Recent Insights
          </h3>
          <div className="space-y-2">
            {cookingInsights.map((insight, index) => (
              <div key={index} className="flex items-center space-x-3">
                {insight.icon}
                <div>
                  <p
                    className={`font-medium ${
                      darkMode ? "text-white" : "text-gray-900"
                    }`}
                  >
                    {insight.title}
                  </p>
                  <p
                    className={`text-sm ${
                      darkMode ? "text-gray-300" : "text-gray-600"
                    }`}
                  >
                    {insight.message}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Achievements */}
      <div
        className={`p-6 rounded-lg border ${
          darkMode ? "bg-gray-800 border-gray-600" : "bg-white border-gray-200"
        }`}
      >
        <h3
          className={`text-xl font-bold mb-4 ${
            darkMode ? "text-white" : "text-gray-900"
          }`}
        >
          Achievements
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {analytics.achievements.map((achievement) => (
            <div
              key={achievement.id}
              className={`p-4 rounded-lg border ${
                achievement.earned
                  ? darkMode
                    ? "bg-green-900 border-green-600"
                    : "bg-green-50 border-green-200"
                  : darkMode
                  ? "bg-gray-700 border-gray-500"
                  : "bg-gray-50 border-gray-200"
              }`}
            >
              <div className="flex items-center space-x-3">
                <div
                  className={`p-2 rounded-full ${
                    achievement.earned
                      ? "bg-green-100 dark:bg-green-800"
                      : "bg-stone-100 dark:bg-stone-600"
                  }`}
                >
                  <Award
                    className={`w-5 h-5 ${
                      achievement.earned
                        ? "text-green-600 dark:text-green-400"
                        : "text-gray-400"
                    }`}
                  />
                </div>
                <div className="flex-1">
                  <p
                    className={`font-semibold ${
                      achievement.earned
                        ? darkMode
                          ? "text-white"
                          : "text-gray-900"
                        : darkMode
                        ? "text-gray-400"
                        : "text-gray-600"
                    }`}
                  >
                    {achievement.name}
                  </p>
                  <p
                    className={`text-sm ${
                      darkMode ? "text-gray-300" : "text-gray-600"
                    }`}
                  >
                    {achievement.description}
                  </p>
                  {!achievement.earned && achievement.progress && (
                    <div className="mt-2">
                      <div className="flex justify-between text-xs text-gray-500">
                        <span>Progress</span>
                        <span>{achievement.progress}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                        <div
                          className="bg-orange-500 h-2 rounded-full"
                          style={{ width: `${achievement.progress}%` }}
                        ></div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recommendations */}
      <div
        className={`p-6 rounded-lg border ${
          darkMode ? "bg-gray-800 border-gray-600" : "bg-white border-gray-200"
        }`}
      >
        <h3
          className={`text-xl font-bold mb-4 ${
            darkMode ? "text-white" : "text-gray-900"
          }`}
        >
          Personalized Recommendations
        </h3>
        <div className="space-y-4">
          {analytics.recommendations.map((rec, index) => (
            <div
              key={index}
              className={`p-4 rounded-lg border ${
                darkMode
                  ? "bg-gray-700 border-gray-500"
                  : "bg-orange-50 border-orange-200"
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p
                    className={`font-semibold ${
                      darkMode ? "text-white" : "text-gray-900"
                    }`}
                  >
                    {rec.title}
                  </p>
                  <p
                    className={`text-sm ${
                      darkMode ? "text-gray-300" : "text-gray-600"
                    }`}
                  >
                    {rec.reason}
                  </p>
                </div>
                <div className="text-right">
                  <p
                    className={`text-sm font-medium ${
                      rec.confidence > 0.9
                        ? "text-green-600"
                        : "text-orange-600"
                    }`}
                  >
                    {Math.round(rec.confidence * 100)}% match
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdvancedAnalytics;
