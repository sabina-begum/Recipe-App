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

import React, { useState, useEffect, useCallback } from "react";
import { useAuth } from "../contexts/useAuth";
import { featuredRecipes } from "../data/recipes";

interface Recipe {
  id: string;
  name: string;
  category: string;
  source: string;
}

interface MealSlot {
  date: Date;
  mealType: string;
}

interface MealsState {
  [dateKey: string]: {
    [mealType: string]: Recipe;
  };
}

interface MealPlanningCalendarProps {
  darkMode: boolean;
}

const MealPlanningCalendar: React.FC<MealPlanningCalendarProps> = ({
  darkMode,
}) => {
  const { currentUser, isDemoUser } = useAuth();
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [view, setView] = useState<"week" | "month">("week");
  const [meals, setMeals] = useState<MealsState>({});
  const [loading, setLoading] = useState<boolean>(true);
  const [showRecipeModal, setShowRecipeModal] = useState<boolean>(false);
  const [selectedMealSlot, setSelectedMealSlot] = useState<MealSlot | null>(
    null,
  );
  const [availableRecipes, setAvailableRecipes] = useState<Recipe[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");

  const mealTypes: string[] = ["Breakfast", "Lunch", "Dinner", "Snack"];
  const daysOfWeek: string[] = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  const loadMealPlan = useCallback((): void => {
    try {
      if (!currentUser) return;

      if (isDemoUser) {
        // Load demo meal plan
        const demoMealPlan =
          (currentUser.demoData as { mealPlan?: MealsState })?.mealPlan || {};
        setMeals(demoMealPlan);
      } else {
        // Load meal plan from localStorage
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth() + 1;
        const mealPlanKey = `mealPlan_${currentUser.uid}_${year}_${month}`;
        const savedMealPlan = JSON.parse(
          localStorage.getItem(mealPlanKey) || "{}",
        );
        setMeals(savedMealPlan.meals || {});
      }
    } catch (error) {
      console.error("Error loading meal plan:", error);
      setMeals({});
    }
    setLoading(false);
  }, [currentUser, isDemoUser, currentDate]);

  useEffect(() => {
    if (currentUser) {
      loadMealPlan();
      loadAvailableRecipes();
    }
  }, [currentUser, currentDate, loadMealPlan, loadAvailableRecipes]);

  const loadAvailableRecipes = useCallback((): void => {
    try {
      const byId = new Map<string, Recipe>();

      if (currentUser) {
        if (isDemoUser) {
          const demo = JSON.parse(localStorage.getItem("demoUser") || "{}");
          const favorites = (demo.demoData?.favorites || []) as Array<{
            id?: string;
            title?: string;
            name?: string;
            category?: string;
          }>;
          favorites.forEach((fav) => {
            const id = String(fav.id ?? "");
            if (id) byId.set(id, { id, name: (fav.title ?? fav.name) || "Unknown", category: fav.category || "Other", source: "favorite" });
          });
          const collections = (demo.demoData?.collections || []) as Array<{ recipes?: Array<{ id: string; name?: string; category?: string }> }>;
          collections.forEach((col) => {
            (col.recipes || []).forEach((r) => {
              const id = String(r.id ?? "");
              if (id && !byId.has(id)) byId.set(id, { id, name: (r.name as string) || "Unknown", category: (r.category as string) || "Other", source: "collection" });
            });
          });
        } else {
          const favorites = JSON.parse(localStorage.getItem(`favorites_${currentUser.uid}`) || "[]") as Array<{ id?: string; recipeId?: string; title?: string; name?: string; category?: string }>;
          favorites.forEach((fav) => {
            const id = String(fav.id ?? fav.recipeId ?? "");
            if (id) byId.set(id, { id, name: (fav.title ?? fav.name) || "Unknown", category: fav.category || "Other", source: "favorite" });
          });
          const collections = JSON.parse(localStorage.getItem(`collections_${currentUser.uid}`) || "[]") as Array<{ recipes?: Array<{ id: string; name?: string; category?: string }> }>;
          collections.forEach((col) => {
            (col.recipes || []).forEach((r) => {
              const id = String(r.id ?? "");
              if (id && !byId.has(id)) byId.set(id, { id, name: (r.name as string) || "Unknown", category: (r.category as string) || "Other", source: "collection" });
            });
          });
        }
      }

      if (byId.size === 0) {
        featuredRecipes.forEach((r) => {
          byId.set(r.id, { id: r.id, name: r.name, category: r.category || "Other", source: "featured" });
        });
      }

      setAvailableRecipes(Array.from(byId.values()));
    } catch (error) {
      console.error("Error loading recipes:", error);
      setAvailableRecipes(featuredRecipes.map((r) => ({ id: r.id, name: r.name, category: r.category || "Other", source: "featured" })));
    }
  }, [currentUser, isDemoUser]);

  const saveMealPlan = (newMeals: MealsState): void => {
    try {
      if (!currentUser) return;

      if (isDemoUser) {
        // Update demo meal plan
        const updatedDemoUser = {
          ...currentUser,
          demoData: {
            ...(currentUser.demoData as Record<string, unknown>),
            mealPlan: newMeals,
          },
        };
        localStorage.setItem("demoUser", JSON.stringify(updatedDemoUser));
      } else {
        // Save to localStorage
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth() + 1;
        const mealPlanKey = `mealPlan_${currentUser.uid}_${year}_${month}`;
        const mealPlanData = {
          userId: currentUser.uid,
          year,
          month,
          meals: newMeals,
          lastUpdated: Date.now(),
        };
        localStorage.setItem(mealPlanKey, JSON.stringify(mealPlanData));
      }
    } catch (error) {
      console.error("Error saving meal plan:", error);
    }
  };

  const addMealToDay = (date: Date, mealType: string, recipe: Recipe): void => {
    const dateKey = date.toISOString().split("T")[0];
    const newMeals: MealsState = {
      ...meals,
      [dateKey]: {
        ...meals[dateKey],
        [mealType]: recipe,
      },
    };
    setMeals(newMeals);
    saveMealPlan(newMeals);
    setShowRecipeModal(false);
  };

  const removeMealFromDay = (date: Date, mealType: string): void => {
    const dateKey = date.toISOString().split("T")[0];
    const newMeals: MealsState = { ...meals };
    if (newMeals[dateKey]) {
      delete newMeals[dateKey][mealType];
      if (Object.keys(newMeals[dateKey]).length === 0) {
        delete newMeals[dateKey];
      }
    }
    setMeals(newMeals);
    saveMealPlan(newMeals);
  };

  const getWeekDates = (): Date[] => {
    const startOfWeek = new Date(currentDate);
    startOfWeek.setDate(currentDate.getDate() - currentDate.getDay());
    const dates: Date[] = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(startOfWeek);
      date.setDate(startOfWeek.getDate() + i);
      dates.push(date);
    }
    return dates;
  };

  const getMonthDates = (): Date[] => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const dates: Date[] = [];
    const startDate = new Date(firstDay);
    startDate.setDate(firstDay.getDate() - firstDay.getDay());
    for (let i = 0; i < 42; i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);
      dates.push(date);
    }
    return dates;
  };

  const formatDate = (date: Date): string => {
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  };

  const isToday = (date: Date): boolean => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const isCurrentMonth = (date: Date): boolean => {
    return date.getMonth() === currentDate.getMonth();
  };

  const filteredRecipes = availableRecipes.filter(
    (recipe: Recipe) =>
      recipe.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      recipe.category.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  if (!currentUser) {
    return (
      <div
        className={`text-center py-8 ${
          darkMode ? "text-stone-300" : "text-neutral-600"
        }`}
      >
        Please log in to access meal planning.
      </div>
    );
  }

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
        <p
          className={`mt-2 ${darkMode ? "text-stone-300" : "text-neutral-600"}`}
        >
          Loading meal plan...
        </p>
      </div>
    );
  }

  return (
    <div
      className={`max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 pt-4 sm:pt-8 lg:pt-12 pb-4 sm:pb-8 lg:pb-12 ${
        darkMode ? "text-stone-100" : "text-neutral-800"
      }`}
    >
      <div
        className={`rounded-xl shadow-lg border p-3 sm:p-4 md:p-6 ${
          darkMode ? "bg-black border-stone-700" : "bg-white border-stone-200"
        }`}
      >
        {/* Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-4 sm:mb-6 gap-4">
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-orange-500 to-amber-500 bg-clip-text text-transparent">
            Meal Planning Calendar
          </h2>

          <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 w-full lg:w-auto">
            <div className="flex items-center space-x-2">
              <button
                onClick={() => {
                  const newDate = new Date(currentDate);
                  newDate.setMonth(newDate.getMonth() - 1);
                  setCurrentDate(newDate);
                }}
                className={`p-2 rounded-lg transition-colors ${
                  darkMode ? "hover:bg-stone-800" : "hover:bg-stone-100"
                }`}
              >
                <svg
                  className="w-4 h-4 sm:w-5 sm:h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </button>

              <span className="text-base sm:text-lg font-semibold whitespace-nowrap">
                {currentDate.toLocaleDateString("en-US", {
                  month: "long",
                  year: "numeric",
                })}
              </span>

              <button
                onClick={() => {
                  const newDate = new Date(currentDate);
                  newDate.setMonth(newDate.getMonth() + 1);
                  setCurrentDate(newDate);
                }}
                className={`p-2 rounded-lg transition-colors ${
                  darkMode ? "hover:bg-stone-800" : "hover:bg-stone-100"
                }`}
              >
                <svg
                  className="w-4 h-4 sm:w-5 sm:h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={() => setView("week")}
                className={`px-2 sm:px-3 py-1 rounded-lg text-xs sm:text-sm font-medium transition-colors ${
                  view === "week"
                    ? "bg-orange-500 text-white"
                    : darkMode
                      ? "bg-stone-700 text-stone-300"
                      : "bg-stone-200 text-stone-700"
                }`}
              >
                Week
              </button>
              <button
                onClick={() => setView("month")}
                className={`px-2 sm:px-3 py-1 rounded-lg text-xs sm:text-sm font-medium transition-colors ${
                  view === "month"
                    ? "bg-orange-500 text-white"
                    : darkMode
                      ? "bg-stone-700 text-stone-300"
                      : "bg-stone-200 text-stone-700"
                }`}
              >
                Month
              </button>
            </div>
          </div>
        </div>

        {/* Calendar Grid */}
        <div className="overflow-x-auto -mx-3 sm:-mx-4 md:-mx-6 px-3 sm:px-4 md:px-6">
          {view === "week" ? (
            <div className="grid grid-cols-8 gap-1 sm:gap-2 min-w-[600px] sm:min-w-[800px]">
              {/* Header */}
              <div className="p-1 sm:p-2"></div>
              {getWeekDates().map((date, index) => (
                <div
                  key={index}
                  className={`p-1 sm:p-2 text-center rounded-lg ${
                    isToday(date)
                      ? "bg-orange-500 text-white"
                      : darkMode
                        ? "bg-neutral-800"
                        : "bg-stone-100"
                  }`}
                >
                  <div className="font-semibold text-xs sm:text-sm">
                    {daysOfWeek[index]}
                  </div>
                  <div className="text-xs sm:text-sm">{formatDate(date)}</div>
                </div>
              ))}

              {/* Meal Types */}
              {mealTypes.map((mealType) => (
                <React.Fragment key={mealType}>
                  <div
                    className={`p-1 sm:p-2 font-semibold text-xs sm:text-sm ${
                      darkMode ? "bg-stone-800" : "bg-stone-100"
                    }`}
                  >
                    {mealType}
                  </div>

                  {getWeekDates().map((date, index) => {
                    const dateKey = date.toISOString().split("T")[0];
                    const meal = meals[dateKey]?.[mealType];

                    return (
                      <div
                        key={`${mealType}-${index}`}
                        className={`p-1 sm:p-2 min-h-[60px] sm:min-h-[80px] border-2 border-dashed rounded-lg cursor-pointer transition-colors ${
                          meal
                            ? darkMode
                              ? "border-green-500 bg-green-900/20"
                              : "border-green-500 bg-green-50"
                            : darkMode
                              ? "border-stone-600 hover:border-stone-500"
                              : "border-stone-300 hover:border-stone-400"
                        }`}
                        onClick={() => {
                          setSelectedMealSlot({ date, mealType });
                          setShowRecipeModal(true);
                        }}
                      >
                        {meal ? (
                          <div className="text-xs sm:text-sm">
                            <div className="font-medium truncate">
                              {meal.name}
                            </div>
                            <div className="text-xs opacity-75 truncate">
                              {meal.category}
                            </div>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                removeMealFromDay(date, mealType);
                              }}
                              className="mt-1 text-xs text-red-500 hover:text-red-700"
                            >
                              Remove
                            </button>
                          </div>
                        ) : (
                          <div className="text-xs sm:text-sm opacity-50">
                            Click to add meal
                          </div>
                        )}
                      </div>
                    );
                  })}
                </React.Fragment>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-7 gap-1">
              {/* Month view header */}
              {daysOfWeek.map((day) => (
                <div
                  key={day}
                  className={`p-1 sm:p-2 text-center font-semibold text-xs sm:text-sm ${
                    darkMode ? "bg-stone-800" : "bg-stone-100"
                  }`}
                >
                  {day.slice(0, 3)}
                </div>
              ))}

              {/* Month view dates */}
              {getMonthDates().map((date, index) => (
                <div
                  key={index}
                  className={`p-1 sm:p-2 min-h-[80px] sm:min-h-[100px] border rounded-lg ${
                    !isCurrentMonth(date)
                      ? "opacity-30"
                      : isToday(date)
                        ? "bg-orange-500 text-white"
                        : darkMode
                          ? "bg-neutral-800"
                          : "bg-white"
                  }`}
                >
                  <div className="text-xs sm:text-sm font-medium mb-1">
                    {date.getDate()}
                  </div>
                  <div className="space-y-1">
                    {mealTypes.map((mealType) => {
                      const dateKey = date.toISOString().split("T")[0];
                      const meal = meals[dateKey]?.[mealType];

                      return meal ? (
                        <div
                          key={mealType}
                          className={`text-xs p-1 rounded truncate ${
                            darkMode ? "bg-stone-700" : "bg-stone-100"
                          }`}
                        >
                          {meal.name}
                        </div>
                      ) : null;
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Recipe Selection Modal */}
      {showRecipeModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-3 sm:p-4">
          <div
            className={`max-w-2xl w-full max-h-[90vh] sm:max-h-[80vh] overflow-y-auto rounded-xl shadow-lg ${
              darkMode ? "bg-stone-800" : "bg-white"
            }`}
          >
            <div className="p-4 sm:p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg sm:text-xl font-semibold">
                  Add Meal for {selectedMealSlot?.date.toLocaleDateString()} -{" "}
                  {selectedMealSlot?.mealType}
                </h3>
                <button
                  onClick={() => setShowRecipeModal(false)}
                  className={`p-2 rounded-lg ${
                    darkMode ? "hover:bg-stone-700" : "hover:bg-stone-100"
                  }`}
                >
                  <svg
                    className="w-4 h-4 sm:w-5 sm:h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              <input
                type="text"
                placeholder="Search recipes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`w-full px-3 py-2 rounded-lg border mb-4 text-sm sm:text-base ${
                  darkMode
                    ? "bg-stone-700 border-stone-600 text-stone-100"
                    : "bg-white border-stone-300 text-stone-800"
                }`}
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-64 sm:max-h-96 overflow-y-auto">
                {filteredRecipes.map((recipe) => (
                  <div
                    key={recipe.id}
                    className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                      darkMode
                        ? "border-stone-600 hover:border-stone-500 hover:bg-stone-700"
                        : "border-stone-300 hover:border-stone-400 hover:bg-stone-50"
                    }`}
                    onClick={() =>
                      addMealToDay(
                        selectedMealSlot!.date,
                        selectedMealSlot!.mealType,
                        recipe,
                      )
                    }
                  >
                    <div className="font-medium text-sm sm:text-base">
                      {recipe.name}
                    </div>
                    <div className="text-xs sm:text-sm opacity-75">
                      {recipe.category}
                    </div>
                    <div className="text-xs opacity-50">
                      {recipe.source === "user" ? "User Recipe" : "API Recipe"}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MealPlanningCalendar;

