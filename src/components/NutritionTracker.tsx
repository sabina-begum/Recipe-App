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
import { Helmet } from "react-helmet-async";
import { useAuth } from "../contexts/useAuth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { db } from "../firebase/config";
import { NutritionAPI } from "../services/nutritionAPI";
import NutritionLogForm from "./NutritionTracker/NutritionLogForm";
import NutritionLogList from "./NutritionTracker/NutritionLogList";
import EmptyState from "./RecipeCollections/EmptyState";

export interface NutritionGoals {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  sugar: number;
  sodium: number;
}

export interface Meal {
  id?: number;
  name: string;
  ingredients: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  sugar: number;
  sodium: number;
  [key: string]: unknown;
}

export interface NewMeal {
  name: string;
  ingredients: string;
  calories: string;
  protein: string;
  carbs: string;
  fat: string;
}

interface NutritionTrackerProps {
  darkMode: boolean;
}

const NutritionTracker: React.FC<NutritionTrackerProps> = ({ darkMode }) => {
  const { currentUser, isDemoUser } = useAuth();
  const [nutritionGoals, setNutritionGoals] = useState<NutritionGoals>({
    calories: 2000,
    protein: 50,
    carbs: 250,
    fat: 65,
    fiber: 25,
    sugar: 50,
    sodium: 2300,
  });
  const [dailyLog, setDailyLog] = useState<NutritionGoals>({
    calories: 0,
    protein: 0,
    carbs: 0,
    fat: 0,
    fiber: 0,
    sugar: 0,
    sodium: 0,
  });
  const [meals, setMeals] = useState<Meal[]>([]);
  const [newMeal, setNewMeal] = useState<NewMeal>({
    name: "",
    ingredients: "",
    calories: "",
    protein: "",
    carbs: "",
    fat: "",
  });
  const [loading, setLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0],
  );
  const [showAddMeal, setShowAddMeal] = useState(false);
  const [activityLevel, setActivityLevel] = useState("moderate");
  const [age, setAge] = useState(30);
  const [weight, setWeight] = useState(70);
  const [height, setHeight] = useState(170);
  const [gender, setGender] = useState("female");
  const [goal, setGoal] = useState("maintain");

  const loadDailyLog = useCallback(async () => {
    if (!currentUser) return;

    try {
      if (isDemoUser) {
        const key = `nutrition_log_${currentUser.uid}_${selectedDate}`;
        const raw = localStorage.getItem(key);
        if (raw) {
          const data = JSON.parse(raw) as {
            dailyLog?: NutritionGoals;
            meals?: Meal[];
          };
          setDailyLog(
            data.dailyLog || {
              calories: 0,
              protein: 0,
              carbs: 0,
              fat: 0,
              fiber: 0,
              sugar: 0,
              sodium: 0,
            },
          );
          setMeals(data.meals || []);
          return;
        }
      }
      const logDoc = await getDoc(
        doc(db, "users", currentUser.uid, "nutritionLogs", selectedDate),
      );
      if (logDoc.exists()) {
        const logData = logDoc.data();
        setDailyLog(
          logData.dailyLog || {
            calories: 0,
            protein: 0,
            carbs: 0,
            fat: 0,
            fiber: 0,
            sugar: 0,
            sodium: 0,
          },
        );
        setMeals(logData.meals || []);
      } else {
        setDailyLog({
          calories: 0,
          protein: 0,
          carbs: 0,
          fat: 0,
          fiber: 0,
          sugar: 0,
          sodium: 0,
        });
        setMeals([]);
      }
    } catch (error) {
      console.error("Error loading daily log:", error);
    }
  }, [currentUser, isDemoUser, selectedDate]);

  const loadUserData = useCallback(async () => {
    if (!currentUser) return;

    try {
      if (isDemoUser) {
        const key = `user_${currentUser.uid}`;
        const raw = localStorage.getItem(key);
        if (raw) {
          const data = JSON.parse(raw) as {
            nutritionGoals?: NutritionGoals;
            profile?: {
              age?: number;
              weight?: number;
              height?: number;
              gender?: string;
              activityLevel?: string;
              goal?: string;
            };
          };
          if (data.nutritionGoals) setNutritionGoals(data.nutritionGoals);
          if (data.profile) {
            setAge(data.profile.age ?? 30);
            setWeight(data.profile.weight ?? 70);
            setHeight(data.profile.height ?? 170);
            setGender(data.profile.gender ?? "female");
            setActivityLevel(data.profile.activityLevel ?? "moderate");
            setGoal(data.profile.goal ?? "maintain");
          }
        }
        loadDailyLog();
        return;
      }
      const userDoc = await getDoc(doc(db, "users", currentUser.uid));
      if (userDoc.exists()) {
        const userData = userDoc.data();
        if (userData.nutritionGoals) {
          setNutritionGoals(userData.nutritionGoals);
        }
        if (userData.profile) {
          setAge(userData.profile.age || 30);
          setWeight(userData.profile.weight || 70);
          setHeight(userData.profile.height || 170);
          setGender(userData.profile.gender || "female");
          setActivityLevel(userData.profile.activityLevel || "moderate");
          setGoal(userData.profile.goal || "maintain");
        }
      }
      loadDailyLog();
    } catch (error) {
      console.error("Error loading user data:", error);
    }
  }, [currentUser, isDemoUser, loadDailyLog]);

  useEffect(() => {
    if (currentUser) {
      loadUserData();
    }
  }, [currentUser, selectedDate, loadUserData]);

  const calculateNutritionGoals = () => {
    let bmr;
    if (gender === "male") {
      bmr = 10 * weight + 6.25 * height - 5 * age + 5;
    } else {
      bmr = 10 * weight + 6.25 * height - 5 * age - 161;
    }

    // Activity multiplier
    const activityMultipliers: Record<string, number> = {
      sedentary: 1.2,
      light: 1.375,
      moderate: 1.55,
      active: 1.725,
      veryActive: 1.9,
    };

    const totalDailyEnergyExpenditure =
      bmr * activityMultipliers[activityLevel];

    // Goal adjustment
    const goalAdjustments: Record<string, number> = {
      lose: 0.85,
      maintain: 1,
      gain: 1.15,
    };

    const targetCalories = Math.round(
      totalDailyEnergyExpenditure * goalAdjustments[goal],
    );

    // Macro distribution
    const newGoals = {
      calories: targetCalories,
      protein: Math.round((targetCalories * 0.25) / 4), // 25% of calories from protein
      carbs: Math.round((targetCalories * 0.45) / 4), // 45% of calories from carbs
      fat: Math.round((targetCalories * 0.3) / 9), // 30% of calories from fat
      fiber: 25,
      sugar: Math.round((targetCalories * 0.1) / 4), // 10% of calories from sugar
      sodium: 2300,
    };

    setNutritionGoals(newGoals);
    saveNutritionGoals(newGoals);
  };

  const saveNutritionGoals = async (goals: NutritionGoals) => {
    if (!currentUser) return;

    try {
      if (isDemoUser) {
        const key = `user_${currentUser.uid}`;
        const existing = JSON.parse(localStorage.getItem(key) || "{}");
        localStorage.setItem(
          key,
          JSON.stringify({
            ...existing,
            nutritionGoals: goals,
            profile: {
              age,
              weight,
              height,
              gender,
              activityLevel,
              goal,
            },
          }),
        );
        return;
      }
      await setDoc(
        doc(db, "users", currentUser.uid),
        {
          nutritionGoals: goals,
          profile: {
            age,
            weight,
            height,
            gender,
            activityLevel,
            goal,
          },
        },
        { merge: true },
      );
    } catch (error) {
      console.error("Error saving nutrition goals:", error);
    }
  };

  const addMeal = async () => {
    if (!newMeal.name || !newMeal.ingredients || !currentUser) return;

    setLoading(true);
    try {
      let mealNutrition = {
        calories: parseFloat(newMeal.calories) || 0,
        protein: parseFloat(newMeal.protein) || 0,
        carbs: parseFloat(newMeal.carbs) || 0,
        fat: parseFloat(newMeal.fat) || 0,
        fiber: 0,
        sugar: 0,
        sodium: 0,
      };

      // If no manual nutrition data, try to get from API
      if (!newMeal.calories && newMeal.ingredients) {
        try {
          const ingredients = newMeal.ingredients
            .split(",")
            .map((i) => i.trim());
          const nutritionData =
            await NutritionAPI.getNutritionForIngredients(ingredients);
          if (nutritionData) {
            mealNutrition = {
              calories: Number(nutritionData.calories) || 0,
              protein: Number(nutritionData.protein) || 0,
              carbs: Number(nutritionData.carbs) || 0,
              fat: Number(nutritionData.fat) || 0,
              fiber: Number(nutritionData.fiber) || 0,
              sugar: Number(nutritionData.sugar) || 0,
              sodium: Number(nutritionData.sodium) || 0,
            };
          }
        } catch (error) {
          console.error("Error fetching nutrition data:", error);
        }
      }

      const meal: Meal = {
        id: Date.now(),
        name: newMeal.name,
        ingredients: newMeal.ingredients,
        calories: mealNutrition.calories,
        protein: mealNutrition.protein,
        carbs: mealNutrition.carbs,
        fat: mealNutrition.fat,
        fiber: mealNutrition.fiber,
        sugar: mealNutrition.sugar,
        sodium: mealNutrition.sodium,
        timestamp: new Date().toISOString(),
      };

      const updatedMeals = [...meals, meal];
      const updatedDailyLog: NutritionGoals = {
        calories: dailyLog.calories + mealNutrition.calories,
        protein: dailyLog.protein + mealNutrition.protein,
        carbs: dailyLog.carbs + mealNutrition.carbs,
        fat: dailyLog.fat + mealNutrition.fat,
        fiber: dailyLog.fiber + mealNutrition.fiber,
        sugar: dailyLog.sugar + mealNutrition.sugar,
        sodium: dailyLog.sodium + mealNutrition.sodium,
      };

      setMeals(updatedMeals);
      setDailyLog(updatedDailyLog);
      setNewMeal({
        name: "",
        ingredients: "",
        calories: "",
        protein: "",
        carbs: "",
        fat: "",
      });
      setShowAddMeal(false);

      if (isDemoUser) {
        const key = `nutrition_log_${currentUser.uid}_${selectedDate}`;
        localStorage.setItem(
          key,
          JSON.stringify({ dailyLog: updatedDailyLog, meals: updatedMeals }),
        );
      } else {
        await setDoc(
          doc(db, "users", currentUser.uid, "nutritionLogs", selectedDate),
          { dailyLog: updatedDailyLog, meals: updatedMeals },
        );
      }
    } catch (error) {
      console.error("Error adding meal:", error);
    } finally {
      setLoading(false);
    }
  };

  const removeMeal = async (mealId: number) => {
    if (!currentUser) return;

    const meal = meals.find((m) => m.id === mealId);
    if (!meal) return;

    const updatedMeals = meals.filter((m) => m.id !== mealId);
    const updatedDailyLog: NutritionGoals = {
      calories: dailyLog.calories - meal.calories,
      protein: dailyLog.protein - meal.protein,
      carbs: dailyLog.carbs - meal.carbs,
      fat: dailyLog.fat - meal.fat,
      fiber: dailyLog.fiber - meal.fiber,
      sugar: dailyLog.sugar - meal.sugar,
      sodium: dailyLog.sodium - meal.sodium,
    };

    setMeals(updatedMeals);
    setDailyLog(updatedDailyLog);

    try {
      if (isDemoUser) {
        const key = `nutrition_log_${currentUser.uid}_${selectedDate}`;
        localStorage.setItem(
          key,
          JSON.stringify({ dailyLog: updatedDailyLog, meals: updatedMeals }),
        );
      } else {
        await setDoc(
          doc(db, "users", currentUser.uid, "nutritionLogs", selectedDate),
          { dailyLog: updatedDailyLog, meals: updatedMeals },
        );
      }
    } catch (error) {
      console.error("Error saving after remove:", error);
    }
  };

  const getProgressPercentage = (current: number, goal: number) => {
    return Math.min((current / goal) * 100, 100);
  };

  const getProgressColor = (current: number, goal: number) => {
    const percentage = (current / goal) * 100;
    if (percentage < 80) return "bg-red-500";
    if (percentage < 100) return "bg-yellow-500";
    return "bg-green-500";
  };

  const formatNutrient = (value: number, unit = "g") => {
    return `${Math.round(value)}${unit}`;
  };

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-stone-100 dark:bg-black pt-20 pb-8 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-green-900 dark:text-green-300 mb-4">
            Please log in to access Nutrition Tracker
          </h1>
          <p className="text-neutral-400">
            Sign in to track your daily nutrition goals and get personalized
            recommendations.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-100 dark:bg-black pt-20 pb-8">
      <Helmet>
        <title>Nutrition Tracker - CULINARIA</title>
        <meta
          name="description"
          content="Track your daily nutrition goals, log meals, and get personalized recommendations with CULINARIA's comprehensive nutrition tracking system."
        />
        <meta
          name="keywords"
          content="culinaria nutrition tracker, meal logging, health goals, calorie tracking, macro tracking"
        />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            name: "Nutrition Tracker",
            description:
              "Comprehensive nutrition tracking and meal logging system",
            applicationCategory: "HealthApplication",
            operatingSystem: "Web Browser",
          })}
        </script>
      </Helmet>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1
            className={`text-3xl md:text-4xl font-bold mb-4 text-green-900 dark:text-green-300`}
          >
            Nutrition Tracker
          </h1>
          <p className="text-lg text-neutral-400">
            Monitor your daily nutrition goals and get personalized
            recommendations with CULINARIA
          </p>
        </div>

        {/* Profile Settings */}
        <div className="bg-white dark:bg-stone-900 rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-bold text-green-900 dark:text-green-300 mb-4">
            Profile & Goals
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-neutral-50 dark:text-stone-300 mb-2">
                Age
              </label>
              <input
                type="number"
                value={age}
                onChange={(e) => setAge(parseInt(e.target.value))}
                className="w-full px-3 py-2 border border-stone-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-300 dark:text-stone-300 mb-2">
                Weight (kg)
              </label>
              <input
                type="number"
                value={weight}
                onChange={(e) => setWeight(parseFloat(e.target.value))}
                className="w-full px-3 py-2 border border-stone-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-300 dark:text-stone-300 mb-2">
                Height (cm)
              </label>
              <input
                type="number"
                value={height}
                onChange={(e) => setHeight(parseFloat(e.target.value))}
                className="w-full px-3 py-2 border border-stone-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-300 dark:text-stone-300 mb-2">
                Gender
              </label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                className="w-full px-3 py-2 border border-stone-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="female">Female</option>
                <option value="male">Male</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-300 dark:text-neutral-300 mb-2">
                Activity Level
              </label>
              <select
                value={activityLevel}
                onChange={(e) => setActivityLevel(e.target.value)}
                className="w-full px-3 py-2 border border-stone-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="sedentary">Sedentary</option>
                <option value="light">Lightly Active</option>
                <option value="moderate">Moderately Active</option>
                <option value="active">Very Active</option>
                <option value="veryActive">Extremely Active</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-300 dark:text-stone-300 mb-2">
                Goal
              </label>
              <select
                value={goal}
                onChange={(e) => setGoal(e.target.value)}
                className="w-full px-3 py-2 border border-stone-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="lose">Lose Weight</option>
                <option value="maintain">Maintain Weight</option>
                <option value="gain">Gain Weight</option>
              </select>
            </div>
          </div>
          <button
            onClick={calculateNutritionGoals}
            className="mt-4 bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-md transition-colors"
          >
            Calculate Goals
          </button>
        </div>

        {/* Date Selector */}
        <div className="bg-white dark:bg-stone-900 rounded-lg shadow-lg p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-green-900 dark:text-green-300">
              Daily Log
            </h2>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="px-3 py-2 border border-stone-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
        </div>

        {/* Nutrition Progress */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Daily Progress */}
          <div className="bg-white dark:bg-black rounded-lg shadow-lg p-6">
            <h3 className="text-xl font-bold text-green-900 dark:text-green-300 mb-4">
              Today&apos;s Progress
            </h3>
            <div className="space-y-4">
              {Object.entries(nutritionGoals).map(([nutrient, goal]) => {
                const current = dailyLog[nutrient as keyof NutritionGoals] || 0;
                const percentage = getProgressPercentage(current, goal);
                const color = getProgressColor(current, goal);
                const unit = nutrient === "calories" ? "kcal" : "g";

                return (
                  <div key={nutrient} className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="font-medium text-neutral-50 dark:text-stone-300 capitalize">
                        {nutrient}
                      </span>
                      <span className="text-neutral-400 dark:text-stone-400">
                        {formatNutrient(current, unit)} /{" "}
                        {formatNutrient(goal, unit)}
                      </span>
                    </div>
                    <div className="w-full bg-stone-200 dark:bg-stone-700 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-all duration-300 ${color}`}
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Nutrition Goals Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {Object.entries(nutritionGoals).map(([nutrient, goal]) => (
              <div
                key={nutrient}
                className={`p-4 rounded-lg border ${
                  darkMode
                    ? "bg-stone-800 border-stone-700"
                    : "bg-white border-gray-200 shadow-sm"
                }`}
              >
                <h3
                  className={`text-sm font-medium mb-2 ${
                    darkMode ? "text-stone-300" : "text-gray-700"
                  }`}
                >
                  {nutrient.charAt(0).toUpperCase() + nutrient.slice(1)}
                </h3>
                <div className="flex justify-between items-center mb-2">
                  <span
                    className={`text-lg font-bold ${
                      darkMode ? "text-green-400" : "text-green-600"
                    }`}
                  >
                    {formatNutrient(dailyLog[nutrient as keyof NutritionGoals])}
                  </span>
                  <span
                    className={`text-sm ${
                      darkMode ? "text-stone-400" : "text-gray-500"
                    }`}
                  >
                    / {formatNutrient(goal)}
                  </span>
                </div>
                <div
                  className={`w-full bg-gray-200 rounded-full h-2 ${
                    darkMode ? "bg-stone-700" : "bg-gray-200"
                  }`}
                >
                  <div
                    className={`h-2 rounded-full transition-all duration-300 ${getProgressColor(
                      dailyLog[nutrient as keyof NutritionGoals],
                      goal,
                    )}`}
                    style={{
                      width: `${Math.min(
                        getProgressPercentage(
                          dailyLog[nutrient as keyof NutritionGoals],
                          goal,
                        ),
                        100,
                      )}%`,
                    }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Meal Logging */}
        <div className="bg-white dark:bg-black rounded-lg shadow-lg p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-green-900 dark:text-green-300">
              Meals Today
            </h3>
            <button
              onClick={() => setShowAddMeal(!showAddMeal)}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md transition-colors"
            >
              {showAddMeal ? "Cancel" : "Add Meal"}
            </button>
          </div>

          {showAddMeal && (
            <NutritionLogForm
              newMeal={newMeal}
              setNewMeal={setNewMeal}
              onAddMeal={addMeal}
              loading={loading}
            />
          )}

          <NutritionLogList
            meals={meals}
            onRemoveMeal={removeMeal}
            darkMode={darkMode}
          />
          {meals.length === 0 && (
            <EmptyState
              message="No meals logged for this day. Add a meal to get started!"
              darkMode={darkMode}
            />
          )}
        </div>

        {/* Tips and Recommendations */}
        <div className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-stone-800 dark:to-stone-700 rounded-lg shadow-lg p-6">
          <h3 className="text-xl font-bold text-green-900 dark:text-green-300 mb-4">
            💡 Tips & Recommendations
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-green-800 dark:text-green-200 mb-2">
                Today&apos;s Progress
              </h4>
              <ul className="text-sm text-neutral-700 dark:text-neutral-300 space-y-1">
                {dailyLog.calories < nutritionGoals.calories * 0.8 && (
                  <li>
                    • You&apos;re under your calorie goal. Consider a healthy
                    snack!
                  </li>
                )}
                {dailyLog.protein < nutritionGoals.protein * 0.8 && (
                  <li>
                    • Add more protein-rich foods like lean meats, eggs, or
                    legumes
                  </li>
                )}
                {dailyLog.fiber < nutritionGoals.fiber * 0.8 && (
                  <li>
                    • Increase fiber intake with fruits, vegetables, and whole
                    grains
                  </li>
                )}
                {dailyLog.sugar > nutritionGoals.sugar * 1.2 && (
                  <li>• Try to reduce added sugars in your next meals</li>
                )}
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-green-800 dark:text-green-200 mb-2">
                General Tips
              </h4>
              <ul className="text-sm text-neutral-700 dark:text-stone-300 space-y-1">
                <li>• Drink plenty of water throughout the day</li>
                <li>• Include a variety of colorful vegetables</li>
                <li>• Choose whole grains over refined grains</li>
                <li>• Limit processed foods and added sugars</li>
                <li>• Listen to your body&apos;s hunger and fullness cues</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NutritionTracker;
