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
import { countUniqueBy } from "../utils/arrayUtils";

// Add Notification type
interface Notification {
  id: number;
  type: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
  priority: string;
}

// Add AuthUser type for useAuth
interface AuthUser {
  currentUser: { uid: string } | null;
  isDemoUser: boolean;
}

const SmartNotifications = ({ darkMode }: { darkMode: boolean }) => {
  const { currentUser, isDemoUser } = useAuth() as AuthUser;
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [settings, setSettings] = useState<{ [key: string]: boolean }>({
    mealPrepReminders: true,
    cookingTimers: true,
    ingredientExpiry: true,
    recipeSuggestions: true,
    shoppingReminders: true,
    nutritionGoals: true,
  });
  const [showSettings, setShowSettings] = useState(false);

  

  const loadNotifications = useCallback(() => {
    if (!currentUser) return;
    try {
      const savedNotifications = JSON.parse(
        localStorage.getItem(`notifications_${currentUser.uid}`) || "[]",
      );
      setNotifications(savedNotifications);
    } catch (error) {
      console.error("Error loading notifications:", error);
      setNotifications([]);
    }
  }, [currentUser]);

  const loadSettings = useCallback(() => {
    if (!currentUser) return;
    try {
      if (isDemoUser) {
        // Use default settings for demo
        return;
      } else {
        const savedSettings = JSON.parse(
          localStorage.getItem(`notification_settings_${currentUser.uid}`) ||
            "{}",
        );
        setSettings({ ...settings, ...savedSettings });
      }
    } catch (error) {
      console.error("Error loading notification settings:", error);
    }
  }, [currentUser, isDemoUser, settings]);

  useEffect(() => {
    if (currentUser) {
      loadNotifications();
      loadSettings();
    }
  }, [currentUser, loadNotifications, loadSettings]);

  const saveSettings = (newSettings: { [key: string]: boolean }) => {
    if (!currentUser) return;
    try {
      if (isDemoUser) {
        // Demo mode - just update state
        setSettings(newSettings);
      } else {
        localStorage.setItem(
          `notification_settings_${currentUser.uid}`,
          JSON.stringify(newSettings),
        );
      }
    } catch (error) {
      console.error("Error saving notification settings:", error);
    }
  };

  const markAsRead = (notificationId: number) => {
    if (!currentUser) return;
    setNotifications((prev: Notification[]) =>
      prev.map((notification: Notification) =>
        notification.id === notificationId
          ? { ...notification, read: true }
          : notification,
      ),
    );

    if (!isDemoUser) {
      localStorage.setItem(
        `notifications_${currentUser.uid}`,
        JSON.stringify(notifications),
      );
    }
  };

  const deleteNotification = (notificationId: number) => {
    if (!currentUser) return;
    setNotifications((prev: Notification[]) =>
      prev.filter(
        (notification: Notification) => notification.id !== notificationId,
      ),
    );

    if (!isDemoUser) {
      localStorage.setItem(
        `notifications_${currentUser.uid}`,
        JSON.stringify(notifications),
      );
    }
  };

  const toggleSetting = (setting: string) => {
    const newSettings = {
      ...settings,
      [setting]: !settings[setting],
    };
    setSettings(newSettings);
    saveSettings(newSettings);
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "meal_prep":
        return "🍽️";
      case "cooking_timer":
        return "⏰";
      case "ingredient_expiry":
        return "⚠️";
      case "recipe_suggestion":
        return "💡";
      case "shopping_reminder":
        return "🛒";
      case "nutrition_goal":
        return "📊";
      default:
        return "🔔";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "border-red-500 bg-red-50 dark:bg-red-900";
      case "medium":
        return "border-yellow-500 bg-yellow-50 dark:bg-yellow-900";
      case "low":
        return "border-blue-500 bg-blue-50 dark:bg-blue-900";
      default:
        return "border-gray-300 bg-stone-50 dark:bg-black";
    }
  };

  const getPriorityTextColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "text-red-800 dark:text-red-200";
      case "medium":
        return "text-yellow-800 dark:text-yellow-200";
      case "low":
        return "text-blue-800 dark:text-blue-200";
      default:
        return "text-gray-800 dark:text-stone-200";
    }
  };

  const unreadCount = notifications.filter((n: Notification) => !n.read).length;

  if (!currentUser) {
    return (
      <div
        className={`text-center py-8 ${
          darkMode ? "text-gray-200" : "text-gray-600"
        }`}
      >
        Please log in to manage your notifications.
      </div>
    );
  }

  return (
    <div
      className={`space-y-4 p-4 sm:p-6 rounded-lg ${
        darkMode
          ? "bg-gradient-to-br from-pink-900 to-rose-900 border border-pink-700 text-gray-100"
          : "bg-gradient-to-br from-pink-50 to-rose-50 border border-pink-200 text-gray-800"
      }`}
    >
      <div
        className={`rounded-lg p-4 ${
          darkMode
            ? "bg-pink-800/50 border border-pink-600"
            : "bg-white/80 border border-pink-300"
        }`}
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold">Smart Notifications</h3>
          <div className="flex items-center space-x-3">
            {unreadCount > 0 && (
              <span className="px-2 py-1 bg-red-500 text-white text-xs rounded-full">
                {unreadCount}
              </span>
            )}
            <button
              onClick={() => setShowSettings(!showSettings)}
              className={`px-3 py-1 rounded-lg text-sm font-medium transition-all duration-200 ${
                darkMode
                  ? "bg-pink-600 hover:bg-pink-700 text-white"
                  : "bg-pink-500 hover:bg-pink-600 text-white"
              }`}
            >
              {showSettings ? "Hide Settings" : "Settings"}
            </button>
          </div>
        </div>

        {/* Notification Settings */}
        {showSettings && (
          <div
            className={`mb-6 p-4 rounded-lg ${
              darkMode ? "bg-pink-700/50" : "bg-pink-100"
            }`}
          >
            <h4 className="font-medium mb-3">Notification Preferences</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {Object.entries(settings).map(([key, value]) => (
                <label key={key} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={value}
                    onChange={() => toggleSetting(key)}
                    className="rounded"
                  />
                  <span className="text-sm">
                    {key
                      .replace(/([A-Z])/g, " $1")
                      .replace(/^./, (str) => str.toUpperCase())}
                  </span>
                </label>
              ))}
            </div>
          </div>
        )}

        {/* Notifications List */}
        <div className="space-y-3">
          {notifications.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No notifications yet. Notifications will appear here when you
              start using the app!
            </div>
          ) : (
            notifications.map((notification: Notification) => (
              <div
                key={notification.id}
                className={`p-4 rounded-lg border-l-4 transition-all duration-200 ${
                  notification.read ? "opacity-75" : "border-l-4"
                } ${getPriorityColor(notification.priority)}`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3 flex-1">
                    <span className="text-2xl">
                      {getNotificationIcon(notification.type)}
                    </span>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <h4
                          className={`font-medium ${getPriorityTextColor(
                            notification.priority,
                          )}`}
                        >
                          {notification.title}
                        </h4>
                        {!notification.read && (
                          <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                        )}
                      </div>
                      <p
                        className={`text-sm ${
                          darkMode ? "text-gray-200" : "text-gray-600"
                        }`}
                      >
                        {notification.message}
                      </p>
                      <span className="text-xs text-gray-500 mt-1">
                        {notification.time}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {!notification.read && (
                      <button
                        onClick={() => markAsRead(notification.id)}
                        className="text-xs text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                      >
                        Mark Read
                      </button>
                    )}
                    <button
                      onClick={() => deleteNotification(notification.id)}
                      className="text-xs text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Notification Summary */}
        {notifications.length > 0 && (
          <div className="mt-6 p-4 rounded-lg bg-pink-50 dark:bg-pink-900 border border-pink-200 dark:border-pink-700">
            <h4 className="font-medium mb-2 text-pink-800 dark:text-pink-200">
              Notification Summary:
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
              <div>
                <span className="font-medium">Total:</span>{" "}
                {notifications.length}
              </div>
              <div>
                <span className="font-medium">Unread:</span> {unreadCount}
              </div>
              <div>
                <span className="font-medium">High Priority:</span>{" "}
                {
                  notifications.filter(
                    (n: Notification) => n.priority === "high",
                  ).length
                }
              </div>
              <div>
                <span className="font-medium">Types:</span>{" "}
                {countUniqueBy(notifications, "type")}
              </div>
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <div className="mt-6 flex flex-wrap gap-2">
          <button
            onClick={() => {
              const updatedNotifications = notifications.map(
                (n: Notification) => ({
                  ...n,
                  read: true,
                }),
              );
              setNotifications(updatedNotifications);
              if (!isDemoUser) {
                localStorage.setItem(
                  `notifications_${currentUser.uid}`,
                  JSON.stringify(updatedNotifications),
                );
              }
            }}
            className={`px-3 py-1 rounded-lg text-sm font-medium ${
              darkMode
                ? "bg-pink-600 hover:bg-pink-700 text-white"
                : "bg-pink-500 hover:bg-pink-600 text-white"
            }`}
          >
            Mark All Read
          </button>
          <button
            onClick={() => {
              setNotifications([]);
              if (!isDemoUser) {
                localStorage.setItem(
                  `notifications_${currentUser.uid}`,
                  JSON.stringify([]),
                );
              }
            }}
            className="px-3 py-1 rounded-lg text-sm font-medium bg-gray-500 hover:bg-gray-600 text-white"
          >
            Clear All
          </button>
        </div>
      </div>
    </div>
  );
};

export default SmartNotifications;

