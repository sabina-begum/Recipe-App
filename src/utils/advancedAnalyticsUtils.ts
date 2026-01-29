/**
 * Compute advanced analytics from real user data (reuses CookingAnalytics data).
 * No mock data — returns zeros and empty arrays when there is no activity.
 */

import { computeCookingAnalytics } from "./cookingAnalyticsUtils";

export interface CookingStats {
  totalRecipesCooked: number;
  totalCookingTime: number; // hours for display
  averageRating: number;
  favoriteCuisine: string;
  mostCookedRecipe: string;
  weeklyGoal: number;
  weeklyProgress: number;
  monthlyTrend: string;
  cookingStreak: number;
  [key: string]: unknown;
}
export interface SearchPattern {
  query: string;
  count: number;
}
export interface PeakCookingTime {
  hour: number;
  count: number;
}
export interface DeviceUsage {
  mobile: number;
  desktop: number;
  tablet: number;
}
export interface UserBehavior {
  searchPatterns: SearchPattern[];
  peakCookingTimes: PeakCookingTime[];
  deviceUsage: DeviceUsage;
  sessionDuration: number;
  bounceRate: number;
  [key: string]: unknown;
}
export interface Preferences {
  dietaryRestrictions: string[];
  spiceLevel: string;
  cookingSkill: string;
  preferredCuisines: string[];
  mealTypes: string[];
  timeConstraints: string;
  [key: string]: unknown;
}
export interface Achievement {
  id: number;
  name: string;
  description: string;
  earned: boolean;
  date?: string;
  progress?: number;
}
export interface Recommendation {
  type: string;
  title: string;
  reason: string;
  confidence: number;
}
export interface AdvancedAnalyticsData {
  cookingStats: CookingStats;
  userBehavior: UserBehavior;
  preferences: Preferences;
  achievements: Achievement[];
  recommendations: Recommendation[];
  [key: string]: unknown;
}

/** Alias for component state type. */
export type AnalyticsData = AdvancedAnalyticsData;

const DEFAULT_COOKING_STATS: CookingStats = {
  totalRecipesCooked: 0,
  totalCookingTime: 0,
  averageRating: 0,
  favoriteCuisine: "—",
  mostCookedRecipe: "—",
  weeklyGoal: 3,
  weeklyProgress: 0,
  monthlyTrend: "—",
  cookingStreak: 0,
};

const DEFAULT_USER_BEHAVIOR: UserBehavior = {
  searchPatterns: [],
  peakCookingTimes: [],
  deviceUsage: { mobile: 0, desktop: 100, tablet: 0 },
  sessionDuration: 0,
  bounceRate: 0,
};

const DEFAULT_PREFERENCES: Preferences = {
  dietaryRestrictions: [],
  spiceLevel: "—",
  cookingSkill: "—",
  preferredCuisines: [],
  mealTypes: [],
  timeConstraints: "—",
};

const LOCKED_ACHIEVEMENTS: Omit<Achievement, "id">[] = [
  {
    name: "Week Warrior",
    description: "Cook 3 recipes in one week",
    earned: false,
    progress: 0,
  },
  {
    name: "Streak Master",
    description: "7-day cooking streak",
    earned: false,
    progress: 0,
  },
  {
    name: "Cuisine Explorer",
    description: "Try 5 different cuisines",
    earned: false,
    progress: 0,
  },
];

/**
 * Compute advanced analytics from the same sources as CookingAnalytics (favorites + collections).
 * Always returns a full AdvancedAnalyticsData object; use zeros/empty when no data.
 */
export function computeAdvancedAnalytics(
  userId: string,
  isDemoUser: boolean,
): AdvancedAnalyticsData {
  const cooking = computeCookingAnalytics(userId, isDemoUser);

  const totalRecipes = cooking.totalRecipes;
  const totalCookingTimeMinutes = cooking.totalCookingTime;
  const totalCookingTimeHours =
    totalCookingTimeMinutes > 0
      ? Math.round((totalCookingTimeMinutes / 60) * 10) / 10
      : 0;
  const favoriteCuisine = cooking.favoriteCuisines?.[0]?.cuisine ?? "—";
  const mostCookedRecipe =
    totalRecipes > 0 ? "From your collections & favorites" : "—";

  const cookingStats: CookingStats = {
    ...DEFAULT_COOKING_STATS,
    totalRecipesCooked: totalRecipes,
    totalCookingTime: totalCookingTimeHours,
    averageRating: cooking.averageRating,
    favoriteCuisine,
    mostCookedRecipe,
    weeklyProgress: 0, // No per-week data without cooked dates
    monthlyTrend: totalRecipes > 0 ? "Based on your saved recipes" : "—",
  };

  const achievements: Achievement[] = cooking.achievements.map((a, i) => ({
    id: i + 1,
    name: a.name,
    description: a.description,
    earned: true,
    date: a.earned,
  }));
  let nextId = achievements.length + 1;
  for (const a of LOCKED_ACHIEVEMENTS) {
    achievements.push({
      id: nextId++,
      name: a.name,
      description: a.description,
      earned: false,
      progress: a.progress ?? 0,
    });
  }

  const preferredCuisines = (cooking.favoriteCuisines ?? []).map(
    (c) => c.cuisine,
  );
  const preferences: Preferences = {
    ...DEFAULT_PREFERENCES,
    preferredCuisines,
  };

  const recommendations: Recommendation[] = [];
  if (totalRecipes === 0) {
    recommendations.push({
      type: "onboarding",
      title: "Add recipes to unlock insights",
      reason:
        "Save recipes from Favorites or Collections to see personalized recommendations and achievements.",
      confidence: 1,
    });
  } else {
    if (cooking.favoriteCuisines?.[0]) {
      recommendations.push({
        type: "cuisine",
        title: `Explore more ${cooking.favoriteCuisines[0].cuisine} recipes`,
        reason: `You enjoy ${cooking.favoriteCuisines[0].cuisine} — try similar dishes to expand your repertoire.`,
        confidence: 0.85,
      });
    }
    if (totalRecipes < 5) {
      recommendations.push({
        type: "growth",
        title: "Build your collection",
        reason:
          "Add a few more recipes to favorites or collections to unlock more achievements and insights.",
        confidence: 0.9,
      });
    }
    if ((cooking.topIngredients?.length ?? 0) > 0) {
      const top = cooking.topIngredients![0];
      recommendations.push({
        type: "ingredient",
        title: `Recipes with ${top.ingredient}`,
        reason: `${top.ingredient} appears often in your saved recipes — discover more dishes that use it.`,
        confidence: 0.8,
      });
    }
  }

  return {
    cookingStats,
    userBehavior: { ...DEFAULT_USER_BEHAVIOR },
    preferences,
    achievements,
    recommendations,
  };
}
