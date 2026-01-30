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

import { useState, useMemo } from "react";
import Button from "./ui/Button";

interface Substitution {
  name: string;
  ratio: string;
  notes: string;
}
interface SubstitutionDatabase {
  [ingredient: string]: Substitution[];
}
interface AISubstitutionsProps {
  darkMode: boolean;
  ingredients: string[];
}

function AISubstitutions({ darkMode, ingredients }: AISubstitutionsProps) {
  const [selectedIngredient, setSelectedIngredient] = useState<string>("");
  const [substitutions, setSubstitutions] = useState<Substitution[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  // Substitution database (real culinary data, no mock)
  const substitutionDatabase: SubstitutionDatabase = {
    eggs: [
      {
        name: "Flaxseed meal",
        ratio: "1 tbsp + 3 tbsp water",
        notes: "For binding",
      },
      {
        name: "Chia seeds",
        ratio: "1 tbsp + 3 tbsp water",
        notes: "For binding",
      },
      { name: "Banana", ratio: "1/4 cup mashed", notes: "For moisture" },
      { name: "Applesauce", ratio: "1/4 cup", notes: "For moisture" },
    ],
    milk: [
      { name: "Almond milk", ratio: "1:1", notes: "Dairy-free alternative" },
      { name: "Soy milk", ratio: "1:1", notes: "High protein" },
      { name: "Oat milk", ratio: "1:1", notes: "Creamy texture" },
      { name: "Coconut milk", ratio: "1:1", notes: "Rich flavor" },
    ],
    butter: [
      {
        name: "Olive oil",
        ratio: "3/4 cup oil for 1 cup butter",
        notes: "Healthier option",
      },
      { name: "Coconut oil", ratio: "1:1", notes: "For baking" },
      { name: "Avocado", ratio: "1/2 cup mashed", notes: "For spreads" },
      {
        name: "Greek yogurt",
        ratio: "1/2 cup for 1 cup butter",
        notes: "Lower fat",
      },
    ],
    flour: [
      {
        name: "Almond flour",
        ratio: "1:1",
        notes: "Gluten-free, high protein",
      },
      {
        name: "Coconut flour",
        ratio: "1/4 cup for 1 cup flour",
        notes: "Absorbs more liquid",
      },
      { name: "Oat flour", ratio: "1:1", notes: "Whole grain" },
      { name: "Chickpea flour", ratio: "1:1", notes: "High protein" },
    ],
    sugar: [
      {
        name: "Honey",
        ratio: "3/4 cup for 1 cup sugar",
        notes: "Reduce liquid by 1/4 cup",
      },
      {
        name: "Maple syrup",
        ratio: "3/4 cup for 1 cup sugar",
        notes: "Reduce liquid by 1/4 cup",
      },
      {
        name: "Stevia",
        ratio: "1/2 tsp for 1 cup sugar",
        notes: "Much sweeter",
      },
      { name: "Coconut sugar", ratio: "1:1", notes: "Lower glycemic index" },
    ],
    salt: [
      {
        name: "Herbs and spices",
        ratio: "1/4 tsp herbs for 1/4 tsp salt",
        notes: "Flavor without sodium",
      },
      {
        name: "Lemon juice",
        ratio: "1 tbsp for 1/4 tsp salt",
        notes: "Brightens flavor",
      },
      {
        name: "Garlic powder",
        ratio: "1/4 tsp for 1/4 tsp salt",
        notes: "Adds depth",
      },
    ],
  };

  // Use the ingredients prop to suggest substitutions for ingredients in the recipe
  const suggestedIngredients = useMemo(() => {
    if (!ingredients || ingredients.length === 0) return [];

    return ingredients
      .filter((ingredient) =>
        Object.keys(substitutionDatabase).some(
          (dbIngredient) =>
            ingredient.toLowerCase().includes(dbIngredient) ||
            dbIngredient.includes(ingredient.toLowerCase()),
        ),
      )
      .slice(0, 5); // Limit to 5 suggestions
  }, [ingredients]);

  const findSubstitutions = (ingredient: string) => {
    setLoading(true);
    const normalizedIngredient = ingredient.toLowerCase().trim();
    const found = substitutionDatabase[normalizedIngredient] || [];

    let result: Substitution[];
    if (found.length === 0) {
      const partialMatches = Object.keys(substitutionDatabase).filter(
        (key: string) =>
          key.includes(normalizedIngredient) ||
          normalizedIngredient.includes(key),
      );
      if (partialMatches.length > 0) {
        result = substitutionDatabase[partialMatches[0]];
      } else {
        result = [
          {
            name: "No specific substitution found",
            ratio: "",
            notes: "Consider omitting or using a similar ingredient",
          },
        ];
      }
    } else {
      result = found;
    }

    // Brief delay so loading state is visible when switching ingredients
    window.setTimeout(() => {
      setSubstitutions(result);
      setLoading(false);
    }, 80);
  };

  const handleIngredientSelect = (ingredient: string) => {
    setSelectedIngredient(ingredient);
    findSubstitutions(ingredient);
  };

  const handleCustomIngredient = () => {
    if (selectedIngredient.trim()) {
      findSubstitutions(selectedIngredient);
    }
  };

  return (
    <div
      className={`p-6 rounded-lg border ${
        darkMode
          ? "bg-black border-stone-700"
          : "bg-gradient-to-br from-orange-50 to-amber-50 border-orange-200"
      }`}
    >
      <h3
        className={`text-xl font-bold mb-4 break-words ${
          darkMode ? "text-green-400" : "text-green-900"
        }`}
      >
        AI Ingredient Substitutions
      </h3>

      {/* Ingredient Selection */}
      <div className="mb-6">
        <label
          className={`block text-sm font-medium mb-2 break-words ${
            darkMode ? "text-stone-200" : "text-gray-700"
          }`}
        >
          Select an ingredient to find substitutes:
        </label>

        {/* Quick selection buttons */}
        <div className="flex flex-wrap gap-1 sm:gap-2 mb-3">
          {Object.keys(substitutionDatabase).map((ingredient: string) => (
            <Button
              key={ingredient}
              onClick={() => handleIngredientSelect(ingredient)}
              variant={
                selectedIngredient === ingredient ? "primary" : "secondary"
              }
              size="sm"
              darkMode={darkMode}
              className="flex-shrink-0 text-xs sm:text-sm"
            >
              {ingredient}
            </Button>
          ))}
        </div>

        {/* Suggested ingredients from recipe */}
        {suggestedIngredients.length > 0 && (
          <div className="mb-3">
            <p
              className={`text-sm mb-2 ${
                darkMode ? "text-stone-300" : "text-gray-600"
              }`}
            >
              Suggested from your recipe:
            </p>
            <div className="flex flex-wrap gap-1 sm:gap-2">
              {suggestedIngredients.map((ingredient: string) => (
                <Button
                  key={ingredient}
                  onClick={() => handleIngredientSelect(ingredient)}
                  variant="secondary"
                  size="sm"
                  darkMode={darkMode}
                  className="flex-shrink-0 text-xs sm:text-sm"
                >
                  {ingredient}
                </Button>
              ))}
            </div>
          </div>
        )}

        {/* Custom ingredient input */}
        <div className="flex flex-col sm:flex-row gap-2">
          <input
            type="text"
            value={selectedIngredient}
            onChange={(e) => setSelectedIngredient(e.target.value)}
            placeholder="Or type a custom ingredient..."
            className={`flex-1 px-3 py-2 rounded-lg border text-sm break-words ${
              darkMode
                ? "bg-neutral-800 border-stone-700 text-stone-200 placeholder-stone-400"
                : "bg-white border-gray-300 text-gray-800 placeholder-gray-500"
            } focus:outline-none focus:ring-2 focus:ring-green-500`}
          />
          <Button
            onClick={handleCustomIngredient}
            variant="primary"
            size="md"
            darkMode={darkMode}
            className="flex-shrink-0 whitespace-nowrap"
          >
            Find
          </Button>
        </div>
      </div>

      {/* Substitutions Display */}
      {loading && (
        <div className="text-center py-8">
          <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-green-600"></div>
          <p
            className={`mt-2 text-sm ${
              darkMode ? "text-stone-300" : "text-gray-600"
            }`}
          >
            Finding substitutions...
          </p>
        </div>
      )}

      {!loading && substitutions.length > 0 && (
        <div>
          <h4
            className={`font-semibold mb-3 break-words ${
              darkMode ? "text-stone-200" : "text-gray-800"
            }`}
          >
            Substitutions for &quot;{selectedIngredient}&quot;:
          </h4>

          <div className="space-y-3">
            {substitutions.map((sub: Substitution, index: number) => (
              <div
                key={index}
                className={`p-3 rounded-lg border flex flex-col sm:flex-row justify-between items-start ${
                  darkMode
                    ? "bg-neutral-800 border-stone-700"
                    : "bg-white border-gray-200"
                }`}
              >
                <div>
                  <h5
                    className={`font-semibold break-words ${
                      darkMode ? "text-green-400" : "text-green-700"
                    }`}
                  >
                    {sub.name}
                  </h5>
                  <p
                    className={`text-sm mt-1 break-words ${
                      darkMode ? "text-stone-300" : "text-gray-600"
                    }`}
                  >
                    <span className="font-medium">Ratio:</span> {sub.ratio}
                  </p>
                </div>
                <p
                  className={`text-xs mt-2 sm:mt-0 sm:ml-4 flex-shrink-0 break-words ${
                    darkMode ? "text-stone-400" : "text-gray-500"
                  }`}
                >
                  {sub.notes}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tips */}
      <div
        className={`mt-6 p-4 rounded-lg border ${
          darkMode
            ? "bg-blue-900 border-blue-700"
            : "bg-blue-50 border-blue-200"
        }`}
      >
        <h4
          className={`font-semibold mb-2 break-words ${
            darkMode ? "text-blue-300" : "text-blue-800"
          }`}
        >
          Pro Tips:
        </h4>
        <ul
          className={`text-sm space-y-1 ${
            darkMode ? "text-blue-200" : "text-blue-700"
          }`}
        >
          <li className="break-words">
            • Always test substitutions in small batches first
          </li>
          <li className="break-words">
            • Consider flavor profiles when substituting
          </li>
          <li className="break-words">
            • Adjust cooking times for different ingredients
          </li>
          <li className="break-words">
            • Some substitutions may affect texture
          </li>
        </ul>
      </div>
    </div>
  );
}

export default AISubstitutions;
