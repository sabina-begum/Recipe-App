import { describe, it, expect } from "@jest/globals";
import { extractIngredientsFromRecipe, type Recipe } from "../apiUtils";

describe("extractIngredientsFromRecipe", () => {
  it("returns empty array for recipe with no ingredients", () => {
    const recipe: Recipe = { idMeal: "1", strMeal: "Test" };
    expect(extractIngredientsFromRecipe(recipe)).toEqual([]);
  });

  it("extracts strIngredient1 through strIngredient20", () => {
    const recipe: Recipe = {
      strIngredient1: "Chicken",
      strIngredient2: "Onion",
      strIngredient3: "Garlic",
      strIngredient4: "",
      strIngredient5: "  ",
    };
    expect(extractIngredientsFromRecipe(recipe)).toEqual([
      "Chicken",
      "Onion",
      "Garlic",
    ]);
  });

  it("skips non-string or empty values", () => {
    const recipe: Recipe = {
      strIngredient1: "A",
      strIngredient2: "",
      strIngredient3: "B",
    };
    expect(extractIngredientsFromRecipe(recipe)).toEqual(["A", "B"]);
  });

  it("keeps non-empty strings as-is (no trim)", () => {
    const recipe: Recipe = {
      strIngredient1: "  Rice  ",
    };
    expect(extractIngredientsFromRecipe(recipe)).toEqual(["  Rice  "]);
  });
});
