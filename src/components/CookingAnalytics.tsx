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

import React, { useState, useEffect, useCallback } from "react";
import { useAuth } from "../contexts/useAuth";
import {
  computeCookingAnalytics,
  type AnalyticsData,
} from "../utils/cookingAnalyticsUtils";

interface CuisineStat {
  cuisine: string;
  count: number;
  percentage: number;
}
interface DifficultyStat {
  difficulty: string;
  count: number;
  percentage: number;
}
interface WeeklyProgress {
  week: string;
  recipes: number;
  time: number;
}
interface IngredientStat {
  ingredient: string;
  count: number;
  percentage: number;
}
interface Achievement {
  name: string;
  description: string;
  earned: string;
  icon: string;
}
interface CookingAnalyticsProps {
  darkMode: boolean;
}

const CookingAnalytics: React.FC<CookingAnalyticsProps> = ({ darkMode }) => {
  const { currentUser, isDemoUser } = useAuth();
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [timeRange, setTimeRange] = useState<string>("month");
  const [loading, setLoading] = useState<boolean>(true);

  const loadAnalytics = useCallback(() => {
    if (!currentUser) return;
    setLoading(true);
    try {
      const computed = computeCookingAnalytics(currentUser.uid, !!isDemoUser);
      setAnalytics(computed);
    } catch (error) {
      console.error("Error computing analytics:", error);
      setAnalytics(null);
    }
    setLoading(false);
  }, [currentUser, isDemoUser]);

  useEffect(() => {
    if (currentUser) {
      loadAnalytics();
    }
  }, [currentUser, timeRange, loadAnalytics]);

  const formatTime = (minutes: number): string => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  const getProgressPercentage = (current: number, target: number): number => {
    return Math.min((current / target) * 100, 100);
  };

  const getProgressColor = (percentage: number): string => {
    if (percentage >= 80) return "text-green-500";
    if (percentage >= 60) return "text-yellow-500";
    if (percentage >= 40) return "text-orange-500";
    return "text-red-500";
  };

  const getProgressBgColor = (percentage: number): string => {
    if (percentage >= 80) return "bg-green-100 dark:bg-green-900";
    if (percentage >= 60) return "bg-yellow-100 dark:bg-yellow-900";
    if (percentage >= 40) return "bg-orange-100 dark:bg-orange-900";
    return "bg-red-100 dark:bg-red-900";
  };

  if (!currentUser) {
    return (
      <div
        className={`text-center py-8 ${
          darkMode ? "text-gray-300" : "text-gray-600"
        }`}
      >
        Please log in to view your cooking analytics.
      </div>
    );
  }

  if (loading) {
    return (
      <div
        className={`text-center py-8 ${
          darkMode ? "text-gray-300" : "text-gray-600"
        }`}
      >
        Loading analytics...
      </div>
    );
  }

  if (!analytics) {
    return (
      <div
        className={`text-center py-8 ${
          darkMode ? "text-gray-300" : "text-gray-600"
        }`}
      >
        Unable to load analytics. Please try again.
      </div>
    );
  }

  const hasNoData = analytics.totalRecipes === 0;

  return (
    <div
      className={`space-y-4 p-4 sm:p-6 rounded-lg ${
        darkMode
          ? "bg-gradient-to-br from-slate-900 to-gray-900 border border-slate-700 text-gray-100"
          : "bg-gradient-to-br from-slate-50 to-gray-50 border border-slate-200 text-gray-800"
      }`}
    >
      <div
        className={`rounded-lg p-4 ${
          darkMode
            ? "bg-slate-800/50 border border-slate-600"
            : "bg-white/80 border border-slate-300"
        }`}
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold">Cooking Analytics</h3>
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className={`px-3 py-1 rounded-lg text-sm ${
              darkMode
                ? "bg-slate-700 border-slate-500 text-white"
                : "bg-white border-slate-300 text-gray-800"
            }`}
          >
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="year">This Year</option>
            <option value="all">All Time</option>
          </select>
        </div>

        {/* Overview Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
          <div
            className={`text-center p-4 rounded-lg ${
              darkMode ? "bg-slate-700/50" : "bg-slate-100"
            }`}
          >
            <div className="text-2xl font-bold text-slate-600 dark:text-slate-400">
              {analytics.totalRecipes || 0}
            </div>
            <div className="text-sm text-slate-600 dark:text-slate-300">
              Total Recipes
            </div>
          </div>
          <div
            className={`text-center p-4 rounded-lg ${
              darkMode ? "bg-slate-700/50" : "bg-slate-100"
            }`}
          >
            <div className="text-2xl font-bold text-slate-600 dark:text-slate-400">
              {formatTime(analytics.totalCookingTime || 0)}
            </div>
            <div className="text-sm text-slate-600 dark:text-slate-300">
              Total Time
            </div>
          </div>
          <div
            className={`text-center p-4 rounded-lg ${
              darkMode ? "bg-slate-700/50" : "bg-slate-100"
            }`}
          >
            <div className="text-2xl font-bold text-slate-600 dark:text-slate-400">
              {analytics.averageRating || 0}
            </div>
            <div className="text-sm text-slate-600 dark:text-slate-300">
              Avg Rating
            </div>
          </div>
          <div
            className={`text-center p-4 rounded-lg ${
              darkMode ? "bg-slate-700/50" : "bg-slate-100"
            }`}
          >
            <div className="text-2xl font-bold text-slate-600 dark:text-slate-400">
              {analytics.favoriteCuisines?.length || 0}
            </div>
            <div className="text-sm text-slate-600 dark:text-slate-300">
              Cuisines Tried
            </div>
          </div>
        </div>

        {/* Cooking Goals Progress */}
        {analytics.cookingGoals && !hasNoData && (
          <div className="mb-6">
            <h4 className="font-medium mb-3">Cooking Goals Progress</h4>
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>
                    Weekly Recipes ({analytics.cookingGoals.currentWeekRecipes}/
                    {analytics.cookingGoals.weeklyRecipes})
                  </span>
                  <span
                    className={getProgressColor(
                      getProgressPercentage(
                        analytics.cookingGoals.currentWeekRecipes,
                        analytics.cookingGoals.weeklyRecipes,
                      ),
                    )}
                  >
                    {Math.round(
                      getProgressPercentage(
                        analytics.cookingGoals.currentWeekRecipes,
                        analytics.cookingGoals.weeklyRecipes,
                      ),
                    )}
                    %
                  </span>
                </div>
                <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${getProgressBgColor(
                      getProgressPercentage(
                        analytics.cookingGoals.currentWeekRecipes,
                        analytics.cookingGoals.weeklyRecipes,
                      ),
                    )}`}
                    style={{
                      width: `${getProgressPercentage(
                        analytics.cookingGoals.currentWeekRecipes,
                        analytics.cookingGoals.weeklyRecipes,
                      )}%`,
                    }}
                  ></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>
                    Weekly Time (
                    {formatTime(analytics.cookingGoals.currentWeekTime)}/
                    {formatTime(analytics.cookingGoals.weeklyTime)})
                  </span>
                  <span
                    className={getProgressColor(
                      getProgressPercentage(
                        analytics.cookingGoals.currentWeekTime,
                        analytics.cookingGoals.weeklyTime,
                      ),
                    )}
                  >
                    {Math.round(
                      getProgressPercentage(
                        analytics.cookingGoals.currentWeekTime,
                        analytics.cookingGoals.weeklyTime,
                      ),
                    )}
                    %
                  </span>
                </div>
                <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${getProgressBgColor(
                      getProgressPercentage(
                        analytics.cookingGoals.currentWeekTime,
                        analytics.cookingGoals.weeklyTime,
                      ),
                    )}`}
                    style={{
                      width: `${getProgressPercentage(
                        analytics.cookingGoals.currentWeekTime,
                        analytics.cookingGoals.weeklyTime,
                      )}%`,
                    }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Favorite Cuisines */}
        {analytics.favoriteCuisines &&
          analytics.favoriteCuisines.length > 0 && (
            <div className="mb-6">
              <h4 className="font-medium mb-3">Favorite Cuisines</h4>
              <div className="space-y-2">
                {analytics.favoriteCuisines
                  .slice(0, 5)
                  .map((cuisine: CuisineStat, index: number) => (
                    <div
                      key={index}
                      className="flex items-center justify-between"
                    >
                      <span className="text-sm">{cuisine.cuisine}</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-24 bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                          <div
                            className="h-2 bg-slate-500 dark:bg-slate-400 rounded-full"
                            style={{ width: `${cuisine.percentage}%` }}
                          ></div>
                        </div>
                        <span className="text-xs text-slate-600 dark:text-slate-300 w-8">
                          {cuisine.count}
                        </span>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}

        {/* Difficulty Breakdown */}
        {analytics.difficultyBreakdown &&
          analytics.difficultyBreakdown.length > 0 && (
            <div className="mb-6">
              <h4 className="font-medium mb-3">Difficulty Breakdown</h4>
              <div className="grid grid-cols-3 gap-4">
                {analytics.difficultyBreakdown.map(
                  (item: DifficultyStat, index: number) => (
                    <div
                      key={index}
                      className={`text-center p-3 rounded-lg ${
                        darkMode ? "bg-slate-700/50" : "bg-slate-100"
                      }`}
                    >
                      <div className="text-lg font-bold text-slate-600 dark:text-slate-400">
                        {item.count}
                      </div>
                      <div className="text-sm text-slate-600 dark:text-slate-300">
                        {item.difficulty}
                      </div>
                      <div className="text-xs text-slate-500 dark:text-slate-400">
                        {item.percentage}%
                      </div>
                    </div>
                  ),
                )}
              </div>
            </div>
          )}

        {/* Top Ingredients */}
        {analytics.topIngredients && analytics.topIngredients.length > 0 && (
          <div className="mb-6">
            <h4 className="font-medium mb-3">Most Used Ingredients</h4>
            <div className="space-y-2">
              {analytics.topIngredients
                .slice(0, 5)
                .map((ingredient: IngredientStat, index: number) => (
                  <div
                    key={index}
                    className="flex items-center justify-between"
                  >
                    <span className="text-sm">{ingredient.ingredient}</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-20 bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                        <div
                          className="h-2 bg-slate-500 dark:bg-slate-400 rounded-full"
                          style={{ width: `${ingredient.percentage}%` }}
                        ></div>
                      </div>
                      <span className="text-xs text-slate-600 dark:text-slate-300 w-6">
                        {ingredient.count}
                      </span>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* Achievements */}
        {analytics.achievements && analytics.achievements.length > 0 && (
          <div className="mb-6">
            <h4 className="font-medium mb-3">Recent Achievements</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {analytics.achievements.map(
                (achievement: Achievement, index: number) => (
                  <div
                    key={index}
                    className={`p-3 rounded-lg border ${
                      darkMode
                        ? "bg-slate-700/50 border-slate-500"
                        : "bg-slate-100 border-slate-300"
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      <span className="text-xl">{achievement.icon}</span>
                      <div>
                        <div className="font-medium text-sm">
                          {achievement.name}
                        </div>
                        <div className="text-xs text-slate-600 dark:text-slate-300">
                          {achievement.description}
                        </div>
                        <div className="text-xs text-slate-500 dark:text-slate-400">
                          Earned: {achievement.earned}
                        </div>
                      </div>
                    </div>
                  </div>
                ),
              )}
            </div>
          </div>
        )}

        {/* Weekly Progress Chart */}
        {analytics.weeklyProgress && analytics.weeklyProgress.length > 0 && (
          <div className="mb-6">
            <h4 className="font-medium mb-3">Weekly Progress</h4>
            <div className="space-y-2">
              {analytics.weeklyProgress.map(
                (week: WeeklyProgress, index: number) => (
                  <div
                    key={index}
                    className="flex items-center justify-between"
                  >
                    <span className="text-sm">{week.week}</span>
                    <div className="flex items-center space-x-4">
                      <span className="text-xs text-slate-600 dark:text-slate-300">
                        {week.recipes} recipes
                      </span>
                      <span className="text-xs text-slate-600 dark:text-slate-300">
                        {formatTime(week.time)}
                      </span>
                    </div>
                  </div>
                ),
              )}
            </div>
          </div>
        )}

        {/* Insights */}
        <div className="p-4 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700">
          <h4 className="font-medium mb-2 text-slate-800 dark:text-slate-200">
            Cooking Insights:
          </h4>
          {hasNoData ? (
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Your analytics are based on recipes in your favorites and
              collections. Add recipes from the Recipes page or browse featured
              recipes on the home page, then save them to see your stats and
              achievements here.
            </p>
          ) : (
            <ul className="text-sm text-slate-700 dark:text-slate-300 space-y-1">
              <li>
                • Your favorite cuisine is{" "}
                {analytics.favoriteCuisines?.[0]?.cuisine ?? "—"}
              </li>
              <li>
                • You prefer{" "}
                {analytics.difficultyBreakdown?.[0]?.difficulty ?? "—"} recipes
              </li>
              <li>
                • Average cooking time:{" "}
                {formatTime(
                  Math.round(
                    (analytics.totalCookingTime || 0) /
                      (analytics.totalRecipes || 1),
                  ),
                )}
              </li>
              <li>
                • You&apos;ve earned {analytics.achievements?.length ?? 0}{" "}
                achievements
              </li>
              <li>• Keep adding recipes to unlock more achievements</li>
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default CookingAnalytics;
