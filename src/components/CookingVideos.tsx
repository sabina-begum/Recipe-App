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
import { cookingVideoTutorials } from "../data/cookingVideoTutorials";
import type { CookingVideoData } from "../data/cookingVideoTutorials";

interface CookingVideosProps {
  recipe: unknown;
  darkMode: boolean;
}
interface Technique {
  name: string;
  keywords: string[];
  difficulty: string;
}

const CookingVideos: React.FC<CookingVideosProps> = ({ recipe, darkMode }) => {
  const [selectedTechnique, setSelectedTechnique] = useState<string | null>(
    null,
  );
  const [showVideoModal, setShowVideoModal] = useState<boolean>(false);

  // Extract cooking techniques from recipe instructions (API: strInstructions; featured: instructions or description)
  const extractCookingTechniques = (): Technique[] => {
    if (!recipe) return [];
    const r = recipe as {
      strInstructions?: string;
      instructions?: string;
      description?: string;
    };
    const raw = r.strInstructions ?? r.instructions ?? r.description ?? "";
    if (!raw || typeof raw !== "string") return [];

    const instructions = raw.toLowerCase();
    const techniques: Technique[] = [
      {
        name: "Sautéing",
        keywords: ["sauté", "sautéed", "sautéing"],
        difficulty: "Medium",
      },
      {
        name: "Braising",
        keywords: ["braise", "braised", "braising"],
        difficulty: "Hard",
      },
      {
        name: "Searing",
        keywords: ["sear", "seared", "searing"],
        difficulty: "Medium",
      },
      {
        name: "Deglazing",
        keywords: ["deglaze", "deglazed", "deglazing"],
        difficulty: "Medium",
      },
      {
        name: "Reducing",
        keywords: ["reduce", "reduced", "reducing"],
        difficulty: "Medium",
      },
      {
        name: "Emulsifying",
        keywords: ["emulsify", "emulsified", "emulsifying"],
        difficulty: "Hard",
      },
      {
        name: "Folding",
        keywords: ["fold", "folded", "folding"],
        difficulty: "Easy",
      },
      {
        name: "Kneading",
        keywords: ["knead", "kneaded", "kneading"],
        difficulty: "Medium",
      },
      {
        name: "Proofing",
        keywords: ["proof", "proofed", "proofing"],
        difficulty: "Medium",
      },
      {
        name: "Tempering",
        keywords: ["temper", "tempered", "tempering"],
        difficulty: "Hard",
      },
      {
        name: "Clarifying",
        keywords: ["clarify", "clarified", "clarifying"],
        difficulty: "Hard",
      },
      { name: "Confit", keywords: ["confit"], difficulty: "Hard" },
      {
        name: "Marinating",
        keywords: ["marinate", "marinated", "marinating"],
        difficulty: "Easy",
      },
      {
        name: "Roasting",
        keywords: ["roast", "roasted", "roasting"],
        difficulty: "Easy",
      },
      {
        name: "Grilling",
        keywords: ["grill", "grilled", "grilling"],
        difficulty: "Medium",
      },
      {
        name: "Poaching",
        keywords: ["poach", "poached", "poaching"],
        difficulty: "Medium",
      },
      {
        name: "Steaming",
        keywords: ["steam", "steamed", "steaming"],
        difficulty: "Easy",
      },
      {
        name: "Frying",
        keywords: ["fry", "fried", "frying"],
        difficulty: "Medium",
      },
      {
        name: "Baking",
        keywords: ["bake", "baked", "baking"],
        difficulty: "Easy",
      },
      {
        name: "Simmering",
        keywords: ["simmer", "simmered", "simmering"],
        difficulty: "Easy",
      },
      {
        name: "Boiling",
        keywords: ["boil", "boiled", "boiling"],
        difficulty: "Easy",
      },
    ];

    const foundTechniques = techniques.filter((technique: Technique) =>
      technique.keywords.some((keyword: string) =>
        instructions.includes(keyword),
      ),
    );

    return foundTechniques;
  };

  const cookingTechniques = extractCookingTechniques();

  // Curated real video data from src/data/cookingVideoTutorials
  const getVideoForTechnique = (
    techniqueName: string,
  ): CookingVideoData | null => cookingVideoTutorials[techniqueName] ?? null;

  const getDifficultyColor = (difficulty: string): string => {
    switch (difficulty) {
      case "Easy":
        return "text-green-500";
      case "Medium":
        return "text-yellow-500";
      case "Hard":
        return "text-red-500";
      default:
        return "text-gray-500";
    }
  };

  const getDifficultyBgColor = (difficulty: string): string => {
    switch (difficulty) {
      case "Easy":
        return "bg-green-100 dark:bg-green-900";
      case "Medium":
        return "bg-yellow-100 dark:bg-yellow-900";
      case "Hard":
        return "bg-red-100 dark:bg-red-900";
      default:
        return "bg-stone-100 dark:bg-black";
    }
  };

  if (cookingTechniques.length === 0) {
    return (
      <div
        className={`space-y-4 p-4 sm:p-6 rounded-lg ${
          darkMode
            ? "bg-gradient-to-br from-blue-900 to-cyan-900 border border-blue-700 text-gray-100"
            : "bg-gradient-to-br from-blue-50 to-cyan-50 border border-blue-200 text-gray-800"
        }`}
      >
        <div
          className={`rounded-lg p-4 ${
            darkMode
              ? "bg-blue-800/50 border border-blue-600"
              : "bg-white/80 border border-blue-300"
          }`}
        >
          <p className="text-gray-600 dark:text-stone-300">
            This recipe uses basic cooking techniques. No special video
            tutorials needed!
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div
        className={`space-y-4 p-4 sm:p-6 rounded-lg ${
          darkMode
            ? "bg-gradient-to-br from-blue-900 to-cyan-900 border border-blue-700 text-gray-100"
            : "bg-gradient-to-br from-blue-50 to-cyan-50 border border-blue-200 text-gray-800"
        }`}
      >
        <div
          className={`rounded-lg p-4 ${
            darkMode
              ? "bg-blue-800/50 border border-blue-600"
              : "bg-white/80 border border-blue-300"
          }`}
        >
          <h3 className="text-lg font-semibold mb-4">
            Cooking Techniques Used
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-4">
            {cookingTechniques.map((technique: Technique, index: number) => (
              <div
                key={index}
                className={`p-3 rounded-lg border cursor-pointer transition-all duration-200 hover:scale-105 ${
                  darkMode
                    ? "bg-blue-700/50 border-blue-500"
                    : "bg-blue-100 border-blue-300"
                }`}
                onClick={() => {
                  setSelectedTechnique(technique.name);
                  setShowVideoModal(true);
                }}
              >
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium">{technique.name}</h4>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyBgColor(
                      technique.difficulty,
                    )} ${getDifficultyColor(technique.difficulty)}`}
                  >
                    {technique.difficulty}
                  </span>
                </div>
                <div className="flex items-center text-sm text-gray-600 dark:text-stone-300">
                  <svg
                    className="w-4 h-4 mr-1"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    role="img"
                    aria-label="Play video tutorial"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Watch Tutorial
                </div>
              </div>
            ))}
          </div>

          <div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-900 border border-blue-200 dark:border-blue-700">
            <p className="text-sm text-blue-800 dark:text-blue-200">
              🎥 <strong>Tip:</strong> Click on any technique above to watch a
              professional tutorial and master the skills needed for this
              recipe!
            </p>
          </div>
        </div>
      </div>

      {/* Video Modal */}
      {showVideoModal &&
        selectedTechnique &&
        getVideoForTechnique(selectedTechnique) && (
          <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
            <div
              className={`relative max-w-4xl w-full rounded-lg overflow-hidden ${
                darkMode ? "bg-gray-900" : "bg-white"
              }`}
            >
              <button
                onClick={() => setShowVideoModal(false)}
                className={`absolute top-4 right-4 z-10 p-2 rounded-full ${
                  darkMode ? "bg-gray-800 text-white" : "bg-white text-gray-800"
                } hover:bg-gray-200 transition-colors`}
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  role="img"
                  aria-label="Close video modal"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>

              {(() => {
                const video = getVideoForTechnique(selectedTechnique)!;
                return (
                  <>
                    <div className="aspect-video">
                      <iframe
                        src={video.videoUrl}
                        title={video.title}
                        className="w-full h-full border-0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    </div>

                    <div className="p-6">
                      <h3 className="text-xl font-semibold mb-2">
                        {video.title}
                      </h3>
                      <p className="text-gray-600 dark:text-stone-300 mb-3">
                        {video.description}
                      </p>
                      <div className="flex items-center text-sm text-gray-500">
                        <svg
                          className="w-4 h-4 mr-1"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                          role="img"
                          aria-label="Video duration"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
                            clipRule="evenodd"
                          />
                        </svg>
                        Duration: {video.duration}
                      </div>
                    </div>
                  </>
                );
              })()}
            </div>
          </div>
        )}
    </>
  );
};

export default CookingVideos;
