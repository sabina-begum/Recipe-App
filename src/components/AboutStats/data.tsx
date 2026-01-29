import { featuredRecipes } from "../../data/recipes";

export interface StatItem {
  value: string;
  colorClass: string;
  label: string;
}

function getStats(): StatItem[] {
  const recipeCount = featuredRecipes.length;
  const categories = new Set(
    featuredRecipes
      .map((r) => r.category)
      .filter((c): c is string => Boolean(c)),
  );
  const categoryCount = categories.size;

  return [
    {
      value: String(recipeCount),
      colorClass:
        "bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent",
      label: "Recipes",
    },
    {
      value: "50K+",
      colorClass:
        "bg-gradient-to-r from-green-500 to-emerald-600 bg-clip-text text-transparent",
      label: "Happy Users",
    },
    {
      value: String(categoryCount),
      colorClass:
        "bg-gradient-to-r from-purple-500 to-indigo-600 bg-clip-text text-transparent",
      label: "Categories",
    },
    {
      value: "24/7",
      colorClass:
        "bg-gradient-to-r from-orange-500 to-red-600 bg-clip-text text-transparent",
      label: "Support",
    },
  ];
}

const stats = getStats();
export default stats;
