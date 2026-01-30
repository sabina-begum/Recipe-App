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

import { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { featuredRecipes } from "../data/recipes";

interface Ingredient {
  name: string;
  category: string;
  peak: string;
  price: string;
}

interface Recipe {
  name: string;
  difficulty: string;
  time: string;
  category: string;
}

interface SeasonData {
  ingredients: Ingredient[];
  recipes: Recipe[];
}

interface SeasonalIngredientsProps {
  darkMode: boolean;
}

const SeasonalIngredients = ({ darkMode }: SeasonalIngredientsProps) => {
  const [currentSeason, setCurrentSeason] = useState<string>("");
  const [seasonalIngredients, setSeasonalIngredients] = useState<Ingredient[]>(
    [],
  );
  const [selectedSeason, setSelectedSeason] = useState<string>("");

  // Real recipes from featuredRecipes filtered by selected season
  const seasonalRecipes = useMemo(
    () => featuredRecipes.filter((r) => r.seasons?.includes(selectedSeason)),
    [selectedSeason],
  );

  // Determine current season
  const getCurrentSeason = (): string => {
    const month = new Date().getMonth();
    if (month >= 2 && month <= 4) return "Spring";
    if (month >= 5 && month <= 7) return "Summer";
    if (month >= 8 && month <= 10) return "Fall";
    return "Winter";
  };

  // Seasonal ingredients data
  const seasonalData: { [key: string]: SeasonData } = useMemo(
    () => ({
      Spring: {
        ingredients: [
          {
            name: "Asparagus",
            category: "Vegetables",
            peak: "March-May",
            price: "$3-5/lb",
          },
          {
            name: "Strawberries",
            category: "Fruits",
            peak: "April-June",
            price: "$2-4/lb",
          },
          {
            name: "Peas",
            category: "Vegetables",
            peak: "March-June",
            price: "$2-3/lb",
          },
          {
            name: "Rhubarb",
            category: "Vegetables",
            peak: "April-June",
            price: "$3-4/lb",
          },
          {
            name: "Artichokes",
            category: "Vegetables",
            peak: "March-May",
            price: "$2-3 each",
          },
          {
            name: "Spinach",
            category: "Vegetables",
            peak: "March-June",
            price: "$2-3/lb",
          },
          {
            name: "Cherries",
            category: "Fruits",
            peak: "May-July",
            price: "$4-6/lb",
          },
          {
            name: "Broad Beans",
            category: "Legumes",
            peak: "April-June",
            price: "$3-4/lb",
          },
        ],
        recipes: [
          {
            name: "Spring Vegetable Risotto",
            difficulty: "Medium",
            time: "30 min",
            category: "Main Course",
          },
          {
            name: "Strawberry Spinach Salad",
            difficulty: "Easy",
            time: "15 min",
            category: "Salad",
          },
          {
            name: "Asparagus Quiche",
            difficulty: "Medium",
            time: "45 min",
            category: "Breakfast",
          },
          {
            name: "Rhubarb Crisp",
            difficulty: "Easy",
            time: "40 min",
            category: "Dessert",
          },
        ],
      },
      Summer: {
        ingredients: [
          {
            name: "Tomatoes",
            category: "Vegetables",
            peak: "June-September",
            price: "$2-4/lb",
          },
          {
            name: "Corn",
            category: "Vegetables",
            peak: "July-September",
            price: "$0.50-1/ear",
          },
          {
            name: "Zucchini",
            category: "Vegetables",
            peak: "June-September",
            price: "$1-2/lb",
          },
          {
            name: "Peaches",
            category: "Fruits",
            peak: "June-September",
            price: "$2-4/lb",
          },
          {
            name: "Watermelon",
            category: "Fruits",
            peak: "June-September",
            price: "$3-6 each",
          },
          {
            name: "Bell Peppers",
            category: "Vegetables",
            peak: "July-October",
            price: "$1-3/lb",
          },
          {
            name: "Blueberries",
            category: "Fruits",
            peak: "June-August",
            price: "$3-5/lb",
          },
          {
            name: "Cucumber",
            category: "Vegetables",
            peak: "June-September",
            price: "$1-2/lb",
          },
        ],
        recipes: [
          {
            name: "Caprese Salad",
            difficulty: "Easy",
            time: "10 min",
            category: "Salad",
          },
          {
            name: "Grilled Corn Salsa",
            difficulty: "Easy",
            time: "20 min",
            category: "Appetizer",
          },
          {
            name: "Peach Cobbler",
            difficulty: "Medium",
            time: "50 min",
            category: "Dessert",
          },
          {
            name: "Zucchini Bread",
            difficulty: "Easy",
            time: "60 min",
            category: "Bread",
          },
        ],
      },
      Fall: {
        ingredients: [
          {
            name: "Pumpkin",
            category: "Vegetables",
            peak: "September-November",
            price: "$2-4 each",
          },
          {
            name: "Sweet Potatoes",
            category: "Vegetables",
            peak: "September-December",
            price: "$1-2/lb",
          },
          {
            name: "Apples",
            category: "Fruits",
            peak: "September-November",
            price: "$2-4/lb",
          },
          {
            name: "Brussels Sprouts",
            category: "Vegetables",
            peak: "September-December",
            price: "$2-4/lb",
          },
          {
            name: "Cranberries",
            category: "Fruits",
            peak: "October-December",
            price: "$3-5/lb",
          },
          {
            name: "Butternut Squash",
            category: "Vegetables",
            peak: "September-December",
            price: "$2-3/lb",
          },
          {
            name: "Pears",
            category: "Fruits",
            peak: "September-December",
            price: "$2-4/lb",
          },
          {
            name: "Mushrooms",
            category: "Vegetables",
            peak: "September-November",
            price: "$3-6/lb",
          },
        ],
        recipes: [
          {
            name: "Pumpkin Soup",
            difficulty: "Easy",
            time: "30 min",
            category: "Soup",
          },
          {
            name: "Apple Crisp",
            difficulty: "Easy",
            time: "45 min",
            category: "Dessert",
          },
          {
            name: "Roasted Brussels Sprouts",
            difficulty: "Easy",
            time: "25 min",
            category: "Side Dish",
          },
          {
            name: "Sweet Potato Casserole",
            difficulty: "Medium",
            time: "60 min",
            category: "Side Dish",
          },
        ],
      },
      Winter: {
        ingredients: [
          {
            name: "Citrus Fruits",
            category: "Fruits",
            peak: "December-March",
            price: "$2-4/lb",
          },
          {
            name: "Kale",
            category: "Vegetables",
            peak: "October-March",
            price: "$2-3/lb",
          },
          {
            name: "Root Vegetables",
            category: "Vegetables",
            peak: "October-March",
            price: "$1-3/lb",
          },
          {
            name: "Pomegranate",
            category: "Fruits",
            peak: "October-January",
            price: "$2-4 each",
          },
          {
            name: "Winter Squash",
            category: "Vegetables",
            peak: "October-March",
            price: "$2-4/lb",
          },
          {
            name: "Cabbage",
            category: "Vegetables",
            peak: "October-March",
            price: "$1-2/lb",
          },
          {
            name: "Persimmons",
            category: "Fruits",
            peak: "October-December",
            price: "$3-5/lb",
          },
          {
            name: "Leeks",
            category: "Vegetables",
            peak: "October-March",
            price: "$2-3/lb",
          },
        ],
        recipes: [
          {
            name: "Citrus Roasted Chicken",
            difficulty: "Medium",
            time: "90 min",
            category: "Main Course",
          },
          {
            name: "Kale Caesar Salad",
            difficulty: "Easy",
            time: "15 min",
            category: "Salad",
          },
          {
            name: "Root Vegetable Soup",
            difficulty: "Easy",
            time: "40 min",
            category: "Soup",
          },
          {
            name: "Pomegranate Molasses",
            difficulty: "Medium",
            time: "30 min",
            category: "Condiment",
          },
        ],
      },
    }),
    [],
  );

  useEffect(() => {
    const season = getCurrentSeason();
    setCurrentSeason(season);
    setSelectedSeason(season);
    setSeasonalIngredients(seasonalData[season]?.ingredients || []);
  }, [seasonalData]);

  const handleSeasonChange = (season: string) => {
    setSelectedSeason(season);
    setSeasonalIngredients(seasonalData[season]?.ingredients || []);
  };

  const getSeasonColor = (season: string) => {
    switch (season) {
      case "Spring":
        return "text-green-500";
      case "Summer":
        return "text-yellow-500";
      case "Fall":
        return "text-orange-500";
      case "Winter":
        return "text-blue-500";
      default:
        return "text-gray-500";
    }
  };

  const getSeasonBgColor = (season: string) => {
    switch (season) {
      case "Spring":
        return "bg-green-100 dark:bg-green-900";
      case "Summer":
        return "bg-yellow-100 dark:bg-yellow-900";
      case "Fall":
        return "bg-orange-100 dark:bg-orange-900";
      case "Winter":
        return "bg-blue-100 dark:bg-blue-900";
      default:
        return "bg-stone-100 dark:bg-black";
    }
  };

  // const getDifficultyColor = (difficulty) => {
  //   switch (difficulty) {
  //     case "Easy":
  //       return "text-green-500";
  //     case "Medium":
  //       return "text-yellow-500";
  //     case "Hard":
  //       return "text-red-500";
  //     default:
  //       return "text-gray-500";
  //   }
  // };

  return (
    <div
      className={`space-y-4 p-4 sm:p-6 rounded-lg ${
        darkMode
          ? "bg-gradient-to-br from-indigo-900 to-purple-900 border border-indigo-700 text-gray-100"
          : "bg-gradient-to-br from-indigo-50 to-purple-50 border border-indigo-200 text-gray-800"
      }`}
    >
      <div
        className={`rounded-lg p-4 ${
          darkMode
            ? "bg-indigo-800/50 border border-indigo-600"
            : "bg-white/80 border border-indigo-300"
        }`}
      >
        <h3 className="text-lg font-semibold mb-4">
          Seasonal Ingredients Guide
        </h3>

        {/* Season Selector */}
        <div className="mb-6">
          <div className="flex flex-wrap gap-2 mb-4">
            {Object.keys(seasonalData).map((season) => (
              <button
                key={season}
                onClick={() => handleSeasonChange(season)}
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                  selectedSeason === season
                    ? `${getSeasonBgColor(season)} ${getSeasonColor(
                        season,
                      )} border-2 border-current`
                    : darkMode
                      ? "bg-indigo-700/50 text-indigo-200 border border-indigo-500"
                      : "bg-indigo-100 text-indigo-800 border border-indigo-300"
                }`}
              >
                {season}
                {season === currentSeason && (
                  <span className="ml-2 text-xs">(Current)</span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Seasonal Ingredients */}
        <div className="mb-6">
          <h4 className="text-md font-medium mb-3">Peak Season Ingredients:</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {seasonalIngredients.map((ingredient, index) => (
              <div
                key={index}
                className={`p-3 rounded-lg border ${
                  darkMode
                    ? "bg-indigo-700/50 border-indigo-500"
                    : "bg-indigo-100 border-indigo-300"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <h5 className="font-medium text-sm">{ingredient.name}</h5>
                  <span className="text-xs text-gray-500">
                    {ingredient.category}
                  </span>
                </div>
                <div className="text-xs text-gray-600 dark:text-stone-300 space-y-1">
                  <div>📅 Peak: {ingredient.peak}</div>
                  <div>💰 Avg Price: {ingredient.price}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Seasonal Recipe Suggestions (real recipes filtered by season) */}
        <div className="mb-6">
          <h4 className="text-md font-medium mb-3">Seasonal recipes</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {seasonalRecipes.length === 0 ? (
              <p className="text-sm opacity-80">
                No recipes tagged for this season yet.
              </p>
            ) : (
              seasonalRecipes.map((recipe) => (
                <Link
                  key={recipe.id}
                  to={`/recipe/${recipe.id}`}
                  className={`block p-3 rounded-lg border transition ${
                    darkMode
                      ? "bg-indigo-700/50 border-indigo-500 hover:border-indigo-400"
                      : "bg-indigo-100 border-indigo-300 hover:border-indigo-500"
                  }`}
                >
                  {recipe.image && (
                    <img
                      src={recipe.image}
                      alt={recipe.name}
                      className="w-full h-24 object-cover rounded mb-2"
                    />
                  )}
                  <div className="flex items-center justify-between mb-2">
                    <h5 className="font-medium text-sm">{recipe.name}</h5>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${getSeasonBgColor(
                        selectedSeason,
                      )} ${getSeasonColor(selectedSeason)}`}
                    >
                      {recipe.difficulty ?? "—"}
                    </span>
                  </div>
                  <div className="text-xs text-gray-600 dark:text-stone-300 space-y-1">
                    <div>⏱️ {recipe.time ?? "—"}</div>
                    <div>🍽️ {recipe.category ?? "—"}</div>
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>

        {/* Seasonal Tips */}
        <div className="p-4 rounded-lg bg-indigo-50 dark:bg-indigo-900 border border-indigo-200 dark:border-indigo-700">
          <h4 className="font-medium mb-2 text-indigo-800 dark:text-indigo-200">
            Seasonal Shopping Tips:
          </h4>
          <ul className="text-sm text-indigo-700 dark:text-indigo-300 space-y-1">
            <li>• Buy in bulk during peak season for better prices</li>
            <li>• Freeze seasonal produce for year-round use</li>
            <li>
              • Visit local farmers&apos; markets for the freshest options
            </li>
            <li>
              • Plan meals around what&apos;s in season for maximum flavor
            </li>
            <li>
              • Seasonal ingredients are often more nutritious and flavorful
            </li>
          </ul>
        </div>

        {/* Current Season Highlight */}
        {currentSeason && (
          <div
            className={`mt-4 p-3 rounded-lg ${getSeasonBgColor(
              currentSeason,
            )} border border-current`}
          >
            <p className={`text-sm ${getSeasonColor(currentSeason)}`}>
              🌱 <strong>Current Season ({currentSeason}):</strong> This is the
              perfect time to enjoy fresh, local produce at its peak flavor and
              best prices!
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SeasonalIngredients;
