import { describe, it, expect } from "@jest/globals";
import { isHalal, isNonHalalIngredient } from "../halal";
import type { Recipe } from "../../global";

describe("isHalal", () => {
  it("returns false for null or undefined", () => {
    expect(isHalal(null)).toBe(false);
    expect(isHalal(undefined)).toBe(false);
  });

  it("returns true when recipe has no pork or alcohol terms", () => {
    const recipe: Recipe = {
      idMeal: "1",
      strMeal: "Chicken Curry",
      strCategory: "Chicken",
      strArea: "Indian",
      strInstructions: "Cook chicken with spices",
      strMealThumb: "",
      strIngredient1: "chicken",
      strIngredient2: "onion",
    };
    expect(isHalal(recipe)).toBe(true);
  });

  it("returns false when meal name contains pork term", () => {
    const recipe: Recipe = {
      idMeal: "1",
      strMeal: "Bacon Wrapped Chicken",
      strCategory: "Chicken",
      strArea: "",
      strInstructions: "",
      strMealThumb: "",
    };
    expect(isHalal(recipe)).toBe(false);
  });

  it("returns false when instructions contain alcohol", () => {
    const recipe: Recipe = {
      idMeal: "1",
      strMeal: "Beef Stew",
      strCategory: "Beef",
      strArea: "",
      strInstructions: "Add wine and simmer",
      strMealThumb: "",
    };
    expect(isHalal(recipe)).toBe(false);
  });

  it("returns false when ingredient contains non-halal term", () => {
    const recipe: Recipe = {
      idMeal: "1",
      strMeal: "Pasta",
      strCategory: "Pasta",
      strArea: "",
      strInstructions: "",
      strMealThumb: "",
      strIngredient1: "prosciutto",
    };
    expect(isHalal(recipe)).toBe(false);
  });
});

describe("isNonHalalIngredient", () => {
  it("returns true for pork-related terms", () => {
    expect(isNonHalalIngredient("bacon")).toBe(true);
    expect(isNonHalalIngredient("pork belly")).toBe(true);
  });

  it("returns true for alcohol terms", () => {
    expect(isNonHalalIngredient("white wine")).toBe(true);
    expect(isNonHalalIngredient("vodka")).toBe(true);
  });

  it("returns false for halal ingredients", () => {
    expect(isNonHalalIngredient("chicken")).toBe(false);
    expect(isNonHalalIngredient("rice")).toBe(false);
  });
});
