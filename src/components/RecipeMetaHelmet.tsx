import { Helmet } from "react-helmet-async";
import type { Recipe, NutritionData } from "../global";

interface RecipeMetaHelmetProps {
  selected: Recipe | null;
  nutritionData: NutritionData | null;
}

/** Convert "35 min" or "1 h" to ISO 8601 duration (e.g. PT35M). */
function timeToDuration(timeStr: string | undefined): string | undefined {
  if (!timeStr || typeof timeStr !== "string") return undefined;
  const trimmed = timeStr.trim();
  const minMatch = trimmed.match(/(\d+)\s*min/i);
  if (minMatch) return `PT${minMatch[1]}M`;
  const hourMatch = trimmed.match(/(\d+)\s*h/i);
  if (hourMatch) return `PT${hourMatch[1]}H`;
  const numMatch = trimmed.match(/(\d+)/);
  if (numMatch) return `PT${numMatch[1]}M`;
  return undefined;
}

export default function RecipeMetaHelmet({
  selected,
  nutritionData,
}: RecipeMetaHelmetProps) {
  const s = selected as {
    strMeal?: string;
    name?: string;
    strMealThumb?: string;
    image?: string;
    strCategory?: string;
    category?: string;
    strArea?: string;
    area?: string;
    time?: string;
  } | null;
  const recipeName = s?.strMeal ?? s?.name;
  const recipeImage = s?.strMealThumb ?? s?.image;
  const recipeCategory = s?.strCategory ?? s?.category;
  const recipeArea = s?.strArea ?? s?.area;
  const cookTimeDuration = timeToDuration(s?.time);
  const cookTime = cookTimeDuration ?? "PT45M";
  const totalTime = cookTimeDuration ?? "PT45M";

  return (
    <Helmet>
      {selected && recipeName ? (
        <>
          <title>{`${recipeName} Recipe - Recipe App`}</title>
          <meta
            name="description"
            content={`Learn how to make ${recipeName}. Get step-by-step instructions, ingredients, nutrition information, and cooking tips for this delicious recipe.`}
          />
          <meta
            name="keywords"
            content={`${recipeName}, recipe, cooking, ${recipeCategory ?? ""}, ${recipeArea ?? ""} cuisine`}
          />
          {/* Recipe Structured Data */}
          <script type="application/ld+json">
            {JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Recipe",
              name: recipeName,
              description: `Learn how to make ${recipeName} with step-by-step instructions`,
              image: recipeImage,
              author: {
                "@type": "Organization",
                name: "Recipe App",
              },
              datePublished: new Date().toISOString(),
              cookTime,
              totalTime,
              recipeCategory: recipeCategory ?? undefined,
              recipeCuisine: recipeArea ?? undefined,
              recipeYield: "4 servings",
              nutrition: {
                "@type": "NutritionInformation",
                calories: nutritionData?.Calories || "300 kcal",
              },
            })}
          </script>
        </>
      ) : (
        <>
          <title>Recipe App - Discover Delicious Recipes & Cooking Tips</title>
          <meta
            name="description"
            content="Find amazing recipes, cooking tips, and meal planning ideas. Browse thousands of recipes from around the world with nutrition information and step-by-step instructions."
          />
        </>
      )}
    </Helmet>
  );
}

