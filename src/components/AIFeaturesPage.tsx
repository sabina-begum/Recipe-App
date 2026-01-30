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

import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import {
  Brain,
  Activity,
  Mic,
  Lightbulb,
  RefreshCw,
  Clock,
  Sparkles,
  ShoppingCart,
  Calendar,
} from "lucide-react";
import HeadManager from "./HeadManager";
import VoiceSearch from "./VoiceSearch";
import AIRecommendations from "./AIRecommendations";
import AISubstitutions from "./AISubstitutions";
import Nutrition, { NutritionData } from "./Nutrition";

interface AIFeaturesPageProps {
  darkMode: boolean;
  onSearch: (query: string) => void;
}

function AIFeaturesPage({ darkMode, onSearch }: AIFeaturesPageProps) {
  const location = useLocation();
  const [selectedRecipe] = useState<unknown>(null);
  const [nutritionData] = useState<unknown>(null);

  useEffect(() => {
    const hash = location.hash?.slice(1);
    if (hash) {
      const el = document.getElementById(hash);
      el?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [location.pathname, location.hash]);

  return (
    <>
      <HeadManager
        title="AI Features - CULINARIA"
        description="Explore CULINARIA's AI-powered cooking features: voice search, smart recommendations, ingredient substitutions, and nutrition analysis."
      />

      <div
        className={`min-h-screen transition-colors duration-300 relative ${
          darkMode ? "bg-black text-stone-100" : "bg-stone-100 text-stone-800"
        }`}
      >
        {/* AI Background Image */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {/* Background Image */}
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-80 dark:opacity-80"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1200 800'%3E%3Cdefs%3E%3ClinearGradient id='ai-gradient' x1='0%25' y1='0%25' x2='100%25' y2='100%25'%3E%3Cstop offset='0%25' style='stop-color:%2310b981;stop-opacity:0.15' /%3E%3Cstop offset='25%25' style='stop-color:%2306b6d4;stop-opacity:0.1' /%3E%3Cstop offset='50%25' style='stop-color:%238b5cf6;stop-opacity:0.08' /%3E%3Cstop offset='75%25' style='stop-color:%23f59e0b;stop-opacity:0.12' /%3E%3Cstop offset='100%25' style='stop-color:%23ef4444;stop-opacity:0.1' /%3E%3C/linearGradient%3E%3CradialGradient id='glow' cx='50%25' cy='50%25' r='50%25'%3E%3Cstop offset='0%25' style='stop-color:%2310b981;stop-opacity:0.3' /%3E%3Cstop offset='100%25' style='stop-color:%2310b981;stop-opacity:0' /%3E%3C/radialGradient%3E%3C/defs%3E%3Crect width='100%25' height='100%25' fill='url(%23ai-gradient)' /%3E%3C!-- Neural Network Nodes --%3E%3Cg fill='%2310b981' opacity='0.8'%3E%3Ccircle cx='150' cy='120' r='6'/%3E%3Ccircle cx='350' cy='180' r='4'/%3E%3Ccircle cx='550' cy='100' r='8'/%3E%3Ccircle cx='750' cy='220' r='5'/%3E%3Ccircle cx='950' cy='140' r='7'/%3E%3Ccircle cx='1150' cy='200' r='4'/%3E%3Ccircle cx='200' cy='320' r='6'/%3E%3Ccircle cx='400' cy='380' r='5'/%3E%3Ccircle cx='600' cy='300' r='7'/%3E%3Ccircle cx='800' cy='420' r='4'/%3E%3Ccircle cx='1000' cy='340' r='6'/%3E%3Ccircle cx='250' cy='520' r='5'/%3E%3Ccircle cx='450' cy='580' r='7'/%3E%3Ccircle cx='650' cy='500' r='4'/%3E%3Ccircle cx='850' cy='620' r='6'/%3E%3Ccircle cx='1050' cy='540' r='5'/%3E%3C/g%3E%3C!-- Neural Network Connections --%3E%3Cg stroke='%2306b6d4' stroke-width='2' opacity='0.6' fill='none'%3E%3Cpath d='M150 120 Q250 100 350 180'/%3E%3Cpath d='M350 180 Q450 120 550 100'/%3E%3Cpath d='M550 100 Q650 180 750 220'/%3E%3Cpath d='M750 220 Q850 160 950 140'/%3E%3Cpath d='M950 140 Q1050 180 1150 200'/%3E%3Cpath d='M200 320 Q300 280 400 380'/%3E%3Cpath d='M400 380 Q500 320 600 300'/%3E%3Cpath d='M600 300 Q700 380 800 420'/%3E%3Cpath d='M800 420 Q900 360 1000 340'/%3E%3Cpath d='M250 520 Q350 480 450 580'/%3E%3Cpath d='M450 580 Q550 520 650 500'/%3E%3Cpath d='M650 500 Q750 580 850 620'/%3E%3Cpath d='M850 620 Q950 560 1050 540'/%3E%3C/g%3E%3C!-- Data Flow Lines --%3E%3Cg stroke='%238b5cf6' stroke-width='1.5' opacity='0.5' fill='none'%3E%3Cpath d='M0 150 Q300 100 600 150 T1200 150'/%3E%3Cpath d='M0 350 Q300 300 600 350 T1200 350'/%3E%3Cpath d='M0 550 Q300 500 600 550 T1200 550'/%3E%3Cpath d='M0 750 Q300 700 600 750 T1200 750'/%3E%3C/g%3E%3C!-- Processing Units --%3E%3Cg fill='%23f59e0b' opacity='0.7'%3E%3Crect x='50' y='50' width='20' height='20' rx='4'/%3E%3Crect x='300' y='100' width='16' height='16' rx='3'/%3E%3Crect x='550' y='70' width='24' height='24' rx='5'/%3E%3Crect x='800' y='120' width='18' height='18' rx='4'/%3E%3Crect x='1050' y='90' width='22' height='22' rx='4'/%3E%3Crect x='150' y='250' width='20' height='20' rx='4'/%3E%3Crect x='400' y='300' width='16' height='16' rx='3'/%3E%3Crect x='650' y='270' width='24' height='24' rx='5'/%3E%3Crect x='900' y='320' width='18' height='18' rx='4'/%3E%3Crect x='1150' y='290' width='22' height='22' rx='4'/%3E%3C/g%3E%3C!-- Glow Effects --%3E%3Ccircle cx='600' cy='400' r='150' fill='url(%23glow)' /%3E%3Ccircle cx='300' cy='200' r='80' fill='url(%23glow)' /%3E%3Ccircle cx='900' cy='300' r='100' fill='url(%23glow)' /%3E%3C/svg%3E")`,
            }}
          />

          {/* Additional AI Circuit Pattern */}
          <div className="absolute inset-0 opacity-20 dark:opacity-30">
            <svg
              className="w-full h-full"
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                <pattern
                  id="ai-circuit"
                  x="0"
                  y="0"
                  width="25"
                  height="25"
                  patternUnits="userSpaceOnUse"
                >
                  <rect
                    width="25"
                    height="25"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="0.5"
                    className="text-green-400"
                    opacity="0.3"
                  />
                  <circle
                    cx="12.5"
                    cy="12.5"
                    r="1"
                    fill="currentColor"
                    className="text-green-500"
                  />
                  <line
                    x1="0"
                    y1="12.5"
                    x2="25"
                    y2="12.5"
                    stroke="currentColor"
                    strokeWidth="0.5"
                    className="text-green-400"
                    opacity="0.2"
                  />
                  <line
                    x1="12.5"
                    y1="0"
                    x2="12.5"
                    y2="25"
                    stroke="currentColor"
                    strokeWidth="0.5"
                    className="text-green-400"
                    opacity="0.2"
                  />
                </pattern>
              </defs>
              <rect width="100" height="100" fill="url(#ai-circuit)" />
            </svg>
          </div>

          {/* Gradient Overlay */}
          <div
            className={`absolute inset-0 ${
              darkMode
                ? "bg-gradient-to-br from-black/80 via-black/60 to-green-900/30"
                : "bg-gradient-to-br from-stone-100/90 via-stone-50/80 to-green-50/40"
            }`}
          />
        </div>
        <div className="relative z-10 max-w-6xl mx-auto px-3 sm:px-4 lg:px-6 pt-4 sm:pt-8 lg:pt-12 pb-4 sm:pb-8 lg:pb-12">
          {/* Header */}
          <div className="text-left mb-12 sm:mb-16">
            <div className="flex items-center mb-6">
              <div className="flex items-center justify-center w-16 h-16 rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 shadow-lg mr-4">
                <Brain className="w-8 h-8 text-white" />
              </div>
              <h1
                className={`text-3xl sm:text-4xl lg:text-5xl font-bold ${
                  darkMode ? "text-green-400" : "text-green-900"
                }`}
              >
                AI-Powered Cooking Features
              </h1>
            </div>
            <p
              className={`text-lg sm:text-xl max-w-4xl leading-relaxed ${
                darkMode ? "text-stone-200" : "text-stone-600"
              }`}
            >
              Discover the future of cooking with our intelligent features
              designed to make your culinary journey easier, faster, and more
              enjoyable.
            </p>
          </div>

          {/* Features Grid */}
          <div className="space-y-12 sm:space-y-16">
            {/* Voice Search Section */}
            <section id="voice-search" className="scroll-mt-20">
              <div className="mb-8">
                <div className="flex items-center mb-3">
                  <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 shadow-lg mr-4">
                    <Mic className="w-6 h-6 text-white" />
                  </div>
                  <h2
                    className={`text-2xl sm:text-3xl font-bold ${
                      darkMode ? "text-orange-300" : "text-orange-900"
                    }`}
                  >
                    Voice Search
                  </h2>
                </div>
                <p
                  className={`text-lg leading-relaxed ${
                    darkMode ? "text-stone-200" : "text-stone-600"
                  }`}
                >
                  Search for recipes hands-free while you cook. Perfect for when
                  your hands are messy!
                </p>
              </div>
              <div
                className={`p-6 rounded-xl border shadow-lg ${
                  darkMode
                    ? "bg-black border-stone-700"
                    : "bg-white border-gray-200"
                }`}
              >
                <VoiceSearch onSearch={onSearch} darkMode={darkMode} />
              </div>
            </section>

            {/* AI Recommendations Section */}
            <section id="ai-recommendations" className="scroll-mt-20">
              <div className="mb-8">
                <div className="flex items-center mb-3">
                  <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-r from-purple-500 to-pink-600 shadow-lg mr-4">
                    <Lightbulb className="w-6 h-6 text-white" />
                  </div>
                  <h2
                    className={`text-2xl sm:text-3xl font-bold ${
                      darkMode ? "text-orange-300" : "text-orange-900"
                    }`}
                  >
                    Smart Recommendations
                  </h2>
                </div>
                <p
                  className={`text-lg leading-relaxed ${
                    darkMode ? "text-stone-200" : "text-stone-600"
                  }`}
                >
                  Get personalized recipe suggestions based on your preferences,
                  cooking history, and dietary needs.
                </p>
              </div>
              <div
                className={`p-6 rounded-xl border shadow-lg ${
                  darkMode
                    ? "bg-black border-stone-700"
                    : "bg-white border-gray-200"
                }`}
              >
                <AIRecommendations
                  darkMode={darkMode}
                  userPreferences={{
                    favoriteCategories: selectedRecipe
                      ? [
                          (selectedRecipe as { strCategory?: string })
                            .strCategory || "",
                        ]
                      : [],
                    dietaryRestrictions: [],
                    skillLevel: "beginner",
                  }}
                />
              </div>
            </section>

            {/* AI Substitutions Section */}
            <section id="ai-substitutions" className="scroll-mt-20">
              <div className="mb-8">
                <div className="flex items-center mb-3">
                  <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-r from-teal-500 to-cyan-600 shadow-lg mr-4">
                    <RefreshCw className="w-6 h-6 text-white" />
                  </div>
                  <h2
                    className={`text-2xl sm:text-3xl font-bold ${
                      darkMode ? "text-orange-300" : "text-orange-900"
                    }`}
                  >
                    Ingredient Substitutions
                  </h2>
                </div>
                <p
                  className={`text-lg leading-relaxed ${
                    darkMode ? "text-stone-200" : "text-stone-600"
                  }`}
                >
                  Find perfect substitutes for ingredients you don&apos;t have.
                  Never let a missing ingredient stop you from cooking!
                </p>
              </div>
              <div
                className={`p-6 rounded-xl border shadow-lg ${
                  darkMode
                    ? "bg-black border-stone-700"
                    : "bg-white border-gray-200"
                }`}
              >
                <AISubstitutions ingredients={[]} darkMode={darkMode} />
              </div>
            </section>

            {/* Nutrition Analysis Section */}
            <section id="nutrition-analysis" className="scroll-mt-20">
              <div className="mb-8">
                <div className="flex items-center mb-3">
                  <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-r from-orange-500 to-amber-600 shadow-lg mr-4">
                    <Activity className="w-6 h-6 text-white" />
                  </div>
                  <h2
                    className={`text-2xl sm:text-3xl font-bold ${
                      darkMode ? "text-orange-300" : "text-orange-900"
                    }`}
                  >
                    Nutrition Analysis
                  </h2>
                </div>
                <p
                  className={`text-lg leading-relaxed ${
                    darkMode ? "text-stone-200" : "text-stone-600"
                  }`}
                >
                  Get detailed nutritional information for any recipe. Track
                  your nutrition goals and get personalized suggestions.
                </p>
              </div>
              <div
                className={`p-6 rounded-xl border shadow-lg ${
                  darkMode
                    ? "bg-black border-stone-700"
                    : "bg-gradient-to-br from-orange-50 to-amber-50 border-orange-200"
                }`}
              >
                <Nutrition
                  nutrition={nutritionData as NutritionData}
                  darkMode={darkMode}
                  loading={false}
                />
              </div>
            </section>

            {/* Coming Soon Section */}
            <section>
              <div
                className={`p-8 rounded-xl border shadow-lg ${
                  darkMode
                    ? "bg-neutral-900 border-stone-700"
                    : "bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200"
                }`}
              >
                <div className="flex items-center mb-6">
                  <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 shadow-lg mr-4">
                    <Sparkles className="w-6 h-6 text-white" />
                  </div>
                  <h2
                    className={`text-2xl sm:text-3xl font-bold ${
                      darkMode ? "text-blue-300" : "text-blue-900"
                    }`}
                  >
                    Coming Soon
                  </h2>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div
                    className={`p-6 rounded-lg border shadow-md transition-all duration-200 hover:shadow-lg ${
                      darkMode
                        ? "bg-neutral-800 border-stone-700 hover:border-stone-600"
                        : "bg-white border-gray-200 hover:border-blue-300"
                    }`}
                  >
                    <div className="flex items-center mb-3">
                      <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-r from-green-500 to-emerald-600 shadow-md mr-3">
                        <Clock className="w-4 h-4 text-white" />
                      </div>
                      <h3
                        className={`font-semibold text-lg ${
                          darkMode ? "text-blue-300" : "text-blue-700"
                        }`}
                      >
                        Step-by-Step Cooking Mode
                      </h3>
                    </div>
                    <p
                      className={`text-sm leading-relaxed ${
                        darkMode ? "text-stone-300" : "text-stone-600"
                      }`}
                    >
                      Voice-guided cooking with timers and progress tracking
                    </p>
                  </div>
                  <div
                    className={`p-6 rounded-lg border shadow-md transition-all duration-200 hover:shadow-lg ${
                      darkMode
                        ? "bg-neutral-800 border-stone-700 hover:border-stone-600"
                        : "bg-white border-gray-200 hover:border-blue-300"
                    }`}
                  >
                    <div className="flex items-center mb-3">
                      <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-r from-orange-500 to-amber-600 shadow-md mr-3">
                        <ShoppingCart className="w-4 h-4 text-white" />
                      </div>
                      <h3
                        className={`font-semibold text-lg ${
                          darkMode ? "text-blue-300" : "text-blue-700"
                        }`}
                      >
                        Smart Shopping Lists
                      </h3>
                    </div>
                    <p
                      className={`text-sm leading-relaxed ${
                        darkMode ? "text-stone-300" : "text-stone-600"
                      }`}
                    >
                      Automatically generate shopping lists from your meal plan
                    </p>
                  </div>
                  <div
                    className={`p-6 rounded-lg border shadow-md transition-all duration-200 hover:shadow-lg ${
                      darkMode
                        ? "bg-neutral-800 border-stone-700 hover:border-stone-600"
                        : "bg-white border-gray-200 hover:border-blue-300"
                    }`}
                  >
                    <div className="flex items-center mb-3">
                      <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-r from-purple-500 to-pink-600 shadow-md mr-3">
                        <Calendar className="w-4 h-4 text-white" />
                      </div>
                      <h3
                        className={`font-semibold text-lg ${
                          darkMode ? "text-blue-300" : "text-blue-700"
                        }`}
                      >
                        AI Meal Planner
                      </h3>
                    </div>
                    <p
                      className={`text-sm leading-relaxed ${
                        darkMode ? "text-stone-300" : "text-stone-600"
                      }`}
                    >
                      Generate weekly meal plans based on your diet and
                      preferences
                    </p>
                  </div>
                </div>
                <p
                  className={`mt-6 text-sm ${
                    darkMode ? "text-stone-400" : "text-stone-500"
                  }`}
                >
                  These cutting-edge features are currently in development and
                  will be rolled out to users soon. Stay tuned!
                </p>
              </div>
            </section>
          </div>
        </div>
      </div>
    </>
  );
}

export default AIFeaturesPage;
