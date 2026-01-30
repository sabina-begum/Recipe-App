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

import React, { useState } from "react";
import { useAuth } from "../contexts/useAuth";
import { addDoc, collection } from "firebase/firestore";
import { db } from "../firebase/config";
import { mealCategories } from "../data/mealCategories";
import { cuisineOptions } from "../data/cuisineOptions";
import { difficultyLevels } from "../data/difficultyLevels";
import { featuredRecipes } from "../data/recipes";
import { getUserDisplayName } from "../utils/userUtils";

const EXAMPLE_IMAGE_PLACEHOLDER =
  featuredRecipes[0]?.image ??
  "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400";

interface UserRecipeSubmissionProps {
  darkMode: boolean;
}
interface Ingredient {
  ingredient: string;
  measure: string;
}
interface UserRecipe {
  name: string;
  category: string;
  cuisine: string;
  description: string;
  prepTime: string;
  cookTime: string;
  servings: number;
  difficulty: string;
  ingredients: Ingredient[];
  instructions: string[];
  imageUrl: string;
  tags: string[];
  [key: string]: unknown;
}

const UserRecipeSubmission: React.FC<UserRecipeSubmissionProps> = ({
  darkMode,
}) => {
  const { currentUser, isDemoUser } = useAuth();
  const [recipe, setRecipe] = useState<UserRecipe>({
    name: "",
    category: "",
    cuisine: "",
    description: "",
    prepTime: "",
    cookTime: "",
    servings: 4,
    difficulty: "Medium",
    ingredients: [{ ingredient: "", measure: "" }],
    instructions: [""],
    imageUrl: "",
    tags: [],
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [success, setSuccess] = useState<boolean>(false);

  const handleInputChange = (field: string, value: string) => {
    setRecipe((prev: UserRecipe) => ({ ...prev, [field]: value }));
  };

  const addIngredient = () => {
    setRecipe((prev: UserRecipe) => ({
      ...prev,
      ingredients: [...prev.ingredients, { ingredient: "", measure: "" }],
    }));
  };

  const removeIngredient = (index: number) => {
    setRecipe((prev: UserRecipe) => ({
      ...prev,
      ingredients: prev.ingredients.filter((_, i: number) => i !== index),
    }));
  };

  const updateIngredient = (index: number, field: string, value: string) => {
    setRecipe((prev: UserRecipe) => ({
      ...prev,
      ingredients: prev.ingredients.map((ing: Ingredient, i: number) =>
        i === index ? { ...ing, [field]: value } : ing,
      ),
    }));
  };

  const addInstruction = () => {
    setRecipe((prev: UserRecipe) => ({
      ...prev,
      instructions: [...prev.instructions, ""],
    }));
  };

  const removeInstruction = (index: number) => {
    setRecipe((prev: UserRecipe) => ({
      ...prev,
      instructions: prev.instructions.filter((_, i: number) => i !== index),
    }));
  };

  const updateInstruction = (index: number, value: string) => {
    setRecipe((prev: UserRecipe) => ({
      ...prev,
      instructions: prev.instructions.map((inst: string, i: number) =>
        i === index ? value : inst,
      ),
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!currentUser) return;

    setLoading(true);
    try {
      const recipeData: UserRecipe = {
        ...recipe,
        userId: currentUser.uid,
        userName: getUserDisplayName(currentUser),
        timestamp: Date.now(),
        status: "pending",
        type: "user-submitted",
      };

      if (isDemoUser) {
        const key = `userRecipes_${currentUser.uid}`;
        const existing = JSON.parse(
          localStorage.getItem(key) || "[]",
        ) as UserRecipe[];
        localStorage.setItem(
          key,
          JSON.stringify([
            ...existing,
            { ...recipeData, id: `demo_${Date.now()}` },
          ]),
        );
      } else {
        await addDoc(collection(db, "userRecipes"), recipeData);
      }
      setSuccess(true);
      setRecipe({
        name: "",
        category: "",
        cuisine: "",
        description: "",
        prepTime: "",
        cookTime: "",
        servings: 4,
        difficulty: "Medium",
        ingredients: [{ ingredient: "", measure: "" }],
        instructions: [""],
        imageUrl: "",
        tags: [],
      });
    } catch (error) {
      console.error("Error submitting recipe:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!currentUser) {
    return (
      <div
        className={`text-center py-8 ${
          darkMode ? "text-gray-300" : "text-gray-600"
        }`}
      >
        Please log in to submit your own recipes.
      </div>
    );
  }

  if (success) {
    return (
      <div
        className={`max-w-2xl mx-auto px-3 sm:px-4 lg:px-6 pt-4 sm:pt-8 lg:pt-12 pb-4 sm:pb-8 lg:pb-12 ${
          darkMode ? "text-gray-100" : "text-gray-800"
        }`}
      >
        <div
          className={`rounded-xl shadow-lg border p-8 text-center ${
            darkMode
              ? "bg-green-900 border-green-700"
              : "bg-green-50 border-green-200"
          }`}
        >
          <div className="text-6xl mb-4">🎉</div>
          <h2 className="text-2xl font-bold mb-4 text-green-800">
            Recipe Submitted!
          </h2>
          <p
            className={`mb-6 ${darkMode ? "text-green-200" : "text-green-700"}`}
          >
            Thank you for sharing your recipe! It will be reviewed and added to
            our collection soon.
          </p>
          <button
            onClick={() => setSuccess(false)}
            className="px-6 py-2 rounded-lg font-medium bg-gradient-to-r from-orange-500 to-amber-500 text-white hover:scale-105 transition-transform"
          >
            Submit Another Recipe
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`max-w-4xl mx-auto px-3 sm:px-4 lg:px-6 pt-4 sm:pt-8 lg:pt-12 pb-4 sm:pb-8 lg:pb-12 ${
        darkMode ? "text-gray-100" : "text-gray-800"
      }`}
    >
      <div
        className={`rounded-xl shadow-lg border p-6 ${
          darkMode ? "bg-black border-gray-700" : "bg-white border-gray-200"
        }`}
      >
        <h2 className="text-2xl font-bold mb-6 bg-gradient-to-r from-orange-500 to-amber-500 bg-clip-text text-transparent">
          Share Your Recipe
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Recipe Name *
              </label>
              <input
                type="text"
                value={recipe.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                required
                className={`w-full px-3 py-2 rounded-lg border ${
                  darkMode
                    ? "bg-gray-800 border-gray-600 text-gray-100"
                    : "bg-white border-gray-300 text-gray-800"
                }`}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">
                Category *
              </label>
              <select
                value={recipe.category}
                onChange={(e) => handleInputChange("category", e.target.value)}
                required
                className={`w-full px-3 py-2 rounded-lg border ${
                  darkMode
                    ? "bg-gray-800 border-gray-600 text-gray-100"
                    : "bg-white border-gray-300 text-gray-800"
                }`}
              >
                <option value="">Select Category</option>
                {mealCategories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Cuisine</label>
              <select
                value={recipe.cuisine}
                onChange={(e) => handleInputChange("cuisine", e.target.value)}
                className={`w-full px-3 py-2 rounded-lg border ${
                  darkMode
                    ? "bg-gray-800 border-gray-600 text-gray-100"
                    : "bg-white border-gray-300 text-gray-800"
                }`}
              >
                <option value="">Select Cuisine</option>
                {cuisineOptions.map((cuisine) => (
                  <option key={cuisine} value={cuisine}>
                    {cuisine}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">
                Difficulty
              </label>
              <select
                value={recipe.difficulty}
                onChange={(e) =>
                  handleInputChange("difficulty", e.target.value)
                }
                className={`w-full px-3 py-2 rounded-lg border ${
                  darkMode
                    ? "bg-gray-800 border-gray-600 text-gray-100"
                    : "bg-white border-gray-300 text-gray-800"
                }`}
              >
                {difficultyLevels.map((diff) => (
                  <option key={diff} value={diff}>
                    {diff}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Servings</label>
              <input
                type="number"
                value={recipe.servings}
                onChange={(e) => handleInputChange("servings", e.target.value)}
                min="1"
                max="20"
                className={`w-full px-3 py-2 rounded-lg border ${
                  darkMode
                    ? "bg-gray-800 border-gray-600 text-gray-100"
                    : "bg-white border-gray-300 text-gray-800"
                }`}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Description
            </label>
            <textarea
              value={recipe.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              rows={3}
              className={`w-full px-3 py-2 rounded-lg border ${
                darkMode
                  ? "bg-gray-800 border-gray-600 text-gray-100"
                  : "bg-white border-gray-300 text-gray-800"
              }`}
              placeholder="Describe your recipe..."
            />
          </div>

          {/* Ingredients */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <label className="text-sm font-medium">Ingredients *</label>
              <button
                type="button"
                onClick={addIngredient}
                className="px-3 py-1 rounded-lg text-sm bg-green-600 text-white hover:bg-green-700"
              >
                + Add Ingredient
              </button>
            </div>
            <div className="space-y-3">
              {recipe.ingredients.map((ing: Ingredient, index: number) => (
                <div key={index} className="flex gap-3">
                  <input
                    type="text"
                    value={ing.measure}
                    onChange={(e) =>
                      updateIngredient(index, "measure", e.target.value)
                    }
                    placeholder="Amount"
                    className={`flex-1 px-3 py-2 rounded-lg border ${
                      darkMode
                        ? "bg-gray-800 border-gray-600 text-gray-100"
                        : "bg-white border-gray-300 text-gray-800"
                    }`}
                  />
                  <input
                    type="text"
                    value={ing.ingredient}
                    onChange={(e) =>
                      updateIngredient(index, "ingredient", e.target.value)
                    }
                    placeholder="Ingredient name"
                    required
                    className={`flex-1 px-3 py-2 rounded-lg border ${
                      darkMode
                        ? "bg-gray-800 border-gray-600 text-gray-100"
                        : "bg-white border-gray-300 text-gray-800"
                    }`}
                  />
                  {recipe.ingredients.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeIngredient(index)}
                      className="px-3 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700"
                    >
                      ×
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Instructions */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <label className="text-sm font-medium">Instructions *</label>
              <button
                type="button"
                onClick={addInstruction}
                className="px-3 py-1 rounded-lg text-sm bg-green-600 text-white hover:bg-green-700"
              >
                + Add Step
              </button>
            </div>
            <div className="space-y-3">
              {recipe.instructions.map((instruction: string, index: number) => (
                <div key={index} className="flex gap-3">
                  <span className="flex-shrink-0 w-8 h-8 rounded-full bg-orange-500 text-white flex items-center justify-center text-sm font-medium">
                    {index + 1}
                  </span>
                  <textarea
                    value={instruction}
                    onChange={(e) => updateInstruction(index, e.target.value)}
                    required
                    rows={2}
                    className={`flex-1 px-3 py-2 rounded-lg border ${
                      darkMode
                        ? "bg-gray-800 border-gray-600 text-gray-100"
                        : "bg-white border-gray-300 text-gray-800"
                    }`}
                    placeholder={`Step ${index + 1}...`}
                  />
                  {recipe.instructions.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeInstruction(index)}
                      className="px-3 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700"
                    >
                      ×
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Image URL (Optional)
            </label>
            <input
              type="url"
              value={recipe.imageUrl}
              onChange={(e) => handleInputChange("imageUrl", e.target.value)}
              className={`w-full px-3 py-2 rounded-lg border ${
                darkMode
                  ? "bg-gray-800 border-gray-600 text-gray-100"
                  : "bg-white border-gray-300 text-gray-800"
              }`}
              placeholder={EXAMPLE_IMAGE_PLACEHOLDER}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 px-6 rounded-lg font-medium transition-colors ${
              loading ? "opacity-50 cursor-not-allowed" : "hover:scale-105"
            } bg-gradient-to-r from-orange-500 to-amber-500 text-white`}
          >
            {loading ? "Submitting Recipe..." : "Submit Recipe"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default UserRecipeSubmission;
