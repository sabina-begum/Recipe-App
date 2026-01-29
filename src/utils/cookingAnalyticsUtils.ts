/**
 * Compute cooking analytics from real user data (collections, favorites).
 * No mock data — returns zeros and empty arrays when there is no activity.
 */

import { featuredRecipes } from "../data/recipes";

export interface CuisineStat {
  cuisine: string;
  count: number;
  percentage: number;
}
export interface DifficultyStat {
  difficulty: string;
  count: number;
  percentage: number;
}
export interface TimeBreakdown {
  range: string;
  count: number;
  percentage: number;
}
export interface WeeklyProgress {
  week: string;
  recipes: number;
  time: number;
}
export interface MonthlyTrend {
  month: string;
  recipes: number;
  time: number;
}
export interface IngredientStat {
  ingredient: string;
  count: number;
  percentage: number;
}
export interface CookingGoals {
  weeklyRecipes: number;
  weeklyTime: number;
  monthlyVariety: number;
  currentWeekRecipes: number;
  currentWeekTime: number;
  currentMonthVariety: number;
}
export interface Achievement {
  name: string;
  description: string;
  earned: string;
  icon: string;
}
export interface AnalyticsData {
  totalRecipes: number;
  totalCookingTime: number;
  averageRating: number;
  favoriteCuisines: CuisineStat[];
  difficultyBreakdown: DifficultyStat[];
  cookingTimeBreakdown: TimeBreakdown[];
  weeklyProgress: WeeklyProgress[];
  monthlyTrends: MonthlyTrend[];
  topIngredients: IngredientStat[];
  cookingGoals: CookingGoals;
  achievements: Achievement[];
  [key: string]: unknown;
}

const DEFAULT_GOALS = {
  weeklyRecipes: 3,
  weeklyTime: 120,
  monthlyVariety: 5,
  currentWeekRecipes: 0,
  currentWeekTime: 0,
  currentMonthVariety: 0,
};

function parseCookTimeMinutes(value: string | number | undefined): number {
  if (value == null) return 0;
  if (typeof value === "number" && !Number.isNaN(value)) return value;
  const s = String(value).trim();
  if (!s || s === "-") return 0;
  const match = s.match(/(\d+)/);
  return match ? Math.max(0, parseInt(match[1], 10)) : 0;
}

function parseRating(value: string | number | undefined): number {
  if (value == null) return 0;
  if (typeof value === "number" && !Number.isNaN(value))
    return Math.min(5, Math.max(0, value));
  const n = parseFloat(String(value));
  return Number.isNaN(n) ? 0 : Math.min(5, Math.max(0, n));
}

interface EnrichedRecipe {
  id: string;
  name: string;
  category: string;
  cookTimeMinutes: number;
  rating: number;
  difficulty: "Easy" | "Medium" | "Hard";
  ingredients: string[];
}

function getEnrichedRecipes(
  userId: string,
  isDemoUser: boolean,
): EnrichedRecipe[] {
  const byId = new Map<string, EnrichedRecipe>();

  // Favorites
  let favorites: Array<{
    id?: string;
    title?: string;
    category?: string;
    cookTime?: string | number;
    rating?: string | number;
  }> = [];
  if (isDemoUser) {
    try {
      const demo = JSON.parse(localStorage.getItem("demoUser") || "{}");
      favorites = (demo.demoData?.favorites as typeof favorites) || [];
    } catch {
      favorites = [];
    }
  } else {
    try {
      favorites = JSON.parse(
        localStorage.getItem(`favorites_${userId}`) || "[]",
      );
    } catch {
      favorites = [];
    }
  }
  for (const f of favorites) {
    const id = String(f.id ?? "");
    if (!id) continue;
    const name = (f.title as string) || "Unknown";
    const category = (f.category as string) || "Other";
    const featured = featuredRecipes.find((r) => r.id === id);
    byId.set(id, {
      id,
      name,
      category,
      cookTimeMinutes: featured?.time
        ? parseCookTimeMinutes(featured.time)
        : parseCookTimeMinutes(f.cookTime),
      rating: parseRating(f.rating) || (featured?.rating ?? 0),
      difficulty: featured?.difficulty ?? "Medium",
      ingredients: featured?.ingredients ?? [],
    });
  }

  // Collections
  let collections: Array<{
    recipes: Array<{ id: string; name?: string; category?: string }>;
  }> = [];
  if (isDemoUser) {
    try {
      const demo = JSON.parse(localStorage.getItem("demoUser") || "{}");
      collections = (demo.demoData?.collections as typeof collections) || [];
    } catch {
      collections = [];
    }
  } else {
    try {
      collections = JSON.parse(
        localStorage.getItem(`collections_${userId}`) || "[]",
      );
    } catch {
      collections = [];
    }
  }
  for (const col of collections) {
    const list = col.recipes || [];
    for (const r of list) {
      const id = String(r.id ?? "").trim();
      if (!id || byId.has(id)) continue;
      const featured = featuredRecipes.find((rec) => rec.id === id);
      byId.set(id, {
        id,
        name: (r.name as string) || "Unknown",
        category: (r.category as string) || "Other",
        cookTimeMinutes: featured?.time
          ? parseCookTimeMinutes(featured.time)
          : 0,
        rating: featured?.rating ?? 0,
        difficulty: featured?.difficulty ?? "Medium",
        ingredients: featured?.ingredients ?? [],
      });
    }
  }

  return Array.from(byId.values());
}

function buildCuisineStats(recipes: EnrichedRecipe[]): CuisineStat[] {
  const counts = new Map<string, number>();
  for (const r of recipes) {
    const c = r.category || "Other";
    counts.set(c, (counts.get(c) ?? 0) + 1);
  }
  const total = recipes.length;
  if (total === 0) return [];
  return Array.from(counts.entries())
    .map(([cuisine, count]) => ({
      cuisine,
      count,
      percentage: Math.round((count / total) * 100),
    }))
    .sort((a, b) => b.count - a.count);
}

function buildDifficultyBreakdown(recipes: EnrichedRecipe[]): DifficultyStat[] {
  const counts = new Map<string, number>();
  for (const r of recipes) {
    const d = r.difficulty || "Medium";
    counts.set(d, (counts.get(d) ?? 0) + 1);
  }
  const total = recipes.length;
  const order = ["Easy", "Medium", "Hard"];
  if (total === 0)
    return order.map((d) => ({ difficulty: d, count: 0, percentage: 0 }));
  return order.map((difficulty) => {
    const count = counts.get(difficulty) ?? 0;
    return {
      difficulty,
      count,
      percentage: total ? Math.round((count / total) * 100) : 0,
    };
  });
}

function buildTimeBreakdown(recipes: EnrichedRecipe[]): TimeBreakdown[] {
  const ranges = [
    { range: "0–30 min", min: 0, max: 30 },
    { range: "30–60 min", min: 30, max: 60 },
    { range: "60+ min", min: 60, max: Infinity },
  ];
  const counts = ranges.map(() => 0);
  for (const r of recipes) {
    const m = r.cookTimeMinutes;
    if (m <= 30) counts[0]++;
    else if (m <= 60) counts[1]++;
    else counts[2]++;
  }
  const total = recipes.length;
  return ranges.map(({ range }, i) => ({
    range,
    count: counts[i],
    percentage: total ? Math.round((counts[i] / total) * 100) : 0,
  }));
}

function buildTopIngredients(recipes: EnrichedRecipe[]): IngredientStat[] {
  const counts = new Map<string, number>();
  for (const r of recipes) {
    for (const ing of r.ingredients) {
      const key = ing.trim().toLowerCase();
      if (!key) continue;
      counts.set(key, (counts.get(key) ?? 0) + 1);
    }
  }
  const total = Array.from(counts.values()).reduce((a, b) => a + b, 0);
  if (total === 0) return [];
  return Array.from(counts.entries())
    .map(([ingredient, count]) => ({
      ingredient: ingredient.charAt(0).toUpperCase() + ingredient.slice(1),
      count,
      percentage: Math.round((count / total) * 100),
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);
}

function buildAchievements(
  recipes: EnrichedRecipe[],
  cuisineCount: number,
): Achievement[] {
  const list: Achievement[] = [];
  const total = recipes.length;
  const now = new Date().toLocaleDateString(undefined, {
    month: "short",
    year: "numeric",
  });

  if (total >= 1)
    list.push({
      name: "First Recipe",
      description: "Added your first recipe",
      earned: now,
      icon: "🌟",
    });
  if (total >= 5)
    list.push({
      name: "Getting Started",
      description: "5 recipes in your kitchen",
      earned: now,
      icon: "📖",
    });
  if (total >= 10)
    list.push({
      name: "Recipe Collector",
      description: "10 recipes saved",
      earned: now,
      icon: "📚",
    });
  if (cuisineCount >= 3)
    list.push({
      name: "Variety",
      description: "Tried 3 or more cuisines",
      earned: now,
      icon: "🌍",
    });
  if (total >= 20)
    list.push({
      name: "Chef in the Making",
      description: "20 recipes in your collection",
      earned: now,
      icon: "👨‍🍳",
    });

  return list;
}

/**
 * Compute analytics from localStorage (collections + favorites).
 * Always returns an AnalyticsData object; use zeros/empty when no data.
 */
export function computeCookingAnalytics(
  userId: string,
  isDemoUser: boolean,
): AnalyticsData {
  const recipes = getEnrichedRecipes(userId, isDemoUser);
  const totalRecipes = recipes.length;
  const totalCookingTime = recipes.reduce(
    (sum, r) => sum + r.cookTimeMinutes,
    0,
  );
  const ratingSum = recipes.reduce((sum, r) => sum + r.rating, 0);
  const averageRating =
    totalRecipes > 0 ? Math.round((ratingSum / totalRecipes) * 10) / 10 : 0;

  const favoriteCuisines = buildCuisineStats(recipes);
  const difficultyBreakdown = buildDifficultyBreakdown(recipes);
  const cookingTimeBreakdown = buildTimeBreakdown(recipes);
  const topIngredients = buildTopIngredients(recipes);
  const cuisineCount = favoriteCuisines.length;
  const achievements = buildAchievements(recipes, cuisineCount);

  return {
    totalRecipes,
    totalCookingTime,
    averageRating,
    favoriteCuisines,
    difficultyBreakdown,
    cookingTimeBreakdown,
    weeklyProgress: [], // No per-week data without cooked dates
    monthlyTrends: [], // No per-month data without cooked dates
    topIngredients,
    cookingGoals: {
      ...DEFAULT_GOALS,
      currentMonthVariety: cuisineCount,
    },
    achievements,
  };
}
