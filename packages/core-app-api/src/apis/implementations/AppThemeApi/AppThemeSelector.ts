/*
 * Copyright 2020 The Backstage Authors
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

import {
  AppThemeApi,
  AppTheme,
  StorageApi,
  ErrorApi,
} from '@backstage/core-plugin-api';
import { Observable, Subscription } from '@backstage/types';
import ObservableImpl from 'zen-observable';

const STORAGE_KEY = 'theme';
const BUCKET_NAME = 'userSettings';
const CACHE_KEY = `/${BUCKET_NAME}/${STORAGE_KEY}`;

/**
 * Options for creating AppThemeSelector with storage.
 *
 * @public
 */
export interface AppThemeSelectorOptions {
  themes: AppTheme[];
  storageApi: StorageApi;
  errorApi: ErrorApi;
}

/**
 * Exposes the themes installed in the app, and permits switching the currently
 * active theme.
 *
 * @public
 */
export class AppThemeSelector implements AppThemeApi {
  static create(themes: AppTheme[]) {
    return new AppThemeSelector(themes);
  }

  static createWithStorage(options: AppThemeSelectorOptions) {
    return new AppThemeSelector(
      options.themes,
      options.storageApi,
      options.errorApi,
    );
  }

  private readonly storage?: StorageApi;
  private readonly errorApi?: ErrorApi;
  private storageSubscription?: Subscription;
  private lastStoredValue: string | null | undefined;
  private readonly subscribers = new Set<
    ZenObservable.SubscriptionObserver<string | undefined>
  >();
  private storageEventListener?: (event: StorageEvent) => void;

  constructor(
    private readonly themes: AppTheme[],
    storageApi?: StorageApi,
    errorApi?: ErrorApi,
  ) {
    this.storage = storageApi;
    this.errorApi = errorApi;
    this.lastStoredValue = undefined;

    if (this.storage) {
      const isWebStorage = this.#initializeFromStorage();
      this.#setupCrossTabSync(isWebStorage);
    }
  }

  /**
   * Initialize lastStoredValue from storage snapshot.
   * Returns true if storage is WebStorage (sync), false if async storage.
   */
  #initializeFromStorage(): boolean {
    const bucket = this.storage!.forBucket(BUCKET_NAME);
    const snapshot = bucket.snapshot<string | null>(STORAGE_KEY);

    if (snapshot.presence !== 'unknown') {
      this.lastStoredValue = snapshot.value ?? null;
      return true;
    }

    return false;
  }

  /**
   * Set up cross-tab synchronization via storage events.
   * Only needed for async storage backends that don't handle storage events themselves.
   */
  #setupCrossTabSync(isWebStorage: boolean): void {
    // WebStorage already handles storage events internally via its observe$ implementation
    if (isWebStorage) {
      return;
    }

    if (typeof window === 'undefined' || !window.addEventListener) {
      return;
    }

    this.storageEventListener = (event: StorageEvent) => {
      if (event.key !== CACHE_KEY) {
        return;
      }

      const newValue = this.#parseStorageEventValue(event);
      if (newValue === undefined) {
        return;
      }

      const themeId = this.#parseThemeValue(newValue);
      if (!this.#isValidTheme(themeId)) {
        return;
      }

      this.lastStoredValue = newValue;
      this.#notifySubscribers(themeId);
    };

    window.addEventListener('storage', this.storageEventListener);
  }

  /**
   * Parse value from storage event, returning undefined if unchanged or invalid.
   */
  #parseStorageEventValue(event: StorageEvent): string | null | undefined {
    try {
      if (event.newValue === null || event.newValue === undefined) {
        return null;
      }

      const parsed = JSON.parse(event.newValue);
      const value = parsed === null ? null : parsed;

      if (value === this.lastStoredValue) {
        return undefined;
      }

      return value;
    } catch {
      // Ignore parse errors
      return undefined;
    }
  }

  /**
   * Notify all subscribers of a theme change.
   */
  #notifySubscribers(themeId: string | undefined): void {
    for (const subscriber of this.subscribers) {
      subscriber.next(themeId);
    }
  }

  #getCachedValue(): string | null | undefined {
    if (typeof window === 'undefined' || !window.localStorage) {
      return undefined;
    }
    try {
      const cached = window.localStorage.getItem(CACHE_KEY);
      if (cached === null) return null;
      if (cached === 'null') return null;
      const parsed = JSON.parse(cached);
      return parsed === null ? null : parsed;
    } catch {
      return undefined;
    }
  }

  #setCachedValue(value: string | null): void {
    if (typeof window === 'undefined' || !window.localStorage) {
      return;
    }
    try {
      if (value === null) {
        window.localStorage.setItem(CACHE_KEY, JSON.stringify(null));
      } else {
        window.localStorage.setItem(CACHE_KEY, JSON.stringify(value));
      }
    } catch {
      // Ignore localStorage errors (quota exceeded, etc.)
    }
  }

  getInstalledThemes(): AppTheme[] {
    return this.themes.slice();
  }

  activeThemeId$(): Observable<string | undefined> {
    if (!this.storage) {
      return this.#createEmptyObservable();
    }

    const bucket = this.storage.forBucket(BUCKET_NAME);
    const initialValue = this.#getInitialThemeValue(bucket);

    return new ObservableImpl<string | undefined>(subscriber => {
      this.subscribers.add(subscriber);

      if (initialValue !== undefined) {
        subscriber.next(initialValue);
      }

      const subscription = this.#subscribeToStorageChanges(bucket, subscriber);

      return () => {
        subscription.unsubscribe();
        this.subscribers.delete(subscriber);
      };
    });
  }

  /**
   * Create an observable that emits undefined (no storage available).
   */
  #createEmptyObservable(): Observable<string | undefined> {
    return new ObservableImpl<string | undefined>(subscriber => {
      subscriber.next(undefined);
    });
  }

  /**
   * Get initial theme value from snapshot or cache.
   * Returns undefined if no valid value is available.
   */
  #getInitialThemeValue(bucket: StorageApi): string | undefined {
    const snapshot = bucket.snapshot<string | null>(STORAGE_KEY);

    if (snapshot.presence !== 'unknown') {
      const themeId = this.#parseThemeValue(snapshot.value);
      if (this.#isValidTheme(themeId)) {
        if (this.lastStoredValue === undefined) {
          this.lastStoredValue = snapshot.value ?? null;
        }
        return themeId;
      }
      return undefined;
    }

    const cachedValue = this.#getCachedValue();
    if (cachedValue !== undefined) {
      const themeId = this.#parseThemeValue(cachedValue);
      if (this.#isValidTheme(themeId)) {
        if (this.lastStoredValue === undefined) {
          this.lastStoredValue = cachedValue;
        }
        return themeId;
      }
    }

    return undefined;
  }

  /**
   * Subscribe to storage changes and emit theme updates.
   */
  #subscribeToStorageChanges(
    bucket: StorageApi,
    subscriber: ZenObservable.SubscriptionObserver<string | undefined>,
  ): Subscription {
    return bucket.observe$(STORAGE_KEY).subscribe({
      next: stored => {
        const storedValue = stored?.value as string | null | undefined;
        const themeId = this.#parseThemeValue(storedValue);

        if (!this.#isValidTheme(themeId)) {
          return;
        }

        this.#updateStoredValue(storedValue);
        subscriber.next(themeId);
      },
      error: error => subscriber.error(error),
    });
  }

  /**
   * Update lastStoredValue and cache when storage value changes.
   */
  #updateStoredValue(storedValue: string | null | undefined): void {
    const valueToStore = storedValue ?? null;
    this.lastStoredValue = valueToStore;
    this.#setCachedValue(valueToStore);
  }

  getActiveThemeId(): string | undefined {
    if (!this.storage) {
      return undefined;
    }

    const bucket = this.storage.forBucket(BUCKET_NAME);
    const snapshot = bucket.snapshot<string | null>(STORAGE_KEY);

    if (snapshot.presence !== 'unknown') {
      return this.#getThemeIdFromValue(snapshot.value);
    }

    const cachedValue = this.#getCachedValue();
    return cachedValue !== undefined
      ? this.#getThemeIdFromValue(cachedValue)
      : undefined;
  }

  /**
   * Parse and validate a stored value, returning the theme ID if valid.
   */
  #getThemeIdFromValue(value: string | null | undefined): string | undefined {
    const themeId = this.#parseThemeValue(value);
    return this.#isValidTheme(themeId) ? themeId : undefined;
  }

  setActiveThemeId(themeId?: string): void {
    if (!this.storage) {
      return;
    }

    const valueToStore = themeId ?? null;

    if (valueToStore === this.lastStoredValue) {
      return;
    }

    this.lastStoredValue = valueToStore;
    this.#setCachedValue(valueToStore);

    this.storage
      .forBucket(BUCKET_NAME)
      .set(STORAGE_KEY, valueToStore)
      .catch(error => {
        this.#handleStorageError(error);
      });
  }

  /**
   * Handle errors when writing to storage.
   */
  #handleStorageError(error: unknown): void {
    if (this.errorApi) {
      this.errorApi.post(
        new Error(`Failed to save theme to storage: ${error}`),
      );
    }
    this.lastStoredValue = undefined;
  }

  #parseThemeValue(storedValue: any): string | undefined {
    if (storedValue === null) {
      return undefined;
    } else if (typeof storedValue === 'string') {
      return storedValue;
    }
    return undefined;
  }

  #isValidTheme(themeId: string | undefined): boolean {
    return (
      themeId === undefined || this.themes.some(theme => theme.id === themeId)
    );
  }

  /**
   * Clean up resources when the selector is no longer needed
   */
  destroy() {
    if (this.storageSubscription) {
      this.storageSubscription.unsubscribe();
      this.storageSubscription = undefined;
    }
    if (
      this.storageEventListener &&
      typeof window !== 'undefined' &&
      window.removeEventListener
    ) {
      window.removeEventListener('storage', this.storageEventListener);
      this.storageEventListener = undefined;
    }
    this.subscribers.clear();
  }
}
