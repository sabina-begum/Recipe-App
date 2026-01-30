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

import { useState, useEffect, useCallback } from "react";
import LoadingSpinner from "./LoadingSpinner";
import OptimizedImage from "./ui/OptimizedImage";
import Button from "./ui/Button";

interface UserPreferences {
  favoriteCategories?: string[];
  dietaryRestrictions?: string[];
  skillLevel?: string;
  [key: string]: unknown;
}
interface RecipeRecommendation {
  idMeal: string;
  strMeal: string;
  strMealThumb: string;
  /** Category used to fetch this recipe (for display). */
  category?: string;
  [key: string]: unknown;
}
interface AIRecommendationsProps {
  darkMode: boolean;
  userPreferences?: UserPreferences;
}

function AIRecommendations({
  darkMode,
  userPreferences = {},
}: AIRecommendationsProps) {
  const [recommendations, setRecommendations] = useState<
    RecipeRecommendation[]
  >([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // AI recommendation logic
  const generateRecommendations = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      // Get user's favorite categories and ingredients
      const { favoriteCategories = [] } = userPreferences;

      // Fetch recipes based on preferences
      const recommendations: RecipeRecommendation[] = [];

      // Get recipes by category (tag with category for display)
      for (const category of favoriteCategories.slice(0, 3)) {
        const response = await fetch(
          `https://www.themealdb.com/api/json/v1/1/filter.php?c=${category}`,
        );
        const data = await response.json();
        if (data.meals) {
          const tagged = data.meals
            .slice(0, 2)
            .map((m: RecipeRecommendation) => ({
              ...m,
              category,
            }));
          recommendations.push(...tagged);
        }
      }

      // Get random recipes for variety (no category label)
      const randomResponse = await fetch(
        "https://www.themealdb.com/api/json/v1/1/random.php",
      );
      const randomData = await randomResponse.json();
      if (randomData.meals) {
        recommendations.push(randomData.meals[0]);
      }

      // Shuffle and limit to 6 recommendations
      const shuffled = recommendations.sort(() => 0.5 - Math.random());
      setRecommendations(shuffled.slice(0, 6));
    } catch (err) {
      console.error("Error generating recommendations:", err);
      setError("Failed to load recommendations. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [userPreferences]);

  useEffect(() => {
    generateRecommendations();
  }, [userPreferences, generateRecommendations]);

  if (loading) {
    return (
      <div
        className={`p-6 rounded-lg border ${
          darkMode
            ? "bg-black border-stone-700"
            : "bg-gradient-to-br from-orange-50 to-amber-50 border-orange-200"
        }`}
      >
        <h3
          className={`text-xl font-bold mb-4 ${
            darkMode ? "text-green-400" : "text-green-900"
          }`}
        >
          AI Recommendations
        </h3>
        <LoadingSpinner
          size="md"
          color="green"
          text="Analyzing your preferences..."
          darkMode={darkMode}
        />
      </div>
    );
  }

  if (error) {
    return (
      <div
        className={`p-6 rounded-lg border ${
          darkMode
            ? "bg-black border-stone-700"
            : "bg-gradient-to-br from-orange-50 to-amber-50 border-orange-200"
        }`}
      >
        <h3
          className={`text-xl font-bold mb-4 ${
            darkMode ? "text-green-400" : "text-green-900"
          }`}
        >
          AI Recommendations
        </h3>
        <p
          className={`text-sm ${darkMode ? "text-stone-300" : "text-gray-600"}`}
        >
          {error}
        </p>
        <Button
          onClick={generateRecommendations}
          variant="primary"
          size="sm"
          darkMode={darkMode}
          className="mt-3"
        >
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <div
      className={`p-6 rounded-lg border ${
        darkMode
          ? "bg-black border-stone-700"
          : "bg-gradient-to-br from-orange-50 to-amber-50 border-orange-200"
      }`}
    >
      <div className="flex items-center justify-between mb-6">
        <h3
          className={`text-xl font-bold break-words ${
            darkMode ? "text-green-400" : "text-green-900"
          }`}
        >
          AI Recommendations
        </h3>
        <Button
          onClick={generateRecommendations}
          variant="secondary"
          size="sm"
          darkMode={darkMode}
          className="flex-shrink-0 whitespace-nowrap"
        >
          Refresh
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {recommendations.map((recipe: RecipeRecommendation) => (
          <div
            key={recipe.idMeal}
            className={`rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow cursor-pointer ${
              darkMode ? "bg-neutral-800" : "bg-white"
            }`}
          >
            <OptimizedImage
              src={recipe.strMealThumb}
              alt={recipe.strMeal}
              className="w-full h-32 object-cover"
            />
            <div className="p-3">
              <h4
                className={`font-semibold text-sm break-words overflow-hidden leading-tight ${
                  darkMode ? "text-stone-200" : "text-gray-800"
                }`}
                title={recipe.strMeal}
              >
                {recipe.strMeal}
              </h4>
              <p
                className={`text-xs mt-1 break-words overflow-hidden ${
                  darkMode ? "text-stone-300" : "text-gray-600"
                }`}
              >
                {recipe.category
                  ? `From your ${recipe.category} preferences`
                  : "Recommended for you"}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AIRecommendations;
