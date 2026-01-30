/**
 * Helpers to push real notifications to localStorage (read by SmartNotifications).
 */

export interface NotificationPayload {
  type: string;
  title: string;
  message: string;
  priority?: "high" | "medium" | "low";
}

function getStorageKey(uid: string): string {
  return `notifications_${uid}`;
}

interface StoredNotification {
  id: number;
  type: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
  priority: string;
}

export function addNotification(
  userId: string,
  payload: NotificationPayload,
): void {
  try {
    const key = getStorageKey(userId);
    const raw = localStorage.getItem(key) || "[]";
    const list: StoredNotification[] = JSON.parse(raw);
    const id = list.length > 0 ? Math.max(...list.map((n) => n.id)) + 1 : 1;
    const time = new Date().toLocaleString(undefined, {
      dateStyle: "short",
      timeStyle: "short",
    });
    list.unshift({
      id,
      time,
      read: false,
      priority: payload.priority || "low",
      type: payload.type,
      title: payload.title,
      message: payload.message,
    });
    // Keep last 50 only
    const trimmed = list.slice(0, 50);
    localStorage.setItem(key, JSON.stringify(trimmed));
  } catch (error) {
    console.error("Error adding notification:", error);
  }
}
