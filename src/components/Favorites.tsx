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

import React, { useState, useEffect, useCallback, useMemo } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/useAuth";
import OptimizedImage from "./ui/OptimizedImage";
import LoadingSpinner from "./LoadingSpinner";

interface FavoritesProps {
  darkMode: boolean;
}

interface FavoriteRecipe {
  id: string | number;
  title: string;
  image: string;
  description: string;
  cookTime: string | number;
  rating: string | number;
  category: string;
  [key: string]: unknown;
}

function normalizeFavorite(recipe: unknown): FavoriteRecipe {
  const r = recipe as Record<string, unknown>;
  return {
    id: (r.id || r.recipeId || r.idMeal || "") as string | number,
    title: (r.title || r.strMeal || "Untitled Recipe") as string,
    image: (r.image || r.strMealThumb || "") as string,
    description: (r.description ||
      (typeof r.strInstructions === "string"
        ? r.strInstructions.slice(0, 120)
        : "No description available.")) as string,
    cookTime: (r.cookTime || r.strCookTime || "-") as string | number,
    rating: (r.rating || r.strRating || "-") as string | number,
    category: (r.category || r.strCategory || "Other") as string,
    ...r,
  };
}

const Favorites: React.FC<FavoritesProps> = ({ darkMode }) => {
  const { currentUser } = useAuth();
  const [favorites, setFavorites] = useState<FavoriteRecipe[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<string>("all");

  // Helper to check if current user is demo user
  const isDemoUser = currentUser && currentUser.uid === "demo-user-123";

  // Memoized fetch favorites function
  const fetchFavorites = useCallback(async () => {
    if (!currentUser) {
      setFavorites([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      let userFavorites: FavoriteRecipe[] = [];
      if (isDemoUser) {
        // Read from demoUser key
        const demoUserData = JSON.parse(
          localStorage.getItem("demoUser") || "{}",
        );
        userFavorites = demoUserData.demoData?.favorites || [];
      } else {
        // Read from favorites_<uid>
        userFavorites = JSON.parse(
          localStorage.getItem(`favorites_${currentUser.uid}`) || "[]",
        );
      }

      // Normalize favorites to always have an 'id' property and required fields
      const normalizedFavorites = userFavorites.map(normalizeFavorite);
      // Save back to localStorage if any were legacy (for non-demo users)
      if (!isDemoUser) {
        localStorage.setItem(
          `favorites_${currentUser.uid}`,
          JSON.stringify(normalizedFavorites),
        );
      } else {
        // For demo user, update demoUser key if needed
        const demoUserData = JSON.parse(
          localStorage.getItem("demoUser") || "{}",
        );
        demoUserData.demoData = demoUserData.demoData || {};
        demoUserData.demoData.favorites = normalizedFavorites;
        localStorage.setItem("demoUser", JSON.stringify(demoUserData));
      }

      setFavorites(normalizedFavorites);
    } catch (err) {
      setError("Failed to load favorites");
      console.error("Error fetching favorites:", err);
    } finally {
      setLoading(false);
    }
  }, [currentUser, isDemoUser]);

  // Memoized remove favorite function
  const removeFavorite = useCallback(
    async (recipeId: string | number) => {
      if (!currentUser) return;

      try {
        const updatedFavorites = favorites.filter(
          (fav) => (fav.id || fav.recipeId) !== recipeId,
        );
        setFavorites(updatedFavorites);

        // Update localStorage
        if (!isDemoUser) {
          localStorage.setItem(
            `favorites_${currentUser.uid}`,
            JSON.stringify(updatedFavorites),
          );
        } else {
          const demoUserData = JSON.parse(
            localStorage.getItem("demoUser") || "{}",
          );
          demoUserData.demoData = demoUserData.demoData || {};
          demoUserData.demoData.favorites = updatedFavorites;
          localStorage.setItem("demoUser", JSON.stringify(demoUserData));
        }
      } catch (err) {
        console.error("Error removing favorite:", err);
        setError("Failed to remove favorite");
      }
    },
    [favorites, currentUser, isDemoUser],
  );

  // Memoized filter change handler
  const handleFilterChange = useCallback((newFilter: string) => {
    setFilter(newFilter);
  }, []);

  // Effect to fetch favorites when user changes
  useEffect(() => {
    fetchFavorites();
  }, [fetchFavorites]);

  // Memoized filtered favorites
  const filteredFavorites = useMemo(() => {
    if (filter === "all") return favorites;

    return favorites.filter((recipe: FavoriteRecipe) => {
      switch (filter) {
        case "breakfast":
          return recipe.category === "breakfast";
        case "lunch":
          return recipe.category === "lunch";
        case "dinner":
          return recipe.category === "dinner";
        case "dessert":
          return recipe.category === "dessert";
        case "snack":
          return recipe.category === "snack";
        default:
          return true;
      }
    });
  }, [favorites, filter]);

  // Memoized filter options
  const filterOptions = useMemo(
    () => [
      { value: "all", label: "All Recipes", icon: "🍽️" },
      { value: "breakfast", label: "Breakfast", icon: "🌅" },
      { value: "lunch", label: "Lunch", icon: "☀️" },
      { value: "dinner", label: "Dinner", icon: "🌙" },
      { value: "dessert", label: "Desserts", icon: "🍰" },
      { value: "snack", label: "Snacks", icon: "🍿" },
    ],
    [],
  );

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 dark:from-black dark:to-stone-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-16 py-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              My Favorites
            </h1>
            <p className="text-gray-600 dark:text-stone-300 mb-8">
              Please log in to view your favorite recipes.
            </p>
            <Link
              to="/login"
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Login to Continue
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 dark:from-black dark:to-stone-800 flex items-center justify-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-16 w-full flex items-center justify-center">
          <LoadingSpinner />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 dark:from-black dark:to-stone-800">
      <div className="py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            My Favorites
          </h1>
          <p className="text-gray-600 dark:text-stone-300">
            Your saved recipes and culinary inspirations
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {filterOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => handleFilterChange(option.value)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                filter === option.value
                  ? darkMode
                    ? "bg-green-600 text-white shadow-lg"
                    : "bg-green-500 text-white shadow-lg"
                  : darkMode
                    ? "bg-stone-700 text-stone-200 hover:bg-stone-600"
                    : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-200"
              }`}
            >
              <span>{option.icon}</span>
              <span className="text-sm font-medium">{option.label}</span>
            </button>
          ))}
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-100 dark:bg-red-900/20 border border-red-400 text-red-700 dark:text-red-400 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        {/* Favorites Grid */}
        {filteredFavorites.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">❤️</div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              No favorites yet
            </h3>
            <p className="text-gray-600 dark:text-stone-300 mb-6">
              Start exploring recipes and add them to your favorites!
            </p>
            <Link
              to="/recipes"
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Browse Recipes
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredFavorites.map((recipe: FavoriteRecipe) => (
              <div
                key={recipe.id}
                className="bg-white dark:bg-stone-900 rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
              >
                <div className="relative">
                  <OptimizedImage
                    src={recipe.image}
                    alt={recipe.title}
                    className="w-full h-48 object-cover"
                    fallbackSrc="🍳"
                  />
                  <button
                    onClick={() => removeFavorite(recipe.id)}
                    className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                    aria-label="Remove from favorites"
                  >
                    ❌
                  </button>
                </div>

                <div className="p-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    {recipe.title}
                  </h3>
                  <p className="text-gray-600 dark:text-stone-300 text-sm mb-3 line-clamp-2">
                    {recipe.description}
                  </p>

                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm text-gray-500 dark:text-stone-400">
                      ⏱️ {recipe.cookTime} min
                    </span>
                    <span className="text-sm text-gray-500 dark:text-stone-400">
                      ⭐ {recipe.rating}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-xs bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-200 px-2 py-1 rounded">
                      {recipe.category}
                    </span>
                    <Link
                      to={`/recipe/${recipe.id}`}
                      className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 text-sm font-medium"
                    >
                      View Recipe →
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Favorites;
