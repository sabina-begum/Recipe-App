import { Link } from "react-router-dom";

interface ServicesSectionProps {
  darkMode: boolean;
}

export default function ServicesSection({ darkMode }: ServicesSectionProps) {
  return (
    <div
      className={`compact-card bg-gradient-to-br from-orange-50 to-amber-50 dark:from-neutral-900 dark:to-neutral-800 rounded-lg shadow-sm p-6 ${
        darkMode ? "" : ""
      }`}
    >
      <div className="flex flex-col sm:flex-row compact-grid-compact justify-center items-center h-full">
        <Link
          to="/meal-planning"
          className={`flex-1 compact-card-compact text-center hover:shadow-lg transition-all duration-200 ${
            darkMode
              ? "bg-stone-900 hover:bg-stone-800 hover:shadow-lg hover:shadow-black/20"
              : "bg-gradient-to-r from-orange-50 to-amber-50 hover:shadow-lg"
          }`}
        >
          <div className="text-orange-600 mb-1 flex items-center justify-center">
            <svg
              className="w-[29.5px] h-[29.5px] sm:w-[33.5px] sm:h-[33.5px] md:w-[33.5px] md:h-[33.5px] mx-auto"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
            </svg>
          </div>
          <span
            className={`font-semibold text-sm ${
              darkMode ? "text-green-300" : "text-green-900"
            }`}
          >
            Meal Planning
          </span>
        </Link>
        <Link
          to="/recipes"
          className={`flex-1 compact-card-compact text-center hover:shadow-lg transition-all duration-200 ${
            darkMode
              ? "bg-stone-900 hover:bg-stone-800 hover:shadow-lg hover:shadow-black/20"
              : "bg-gradient-to-r from-orange-50 to-amber-50 hover:shadow-lg"
          }`}
        >
          <div className="text-orange-600 mb-1 flex items-center justify-center">
            <svg
              className="w-[29.5px] h-[29.5px] sm:w-[33.5px] sm:h-[33.5px] md:w-[33.5px] md:h-[33.5px] mx-auto"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
            </svg>
          </div>
          <span
            className={`font-semibold text-sm ${
              darkMode ? "text-green-300" : "text-green-900"
            }`}
          >
            Recipes A–Z
          </span>
        </Link>
        <Link
          to="/nutrition-tracker"
          className={`flex-1 compact-card-compact text-center hover:shadow-lg transition-all duration-200 ${
            darkMode
              ? "bg-stone-900 hover:bg-stone-800 hover:shadow-lg hover:shadow-black/20"
              : "bg-gradient-to-r from-orange-50 to-amber-50 hover:shadow-lg"
          }`}
        >
          <div className="text-orange-600 mb-1 flex items-center justify-center">
            <svg
              className="w-[29.5px] h-[29.5px] sm:w-[33.5px] sm:h-[33.5px] md:w-[33.5px] md:h-[33.5px] mx-auto"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M9 2v1a1 1 0 001 1h8a1 1 0 001-1V2a1 1 0 00-1-1H10a1 1 0 00-1 1zM3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 8a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V8zM3 12a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1v-2z" />
            </svg>
          </div>
          <span
            className={`font-semibold text-sm ${
              darkMode ? "text-green-300" : "text-green-900"
            }`}
          >
            Nutrition Tracker
          </span>
        </Link>
        <Link
          to="/shopping-list"
          className={`flex-1 compact-card-compact text-center hover:shadow-lg transition-all duration-200 ${
            darkMode
              ? "bg-stone-900 hover:bg-stone-800 hover:shadow-lg hover:shadow-black/20"
              : "bg-gradient-to-r from-orange-50 to-amber-50 hover:shadow-lg"
          }`}
        >
          <div className="text-orange-600 mb-1 flex items-center justify-center">
            <svg
              className="w-[29.5px] h-[29.5px] sm:w-[33.5px] sm:h-[33.5px] md:w-[33.5px] md:h-[33.5px] mx-auto"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M16 6V4a2 2 0 00-2-2H6a2 2 0 00-2 2v2H2v2h1l1.6 9.2A2 2 0 006.6 19h6.8a2 2 0 001.98-1.8L18 8h1V6h-3zM6 4h8v2H6V4zm2 10a1 1 0 110-2 1 1 0 010 2zm4 0a1 1 0 110-2 1 1 0 010 2z" />
            </svg>
          </div>
          <span
            className={`font-semibold text-sm ${
              darkMode ? "text-green-300" : "text-green-900"
            }`}
          >
            Shopping List
          </span>
        </Link>
      </div>
    </div>
  );
}
