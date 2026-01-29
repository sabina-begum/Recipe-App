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
import OptimizedImage from "./ui/OptimizedImage";
import { featuredRecipes } from "../data/recipes";

export interface LeftoverRecipeSuggestion {
  id: number;
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

  const getLeftoverSuggestions = useCallback(
    (ingredients: string[]): LeftoverRecipeSuggestion[] => {
      if (!ingredients.length) return [];
      const normalized = ingredients.map((i) => i.toLowerCase().trim());
      return featuredRecipes
        .filter((r) => {
          const recipeIngreds = (r.ingredients || []).map((i) =>
            i.toLowerCase().trim(),
          );
          const hasOverlap = normalized.some((curr) =>
            recipeIngreds.some((ri) => ri.includes(curr) || curr.includes(ri)),
          );
          return hasOverlap;
        })
        .map((r, index) => ({
          id: index + 1,
          name: r.name,
          description: r.description,
          ingredients: r.ingredients || [],
          difficulty: r.difficulty || "Easy",
          time: r.time || "—",
          image: r.image,
          category: r.category || "Other",
        }));
    },
    [],
  );

  useEffect(() => {
    if (recipe) {
      const ingredients = extractIngredients();
      const suggestions = getLeftoverSuggestions(ingredients);
      setLeftoverRecipes(suggestions);
    }
  }, [recipe, extractIngredients]);

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
        {leftoverRecipes.length > 0 ? (
          <div className="space-y-4">
            <h4 className="text-md font-medium">
              Suggested recipes using leftovers:
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {leftoverRecipes.map((suggestion) => (
                <div
                  key={suggestion.id}
                  className={`rounded-lg overflow-hidden border transition-all duration-200 hover:scale-105 cursor-pointer ${
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
                </div>
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
