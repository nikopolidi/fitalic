/**
 * Index file for storage services
 */
import { storage, getItem, setItem, removeItem, clearAll, getAllKeys } from './mmkv';
import { useUserStore } from './userStore';
import { useNutritionStore } from './nutritionStore';
import { useProgressStore } from './progressStore';
import { useChatStore } from './chatStore';

export {
  // MMKV storage
  storage,
  getItem,
  setItem,
  removeItem,
  clearAll,
  getAllKeys,
  
  // Zustand stores
  useUserStore,
  useNutritionStore,
  useProgressStore,
  useChatStore
};
