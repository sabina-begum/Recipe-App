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

import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import LoadingSpinner from "../../components/LoadingSpinner";
import ErrorMessage from "../../components/ErrorMessage";
import Button from "../../components/ui/Button";
import OptimizedImage from "../../components/ui/OptimizedImage";
import performanceService from "../../services/performanceService";
import type { Recipe } from "../../global";

interface Meal {
  idMeal: string;
  strMeal: string;
  strMealThumb: string;
}

interface AZRecipesPageProps {
  darkMode: boolean;
}

export default function AZRecipesPage({ darkMode }: AZRecipesPageProps) {
  const [letter, setLetter] = useState("a");
  const [meals, setMeals] = useState<Meal[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Function to check if recipe contains pork or alcohol
  const containsPorkOrAlcohol = (recipe: Recipe) => {
    const searchTerms = [
      "pork",
      "bacon",
      "ham",
      "sausage",
      "prosciutto",
      "pancetta",
      "lard",
      "speck",
      "alcohol",
      "wine",
      "beer",
      "vodka",
      "whiskey",
      "rum",
      "gin",
      "tequila",
      "brandy",
      "sherry",
      "port",
      "cognac",
      "bourbon",
      "scotch",
      "liqueur",
      "schnapps",
      "absinthe",
    ];

    const recipeText = [
      recipe.strMeal?.toLowerCase() || "",
      recipe.strCategory?.toLowerCase() || "",
      recipe.strArea?.toLowerCase() || "",
      recipe.strInstructions?.toLowerCase() || "",
      ...Array.from(
        { length: 20 },
        (_, i) => recipe[`strIngredient${i + 1}`]?.toLowerCase() || ""
      ),
    ].join(" ");

    return searchTerms.some((term) => recipeText.includes(term));
  };

  useEffect(() => {
    async function fetchByLetter() {
      setLoading(true);
      setError(null);

      try {
        const url = `https://www.themealdb.com/api/json/v1/1/search.php?f=${letter}`;
        const json = await performanceService.cachedFetch(url);
        const allMeals = json.meals || [];

        // Filter out recipes containing pork or alcohol
        const filteredMeals = allMeals.filter(
          (meal: Recipe) => !containsPorkOrAlcohol(meal)
        );
        setMeals(filteredMeals);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch recipes. Please try again.");
        setMeals([]);
      } finally {
        setLoading(false);
      }
    }
    fetchByLetter();
  }, [letter]);

  return (
    <div
      className={`pt-4 sm:pt-8 lg:pt-12 pb-4 sm:pb-8 lg:pb-12 transition-colors duration-300 ${
        darkMode ? "bg-black" : "bg-stone-100"
      }`}
    >
      <h1
        className={`text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl font-bold mb-6 sm:mb-8 lg:mb-12 text-left leading-tight ${
          darkMode ? "text-green-300" : "text-green-900"
        }`}
      >
        Browse Recipes: A–Z
      </h1>

      <div className="flex flex-wrap gap-2 sm:gap-3 mb-6 sm:mb-8 lg:mb-12 justify-start">
        {"abcdefghijklmnopqrstuvwxyz".split("").map((l) => (
          <Button
            key={l}
            onClick={() => setLetter(l)}
            isActive={letter === l}
            darkMode={darkMode}
            size="lg"
            variant="primary"
          >
            {l.toUpperCase()}
          </Button>
        ))}
      </div>

      {/* Loading State */}
      {loading && (
        <LoadingSpinner
          size="lg"
          color="blue"
          text="Loading recipes..."
          darkMode={darkMode}
        />
      )}

      {/* Error State */}
      {error && <ErrorMessage message={error} darkMode={darkMode} />}

      {/* Recipes Grid */}
      {!loading && !error && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4 lg:gap-6">
          {meals.map((meal) => (
            <Link
              key={meal.idMeal}
              to={`/recipe/${meal.idMeal}`}
              className={`rounded-lg shadow-2xl border-0 hover:shadow-lg transition-shadow cursor-pointer overflow-hidden block
                ${
                  darkMode
                    ? "bg-gradient-to-br from-neutral-900 to-neutral-800"
                    : "bg-gradient-to-br from-stone-50 to-stone-100"
                }`}
            >
              <div className="w-full aspect-[4/3] bg-stone-100 dark:bg-black overflow-hidden">
                <OptimizedImage
                  src={meal.strMealThumb}
                  alt={meal.strMeal}
                  className="w-full h-full object-cover rounded-t-lg"
                  lazy={true}
                />
              </div>
              <div className="p-3">
                <h2
                  className={`text-sm sm:text-lg font-semibold leading-tight break-words overflow-hidden ${
                    darkMode ? "text-stone-300" : "text-gray-800"
                  }`}
                >
                  {meal.strMeal}
                </h2>
              </div>
            </Link>
          ))}
          {meals.length === 0 && (
            <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-16 w-full col-span-full">
              <p
                className={`text-center py-8 ${
                  darkMode ? "text-stone-400" : "text-gray-600"
                }`}
              >
                No recipes found for &quot;{letter.toUpperCase()}&quot;
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
