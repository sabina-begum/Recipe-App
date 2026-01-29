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
import React, { useState, useCallback, useEffect } from "react";
import { useAuth } from "../contexts/useAuth";
import { addNotification } from "../utils/notificationUtils";
import CollectionCard from "./RecipeCollections/CollectionCard";
import CollectionDetails from "./RecipeCollections/CollectionDetails";
import CreateCollectionModal from "./RecipeCollections/CreateCollectionModal";
import AddRecipeModal from "./RecipeCollections/AddRecipeModal";
import EmptyState from "./RecipeCollections/EmptyState";

// Types
export interface Recipe {
  id: string;
  name: string;
  category: string;
  [key: string]: unknown;
}

export interface Collection {
  id: string;
  name: string;
  description: string;
  category: string;
  recipeCount: number;
  recipes: Recipe[];
  lastUpdated: number;
  [key: string]: unknown;
}

export interface NewCollection {
  name: string;
  description: string;
  category: string;
  isPublic: boolean;
  coverImage: string;
}

interface RecipeCollectionsProps {
  darkMode: boolean;
}

const RecipeCollections: React.FC<RecipeCollectionsProps> = ({ darkMode }) => {
  const { currentUser, isDemoUser } = useAuth();
  const [collections, setCollections] = useState<Collection[]>([]);
  const [selectedCollection, setSelectedCollection] =
    useState<Collection | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showAddRecipeModal, setShowAddRecipeModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [newCollection, setNewCollection] = useState<NewCollection>({
    name: "",
    description: "",
    category: "",
    isPublic: false,
    coverImage: "",
  });
  const [availableRecipes, setAvailableRecipes] = useState<Recipe[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  const collectionCategories: string[] = [
    "Weeknight Dinners",
    "Weekend Brunch",
    "Holiday Meals",
    "Quick & Easy",
    "Healthy Eating",
    "Comfort Food",
    "Party Appetizers",
    "Desserts",
    "Meal Prep",
    "Family Favorites",
    "Date Night",
    "Budget-Friendly",
  ];

  const loadAvailableRecipes = useCallback(async () => {
    try {
      if (isDemoUser) {
        // Load demo favorites
        const demoFavorites =
          (currentUser?.demoData as { favorites?: unknown[] })?.favorites || [];
        setAvailableRecipes(
          demoFavorites.map(
            (fav: unknown) =>
              ({
                ...(fav as Record<string, unknown>),
                id: (fav as Record<string, unknown>).id as string,
                name:
                  ((fav as Record<string, unknown>).name as string) ||
                  "Unknown Recipe",
                category:
                  ((fav as Record<string, unknown>).category as string) ||
                  "Other",
                source: "favorite",
              }) as Recipe,
          ),
        );
      } else if (currentUser) {
        // Load user favorites from localStorage
        const userFavorites = JSON.parse(
          localStorage.getItem(`favorites_${currentUser.uid}`) || "[]",
        );
        setAvailableRecipes(
          userFavorites.map((fav: unknown) => ({
            ...(fav as Record<string, unknown>),
            id: (fav as Record<string, unknown>).recipeId,
            source: "favorite",
          })),
        );
      } else {
        // Show sample recipes for non-logged in users
        setAvailableRecipes([
          {
            id: "1",
            name: "Spaghetti Carbonara",
            category: "Italian",
            source: "sample",
          },
          {
            id: "2",
            name: "Chicken Stir Fry",
            category: "Asian",
            source: "sample",
          },
          {
            id: "3",
            name: "Taco Tuesday",
            category: "Mexican",
            source: "sample",
          },
        ]);
      }
    } catch (error) {
      console.error("Error loading available recipes:", error);
    }
  }, [currentUser, isDemoUser]);

  const loadCollections = useCallback(() => {
    setLoading(true);
    try {
      if (isDemoUser && currentUser) {
        const demoUserData = JSON.parse(
          localStorage.getItem("demoUser") || "{}",
        );
        const saved =
          (demoUserData.demoData as { collections?: Collection[] })
            ?.collections || [];
        setCollections(Array.isArray(saved) ? saved : []);
      } else if (currentUser) {
        const saved = JSON.parse(
          localStorage.getItem(`collections_${currentUser.uid}`) || "[]",
        ) as Collection[];
        setCollections(Array.isArray(saved) ? saved : []);
      } else {
        setCollections([]);
      }
    } catch (error) {
      console.error("Error loading collections:", error);
      setCollections([]);
    } finally {
      setLoading(false);
    }
  }, [currentUser, isDemoUser]);

  useEffect(() => {
    if (currentUser || isDemoUser) {
      loadAvailableRecipes();
    }
  }, [currentUser, isDemoUser, loadAvailableRecipes]);

  useEffect(() => {
    loadCollections();
  }, [loadCollections]);

  const createCollection = async () => {
    if (!newCollection.name.trim()) return;

    try {
      const collectionData = {
        ...newCollection,
        userId: currentUser?.uid || "demo",
        userName: currentUser?.displayName || "Demo User",
        recipes: [],
        recipeCount: 0,
        createdAt: Date.now(),
        lastUpdated: Date.now(),
      };

      const newCollectionWithId = {
        id: `collection-${Date.now()}`,
        ...collectionData,
      };

      if (isDemoUser) {
        // Save to demo user data
        const updatedDemoUser = {
          ...currentUser,
          demoData: {
            ...(currentUser?.demoData as Record<string, unknown>),
            collections: [...collections, newCollectionWithId],
          },
        };
        localStorage.setItem("demoUser", JSON.stringify(updatedDemoUser));
      } else if (currentUser) {
        // Save to localStorage
        const userCollections = JSON.parse(
          localStorage.getItem(`collections_${currentUser.uid}`) || "[]",
        );
        localStorage.setItem(
          `collections_${currentUser.uid}`,
          JSON.stringify([...userCollections, newCollectionWithId]),
        );
      }

      setCollections((prev) => [newCollectionWithId, ...prev]);
      const uid = currentUser?.uid;
      if (uid) {
        addNotification(uid, {
          type: "recipe_suggestion",
          title: "Collection created",
          message: `"${newCollectionWithId.name}" was created. Add recipes to get started!`,
          priority: "low",
        });
      }
      setNewCollection({
        name: "",
        description: "",
        category: "",
        isPublic: false,
        coverImage: "",
      });
      setShowCreateModal(false);
    } catch (error) {
      console.error("Error creating collection:", error);
    }
  };

  const addRecipeToCollection = async (recipe: Recipe) => {
    if (!selectedCollection) return;

    try {
      const updatedRecipes = [...selectedCollection.recipes, recipe];
      const updatedCollection = {
        ...selectedCollection,
        recipes: updatedRecipes,
        recipeCount: updatedRecipes.length,
        lastUpdated: Date.now(),
      };

      if (isDemoUser) {
        const updatedDemoUser = {
          ...currentUser,
          demoData: {
            ...(currentUser?.demoData as Record<string, unknown>),
            collections: collections.map((c) =>
              c.id === selectedCollection.id ? updatedCollection : c,
            ),
          },
        };
        localStorage.setItem("demoUser", JSON.stringify(updatedDemoUser));
      } else if (currentUser) {
        const userCollections = JSON.parse(
          localStorage.getItem(`collections_${currentUser.uid}`) || "[]",
        );
        localStorage.setItem(
          `collections_${currentUser.uid}`,
          JSON.stringify(
            userCollections.map((c: Collection) =>
              c.id === selectedCollection.id ? updatedCollection : c,
            ),
          ),
        );
      }
      setSelectedCollection(updatedCollection);
      setCollections((prev) =>
        prev.map((c) =>
          c.id === selectedCollection.id ? updatedCollection : c,
        ),
      );
      setShowAddRecipeModal(false);
    } catch (error) {
      console.error("Error adding recipe to collection:", error);
    }
  };

  const removeRecipeFromCollection = async (recipeId: string) => {
    if (!selectedCollection) return;

    try {
      const updatedRecipes = selectedCollection.recipes.filter(
        (r) => r.id !== recipeId,
      );
      const updatedCollection = {
        ...selectedCollection,
        recipes: updatedRecipes,
        recipeCount: updatedRecipes.length,
        lastUpdated: Date.now(),
      };

      if (isDemoUser) {
        const updatedDemoUser = {
          ...currentUser,
          demoData: {
            ...(currentUser?.demoData as Record<string, unknown>),
            collections: collections.map((c) =>
              c.id === selectedCollection.id ? updatedCollection : c,
            ),
          },
        };
        localStorage.setItem("demoUser", JSON.stringify(updatedDemoUser));
      } else if (currentUser) {
        const userCollections = JSON.parse(
          localStorage.getItem(`collections_${currentUser.uid}`) || "[]",
        );
        localStorage.setItem(
          `collections_${currentUser.uid}`,
          JSON.stringify(
            userCollections.map((c: Collection) =>
              c.id === selectedCollection.id ? updatedCollection : c,
            ),
          ),
        );
      }
      setSelectedCollection(updatedCollection);
      setCollections((prev) =>
        prev.map((c) =>
          c.id === selectedCollection.id ? updatedCollection : c,
        ),
      );
    } catch (error) {
      console.error("Error removing recipe from collection:", error);
    }
  };

  const deleteCollection = async (collectionId: string) => {
    if (!window.confirm("Are you sure you want to delete this collection?"))
      return;

    try {
      const updatedCollections = collections.filter(
        (c) => c.id !== collectionId,
      );
      if (isDemoUser) {
        const updatedDemoUser = {
          ...currentUser,
          demoData: {
            ...(currentUser?.demoData as Record<string, unknown>),
            collections: updatedCollections,
          },
        };
        localStorage.setItem("demoUser", JSON.stringify(updatedDemoUser));
      } else if (currentUser) {
        localStorage.setItem(
          `collections_${currentUser.uid}`,
          JSON.stringify(updatedCollections),
        );
      }
      setCollections(updatedCollections);
      setSelectedCollection(null);
    } catch (error) {
      console.error("Error deleting collection:", error);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
        <p className={`mt-2 ${darkMode ? "text-stone-300" : "text-gray-600"}`}>
          Loading collections...
        </p>
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen flex items-center justify-center relative overflow-hidden ${
        darkMode ? "text-stone-300" : "text-gray-900"
      }`}
    >
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-8 lg:px-16 w-full pt-4 pb-6">
        <div
          className={`rounded-2xl shadow-2xl border-2 p-6 sm:p-8 lg:p-12 relative overflow-hidden ${
            darkMode ? "border-stone-700" : "border-stone-200"
          }`}
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='100%25' height='100%25' xmlns='http://www.w3.org/2000/svg'%3E%3Cdefs%3E%3ClinearGradient id='bg-gradient' x1='0%25' y1='0%25' x2='100%25' y2='100%25'%3E%3Cstop offset='0%25' style='stop-color:%23fef3c7;stop-opacity:0.4' /%3E%3Cstop offset='50%25' style='stop-color:%23fed7aa;stop-opacity:0.3' /%3E%3Cstop offset='100%25' style='stop-color:%23fdba74;stop-opacity:0.4' /%3E%3C/linearGradient%3E%3Cfilter id='glow'%3E%3CfeGaussianBlur stdDeviation='3' result='coloredBlur'/%3E%3CfeMerge%3E%3CfeMergeNode in='coloredBlur'/%3E%3CfeMergeNode in='SourceGraphic'/%3E%3C/feMerge%3E%3C/filter%3E%3C/defs%3E%3Crect width='100%25' height='100%25' fill='url(%23bg-gradient)'/%3E%3Cg opacity='0.2'%3E%3C!-- Recipe cards --%3E%3Cg transform='translate(80,60)' filter='url(%23glow)'%3E%3Crect x='0' y='0' width='60' height='40' rx='8' fill='none' stroke='%23f59e0b' stroke-width='2'/%3E%3Crect x='5' y='5' width='50' height='8' rx='2' fill='%23f59e0b' opacity='0.3'/%3E%3Crect x='5' y='18' width='30' height='4' rx='1' fill='%23f59e0b' opacity='0.2'/%3E%3Crect x='5' y='26' width='25' height='4' rx='1' fill='%23f59e0b' opacity='0.2'/%3E%3Crect x='5' y='34' width='20' height='4' rx='1' fill='%23f59e0b' opacity='0.2'/%3E%3C/g%3E%3Cg transform='translate(350,100)' filter='url(%23glow)'%3E%3Crect x='0' y='0' width='50' height='35' rx='6' fill='none' stroke='%23ea580c' stroke-width='2'/%3E%3Crect x='4' y='4' width='42' height='6' rx='2' fill='%23ea580c' opacity='0.3'/%3E%3Crect x='4' y='15' width='25' height='3' rx='1' fill='%23ea580c' opacity='0.2'/%3E%3Crect x='4' y='22' width='20' height='3' rx='1' fill='%23ea580c' opacity='0.2'/%3E%3Crect x='4' y='29' width='15' height='3' rx='1' fill='%23ea580c' opacity='0.2'/%3E%3C/g%3E%3Cg transform='translate(600,70)' filter='url(%23glow)'%3E%3Crect x='0' y='0' width='55' height='38' rx='7' fill='none' stroke='%23d97706' stroke-width='2'/%3E%3Crect x='4' y='4' width='47' height='7' rx='2' fill='%23d97706' opacity='0.3'/%3E%3Crect x='4' y='16' width='28' height='4' rx='1' fill='%23d97706' opacity='0.2'/%3E%3Crect x='4' y='24' width='22' height='4' rx='1' fill='%23d97706' opacity='0.2'/%3E%3Crect x='4' y='32' width='18' height='4' rx='1' fill='%23d97706' opacity='0.2'/%3E%3C/g%3E%3Cg transform='translate(150,320)' filter='url(%23glow)'%3E%3Crect x='0' y='0' width='45' height='32' rx='5' fill='none' stroke='%23f59e0b' stroke-width='2'/%3E%3Crect x='3' y='3' width='39' height='5' rx='2' fill='%23f59e0b' opacity='0.3'/%3E%3Crect x='3' y='13' width='20' height='3' rx='1' fill='%23f59e0b' opacity='0.2'/%3E%3Crect x='3' y='19' width='16' height='3' rx='1' fill='%23f59e0b' opacity='0.2'/%3E%3Crect x='3' y='25' width='12' height='3' rx='1' fill='%23f59e0b' opacity='0.2'/%3E%3C/g%3E%3Cg transform='translate(450,380)' filter='url(%23glow)'%3E%3Crect x='0' y='0' width='58' height='42' rx='8' fill='none' stroke='%23ea580c' stroke-width='2'/%3E%3Crect x='5' y='5' width='48' height='8' rx='2' fill='%23ea580c' opacity='0.3'/%3E%3Crect x='5' y='18' width='32' height='4' rx='1' fill='%23ea580c' opacity='0.2'/%3E%3Crect x='5' y='26' width='26' height='4' rx='1' fill='%23ea580c' opacity='0.2'/%3E%3Crect x='5' y='34' width='22' height='4' rx='1' fill='%23ea580c' opacity='0.2'/%3E%3C/g%3E%3Cg transform='translate(750,300)' filter='url(%23glow)'%3E%3Crect x='0' y='0' width='48' height='36' rx='6' fill='none' stroke='%23d97706' stroke-width='2'/%3E%3Crect x='4' y='4' width='40' height='6' rx='2' fill='%23d97706' opacity='0.3'/%3E%3Crect x='4' y='15' width='26' height='4' rx='1' fill='%23d97706' opacity='0.2'/%3E%3Crect x='4' y='23' width='21' height='4' rx='1' fill='%23d97706' opacity='0.2'/%3E%3Crect x='4' y='31' width='17' height='3' rx='1' fill='%23d97706' opacity='0.2'/%3E%3C/g%3E%3C!-- Collection icons --%3E%3Cg opacity='0.3'%3E%3Ccircle cx='200' cy='200' r='8' fill='%23fbbf24'/%3E%3Ccircle cx='400' cy='150' r='6' fill='%23f97316'/%3E%3Ccircle cx='600' cy='250' r='10' fill='%23eab308'/%3E%3Ccircle cx='300' cy='400' r='7' fill='%23f59e0b'/%3E%3Ccircle cx='500' cy='450' r='5' fill='%23ea580c'/%3E%3Ccircle cx='700' cy='350' r='9' fill='%23d97706'/%3E%3C/g%3E%3C!-- Connection lines --%3E%3Cg stroke='%23fbbf24' stroke-width='1.5' opacity='0.15'%3E%3Cpath d='M80 60 L350 100'/%3E%3Cpath d='M350 100 L600 70'/%3E%3Cpath d='M600 70 L450 380'/%3E%3Cpath d='M150 320 L450 380'/%3E%3Cpath d='M450 380 L750 300'/%3E%3Cpath d='M80 60 L150 320'/%3E%3Cpath d='M350 100 L150 320'/%3E%3C/g%3E%3C!-- Data flow lines --%3E%3Cg stroke='%23f97316' stroke-width='1' opacity='0.1' stroke-dasharray='4,4'%3E%3Cpath d='M250 120 L400 180'/%3E%3Cpath d='M400 180 L650 150'/%3E%3Cpath d='M650 150 L500 350'/%3E%3Cpath d='M500 350 L250 450'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          {/* Dark overlay for better readability */}
          <div
            className={`absolute inset-0 ${
              darkMode ? "bg-black/70" : "bg-white/60"
            }`}
          ></div>
          <div className="relative z-10">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
              <div>
                <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-orange-500 to-amber-500 bg-clip-text text-transparent">
                  Recipe Collections
                </h2>
                {!currentUser && (
                  <p
                    className={`text-sm mt-1 ${
                      darkMode ? "text-stone-400" : "text-gray-600"
                    }`}
                  >
                    Sign in to create and save your collections
                  </p>
                )}
                {isDemoUser && (
                  <p
                    className={`text-sm mt-1 ${
                      darkMode ? "text-stone-400" : "text-gray-600"
                    }`}
                  >
                    🎮 Demo Mode - Your collections are saved locally
                  </p>
                )}
              </div>
              <button
                onClick={() => setShowCreateModal(true)}
                className="px-3 sm:px-4 py-2 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-lg text-sm sm:text-base font-medium hover:scale-105 transition-transform"
              >
                + Create Collection
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
              {/* Collections List */}
              <div className="lg:col-span-1">
                <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">
                  Your Collections
                </h3>
                <div className="space-y-3">
                  {collections.map((collection: Collection) => (
                    <CollectionCard
                      key={collection.id}
                      collection={collection}
                      isSelected={selectedCollection?.id === collection.id}
                      onSelect={setSelectedCollection}
                      onDelete={deleteCollection}
                      darkMode={darkMode}
                    />
                  ))}
                  {collections.length === 0 && (
                    <EmptyState
                      message="No collections yet. Create your first collection!"
                      darkMode={darkMode}
                    />
                  )}
                </div>
              </div>

              {/* Collection Details */}
              <div className="lg:col-span-2">
                <CollectionDetails
                  selectedCollection={selectedCollection}
                  onAddRecipe={() => setShowAddRecipeModal(true)}
                  onRemoveRecipe={removeRecipeFromCollection}
                  darkMode={darkMode}
                />
              </div>
            </div>

            {/* Modals */}
            <CreateCollectionModal
              showModal={showCreateModal}
              newCollection={newCollection}
              setNewCollection={setNewCollection}
              collectionCategories={collectionCategories}
              onCreate={createCollection}
              onClose={() => setShowCreateModal(false)}
              darkMode={darkMode}
            />

            <AddRecipeModal
              showModal={showAddRecipeModal}
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              availableRecipes={availableRecipes}
              onAddRecipe={addRecipeToCollection}
              onClose={() => setShowAddRecipeModal(false)}
              darkMode={darkMode}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecipeCollections;
