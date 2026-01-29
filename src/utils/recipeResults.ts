/**
 * Recipe results in search/display shape (id, title, cookTime, etc.).
 * Sourced from featured recipes for fallback, tests, or any consumer needing this shape.
 */

import { featuredRecipes } from "../data/recipes";

function parseCookTimeMinutes(timeStr: string | undefined): number {
  if (!timeStr) return 0;
  const match = timeStr.match(/(\d+)/);
  return match ? parseInt(match[1], 10) : 0;
}

/** Recipe results derived from featured recipes (search fallback, tests, display). */
export const recipeResults = featuredRecipes.map((r, index) => ({
  id: index + 1,
  title: r.name,
  description: r.description,
  image: r.image,
  cookTime: parseCookTimeMinutes(r.time),
  difficulty: (r.difficulty ?? "Medium").toLowerCase(),
  rating: r.rating,
  category: (r.category ?? "Other").toLowerCase(),
  ingredients: r.ingredients ?? [],
}));
