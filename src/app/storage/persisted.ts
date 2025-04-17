import { MMKV } from 'react-native-mmkv';

/**
 * A persistent storage service using MMKV with AsyncStorage-like API
 */
class PersistedStorage {
  private storage: MMKV;

  constructor(id = 'app.storage') {
    this.storage = new MMKV({
      id,
    });
  }

  /**
   * Get an item from storage
   * @param key - The key to look up
   * @returns The value or null if not found
   */
  getItem(key: string): string | null {
    try {
      const value = this.storage.getString(key);
      return value || null;
    } catch (error) {
      console.error('PersistedStorage getItem error:', error);
      return null;
    }
  }

  /**
   * Store a string value
   * @param key - The key to store under
   * @param value - The string value to store
   */
  setItem(key: string, value: string): void {
    try {
      this.storage.set(key, value);
    } catch (error) {
      console.error('PersistedStorage setItem error:', error);
    }
  }

  /**
   * Remove an item from storage
   * @param key - The key to remove
   */
  removeItem(key: string): void {
    try {
      this.storage.delete(key);
    } catch (error) {
      console.error('PersistedStorage removeItem error:', error);
    }
  }

  /**
   * Clear all stored data
   */
  clear(): void {
    try {
      this.storage.clearAll();
    } catch (error) {
      console.error('PersistedStorage clear error:', error);
    }
  }

  /**
   * Get all keys in storage
   * @returns Array of keys
   */
  getAllKeys(): string[] {
    try {
      return this.storage.getAllKeys();
    } catch (error) {
      console.error('PersistedStorage getAllKeys error:', error);
      return [];
    }
  }

  /**
   * Check if a key exists in storage
   * @param key - The key to check
   * @returns Boolean indicating if key exists
   */
  hasKey(key: string): boolean {
    try {
      return this.storage.contains(key);
    } catch (error) {
      console.error('PersistedStorage hasKey error:', error);
      return false;
    }
  }

  /**
   * Store an object by serializing to JSON
   * @param key - The key to store under
   * @param value - The object to store
   */
  setObject<T>(key: string, value: T): void {
    try {
      const jsonValue = JSON.stringify(value);
      this.storage.set(key, jsonValue);
    } catch (error) {
      console.error('PersistedStorage setObject error:', error);
    }
  }

  /**
   * Get and parse a stored object
   * @param key - The key to look up
   * @returns The parsed object or null if not found or invalid
   */
  getObject<T>(key: string): T | null {
    try {
      const jsonValue = this.storage.getString(key);
      if (!jsonValue) return null;
      return JSON.parse(jsonValue) as T;
    } catch (error) {
      console.error('PersistedStorage getObject error:', error);
      return null;
    }
  }

  /**
   * Get the raw MMKV instance for direct access
   * @returns The MMKV instance
   */
  getInstance(): MMKV {
    return this.storage;
  }

  /**
   * For AsyncStorage API compatibility
   */
  async multiGet(keys: string[]): Promise<[string, string | null][]> {
    return keys.map(key => [key, this.getItem(key)]);
  }

  /**
   * For AsyncStorage API compatibility
   */
  async multiSet(keyValuePairs: [string, string][]): Promise<void> {
    keyValuePairs.forEach(([key, value]) => this.setItem(key, value));
  }

  /**
   * For AsyncStorage API compatibility
   */
  async multiRemove(keys: string[]): Promise<void> {
    keys.forEach(key => this.removeItem(key));
  }
}

// Create and export a singleton instance
export const storage = new PersistedStorage();

// Export class for creating custom instances
export { PersistedStorage };
