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

import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  Search,
  Sparkles,
  Calendar,
  Users,
  BookOpen,
  Search as AdvancedSearchIcon,
  FolderOpen,
  BookMarked,
  Mic,
  Lightbulb,
  RefreshCw,
  CalendarDays,
  ShoppingCart,
  Star,
  BarChart3,
  Package,
  Sprout,
  PenTool,
  Settings,
  TrendingUp,
  Bell,
  Info,
  LogIn,
} from "lucide-react";

const FEATURE_NAV_STORAGE = "culinaria_feature_nav_section";

interface FeatureNavbarProps {
  darkMode: boolean;
}

function FeatureNavbar({ darkMode }: FeatureNavbarProps) {
  const [activeSection, setActiveSection] = useState(() => {
    try {
      return localStorage.getItem(FEATURE_NAV_STORAGE) || "discover";
    } catch {
      return "discover";
    }
  });

  const setSection = (id: string) => {
    setActiveSection(id);
    try {
      localStorage.setItem(FEATURE_NAV_STORAGE, id);
    } catch {
      // ignore
    }
  };

  const sections = [
    {
      id: "discover",
      label: "Discover",
      icon: Search,
      items: [
        { label: "Browse A-Z", path: "/recipes", icon: BookOpen },
        {
          label: "Advanced Search",
          path: "/advanced-search",
          icon: AdvancedSearchIcon,
        },
        { label: "Categories", path: "/categories", icon: FolderOpen },
        { label: "Collections", path: "/collections", icon: BookMarked },
      ],
    },
    {
      id: "ai-features",
      label: "AI Features",
      icon: Sparkles,
      items: [
        { label: "All AI Features", path: "/ai-features", icon: Sparkles },
        { label: "Voice Search", path: "/ai-features#voice-search", icon: Mic },
        {
          label: "Smart Recommendations",
          path: "/ai-features#ai-recommendations",
          icon: Lightbulb,
        },
        {
          label: "Ingredient Substitutions",
          path: "/ai-features#ai-substitutions",
          icon: RefreshCw,
        },
      ],
    },
    {
      id: "planning",
      label: "Planning",
      icon: Calendar,
      items: [
        { label: "Meal Planning", path: "/meal-planning", icon: CalendarDays },
        { label: "Shopping List", path: "/shopping-list", icon: ShoppingCart },
        { label: "Favorites", path: "/favorites", icon: Star },
        {
          label: "Nutrition Tracker",
          path: "/nutrition-tracker",
          icon: BarChart3,
        },
        {
          label: "Ingredient Inventory",
          path: "/ingredient-inventory",
          icon: Package,
        },
        {
          label: "Seasonal Ingredients",
          path: "/seasonal-ingredients",
          icon: Sprout,
        },
      ],
    },
    {
      id: "community",
      label: "Community",
      icon: Users,
      items: [
        { label: "Submit Recipe", path: "/submit-recipe", icon: PenTool },
        { label: "User Profile", path: "/profile", icon: Settings },
        { label: "Cooking Analytics", path: "/analytics", icon: TrendingUp },
        { label: "Smart Notifications", path: "/notifications", icon: Bell },
        { label: "About", path: "/about", icon: Info },
        { label: "Login", path: "/login", icon: LogIn },
      ],
    },
  ];

  const handleAction = (action: string) => {
    switch (action) {
      case "voice": {
        // Trigger voice search
        const voiceSearchEvent = new CustomEvent("openVoiceSearch");
        window.dispatchEvent(voiceSearchEvent);
        break;
      }
      case "recommendations":
        // Scroll to recommendations section
        document
          .getElementById("ai-recommendations")
          ?.scrollIntoView({ behavior: "smooth" });
        break;
      case "substitutions":
        // Scroll to substitutions section
        document
          .getElementById("ai-substitutions")
          ?.scrollIntoView({ behavior: "smooth" });
        break;
      case "nutrition":
        // Scroll to nutrition section
        document
          .getElementById("nutrition-analysis")
          ?.scrollIntoView({ behavior: "smooth" });
        break;
      default:
        break;
    }
  };

  return (
    <nav
      className={`border-b transition-colors duration-300 ${
        darkMode
          ? "bg-gradient-to-r from-black to-stone-900 border-stone-700 shadow-lg"
          : "bg-gradient-to-r from-orange-50 to-amber-50 border-orange-200 shadow-sm"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-16">
        {/* Main Navigation Tabs */}
        <div className="flex space-x-2 overflow-x-auto scrollbar-hide pt-2 pb-2 pl-4">
          {sections.map((section) => (
            <button
              key={section.id}
              onClick={() => setSection(section.id)}
              className={`flex items-center space-x-2 sm:space-x-3 px-3 sm:px-5 py-3 text-sm sm:text-base font-semibold rounded-t-xl transition-all duration-200 whitespace-nowrap flex-shrink-0 relative ${
                activeSection === section.id
                  ? darkMode
                    ? "bg-black text-green-300 shadow-lg"
                    : "bg-white text-green-700 shadow-lg border border-orange-200"
                  : darkMode
                    ? "text-stone-300 hover:text-green-300 hover:bg-stone-800"
                    : "text-gray-700 hover:text-green-700 hover:bg-white hover:shadow-md"
              }`}
            >
              <span className="text-base sm:text-lg flex-shrink-0">
                {React.createElement(section.icon, { className: "w-5 h-5" })}
              </span>
              <span className="font-semibold truncate">{section.label}</span>
              {activeSection === section.id && (
                <div
                  className={`absolute bottom-0 left-0 right-0 h-1 rounded-t-full ${
                    darkMode ? "bg-green-300" : "bg-green-600"
                  }`}
                ></div>
              )}
            </button>
          ))}
        </div>

        {/* Dropdown Content */}
        <div
          className={`border-t transition-all duration-300 ${
            darkMode ? "border-stone-700" : "border-orange-200"
          }`}
        >
          <div className="py-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {sections
                .find((s) => s.id === activeSection)
                ?.items.map((item, index) => (
                  <div key={index}>
                    {item.path ? (
                      <Link
                        to={item.path}
                        className={`flex items-center space-x-3 sm:space-x-4 p-4 sm:p-5 rounded-xl transition-all duration-200 hover:shadow-lg ${
                          darkMode
                            ? "hover:bg-stone-800 text-stone-300 hover:text-green-300 border border-transparent hover:border-stone-600"
                            : "hover:bg-white text-gray-700 hover:text-green-700 border border-transparent hover:border-orange-200 shadow-sm"
                        }`}
                      >
                        <span className="text-lg sm:text-xl flex-shrink-0">
                          {React.createElement(item.icon, {
                            className: "w-5 h-5",
                          })}
                        </span>
                        <span className="font-medium truncate text-sm sm:text-base">
                          {item.label}
                        </span>
                      </Link>
                    ) : (
                      <button
                        onClick={() =>
                          "action" in item &&
                          typeof item.action === "string" &&
                          handleAction(item.action)
                        }
                        className={`flex items-center space-x-3 sm:space-x-4 p-4 sm:p-5 rounded-xl transition-all duration-200 w-full text-left hover:shadow-lg ${
                          darkMode
                            ? "hover:bg-stone-800 text-stone-300 hover:text-green-300 border border-transparent hover:border-stone-600"
                            : "hover:bg-white text-gray-700 hover:text-green-700 border border-transparent hover:border-orange-200 shadow-sm"
                        }`}
                      >
                        <span className="text-lg sm:text-xl flex-shrink-0">
                          {React.createElement(item.icon, {
                            className: "w-5 h-5",
                          })}
                        </span>
                        <span className="font-medium truncate text-sm sm:text-base">
                          {item.label}
                        </span>
                      </button>
                    )}
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default FeatureNavbar;
