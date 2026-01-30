import React, { useState, useEffect, useCallback } from "react";
import { useAuth } from "../contexts/useAuth";
import { ingredientCategories } from "../data/ingredientCategories";

export interface InventoryItem {
  id: number;
  name: string;
  quantity: number;
  unit: string;
  category: string;
}

interface IngredientInventoryProps {
  darkMode: boolean;
}

const IngredientInventory: React.FC<IngredientInventoryProps> = ({
  darkMode,
}) => {
  const { currentUser } = useAuth();
  const storageKey = `ingredientInventory_${currentUser?.uid ?? "anonymous"}`;

  const [items, setItems] = useState<InventoryItem[]>([]);
  const [newItem, setNewItem] = useState({
    name: "",
    quantity: "",
    unit: "",
    category: ingredientCategories[0],
  });
  const [showAdd, setShowAdd] = useState(false);
  const [hasLoaded, setHasLoaded] = useState(false);

  // Load inventory from localStorage
  useEffect(() => {
    try {
      const raw = localStorage.getItem(storageKey);
      if (raw) {
        const parsed = JSON.parse(raw) as InventoryItem[];
        if (Array.isArray(parsed)) setItems(parsed);
      }
    } catch {
      // ignore invalid stored data
    }
    const t = window.setTimeout(() => setHasLoaded(true), 0);
    return () => clearTimeout(t);
  }, [storageKey]);

  // Persist inventory to localStorage when items change (after initial load)
  useEffect(() => {
    if (!hasLoaded) return;
    try {
      localStorage.setItem(storageKey, JSON.stringify(items));
    } catch {
      // ignore quota errors
    }
  }, [items, storageKey, hasLoaded]);

  const handleAdd = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      if (!newItem.name.trim() || !newItem.quantity.trim()) return;
      const added: InventoryItem = {
        ...newItem,
        id: Date.now(),
        quantity: Number(newItem.quantity),
      };
      setItems((prev) => [...prev, added]);
      setNewItem({
        name: "",
        quantity: "",
        unit: "",
        category: ingredientCategories[0],
      });
      setShowAdd(false);
    },
    [newItem],
  );

  const handleRemove = useCallback((id: number) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  }, []);

  return (
    <div
      className={`max-w-2xl mx-auto mt-10 p-6 rounded-xl shadow-lg border transition-colors duration-300 ${
        darkMode
          ? "bg-neutral-800 border-neutral-700 text-stone-300"
          : "bg-white border-gray-200 text-gray-900"
      }`}
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Ingredient Inventory</h2>
        <button
          onClick={() => setShowAdd((v) => !v)}
          className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
            darkMode
              ? "bg-green-700 hover:bg-green-800 text-white"
              : "bg-green-500 hover:bg-green-600 text-white"
          }`}
        >
          {showAdd ? "Cancel" : "Add Item"}
        </button>
      </div>
      {showAdd && (
        <form
          className="mb-6 grid grid-cols-1 sm:grid-cols-2 gap-4"
          onSubmit={handleAdd}
        >
          <input
            type="text"
            placeholder="Name"
            value={newItem.name}
            onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
            className="px-3 py-2 rounded border"
            required
          />
          <input
            type="number"
            placeholder="Quantity"
            value={newItem.quantity}
            onChange={(e) =>
              setNewItem({ ...newItem, quantity: e.target.value })
            }
            className="px-3 py-2 rounded border"
            required
          />
          <input
            type="text"
            placeholder="Unit (e.g. lbs, pcs)"
            value={newItem.unit}
            onChange={(e) => setNewItem({ ...newItem, unit: e.target.value })}
            className="px-3 py-2 rounded border"
          />
          <select
            value={newItem.category}
            onChange={(e) =>
              setNewItem({ ...newItem, category: e.target.value })
            }
            className="px-3 py-2 rounded border"
          >
            {ingredientCategories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
          <button
            type="submit"
            className="col-span-1 sm:col-span-2 mt-2 px-4 py-2 rounded-lg bg-green-600 text-white font-semibold hover:bg-green-700"
          >
            Add
          </button>
        </form>
      )}
      <ul className="divide-y divide-gray-300 dark:divide-neutral-700">
        {items.length === 0 ? (
          <li className="py-6 text-center text-stone-400">
            No items in inventory.
          </li>
        ) : (
          items.map((item) => (
            <li
              key={item.id}
              className="flex items-center justify-between py-3"
            >
              <div>
                <span className="font-semibold">{item.name}</span> —{" "}
                {item.quantity} {item.unit}{" "}
                <span className="text-sm text-gray-500 dark:text-stone-400">
                  [{item.category}]
                </span>
              </div>
              <button
                onClick={() => handleRemove(item.id)}
                className="ml-4 px-3 py-1 rounded bg-red-500 text-white hover:bg-red-600"
                title="Remove"
              >
                &times;
              </button>
            </li>
          ))
        )}
      </ul>
    </div>
  );
};

export default IngredientInventory;
