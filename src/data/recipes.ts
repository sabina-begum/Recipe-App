// src/data/recipes.ts
import type { Recipe } from "../global";

export interface FeaturedRecipe {
  id: string;
  name: string;
  description: string;
  image: string;
  rating: number;
  tags: string[];
  /** Optional: for leftover suggestions (match by overlapping ingredients) */
  ingredients?: string[];
  difficulty?: "Easy" | "Medium" | "Hard";
  time?: string;
  category?: string;
  /** Optional: seasons when this recipe is in season (e.g. ["Fall", "Winter"]) */
  seasons?: string[];
}

export const featuredRecipes: FeaturedRecipe[] = [
  {
    id: "truffle-risotto",
    name: "Truffle Risotto",
    description:
      "Creamy Arborio rice with wild mushrooms and shaved black truffle, finished with Parmigiano-Reggiano.",
    image:
      "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=800&q=80",
    rating: 4.9,
    tags: ["Chef's Pick", "30–40 min"],
    ingredients: ["rice", "mushrooms", "parmesan", "butter", "onion", "stock"],
    difficulty: "Medium",
    time: "35 min",
    category: "Main",
    seasons: ["Fall", "Winter"],
  },
  {
    id: "mushroom-soup",
    name: "Cream of Mushroom Soup",
    description:
      "Creamy soup with wild mushrooms, thyme, and a touch of cream.",
    image:
      "https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&w=800&q=80",
    rating: 4.6,
    tags: ["Soup", "25 min"],
    ingredients: [
      "mushrooms",
      "cream",
      "onion",
      "garlic",
      "stock",
      "thyme",
      "butter",
    ],
    difficulty: "Easy",
    time: "25 min",
    category: "Soup",
    seasons: ["Fall", "Winter"],
  },
  {
    id: "fried-rice",
    name: "Vegetable Fried Rice",
    description: "Quick fried rice with vegetables, egg, and soy sauce.",
    image:
      "https://images.unsplash.com/photo-1603133872878-684f208fb84b?auto=format&fit=crop&w=800&q=80",
    rating: 4.5,
    tags: ["Quick", "20 min"],
    ingredients: [
      "rice",
      "eggs",
      "soy sauce",
      "vegetables",
      "onion",
      "garlic",
      "oil",
    ],
    difficulty: "Easy",
    time: "20 min",
    category: "Main",
    seasons: ["Spring", "Summer"],
  },
  {
    id: "garlic-bread",
    name: "Garlic Butter Bread",
    description: "Toasted bread with garlic butter and parsley.",
    image:
      "https://images.unsplash.com/photo-1573140401552-3fab0b24306f?auto=format&fit=crop&w=800&q=80",
    rating: 4.4,
    tags: ["Side", "10 min"],
    ingredients: ["bread", "butter", "garlic", "parsley"],
    difficulty: "Easy",
    time: "10 min",
    category: "Side",
    seasons: ["Spring", "Summer", "Fall", "Winter"],
  },
];

/** Map a featured recipe to the global Recipe shape so detail page and components work. */
export function featuredRecipeToRecipe(f: FeaturedRecipe): Recipe {
  const r: Recipe = {
    idMeal: f.id,
    strMeal: f.name,
    strCategory: f.category ?? "General",
    strArea: "",
    strInstructions: f.description,
    strMealThumb: f.image,
    strTags: f.tags?.join(",") ?? "",
  };
  (f.ingredients ?? []).slice(0, 20).forEach((ing, i) => {
    r[`strIngredient${i + 1}`] = ing;
    r[`strMeasure${i + 1}`] = "";
  });
  return r;
}
