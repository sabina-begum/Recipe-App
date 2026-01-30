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

import { useState, useEffect, useCallback } from "react";
import { useAuth } from "../contexts/useAuth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { db } from "../firebase/config";
import ProfileHeader from "./UserProfile/ProfileHeader";
import BasicInfoSection from "./UserProfile/BasicInfoSection";
import NutritionalGoalsSection from "./UserProfile/NutritionalGoalsSection";
import DietaryRestrictionsSection from "./UserProfile/DietaryRestrictionsSection";
import FavoriteCuisinesSection from "./UserProfile/FavoriteCuisinesSection";
import SaveButton from "./UserProfile/SaveButton";

interface UserProfileData {
  displayName: string;
  dailyCalories: number;
  proteinGoal: number;
  carbsGoal: number;
  fatGoal: number;
  dietaryRestrictions: string[];
  favoriteCuisines: string[];
}

interface UserProfileProps {
  darkMode: boolean;
}

const UserProfile = ({ darkMode }: UserProfileProps) => {
  const { currentUser, isDemoUser } = useAuth();
  const [profile, setProfile] = useState<UserProfileData>({
    displayName: "",
    dailyCalories: 0,
    proteinGoal: 0,
    carbsGoal: 0,
    fatGoal: 0,
    dietaryRestrictions: [],
    favoriteCuisines: [],
  });
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);

  const loadUserProfile = useCallback(async () => {
    if (!currentUser) return;
    try {
      if (isDemoUser) {
        const key = `user_${currentUser.uid}`;
        const stored = localStorage.getItem(key);
        if (stored) {
          const data = JSON.parse(stored) as Partial<UserProfileData>;
          setProfile((prev) => ({
            ...prev,
            displayName: data.displayName ?? currentUser.displayName ?? "",
            dailyCalories: data.dailyCalories ?? 0,
            proteinGoal: data.proteinGoal ?? 0,
            carbsGoal: data.carbsGoal ?? 0,
            fatGoal: data.fatGoal ?? 0,
            dietaryRestrictions: data.dietaryRestrictions ?? [],
            favoriteCuisines: data.favoriteCuisines ?? [],
          }));
          return;
        }
      }
      const userDoc = await getDoc(doc(db, "users", currentUser.uid));
      if (userDoc.exists()) {
        setProfile(userDoc.data() as UserProfileData);
      } else {
        setProfile((prev: typeof profile) => ({
          ...prev,
          displayName: currentUser.displayName || "",
        }));
      }
    } catch (error) {
      console.error("Error loading profile:", error);
    }
  }, [currentUser, isDemoUser]);

  useEffect(() => {
    if (currentUser) {
      loadUserProfile();
    }
  }, [currentUser, loadUserProfile]);

  const saveProfile = async () => {
    if (!currentUser) return;
    setLoading(true);
    try {
      if (isDemoUser) {
        const key = `user_${currentUser.uid}`;
        const existing = JSON.parse(localStorage.getItem(key) || "{}");
        localStorage.setItem(key, JSON.stringify({ ...existing, ...profile }));
      } else {
        await setDoc(doc(db, "users", currentUser.uid), profile);
      }
      setIsEditing(false);
    } catch (error) {
      console.error("Error saving profile:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-main text-main flex items-center justify-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-16 w-full text-center py-16">
          <h1
            className={`text-3xl font-bold mb-4 ${
              darkMode ? "text-green-300" : "text-gray-900"
            }`}
          >
            Please log in to view your profile.
          </h1>
          <p className={darkMode ? "text-stone-300" : "text-gray-600"}>
            Sign in to access your personalized profile and settings.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`pt-4 sm:pt-8 lg:pt-12 pb-4 sm:pb-8 lg:pb-12 ${
        darkMode ? "text-gray-100" : "text-gray-800"
      }`}
    >
      <div
        className={`rounded-xl shadow-lg border p-6 ${
          darkMode ? "bg-black border-gray-700" : "bg-white border-gray-200"
        }`}
      >
        <ProfileHeader
          isEditing={isEditing}
          onToggleEdit={() => setIsEditing(!isEditing)}
          darkMode={darkMode}
        />

        <div className="space-y-6">
          <BasicInfoSection
            profile={profile}
            setProfile={(updates) =>
              setProfile((prev) => ({ ...prev, ...updates }))
            }
            isEditing={isEditing}
            darkMode={darkMode}
          />

          <NutritionalGoalsSection
            profile={profile}
            setProfile={(updates) =>
              setProfile((prev) => ({ ...prev, ...updates }))
            }
            isEditing={isEditing}
            darkMode={darkMode}
          />

          <DietaryRestrictionsSection
            profile={profile}
            setProfile={(updates) =>
              setProfile((prev) => ({ ...prev, ...updates }))
            }
            isEditing={isEditing}
          />

          <FavoriteCuisinesSection
            profile={profile}
            setProfile={(updates) =>
              setProfile((prev) => ({ ...prev, ...updates }))
            }
            isEditing={isEditing}
          />

          <SaveButton
            isEditing={isEditing}
            loading={loading}
            onSave={saveProfile}
          />
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
