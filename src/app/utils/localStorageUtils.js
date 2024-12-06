// utils/localStorageUtils.js

export const loadFromLocalStorage = (key, defaultValue = null) => {
  // Check if we are in the browser environment
  if (typeof window !== 'undefined') {
    try {
      const serializedState = localStorage.getItem(key);
      return serializedState ? JSON.parse(serializedState) : defaultValue;
    } catch (err) {
      console.error("Error loading from localStorage:", err);
      return defaultValue;
    }
  }
  return defaultValue; // Return default value if not in browser environment
};

export const saveToLocalStorage = (key, value) => {
  // Check if we are in the browser environment
  if (typeof window !== 'undefined') {
    try {
      const serializedState = JSON.stringify(value);
      localStorage.removeItem(key);
      localStorage.setItem(key, serializedState);
    } catch (err) {
      console.error("Error saving to localStorage:", err);
    }
  }
};

export const removeFromLocalStorage = (key) => {
  // Check if we are in the browser environment
  if (typeof window !== 'undefined') {
    try {
      localStorage.removeItem(key);
    } catch (err) {
      console.error("Error removing from localStorage:", err);
    }
  }
};
