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
import { Link } from "react-router-dom";
import OptimizedImage from "./ui/OptimizedImage";

const MEALDB_BASE = "https://www.themealdb.com/api/json/v1/1";

export interface LeftoverRecipeSuggestion {
  id: number;
  mealId: string;
  name: string;
  description: string;
  ingredients: string[];
  difficulty: "Easy" | "Medium" | "Hard";
  time: string;
  image: string;
  category: string;
}

interface LeftoverIntegrationProps {
  recipe: unknown;
  darkMode: boolean;
}

const LeftoverIntegration: React.FC<LeftoverIntegrationProps> = ({
  recipe,
  darkMode,
}) => {
  const [leftoverRecipes, setLeftoverRecipes] = useState<
    LeftoverRecipeSuggestion[]
  >([]);
  const [leftoverLoading, setLeftoverLoading] = useState(false);
  const [selectedIngredients, setSelectedIngredients] = useState<string[]>([]);

  // Extract ingredients from current recipe
  const extractIngredients = useCallback((): string[] => {
    if (!recipe) return [];
    const ingredients: string[] = [];
    for (let i = 1; i <= 20; i++) {
      const ing = (recipe as Record<string, unknown>)[
        `strIngredient${i}`
      ] as string;
      if (ing && ing.trim()) {
        ingredients.push(ing.trim().toLowerCase());
      }
    }
    return ingredients;
  }, [recipe]);

  const fetchLeftoverSuggestions = useCallback(
    async (
      ingredients: string[],
      currentRecipeId?: string,
    ): Promise<LeftoverRecipeSuggestion[]> => {
      if (!ingredients.length) return [];
      const normalized = ingredients.map((i) => i.toLowerCase().trim());
      const currentId = String(currentRecipeId ?? "").toLowerCase();
      const mealOverlaps: Record<
        string,
        {
          count: number;
          strMeal: string;
          strMealThumb: string;
          matched: string[];
        }
      > = {};

      for (const ing of normalized) {
        const param = ing
          .replace(/\s+/g, "_")
          .replace(/^./, (c) => c.toUpperCase());
        try {
          const res = await fetch(
            `${MEALDB_BASE}/filter.php?i=${encodeURIComponent(param)}`,
          );
          const json = (await res.json()) as {
            meals?: Array<{
              idMeal: string;
              strMeal: string;
              strMealThumb: string;
            }>;
          };
          const meals = json.meals ?? [];
          for (const m of meals) {
            if (currentId && m.idMeal === currentId) continue;
            if (!mealOverlaps[m.idMeal]) {
              mealOverlaps[m.idMeal] = {
                count: 0,
                strMeal: m.strMeal ?? "",
                strMealThumb: m.strMealThumb ?? "",
                matched: [],
              };
            }
            mealOverlaps[m.idMeal].count += 1;
            if (!mealOverlaps[m.idMeal].matched.includes(ing)) {
              mealOverlaps[m.idMeal].matched.push(ing);
            }
          }
        } catch {
          // skip failed ingredient
        }
      }

      const entries = Object.entries(mealOverlaps)
        .filter(([, v]) => v.count > 0)
        .sort((a, b) => b[1].count - a[1].count)
        .slice(0, 12);

      return entries.map(([idMeal, v], index) => ({
        id: index + 1,
        mealId: idMeal,
        name: v.strMeal,
        description:
          v.matched.length > 0
            ? `Uses your leftovers: ${v.matched.slice(0, 5).join(", ")}${v.matched.length > 5 ? "…" : ""}`
            : "From TheMealDB",
        ingredients: v.matched,
        difficulty: "Easy" as const,
        time: "—",
        image: v.strMealThumb,
        category: "—",
      }));
    },
    [],
  );

  useEffect(() => {
    if (!recipe) return;
    const ingredients = extractIngredients();
    const currentId = (recipe as Record<string, unknown>).idMeal as
      | string
      | undefined;
    let cancelled = false;
    setLeftoverLoading(true);
    setLeftoverRecipes([]);
    fetchLeftoverSuggestions(ingredients, currentId).then((suggestions) => {
      if (!cancelled) {
        setLeftoverRecipes(suggestions);
        setLeftoverLoading(false);
      }
    });
    return () => {
      cancelled = true;
    };
  }, [recipe, extractIngredients, fetchLeftoverSuggestions]);

  const handleIngredientToggle = (ingredient: string): void => {
    setSelectedIngredients((prev) =>
      prev.includes(ingredient)
        ? prev.filter((ing) => ing !== ingredient)
        : [...prev, ingredient],
    );
  };

  const getDifficultyColor = (
    difficulty: "Easy" | "Medium" | "Hard",
  ): string => {
    switch (difficulty) {
      case "Easy":
        return "text-green-500";
      case "Medium":
        return "text-yellow-500";
      case "Hard":
        return "text-red-500";
      default:
        return "text-gray-500";
    }
  };

  const getDifficultyBgColor = (
    difficulty: "Easy" | "Medium" | "Hard",
  ): string => {
    switch (difficulty) {
      case "Easy":
        return "bg-green-100 dark:bg-green-900";
      case "Medium":
        return "bg-yellow-100 dark:bg-yellow-900";
      case "Hard":
        return "bg-red-100 dark:bg-red-900";
      default:
        return "bg-stone-100 dark:bg-black";
    }
  };

  if (!recipe) return null;

  const currentIngredients = extractIngredients();

  return (
    <div
      className={`space-y-4 p-4 sm:p-6 rounded-lg ${
        darkMode
          ? "bg-gradient-to-br from-green-900 to-emerald-900 border border-green-700 text-gray-100"
          : "bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 text-gray-800"
      }`}
    >
      <div
        className={`rounded-lg p-4 ${
          darkMode
            ? "bg-green-800/50 border border-green-600"
            : "bg-white/80 border border-green-300"
        }`}
      >
        <h3 className="text-lg font-semibold mb-4">Leftover Recipe Ideas</h3>

        {/* Current Recipe Ingredients */}
        <div className="mb-6">
          <h4 className="text-md font-medium mb-3">
            Ingredients from this recipe:
          </h4>
          <div className="flex flex-wrap gap-2">
            {currentIngredients.map((ingredient, index) => (
              <button
                key={index}
                onClick={() => handleIngredientToggle(ingredient)}
                className={`px-3 py-1 rounded-full text-sm font-medium transition-all duration-200 ${
                  selectedIngredients.includes(ingredient)
                    ? "bg-green-500 text-white"
                    : darkMode
                      ? "bg-green-700/50 text-green-200 border border-green-500"
                      : "bg-green-100 text-green-800 border border-green-300"
                }`}
              >
                {ingredient}
              </button>
            ))}
          </div>
        </div>

        {/* Leftover Recipe Suggestions */}
        {leftoverLoading ? (
          <p className="text-sm text-muted-foreground py-4">
            Loading leftover ideas from database…
          </p>
        ) : leftoverRecipes.length > 0 ? (
          <div className="space-y-4">
            <h4 className="text-md font-medium">
              Suggested recipes using leftovers (from database):
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {leftoverRecipes.map((suggestion) => (
                <Link
                  key={suggestion.mealId}
                  to={`/recipe/${suggestion.mealId}`}
                  className={`rounded-lg overflow-hidden border transition-all duration-200 hover:scale-105 cursor-pointer block ${
                    darkMode
                      ? "bg-green-700/50 border-green-500"
                      : "bg-white border-green-300"
                  }`}
                >
                  <div className="h-32 overflow-hidden">
                    <OptimizedImage
                      src={suggestion.image}
                      alt={suggestion.name}
                      className="w-full h-full object-cover"
                      fallbackSrc="🍳"
                    />
                  </div>
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h5 className="font-semibold text-sm">
                        {suggestion.name}
                      </h5>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyBgColor(
                          suggestion.difficulty,
                        )} ${getDifficultyColor(suggestion.difficulty)}`}
                      >
                        {suggestion.difficulty}
                      </span>
                    </div>
                    <p className="text-xs text-gray-600 dark:text-stone-200 mb-2">
                      {suggestion.description}
                    </p>
                    <div className="flex items-center justify-between text-xs text-gray-500 dark:text-stone-400">
                      <span>⏱️ {suggestion.time}</span>
                      <span>🍽️ {suggestion.category}</span>
                    </div>
                    <div className="mt-2">
                      <div className="flex flex-wrap gap-1">
                        {suggestion.ingredients
                          .slice(0, 3)
                          .map((ingredient, index) => (
                            <span
                              key={index}
                              className={`px-2 py-1 rounded text-xs ${
                                currentIngredients.some(
                                  (ing) =>
                                    ing.includes(ingredient) ||
                                    ingredient.includes(ing),
                                )
                                  ? "bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-200"
                                  : "bg-stone-100 text-gray-600 dark:bg-neutral-700 dark:text-stone-300"
                              }`}
                            >
                              {ingredient}
                            </span>
                          ))}
                        {suggestion.ingredients.length > 3 && (
                          <span className="px-2 py-1 rounded text-xs bg-stone-100 text-gray-600 dark:bg-neutral-700 dark:text-stone-300">
                            +{suggestion.ingredients.length - 3} more
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-600 dark:text-stone-200 mb-4">
              No specific leftover recipes found for this dish.
            </p>
            <div className="p-3 rounded-lg bg-green-50 dark:bg-green-900 border border-green-200 dark:border-green-700">
              <p className="text-sm text-green-800 dark:text-green-200">
                💡 <strong>Tip:</strong> Most ingredients can be repurposed! Try
                searching for recipes using specific ingredients you have
                leftover.
              </p>
            </div>
          </div>
        )}

        {/* Tips Section */}
        <div className="mt-6 p-4 rounded-lg bg-green-50 dark:bg-green-900 border border-green-200 dark:border-green-700">
          <h4 className="font-medium mb-2 text-green-800 dark:text-green-200">
            Leftover Tips:
          </h4>
          <ul className="text-sm text-green-700 dark:text-green-300 space-y-1">
            <li>• Store leftovers in airtight containers for 3-4 days</li>
            <li>• Freeze cooked proteins for up to 3 months</li>
            <li>
              • Use leftover vegetables in soups, stir-fries, or omelettes
            </li>
            <li>• Transform leftover rice into fried rice or rice pudding</li>
            <li>
              • Repurpose bread into croutons, breadcrumbs, or bread pudding
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default LeftoverIntegration;
