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
import { useAuth } from "../../contexts/useAuth";
import type { Review, User } from "../../global";
import {
  Star,
  ThumbsUp,
  MessageCircle,
  Share2,
  Heart,
  Flag,
} from "lucide-react";
import { renderStars, handleShareReview } from "../../utils/ratingHelpers";
import { formatDate } from "../../utils/dateUtils";

interface RecipeReviewsProps {
  recipeId: string;
  recipeName?: string;
  darkMode: boolean;
}

interface UserReview {
  rating: number;
  comment: string;
  difficulty: number;
  cookingTime: string;
  modifications: string;
  photos: unknown[];
}

const RecipeReviews = ({
  recipeId,
  recipeName: recipeNameProp,
  darkMode,
}: RecipeReviewsProps) => {
  const { currentUser } = useAuth() as { currentUser: User | null };
  const [reviews, setReviews] = useState<Review[]>([]);
  const [userReview, setUserReview] = useState<UserReview>({
    rating: 0,
    comment: "",
    difficulty: 3,
    cookingTime: "",
    modifications: "",
    photos: [],
  });
  const [showReviewForm, setShowReviewForm] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  // Load reviews from localStorage
  useEffect(() => {
    const savedReviews: Review[] = JSON.parse(
      localStorage.getItem(`reviews_${recipeId}`) || "[]",
    );
    setReviews(savedReviews);
  }, [recipeId]);

  const handleRatingChange = useCallback((rating: number) => {
    setUserReview((prev) => ({ ...prev, rating }));
  }, []);

  const handleSubmitReview = useCallback(async () => {
    if (!currentUser) {
      alert("Please log in to submit a review");
      return;
    }

    if (userReview.rating === 0) {
      alert("Please provide a rating");
      return;
    }

    setLoading(true);
    try {
      const newReview: Review = {
        id: Date.now().toString(),
        userName: currentUser.displayName || currentUser.email || "Anonymous",
        recipeId: recipeId,
        recipeName: recipeNameProp ?? "Recipe",
        rating: userReview.rating,
        comment: userReview.comment,
        difficulty: userReview.difficulty,
        cookingTime: userReview.cookingTime,
        modifications: userReview.modifications,
        likes: 0,
        helpful: 0,
        timestamp: new Date().toISOString(),
      };

      const updatedReviews = [...reviews, newReview];
      setReviews(updatedReviews);
      localStorage.setItem(
        `reviews_${recipeId}`,
        JSON.stringify(updatedReviews),
      );

      setUserReview({
        rating: 0,
        comment: "",
        difficulty: 3,
        cookingTime: "",
        modifications: "",
        photos: [],
      });
      setShowReviewForm(false);
    } catch (error) {
      console.error("Error submitting review:", error);
    } finally {
      setLoading(false);
    }
  }, [currentUser, userReview, reviews, recipeId]);

  const handleLikeReview = useCallback(
    (reviewId: string) => {
      if (!currentUser) {
        alert("Please log in to like reviews");
        return;
      }

      const updatedReviews = reviews.map((review) =>
        review.id === reviewId
          ? { ...review, likes: review.likes + 1 }
          : review,
      );
      setReviews(updatedReviews);
      localStorage.setItem(
        `reviews_${recipeId}`,
        JSON.stringify(updatedReviews),
      );
    },
    [currentUser, reviews, recipeId],
  );

  const handleMarkHelpful = useCallback(
    (reviewId: string) => {
      if (!currentUser) {
        alert("Please log in to mark reviews as helpful");
        return;
      }

      const updatedReviews = reviews.map((review) =>
        review.id === reviewId
          ? { ...review, helpful: review.helpful + 1 }
          : review,
      );
      setReviews(updatedReviews);
      localStorage.setItem(
        `reviews_${recipeId}`,
        JSON.stringify(updatedReviews),
      );
    },
    [currentUser, reviews, recipeId],
  );

  const averageRating =
    reviews.length > 0
      ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
      : 0;

  return (
    <div
      className={`recipe-reviews space-y-6 ${
        darkMode ? "text-stone-300" : "text-gray-800"
      }`}
    >
      {/* Reviews Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3
            className={`text-xl font-bold ${
              darkMode ? "text-white" : "text-gray-900"
            }`}
          >
            Reviews & Ratings
          </h3>
          <div className="flex items-center space-x-2 mt-1">
            <div className="flex">{renderStars(Math.round(averageRating))}</div>
            <span
              className={`text-sm ${
                darkMode ? "text-stone-400" : "text-gray-600"
              }`}
            >
              {averageRating.toFixed(1)} ({reviews.length} reviews)
            </span>
          </div>
        </div>

        <button
          onClick={() => setShowReviewForm(!showReviewForm)}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            darkMode
              ? "bg-orange-600 hover:bg-orange-700 text-white"
              : "bg-orange-500 hover:bg-orange-600 text-white"
          }`}
        >
          Write Review
        </button>
      </div>

      {/* Review Form */}
      {showReviewForm && (
        <div
          className={`p-6 rounded-lg border ${
            darkMode
              ? "bg-neutral-800 border-neutral-700"
              : "bg-orange-50 border-orange-200"
          }`}
        >
          <h4
            className={`font-semibold mb-4 ${
              darkMode ? "text-white" : "text-gray-900"
            }`}
          >
            Share Your Experience
          </h4>

          {/* Rating */}
          <div className="mb-4">
            <label
              className={`block text-sm font-medium mb-2 ${
                darkMode ? "text-stone-300" : "text-gray-700"
              }`}
            >
              Overall Rating
            </label>
            <div className="flex space-x-1">
              {Array.from({ length: 5 }, (_, i) => (
                <button
                  key={i}
                  onClick={() => handleRatingChange(i + 1)}
                  className="focus:outline-none"
                >
                  <Star
                    className={`w-6 h-6 ${
                      i < userReview.rating
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-gray-300 dark:text-stone-700 hover:text-yellow-300"
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Difficulty */}
          <div className="mb-4">
            <label
              className={`block text-sm font-medium mb-2 ${
                darkMode ? "text-stone-300" : "text-gray-700"
              }`}
            >
              Difficulty Level
            </label>
            <div className="flex space-x-2">
              {["Easy", "Medium", "Hard", "Expert"].map((level, index) => (
                <button
                  key={level}
                  onClick={() =>
                    setUserReview((prev) => ({
                      ...prev,
                      difficulty: index + 1,
                    }))
                  }
                  className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-200 ${
                    userReview.difficulty === index + 1
                      ? "bg-green-600 text-white"
                      : darkMode
                        ? "bg-neutral-700 text-stone-300"
                        : "bg-gray-200 text-gray-700"
                  }`}
                >
                  {level}
                </button>
              ))}
            </div>
          </div>

          {/* Cooking Time */}
          <div className="mb-4">
            <label
              htmlFor="cookingTime"
              className={`block text-sm font-medium mb-2 ${
                darkMode ? "text-stone-300" : "text-gray-700"
              }`}
            >
              Actual Cooking Time
            </label>
            <input
              type="text"
              id="cookingTime"
              value={userReview.cookingTime}
              onChange={(e) =>
                setUserReview((prev) => ({
                  ...prev,
                  cookingTime: e.target.value,
                }))
              }
              className={`w-full px-3 py-2 rounded-lg border transition-colors ${
                darkMode
                  ? "bg-neutral-700 border-neutral-600 placeholder-stone-400"
                  : "bg-white border-gray-300"
              }`}
            />
          </div>

          {/* Comment */}
          <div className="mb-4">
            <label
              className={`block text-sm font-medium mb-2 ${
                darkMode ? "text-stone-300" : "text-gray-700"
              }`}
            >
              Your Review
            </label>
            <textarea
              id="comment"
              value={userReview.comment}
              onChange={(e) =>
                setUserReview((prev) => ({
                  ...prev,
                  comment: e.target.value,
                }))
              }
              className={`w-full px-3 py-2 rounded-lg border transition-colors ${
                darkMode
                  ? "bg-neutral-700 border-neutral-600 placeholder-stone-400"
                  : "bg-white border-gray-300"
              }`}
            />
          </div>

          {/* Modifications */}
          <div className="mb-4">
            <label
              className={`block text-sm font-medium mb-2 ${
                darkMode ? "text-stone-300" : "text-gray-700"
              }`}
            >
              Modifications Made (Optional)
            </label>
            <input
              type="text"
              value={userReview.modifications}
              onChange={(e) =>
                setUserReview((prev) => ({
                  ...prev,
                  modifications: e.target.value,
                }))
              }
              placeholder="e.g., Used almond milk instead of regular milk"
              className={`w-full px-3 py-2 rounded border ${
                darkMode
                  ? "bg-neutral-700 border-neutral-600 text-white placeholder-stone-400"
                  : "bg-white border-gray-300 text-gray-900 placeholder-gray-500"
              }`}
            />
          </div>

          {/* Submit Button */}
          <div className="flex space-x-3">
            <button
              onClick={handleSubmitReview}
              disabled={loading}
              className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                loading
                  ? "bg-neutral-600 cursor-not-allowed"
                  : darkMode
                    ? "bg-orange-600 hover:bg-orange-700 text-white"
                    : "bg-orange-500 hover:bg-orange-600 text-white"
              }`}
            >
              {loading ? "Submitting..." : "Submit Review"}
            </button>
            <button
              onClick={() => setShowReviewForm(false)}
              className={`px-6 py-2 rounded-lg font-medium border transition-colors ${
                darkMode
                  ? "border-neutral-600 text-stone-300 hover:bg-neutral-700"
                  : "border-gray-300 text-gray-700 hover:bg-gray-50"
              }`}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Reviews List */}
      <div className="space-y-4">
        {reviews.length === 0 ? (
          <div
            className={`text-center py-8 ${
              darkMode ? "text-stone-400" : "text-gray-500"
            }`}
          >
            <MessageCircle className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>No reviews yet. Be the first to share your experience!</p>
          </div>
        ) : (
          reviews
            .sort(
              (a, b) =>
                new Date(b.timestamp).getTime() -
                new Date(a.timestamp).getTime(),
            )
            .map((review: Review) => (
              <div
                key={review.id}
                className={`p-4 rounded-lg border ${
                  darkMode
                    ? "bg-neutral-800 border-neutral-700"
                    : "bg-white border-gray-200"
                }`}
              >
                {/* Review Header */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full bg-orange-500 flex items-center justify-center">
                      <span className="text-white font-semibold">
                        {review.userName.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <p
                        className={`font-medium ${
                          darkMode ? "text-white" : "text-gray-900"
                        }`}
                      >
                        {review.userName}
                      </p>
                      <div className="flex items-center space-x-2">
                        <div className="flex">
                          {renderStars(review.rating, "w-3 h-3")}
                        </div>
                        <span
                          className={`text-xs ${
                            darkMode ? "text-stone-400" : "text-gray-500"
                          }`}
                        >
                          {formatDate(review.timestamp)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex space-x-2">
                    <button
                      onClick={() =>
                        handleShareReview({
                          ...review,
                          comment: review.comment || "",
                        })
                      }
                      className={`p-1 rounded hover:bg-gray-100 ${
                        darkMode ? "hover:bg-neutral-700" : "hover:bg-gray-100"
                      }`}
                    >
                      <Share2 className="w-4 h-4" />
                    </button>
                    <button
                      className={`p-1 rounded hover:bg-gray-100 ${
                        darkMode ? "hover:bg-neutral-700" : "hover:bg-gray-100"
                      }`}
                    >
                      <Flag className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Review Content */}
                {review.comment && (
                  <p
                    className={`mb-3 ${
                      darkMode ? "text-stone-300" : "text-gray-700"
                    }`}
                  >
                    <span>&quot;{review.comment}&quot;</span>
                  </p>
                )}

                {/* Review Details */}
                <div className="grid grid-cols-2 gap-4 mb-3 text-sm">
                  <div>
                    <span
                      className={`font-medium ${
                        darkMode ? "text-stone-400" : "text-gray-600"
                      }`}
                    >
                      Difficulty:{" "}
                    </span>
                    <span
                      className={darkMode ? "text-stone-300" : "text-gray-700"}
                    >
                      {
                        ["Easy", "Medium", "Hard", "Expert"][
                          (review.difficulty || 3) - 1
                        ]
                      }
                    </span>
                  </div>
                  {review.cookingTime && (
                    <div>
                      <span
                        className={`font-medium ${
                          darkMode ? "text-stone-400" : "text-gray-600"
                        }`}
                      >
                        Time:{" "}
                      </span>
                      <span
                        className={
                          darkMode ? "text-stone-300" : "text-gray-700"
                        }
                      >
                        {review.cookingTime}
                      </span>
                    </div>
                  )}
                </div>

                {review.modifications && (
                  <div className="mb-3">
                    <span
                      className={`text-sm font-medium ${
                        darkMode ? "text-stone-400" : "text-gray-600"
                      }`}
                    >
                      Modifications:{" "}
                    </span>
                    <span
                      className={`text-sm ${
                        darkMode ? "text-stone-300" : "text-gray-700"
                      }`}
                    >
                      {review.modifications}
                    </span>
                  </div>
                )}

                {/* Review Actions */}
                <div className="flex items-center space-x-4 pt-3 border-t border-gray-200 dark:border-neutral-700">
                  <button
                    onClick={() => handleLikeReview(review.id)}
                    className={`flex items-center space-x-1 text-sm transition-colors ${
                      darkMode
                        ? "text-stone-400 hover:text-stone-200"
                        : "text-gray-500 hover:text-gray-800"
                    }`}
                  >
                    <Heart className="w-4 h-4" />
                    <span>{review.likes}</span>
                  </button>
                  <button
                    onClick={() => handleMarkHelpful(review.id)}
                    className={`flex items-center space-x-1 text-sm transition-colors ${
                      darkMode
                        ? "text-stone-400 hover:text-stone-200"
                        : "text-gray-500 hover:text-gray-800"
                    }`}
                  >
                    <ThumbsUp className="w-4 h-4" />
                    <span>{review.helpful}</span>
                  </button>
                </div>
              </div>
            ))
        )}
      </div>
    </div>
  );
};

export default RecipeReviews;
