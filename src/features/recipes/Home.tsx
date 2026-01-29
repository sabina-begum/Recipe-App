/**
 * Copyright (c) 2024 Sabina Begum. All rights reserved.
 *
 * PROPRIETARY SOFTWARE - CONFIDENTIAL
 *
 * This file contains proprietary and confidential information.
 * Unauthorized copying, distribution, or use is strictly prohibited.
 *
 * For licensing inquiries: begumsabina81193@gmail.com
 *
 * Educational use only - Commercial use prohibited.
 */
import { featuredRecipes } from "../../data/recipes";
import { useState, useMemo, useCallback } from "react";
import { useAuth } from "../../contexts/useAuth";
import type { Recipe, NutritionData, User } from "../../global";

import FoodCategory from "../../components/FoodCategory";
import Ingredients from "../../components/Ingredients";
import Instructions from "../../components/Instructions";
import Nutrition from "../../components/Nutrition";
import RecipeScaling from "../../components/RecipeScaling";
import RecipeDifficulty from "../../components/RecipeDifficulty";
import CookingVideos from "../../components/CookingVideos";
import LeftoverIntegration from "../../components/LeftoverIntegration";
import RecipeReviews from "../../components/RecipeReviews";
import LoadingSkeleton from "../../components/home/LoadingSkeleton";
import ErrorMessage from "../../components/ErrorMessage";
import ServicesSection from "../../components/home/ServicesSection";
import RecipeCard from "./RecipeCard";
import QuickAccessSection from "../../components/home/QuickAccessSection";
import { useFavorites } from "../../hooks/useFavorites";
import RecipeMetaHelmet from "../../components/RecipeMetaHelmet";
// Hero images from featured recipes (real data)
const heroImages = featuredRecipes.slice(0, 3);

// Word arrays for food description generation
/** Fallback description when recipe has no description or instructions (deterministic, no random placeholder text). */
function getFallbackDescription(recipeName: string | undefined): string {
  if (!recipeName) return "";
  const name = recipeName.trim();
  return name ? `A delicious ${name} recipe.` : "";
}

// Define prop types for HomePage
interface HomePageProps {
  selected: Recipe | null;
  nutritionData: NutritionData | null;
  loading: boolean;
  error: string | null;
  darkMode: boolean;
  nutritionLoading: boolean;
}

export default function HomePage({
  selected,
  nutritionData,
  loading,
  error,
  darkMode,
  nutritionLoading,
}: HomePageProps) {
  const { currentUser, isDemoUser } = useAuth() as {
    currentUser: User | null;
    isDemoUser: boolean;
  };
  const { isFavorite, favoriteLoading, toggleFavorite } = useFavorites(
    currentUser,
    selected,
    isDemoUser,
  );
  const [toolsExpanded, setToolsExpanded] = useState(false);

  // Use real recipe description when available; otherwise fall back to recipe-name-based description
  const memoizedDescription = useMemo(() => {
    if (!selected) return "";
    const s = selected as {
      description?: string;
      strInstructions?: string;
      strMeal?: string;
    };
    if (s.description?.trim()) return s.description.trim();
    if (s.strInstructions?.trim()) {
      const max = 220;
      const text = s.strInstructions.trim();
      return text.length <= max ? text : `${text.slice(0, max).trim()}…`;
    }
    return getFallbackDescription(s.strMeal);
  }, [selected]);
  const handleToolsToggle = useCallback(
    () => setToolsExpanded((prev) => !prev),
    [],
  );

  if (!selected) {
    const mainFeatured = featuredRecipes[0];

    return (
      <div className="bg-main text-main min-h-screen w-full">
        {/* Hero Section */}
        <div className="w-full flex flex-col md:flex-row items-center justify-center min-h-[80vh] md:min-h-[90vh]">
          {/* Left: Hero Text & CTA */}
          <div className="flex-1 flex flex-col items-center md:items-start justify-center py-12 md:py-0 px-4 md:px-0 max-w-2xl">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-6 text-neutral-900 dark:text-neutral-100 tracking-tight text-center md:text-left">
              Premium Recipes for Culinary Excellence
            </h2>
            <p className="text-lg md:text-xl text-muted-foreground mb-8 text-center md:text-left max-w-xl">
              Unlock exclusive, chef-curated dishes and gourmet inspiration.
              Experience the art of fine cooking—crafted for discerning food
              lovers.
            </p>
            <a
              href="#featured"
              className="inline-block px-8 py-3 rounded-lg bg-gradient-to-r from-green-600 to-emerald-600 text-white font-semibold text-lg hover:bg-green-700 transition-colors mb-8 md:mb-0"
            >
              Explore Featured Recipe
            </a>
            <div className="mt-10 border-t pt-8 w-full bg-green-50 dark:bg-green-900/20 rounded-lg p-6">
              <h2 className="text-2xl font-bold mb-2 text-green-700 dark:text-green-300">
                Featured: {mainFeatured.name}
              </h2>
              <p className="text-base text-muted-foreground mb-2">
                {mainFeatured.description}
              </p>
              <div className="flex justify-start items-center gap-4 mt-4">
                <span className="inline-block bg-yellow-50 text-yellow-700 px-3 py-1 rounded-full text-sm font-medium border border-yellow-200">
                  ⭐ {mainFeatured.rating.toFixed(1)}
                </span>
                {mainFeatured.tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-block bg-green-50 text-green-700 px-3 py-1 rounded-full text-sm font-medium border border-green-200"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Food Images Grid */}
          <div className="flex-1 flex items-center justify-center w-full h-full py-8 md:py-0">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-1 lg:grid-cols-1 w-full max-w-lg">
              <div className="grid grid-cols-2 gap-4">
                {heroImages[0] && (
                  <img
                    src={heroImages[0].image}
                    alt={heroImages[0].name}
                    className="rounded-2xl shadow-md object-cover w-full h-40 md:h-56 lg:h-64 border border-border"
                    style={{ background: "#fffbe6" }}
                    loading="lazy"
                    onError={() =>
                      console.log("Failed to load:", heroImages[0]?.image)
                    }
                  />
                )}
                {heroImages[1] && (
                  <img
                    src={heroImages[1].image}
                    alt={heroImages[1].name}
                    className="rounded-2xl shadow-md object-cover w-full h-40 md:h-56 lg:h-64 border border-border"
                    style={{ background: "#ffe5d9" }}
                    loading="lazy"
                    onError={() =>
                      console.log("Failed to load:", heroImages[1]?.image)
                    }
                  />
                )}
              </div>
              {heroImages[2] && (
                <img
                  src={heroImages[2].image}
                  alt={heroImages[2].name}
                  className="rounded-2xl shadow-md object-cover w-full h-40 md:h-56 lg:h-64 border border-border mt-4"
                  style={{ background: "#f8f8f8" }}
                  loading="lazy"
                  onError={() =>
                    console.log("Failed to load:", heroImages[2]?.image)
                  }
                />
              )}
            </div>
          </div>
        </div>

        {/* Featured Recipes Grid */}
        <section id="featured" className="py-12">
          <h2 className="text-2xl md:text-3xl font-bold mb-6 text-green-900 dark:text-green-300 text-left">
            Featured Recipes
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {featuredRecipes.slice(0, 4).map((recipe) => (
              <div
                key={recipe.id}
                className="rounded-xl shadow-lg bg-white dark:bg-neutral-900 border border-border overflow-hidden flex flex-col"
              >
                <div className="h-40 bg-gray-200 dark:bg-neutral-800 flex items-center justify-center">
                  <img
                    src={recipe.image}
                    alt={recipe.name}
                    className="object-cover w-full h-full"
                  />
                </div>
                <div className="p-4 flex-1 flex flex-col justify-between">
                  <h3 className="text-lg font-semibold mb-2 text-green-800 dark:text-green-200">
                    {recipe.name}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
                    {recipe.description}
                  </p>
                  <button className="mt-auto px-4 py-2 rounded bg-green-600 hover:bg-green-700 text-white font-medium transition">
                    View Recipe
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Category Shortcuts: Quick Access & Our Services */}
        <section className="py-12 grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h2 className="text-xl font-semibold mb-4 text-green-900 dark:text-green-300">
              Quick Access
            </h2>
            <QuickAccessSection darkMode={darkMode} />
          </div>
          <div>
            <h2 className="text-xl font-semibold mb-4 text-green-900 dark:text-green-300">
              Our Services
            </h2>
            <ServicesSection darkMode={darkMode} />
          </div>
        </section>

        {/* Recommendations, Seasonal Collection, Testimonials */}
        {/* (leave the rest of your existing sections here as they are) */}
      </div>
    );
  }

  return (
    <div className="bg-main text-main min-h-screen">
      <div>
        <RecipeMetaHelmet selected={selected} nutritionData={nutritionData} />
        {loading && <LoadingSkeleton darkMode={darkMode} />}
        {error && <ErrorMessage message={error} darkMode={darkMode} />}
        {/* Recipe Card */}
        {!loading && selected && (
          <section
            data-recipe-section
            className="bg-card rounded-xl shadow-md p-6 md:p-8 mb-8 px-0"
          >
            <h2 className="text-2xl font-semibold mb-4">Recipe</h2>
            <RecipeCard
              selected={selected}
              darkMode={darkMode}
              generateFoodDescription={memoizedDescription}
              isFavorite={isFavorite}
              favoriteLoading={favoriteLoading}
              toggleFavorite={toggleFavorite}
            />
          </section>
        )}

        {/* Category, Ingredients, Method, Nutrition */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-card rounded-xl shadow-md p-6 md:p-8 mb-8 px-0">
          <div className="space-y-4">
            <h2 className="text-xl font-semibold mb-4">
              Category & Ingredients
            </h2>
            <FoodCategory category={selected.strCategory} darkMode={darkMode} />
            <Ingredients recipe={selected} darkMode={darkMode} />
          </div>
          <div className="space-y-4">
            <h2 className="text-xl font-semibold mb-4">Method & Nutrition</h2>
            <Instructions
              instructions={selected.strInstructions}
              darkMode={darkMode}
            />
            <Nutrition
              nutrition={nutritionData || {}}
              darkMode={darkMode}
              loading={nutritionLoading}
            />
          </div>
        </section>
        {/* Tools Section */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-card rounded-xl shadow-md p-6 md:p-8 mb-8 px-0">
          {/* Leftover Ideas */}
          <div className="col-span-1 md:col-span-3 flex flex-col">
            <h2 className="text-lg font-medium mb-4">Leftover Ideas</h2>
            <LeftoverIntegration recipe={selected} darkMode={darkMode} />
          </div>
          {/* Adjust Servings */}
          <div className="flex flex-col p-0 h-full">
            <div className="bg-white dark:bg-neutral-900 rounded-lg shadow-md border border-stone-200 dark:border-neutral-800 relative h-full flex flex-col">
              <div className="flex items-center justify-between p-4 pb-2">
                <h2 className="text-lg font-medium">Adjust Servings</h2>
              </div>
              {toolsExpanded ? (
                <div className="p-4 pt-0 flex-1 flex flex-col">
                  <RecipeScaling recipe={selected} darkMode={darkMode} />
                </div>
              ) : (
                <div className="relative flex-1 flex flex-col justify-between h-full">
                  <div className="p-4 pt-0 flex-1 overflow-hidden max-h-24">
                    <RecipeScaling recipe={selected} darkMode={darkMode} />
                  </div>
                  <div className="absolute bottom-12 left-0 w-full h-14 bg-gradient-to-t from-white/95 dark:from-neutral-900/95 to-transparent pointer-events-none transition-all duration-200" />
                </div>
              )}
            </div>
          </div>
          {/* Difficulty & Time */}
          <div className="flex flex-col p-0 h-full">
            <div className="bg-white dark:bg-neutral-900 rounded-lg shadow-md border border-stone-200 dark:border-neutral-800 relative h-full flex flex-col">
              <div className="flex items-center justify-between p-4 pb-2">
                <h2 className="text-lg font-medium">Difficulty & Time</h2>
              </div>
              {toolsExpanded ? (
                <div className="p-4 pt-0 flex-1 flex flex-col">
                  <RecipeDifficulty recipe={selected} darkMode={darkMode} />
                </div>
              ) : (
                <div className="relative flex-1 flex flex-col justify-between h-full">
                  <div className="p-4 pt-0 flex-1 overflow-hidden max-h-24">
                    <RecipeDifficulty recipe={selected} darkMode={darkMode} />
                  </div>
                  <div className="absolute bottom-12 left-0 w-full h-14 bg-gradient-to-t from-white/95 dark:from-neutral-900/95 to-transparent pointer-events-none transition-all duration-200" />
                </div>
              )}
            </div>
          </div>
          {/* Cooking Techniques */}
          <div className="flex flex-col p-0 h-full">
            <div className="bg-white dark:bg-neutral-900 rounded-lg shadow-md border border-stone-200 dark:border-neutral-800 relative h-full flex flex-col">
              <div className="flex items-center justify-between p-4 pb-2">
                <h2 className="text-lg font-medium">Cooking Techniques</h2>
              </div>
              {toolsExpanded ? (
                <div className="p-4 pt-0 flex-1 flex flex-col">
                  <CookingVideos recipe={selected} darkMode={darkMode} />
                </div>
              ) : (
                <div className="relative flex-1 flex flex-col justify-between h-full">
                  <div className="p-4 pt-0 flex-1 overflow-hidden max-h-24">
                    <CookingVideos recipe={selected} darkMode={darkMode} />
                  </div>
                  <div className="absolute bottom-12 left-0 w-full h-14 bg-gradient-to-t from-white/95 dark:from-neutral-900/95 to-transparent pointer-events-none transition-all duration-200" />
                </div>
              )}
            </div>
          </div>
          {/* Expand/Collapse Button */}
          <div className="col-span-1 md:col-span-3 flex justify-center mt-4">
            <button
              className="text-sm px-4 py-2 rounded bg-stone-200 dark:bg-neutral-700 hover:bg-stone-300 dark:hover:bg-neutral-600 transition shadow"
              onClick={handleToolsToggle}
              aria-expanded={toolsExpanded}
            >
              {toolsExpanded ? "Collapse All" : "Expand All"}
            </button>
          </div>
        </section>
        {/* Reviews */}
        <section className="bg-card rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold mb-4">Reviews</h2>
          <RecipeReviews
            recipeId={selected.idMeal}
            recipeName={
              (selected as { strMeal?: string; name?: string }).strMeal ??
              (selected as { strMeal?: string; name?: string }).name
            }
            darkMode={darkMode}
          />
        </section>
      </div>
    </div>
  );
}
