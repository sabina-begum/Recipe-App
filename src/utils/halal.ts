import type { Recipe } from "../global";

const NON_HALAL_TERMS = [
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

/** Returns true if the recipe appears halal (no pork or alcohol). */
export function isHalal(recipe: Recipe | null | undefined): boolean {
  if (!recipe) return false;
  const text = [
    recipe.strMeal ?? "",
    recipe.strCategory ?? "",
    recipe.strArea ?? "",
    recipe.strInstructions ?? "",
    ...Array.from(
      { length: 20 },
      (_, i) => (recipe[`strIngredient${i + 1}`] ?? "") as string,
    ),
  ]
    .join(" ")
    .toLowerCase();
  return !NON_HALAL_TERMS.some((term) => text.includes(term));
}

/** Returns true if the ingredient name is a known non-halal term (skip when building suggestions). */
export function isNonHalalIngredient(ingredient: string): boolean {
  const lower = ingredient.toLowerCase().trim();
  return NON_HALAL_TERMS.some((term) => lower.includes(term) || term.includes(lower));
}
