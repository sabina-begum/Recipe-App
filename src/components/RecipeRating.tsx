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
import {
  doc,
  setDoc,
  getDoc,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { db } from "../firebase/config";

interface RecipeRatingProps {
  recipeId: unknown;
  recipeName: unknown;
  darkMode: boolean;
}

interface Review {
  id: string;
  userId: string;
  userName: string;
  recipeId: string;
  recipeName: string;
  rating: number;
  review: string;
  timestamp: number;
}

interface UserRating {
  rating: number;
  review: string;
}

const RecipeRating = ({
  recipeId,
  recipeName,
  darkMode,
}: RecipeRatingProps) => {
  const { currentUser, isDemoUser } = useAuth();
  const ratingsKey = `ratings_recipe_${recipeId}`;
  const [rating, setRating] = useState<number>(0);
  const [review, setReview] = useState<string>("");
  const [userRating, setUserRating] = useState<UserRating | null>(null);
  const [allReviews, setAllReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [submitted, setSubmitted] = useState<boolean>(false);

  const loadUserRating = useCallback(async () => {
    if (!currentUser) return;
    try {
      if (isDemoUser) {
        const raw = localStorage.getItem(ratingsKey);
        if (raw) {
          const list = JSON.parse(raw) as Review[];
          const mine = list.find((r) => r.userId === currentUser.uid);
          if (mine) {
            setUserRating({ rating: mine.rating, review: mine.review || "" });
            setRating(mine.rating);
            setReview(mine.review || "");
            setSubmitted(true);
          }
        }
        return;
      }
      const ratingDoc = await getDoc(
        doc(db, "ratings", `${currentUser.uid}_${recipeId}`),
      );
      if (ratingDoc.exists()) {
        const data = ratingDoc.data();
        setUserRating(data as UserRating);
        setRating(data.rating);
        setReview(data.review || "");
        setSubmitted(true);
      }
    } catch (error) {
      console.error("Error loading user rating:", error);
    }
  }, [currentUser, isDemoUser, recipeId, ratingsKey]);

  const loadAllReviews = useCallback(async () => {
    try {
      if (isDemoUser) {
        const raw = localStorage.getItem(ratingsKey);
        const list = raw ? (JSON.parse(raw) as Review[]) : [];
        setAllReviews(list.sort((a, b) => b.timestamp - a.timestamp));
        return;
      }
      const reviewsQuery = query(
        collection(db, "ratings"),
        where("recipeId", "==", recipeId),
      );
      const querySnapshot = await getDocs(reviewsQuery);
      const reviews: Review[] = [];
      querySnapshot.forEach((d) => {
        const data = d.data() as Review;
        reviews.push({ ...data, id: d.id });
      });
      setAllReviews(reviews.sort((a, b) => b.timestamp - a.timestamp));
    } catch (error) {
      console.error("Error loading reviews:", error);
    }
  }, [recipeId, isDemoUser, ratingsKey]);

  useEffect(() => {
    if (currentUser && recipeId) {
      loadUserRating();
      loadAllReviews();
    }
  }, [currentUser, recipeId, loadUserRating, loadAllReviews]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!currentUser || rating === 0) return;

    setLoading(true);
    try {
      const ratingData: Review = {
        id: `${currentUser.uid}_${recipeId}`,
        userId: currentUser.uid,
        userName: currentUser.displayName || "Anonymous",
        recipeId: recipeId as string,
        recipeName: recipeName as string,
        rating,
        review,
        timestamp: Date.now(),
      };

      if (isDemoUser) {
        const raw = localStorage.getItem(ratingsKey);
        const list = raw ? (JSON.parse(raw) as Review[]) : [];
        const rest = list.filter((r) => r.userId !== currentUser.uid);
        localStorage.setItem(
          ratingsKey,
          JSON.stringify(
            [...rest, ratingData].sort((a, b) => b.timestamp - a.timestamp),
          ),
        );
      } else {
        await setDoc(
          doc(db, "ratings", `${currentUser.uid}_${recipeId}`),
          ratingData,
        );
      }
      setSubmitted(true);
      loadAllReviews();
    } catch (error) {
      console.error("Error submitting rating:", error);
    } finally {
      setLoading(false);
    }
  };

  const averageRating =
    allReviews.length > 0
      ? allReviews.reduce((sum, review) => sum + review.rating, 0) /
        allReviews.length
      : 0;

  if (!currentUser) {
    return (
      <div
        className={`text-center py-4 ${
          darkMode ? "text-gray-300" : "text-gray-600"
        }`}
      >
        Please log in to rate and review recipes.
      </div>
    );
  }

  return (
    <div
      className={`space-y-6 ${darkMode ? "text-gray-100" : "text-gray-800"}`}
    >
      {/* Average Rating Display */}
      <div
        className={`rounded-lg p-4 ${
          darkMode
            ? "bg-gray-800 border border-gray-700"
            : "bg-gray-50 border border-gray-200"
        }`}
      >
        <h3 className="text-lg font-semibold mb-2">Overall Rating</h3>
        <div className="flex items-center space-x-2 mb-2">
          <div className="flex">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                className={`text-2xl ${
                  star <= averageRating ? "text-yellow-400" : "text-gray-300"
                }`}
              >
                ★
              </button>
            ))}
          </div>
          <span className="text-lg font-medium">
            {averageRating.toFixed(1)} ({allReviews.length} reviews)
          </span>
        </div>
      </div>

      {/* Rating Form */}
      {!submitted && (
        <div
          className={`rounded-lg p-4 ${
            darkMode
              ? "bg-gray-800 border border-gray-700"
              : "bg-gray-50 border border-gray-200"
          }`}
        >
          <h3 className="text-lg font-semibold mb-4">Rate this Recipe</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Your Rating
              </label>
              <div className="flex space-x-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className={`text-3xl transition-colors ${
                      star <= rating ? "text-yellow-400" : "text-gray-300"
                    } hover:text-yellow-400`}
                  >
                    ★
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Your Review (Optional)
              </label>
              <textarea
                value={review}
                onChange={(e) => setReview(e.target.value)}
                rows={3}
                className={`w-full px-3 py-2 rounded-lg border ${
                  darkMode
                    ? "bg-gray-700 border-gray-600 text-gray-100"
                    : "bg-white border-gray-300 text-gray-800"
                }`}
                placeholder="Share your thoughts about this recipe..."
              />
            </div>

            <button
              type="submit"
              disabled={loading || rating === 0}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                loading || rating === 0
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:scale-105"
              } bg-gradient-to-r from-orange-500 to-amber-500 text-white`}
            >
              {loading ? "Submitting..." : "Submit Rating"}
            </button>
          </form>
        </div>
      )}

      {/* User's Submitted Rating */}
      {submitted && userRating && (
        <div
          className={`rounded-lg p-4 ${
            darkMode
              ? "bg-green-900 border border-green-700"
              : "bg-green-50 border border-green-200"
          }`}
        >
          <h3 className="text-lg font-semibold mb-2 text-green-800">
            Your Rating
          </h3>
          <div className="flex items-center space-x-2 mb-2">
            <div className="flex">
              {[1, 2, 3, 4, 5].map((star) => (
                <span
                  key={star}
                  className={`text-2xl ${
                    star <= userRating.rating
                      ? "text-yellow-400"
                      : "text-gray-300"
                  }`}
                >
                  ★
                </span>
              ))}
            </div>
            <span className="text-lg font-medium">{userRating.rating}/5</span>
          </div>
          {userRating.review && (
            <p className="text-sm italic">&quot;{userRating.review}&quot;</p>
          )}
        </div>
      )}

      {/* All Reviews */}
      {allReviews.length > 0 && (
        <div
          className={`rounded-lg p-4 ${
            darkMode
              ? "bg-gray-800 border border-gray-700"
              : "bg-gray-50 border border-gray-200"
          }`}
        >
          <h3 className="text-lg font-semibold mb-4">All Reviews</h3>
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {allReviews.map((review) => (
              <div
                key={review.id}
                className={`p-3 rounded-lg ${
                  darkMode ? "bg-gray-700" : "bg-white"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium">{review.userName}</span>
                  <div className="flex items-center space-x-1">
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <span
                          key={star}
                          className={`text-sm ${
                            star <= review.rating
                              ? "text-yellow-400"
                              : "text-gray-300"
                          }`}
                        >
                          ★
                        </span>
                      ))}
                    </div>
                    <span className="text-sm text-gray-500">
                      {review.rating}/5
                    </span>
                  </div>
                </div>
                {review.review && <p className="text-sm">{review.review}</p>}
                <p className="text-xs text-gray-500 mt-2">
                  {new Date(review.timestamp).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default RecipeRating;
