# Persisted Storage

A lightweight, high-performance persistent storage service built on top of MMKV with an API similar to AsyncStorage.

## Features

- ⚡️ **High Performance**: ~30x faster than AsyncStorage, powered by MMKV
- 🔄 **Synchronous API**: No need for `async/await` unlike AsyncStorage
- 🔀 **AsyncStorage Compatible**: Includes compatibility methods for easy migration
- 🧠 **Type-Safe**: Full TypeScript support with generics for object storage
- 🛡️ **Error Handling**: Built-in error handling for all operations

## Usage

### Basic Operations

```typescript
import { storage } from '@/app/storage/persisted';

// Store and retrieve a string
storage.setItem('username', 'john_doe');
const username = storage.getItem('username'); // 'john_doe'

// Check if key exists
const hasKey = storage.hasKey('username'); // true

// Remove a key
storage.removeItem('username');

// Get all keys
const keys = storage.getAllKeys();

// Clear all data
storage.clear();
```

### Object Storage

```typescript
import { storage } from '@/app/storage/persisted';

// Store an object
const user = {
  id: 1,
  name: 'John Doe',
  email: 'john@example.com',
  preferences: {
    darkMode: true,
    notifications: false
  }
};

storage.setObject('currentUser', user);

// Retrieve an object with type inference
const savedUser = storage.getObject<typeof user>('currentUser');
```

### AsyncStorage Compatibility

```typescript
import { storage } from '@/app/storage/persisted';

// Using AsyncStorage-like methods
await storage.multiSet([
  ['key1', 'value1'],
  ['key2', 'value2']
]);

const values = await storage.multiGet(['key1', 'key2']);
// [['key1', 'value1'], ['key2', 'value2']]

await storage.multiRemove(['key1', 'key2']);
```

### Creating Custom Instances

```typescript
import { PersistedStorage } from '@/app/storage/persisted';

// Create a separate storage instance for user data
const userStorage = new PersistedStorage('user.data');

// Create an encrypted storage instance
const secureStorage = new PersistedStorage('secure.storage');
```

## License

This project is proprietary and all rights are reserved. Unauthorized copying, use, or distribution is strictly prohibited. 