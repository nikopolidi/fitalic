/**
 * MMKV storage service for persisting data
 */
import { MMKV } from 'react-native-mmkv';

// Create the storage instance
export const storage = new MMKV({
  id: 'fitalic-storage',
  encryptionKey: 'fitalic-secure-key',
});

/**
 * Get a value from storage
 * @param key The key to get
 * @returns The value or undefined if not found
 */
export const getItem = <T>(key: string): T | undefined => {
  const value = storage.getString(key);
  if (value) {
    try {
      return JSON.parse(value) as T;
    } catch (e) {
      console.error('Error parsing stored value:', e);
      return undefined;
    }
  }
  return undefined;
};

/**
 * Set a value in storage
 * @param key The key to set
 * @param value The value to store
 */
export const setItem = <T>(key: string, value: T): void => {
  try {
    storage.set(key, JSON.stringify(value));
  } catch (e) {
    console.error('Error storing value:', e);
  }
};

/**
 * Remove a value from storage
 * @param key The key to remove
 */
export const removeItem = (key: string): void => {
  storage.delete(key);
};

/**
 * Clear all values from storage
 */
export const clearAll = (): void => {
  storage.clearAll();
};

/**
 * Get all keys in storage
 * @returns Array of keys
 */
export const getAllKeys = (): string[] => {
  return storage.getAllKeys();
};
