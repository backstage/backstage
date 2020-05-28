/*
 * Copyright 2020 Spotify AB
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import { useState, useEffect } from 'react';
import { UserSettingsApi } from '../../definitions';

export class UserSettings implements UserSettingsApi {
  getFromStore<T>(
    storeName: string,
    key: string = '',
    defaultValue: T | null,
  ): T | null {
    let store;
    try {
      store = JSON.parse(localStorage.getItem(storeName)!) || {};
    } catch (e) {
      window.console.error(
        `Error when parsing JSON config from storage for: ${storeName}`,
      );
      return defaultValue as T;
    }

    if (key) {
      return (store[key] ?? defaultValue) as T;
    }
    return store as T;
  }

  saveToStore(storeName: string, key: string, data: any): void {
    const store = JSON.parse(localStorage.getItem(storeName)!) || {};
    store[key] = data;
    localStorage.setItem(storeName, JSON.stringify(store));
  }

  removeFromStore(storeName: string, key: string): void {
    const store = JSON.parse(localStorage.getItem(storeName)!) || {};
    delete store[key];
    localStorage.setItem(storeName, JSON.stringify(store));
  }

  useStoreValue<T>(
    storeName: string,
    key: string,
  ): [T | null, (value: T | null) => void, () => void] {
    // We hardcode the emptyValue to null, since allowing objects or arrays would make
    // the useEffect params a lot more complex and it would easy to get stuck in a loop.
    const [value, setValue] = useState<T | null>(() =>
      this.getFromStore(storeName, key, null),
    );

    // Listen to storage change events from other tabs
    useEffect(() => {
      const onChange = (event: StorageEvent) => {
        if (event.key === storeName) {
          // Avoid sending unnecessary updates when only the reference changes because of JSON.parse
          setValue((currentValue: T | null) => {
            const newValue = this.getFromStore(storeName, key, null);

            // Fastest way to do a deep equals, since we know references will differ,
            // the values are serializable, and it's ok to signal a change if key order changes.
            if (JSON.stringify(currentValue) === JSON.stringify(newValue)) {
              return currentValue;
            }
            return newValue;
          });
        }
      };

      window.addEventListener('storage', onChange);
      return () => window.removeEventListener('storage', onChange);
    }, [storeName, key]);

    const saveValue = (newValue: T | null) => {
      this.saveToStore(storeName, key, newValue);
      setValue(this.getFromStore(storeName, key, null));
    };

    const removeValue = () => {
      this.removeFromStore(storeName, key);
      setValue(null);
    };

    return [value, saveValue, removeValue];
  }
}
