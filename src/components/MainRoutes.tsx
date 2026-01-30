import React, { Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import type { Recipe, NutritionData } from "../global";
import LoadingSpinner from "./LoadingSpinner";
import HomePage from "../features/recipes/Home";
import AZRecipesPage from "../features/recipes/AZRecipesPage";
import UserProfile from "./UserProfile";
import Favorites from "./Favorites";
import UserRecipeSubmission from "./UserRecipeSubmission";
import Login from "./Auth/Login";
import Signup from "./Auth/Signup";
import MealPlanningCalendar from "./MealPlanningCalendar";
import ShoppingListGenerator from "./ShoppingListGenerator";
import AdvancedSearch from "./AdvancedSearch";
import RecipeCollections from "./RecipeCollections";
import NutritionTracker from "./NutritionTracker";
import About from "./About";
import AIFeaturesPage from "./AIFeaturesPage";
import IngredientInventory from "./IngredientInventory";
import SeasonalIngredients from "./SeasonalIngredients";
import SmartNotifications from "./SmartNotifications";
import AdvancedAnalytics from "./AdvancedAnalytics";
import RecipeDetailsSection from "../features/recipes/RecipeDetailsSection";
import { useDarkMode } from "../contexts/DarkModeContext";
import CategoriesPage from "./CategoriesPage";
import RecommendationsPage from "./RecommendationsPage";

interface MainRoutesProps {
  selected: Recipe | null;
  nutritionData: NutritionData | null;
  loading: boolean;
  error: string | null;
  nutritionLoading: boolean;
  hasUserSearched: boolean;
}

export default function MainRoutes({
  selected,
  nutritionData,
  loading,
  error,
  nutritionLoading,
}: MainRoutesProps) {
  const darkModeContext = useDarkMode();
  const darkMode = darkModeContext?.darkMode || false;

  const routes: { path: string; element: React.ReactNode }[] = [
    {
      path: "/",
      element: (
        <HomePage
          selected={selected}
          nutritionData={nutritionData}
          loading={loading}
          error={error}
          darkMode={darkMode}
          nutritionLoading={nutritionLoading}
        />
      ),
    },
    {
      path: "/recipe/:id",
      element: (
        <RecipeDetailsSection
          selected={selected}
          nutritionData={nutritionData}
          darkMode={darkMode}
          nutritionLoading={nutritionLoading}
        />
      ),
    },
    { path: "/recipes", element: <AZRecipesPage darkMode={darkMode} /> },
    { path: "/profile", element: <UserProfile darkMode={darkMode} /> },
    { path: "/favorites", element: <Favorites darkMode={darkMode} /> },
    {
      path: "/submit-recipe",
      element: <UserRecipeSubmission darkMode={darkMode} />,
    },
    { path: "/login", element: <Login darkMode={darkMode} /> },
    { path: "/signup", element: <Signup darkMode={darkMode} /> },
    {
      path: "/meal-planning",
      element: <MealPlanningCalendar darkMode={darkMode} />,
    },
    {
      path: "/shopping-list",
      element: <ShoppingListGenerator darkMode={darkMode} />,
    },
    {
      path: "/advanced-search",
      element: <AdvancedSearch darkMode={darkMode} onSearch={() => {}} />,
    },
    {
      path: "/collections",
      element: <RecipeCollections darkMode={darkMode} />,
    },
    {
      path: "/nutrition-tracker",
      element: <NutritionTracker darkMode={darkMode} />,
    },
    { path: "/about", element: <About darkMode={darkMode} /> },
    {
      path: "/ai-features",
      element: <AIFeaturesPage darkMode={darkMode} onSearch={() => {}} />,
    },
    {
      path: "/ingredient-inventory",
      element: <IngredientInventory darkMode={darkMode} />,
    },
    {
      path: "/seasonal-ingredients",
      element: <SeasonalIngredients darkMode={darkMode} />,
    },
    {
      path: "/notifications",
      element: <SmartNotifications darkMode={darkMode} />,
    },
    {
      path: "/analytics",
      element: <AdvancedAnalytics darkMode={darkMode} />,
    },
    {
      path: "/categories",
      element: <CategoriesPage darkMode={darkMode} />,
    },
    {
      path: "/recommendations",
      element: <RecommendationsPage darkMode={darkMode} />,
    },
    { path: "*", element: <div>404 - Page Not Found</div> },
  ];

  return (
    <Suspense fallback={<LoadingSpinner />}>
      <Routes>
        {routes.map(({ path, element }) => (
          <Route key={path} path={path} element={element} />
        ))}
      </Routes>
    </Suspense>
  );
}
