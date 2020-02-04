import { useState, useEffect } from 'react';

/**
 * Save persistent data.
 *
 * TODO: Replace with e.g. Google Cloud Firestore in the future.
 *
 * @param {String} storeName Name of the store.
 * @param {String} key Unique key associated with the data.
 * @param {Object} data The data that should be stored.
 */
export function saveToStore(storeName, key, data) {
  const store = JSON.parse(localStorage.getItem(storeName)) || {};
  store[key] = data;
  localStorage.setItem(storeName, JSON.stringify(store));
}

/**
 * Remove persistent data.
 *
 * TODO: Replace with e.g. Google Cloud Firestore in the future.
 *
 * @param {String} storeName Name of the store.
 * @param {String} key Unique key associated with the data.
 */
export function removeFromStore(storeName, key) {
  const store = JSON.parse(localStorage.getItem(storeName)) || {};
  delete store[key];
  localStorage.setItem(storeName, JSON.stringify(store));
}

/**
 * Get persistent data.
 *
 * TODO: Replace with e.g. Google Cloud Firestore in the future.
 *
 * @param {String} storeName Name of the store.
 * @param {String?} key (Optional) Unique key associated with the data.
 * If not key is specified,the whole store is returned.
 * @param {String} key (Optional) Empty value to return if there is not data.
 * @return {Object} data The data that should is stored.
 */
export function getFromStore(storeName, key, emptyValue = {}) {
  let store;
  try {
    store = JSON.parse(localStorage.getItem(storeName)) || {};
  } catch (e) {
    console.error(`Error when parsing JSON config from storage for: ${storeName}`);
    return emptyValue;
  }

  if (key) {
    return store[key] || emptyValue;
  }
  return store;
}

/**
 * React hook that observes a single store value and provides functions for updating the value.
 *
 * @param {String} storeName Name of the store.
 * @param {String} key Unique key associated with the data.
 * @return {[value, setValue(value), removeValue()]} An array to be deconstructed,
 * The first element is the value, the second is a function to call to update the value,
 * and the third is a function to call to clear the value.
 */
export function useStoreValue(storeName, key) {
  // We hardcode the emptyValue to null, since allowing objects or arrays would make
  // the useEffect params a lot more complex and it would easy to get stuck in a loop.
  let [value, setValue] = useState(() => getFromStore(storeName, key, null));

  // Listen to storage change events from other tabs
  useEffect(() => {
    const onChange = event => {
      if (event.key === storeName) {
        // Avoid sending unnecessary updates when only the reference changes because of JSON.parse
        setValue(currentValue => {
          let newValue = getFromStore(storeName, key, null);

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

  const saveValue = value => {
    saveToStore(storeName, key, value);
    setValue(getFromStore(storeName, key, null));
  };

  const removeValue = () => {
    removeFromStore(storeName, key);
    setValue(null);
  };

  return [value, saveValue, removeValue];
}
