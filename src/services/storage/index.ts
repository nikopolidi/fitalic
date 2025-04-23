/**
 * Index file for storage services
 */
import { clearAll, getAllKeys, getItem, removeItem, setItem, storage } from '../../storage/mmkv';
import { useChatStore } from './chatStore';
import { useNutritionStore } from './nutritionStore';
import { useProgressStore } from './progressStore';
import { useUserStore } from './userStore';

export {
  clearAll,
  getAllKeys, getItem, removeItem, setItem,
  // MMKV storage
  storage, useChatStore, useNutritionStore,
  useProgressStore,
  // Zustand stores
  useUserStore
};

