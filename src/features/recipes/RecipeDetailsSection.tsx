import type { Recipe, NutritionData } from "../../global";
import FoodCategory from "../../components/FoodCategory";
import Ingredients from "../../components/Ingredients";
import Instructions from "../../components/Instructions";
import Nutrition from "../../components/Nutrition";
import RecipeDifficulty from "../../components/RecipeDifficulty";
import CookingVideos from "../../components/CookingVideos";
import RecipeScaling from "../../components/RecipeScaling";
import RecipeRating from "../../components/RecipeRating";
import LeftoverIntegration from "../../components/LeftoverIntegration";
import RecipeReviews from "../../components/RecipeReviews";
import StepByStepMode from "../../components/StepByStepMode";

interface RecipeDetailsSectionProps {
  selected: Recipe | null;
  nutritionData: NutritionData | null;
  darkMode: boolean;
  nutritionLoading: boolean;
}

export default function RecipeDetailsSection({
  selected,
  nutritionData,
  darkMode,
  nutritionLoading,
}: RecipeDetailsSectionProps) {
  if (!selected)
    return (
      <h2
        className={`text-center font-bold text-xl sm:text-2xl leading-tight ${
          darkMode ? "text-gray-300" : "text-gray-700"
        }`}
      >
        No recipe found
      </h2>
    );
  return (
    <div
      className={`font-sans compact-card overflow-hidden relative ${
        darkMode
          ? "bg-black border-gray-700"
          : "bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 border-orange-200"
      }`}
    >
      {/* Replace <Post heading={selected.strMeal} darkMode={darkMode} /> with a styled heading */}
      <div
        className={`p-4 ${
          darkMode ? "bg-black text-stone-200" : "bg-white text-gray-800"
        }`}
      >
        <h2 className="text-3xl font-bold mb-2 break-words">
          {selected.strMeal}
        </h2>
      </div>
      {/* Recipe Share */}
      <FoodCategory category={selected.strCategory} darkMode={darkMode} />
      <Ingredients recipe={selected} darkMode={darkMode} />
      <Instructions
        instructions={selected.strInstructions}
        darkMode={darkMode}
      />
      {/* Step-by-Step Mode */}
      <div className="p-4">
        <StepByStepMode
          steps={
            selected.strInstructions
              ? selected.strInstructions.split(/\n+/).filter(Boolean)
              : []
          }
          darkMode={darkMode}
        />
      </div>
      <Nutrition
        nutrition={nutritionData || {}}
        darkMode={darkMode}
        loading={nutritionLoading}
      />
      <div className="p-4">
        <RecipeDifficulty recipe={selected} darkMode={darkMode} />
      </div>
      <div className="p-4">
        <CookingVideos recipe={selected} darkMode={darkMode} />
      </div>
      <div className="p-4">
        <RecipeScaling recipe={selected} darkMode={darkMode} />
      </div>
      <div className="p-4">
        <RecipeRating
          recipeId={selected.idMeal}
          recipeName={selected.strMeal}
          darkMode={darkMode}
        />
      </div>
      <div className="p-4">
        <LeftoverIntegration recipe={selected} darkMode={darkMode} />
      </div>
      <div className="p-4">
        <RecipeReviews
          recipeId={selected.idMeal}
          recipeName={selected.strMeal}
          darkMode={darkMode}
        />
      </div>
    </div>
  );
}
