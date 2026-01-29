import React, { useState } from "react";
import { useAuth } from "../contexts/useAuth";

interface QuickAddModalProps {
  open: boolean;
  onClose: () => void;
  darkMode: boolean;
}

interface ShoppingItem {
  ingredient: string;
  quantity: string;
  unit: string;
  category: string;
  recipes: string[];
  checked: boolean;
  isCustom: boolean;
}

const QuickAddModal: React.FC<QuickAddModalProps> = ({
  open,
  onClose,
  darkMode,
}) => {
  const { currentUser } = useAuth();
  const [name, setName] = useState<string>("");

  if (!open) return null;

  const handleAdd = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!name.trim() || !currentUser) {
      setName("");
      onClose();
      return;
    }

    try {
      // Load existing shopping list from localStorage
      const storageKey = `shoppingList_${currentUser.uid}`;
      const existing = JSON.parse(
        localStorage.getItem(storageKey) || "[]",
      ) as ShoppingItem[];

      // Create new item
      const newItem: ShoppingItem = {
        ingredient: name.trim(),
        quantity: "1",
        unit: "",
        category: "Produce", // Default category
        recipes: ["Quick Add"],
        checked: false,
        isCustom: true,
      };

      // Add to list (avoid duplicates)
      const exists = existing.some(
        (item) =>
          item.ingredient.toLowerCase() === newItem.ingredient.toLowerCase(),
      );
      if (!exists) {
        const updated = [...existing, newItem];
        localStorage.setItem(storageKey, JSON.stringify(updated));
      }

      setName("");
      onClose();
    } catch (error) {
      console.error("Error adding item to shopping list:", error);
      setName("");
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div
        className={`max-w-sm w-full rounded-xl shadow-lg border p-6 relative transition-colors duration-300 ${
          darkMode
            ? "bg-neutral-900 border-neutral-700 text-stone-100"
            : "bg-white border-stone-200 text-stone-900"
        }`}
      >
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-stone-400 hover:text-orange-500 text-xl font-bold"
          aria-label="Close quick add"
        >
          ×
        </button>
        <h2 className="text-xl font-bold mb-4">Quick Add</h2>
        <form onSubmit={handleAdd}>
          <input
            type="text"
            placeholder="Recipe name..."
            value={name}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setName(e.target.value)
            }
            className={`w-full px-3 py-2 rounded border mb-4 ${
              darkMode
                ? "bg-neutral-800 border-neutral-600"
                : "bg-white border-gray-300"
            }`}
            required
          />
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className={`px-4 py-2 rounded font-medium transition-colors ${
                darkMode
                  ? "bg-neutral-700 hover:bg-neutral-600 text-stone-300"
                  : "bg-stone-200 hover:bg-stone-300 text-stone-900"
              }`}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded bg-green-600 hover:bg-green-700 text-white font-medium"
            >
              Add
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default QuickAddModal;
