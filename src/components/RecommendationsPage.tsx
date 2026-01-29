import { useMemo } from "react";
import { useAuth } from "../contexts/useAuth";
import { computeAdvancedAnalytics } from "../utils/advancedAnalyticsUtils";
import AIRecommendations from "./AIRecommendations";

interface RecommendationsPageProps {
  darkMode: boolean;
}

/** TheMealDB filter.php accepts these category names. */
const MEAL_DB_CATEGORIES = new Set([
  "Beef",
  "Breakfast",
  "Chicken",
  "Dessert",
  "Goat",
  "Lamb",
  "Miscellaneous",
  "Pasta",
  "Pork",
  "Seafood",
  "Side",
  "Starter",
  "Vegan",
  "Vegetarian",
]);

/** Map app categories to TheMealDB categories for API compatibility. */
function toMealDBCategory(appCategory: string): string | null {
  const normalized = appCategory.trim();
  if (MEAL_DB_CATEGORIES.has(normalized)) return normalized;
  const map: Record<string, string> = {
    Main: "Chicken",
    Soup: "Starter",
    Other: "Miscellaneous",
    Lunch: "Chicken",
    Dinner: "Chicken",
    Snack: "Side",
  };
  return map[normalized] ?? null;
}

const DEFAULT_CATEGORIES = ["Vegetarian", "Seafood", "Dessert"];

const RecommendationsPage = ({ darkMode }: RecommendationsPageProps) => {
  const { currentUser, isDemoUser } = useAuth();

  const userPreferences = useMemo(() => {
    if (!currentUser) {
      return { favoriteCategories: DEFAULT_CATEGORIES };
    }
    try {
      const analytics = computeAdvancedAnalytics(currentUser.uid, !!isDemoUser);
      const preferred = analytics.preferences.preferredCuisines ?? [];
      const mapped = preferred
        .map((c) => toMealDBCategory(c))
        .filter((c): c is string => c !== null);
      const unique = [...new Set(mapped)];
      const categories =
        unique.length > 0 ? unique.slice(0, 5) : DEFAULT_CATEGORIES;
      return { favoriteCategories: categories };
    } catch {
      return { favoriteCategories: DEFAULT_CATEGORIES };
    }
  }, [currentUser, isDemoUser]);

  return (
    <div className="max-w-4xl mx-auto mt-10 p-4">
      <h2 className="text-2xl font-bold mb-6">Smart Recipe Recommendations</h2>
      <AIRecommendations
        darkMode={darkMode}
        userPreferences={userPreferences}
      />
    </div>
  );
};

export default RecommendationsPage;
