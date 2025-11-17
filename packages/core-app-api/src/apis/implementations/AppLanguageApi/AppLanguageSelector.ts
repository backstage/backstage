/*
 * Copyright 2023 The Backstage Authors
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

// Internal import to avoid code duplication, this will lead to duplication in build output
// eslint-disable-next-line @backstage/no-relative-monorepo-imports
import { AppLanguageApi } from '@backstage/core-plugin-api/alpha';
import { Observable, Subscription } from '@backstage/types';
import ObservableImpl from 'zen-observable';
import { StorageApi, ErrorApi } from '@backstage/core-plugin-api';

const STORAGE_KEY = 'language';
export const DEFAULT_LANGUAGE = 'en';
const BUCKET_NAME = 'userSettings';
const CACHE_KEY = `/${BUCKET_NAME}/${STORAGE_KEY}`;

/** @alpha */
export interface AppLanguageSelectorOptions {
  defaultLanguage?: string;
  availableLanguages?: string[];
  storageApi?: StorageApi;
  errorApi?: ErrorApi;
}

/**
 * Options for creating AppLanguageSelector with storage.
 *
 * @alpha
 */
export interface AppLanguageSelectorWithStorageOptions {
  defaultLanguage?: string;
  availableLanguages?: string[];
  storageApi: StorageApi;
  errorApi: ErrorApi;
}

/**
 * Exposes the available languages in the app and allows for switching of the active language.
 *
 * @alpha
 */
export class AppLanguageSelector implements AppLanguageApi {
  static create(options?: AppLanguageSelectorOptions) {
    const languages = options?.availableLanguages ?? [DEFAULT_LANGUAGE];
    if (languages.length !== new Set(languages).size) {
      throw new Error(
        `Supported languages may not contain duplicates, got '${languages.join(
          "', '",
        )}'`,
      );
    }

    const initialLanguage = options?.defaultLanguage ?? DEFAULT_LANGUAGE;

    if (!languages.includes(initialLanguage)) {
      throw new Error(
        `Initial language must be one of the supported languages, got '${initialLanguage}'`,
      );
    }

    return new AppLanguageSelector(
      languages,
      initialLanguage,
      options?.storageApi,
      options?.errorApi,
    );
  }

  static createWithStorage(
    options: AppLanguageSelectorWithStorageOptions,
  ): AppLanguageSelector {
    return AppLanguageSelector.create({
      defaultLanguage: options.defaultLanguage,
      availableLanguages: options.availableLanguages,
      storageApi: options.storageApi,
      errorApi: options.errorApi,
    });
  }

  private readonly storage?: StorageApi;
  private readonly errorApi?: ErrorApi;
  private readonly languages: string[];
  private readonly defaultLanguage: string;
  private storageSubscription?: Subscription;
  private lastStoredValue: string | null | undefined;
  private readonly subscribers = new Set<
    ZenObservable.SubscriptionObserver<{ language: string }>
  >();
  private storageEventListener?: (event: StorageEvent) => void;

  private constructor(
    languages: string[],
    defaultLanguage: string,
    storageApi?: StorageApi,
    errorApi?: ErrorApi,
  ) {
    this.languages = languages;
    this.defaultLanguage = defaultLanguage;
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

      const language = this.#parseLanguageValue(newValue);
      if (!this.#isValidLanguage(language)) {
        return;
      }

      this.lastStoredValue = newValue;
      this.#notifySubscribers(language ?? this.defaultLanguage);
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

  #notifySubscribers(language: string): void {
    for (const subscriber of this.subscribers) {
      subscriber.next({ language });
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
      // Ignore localStorage errors
    }
  }

  getAvailableLanguages(): { languages: string[] } {
    return { languages: this.languages.slice() };
  }

  language$(): Observable<{ language: string }> {
    if (!this.storage) {
      return this.#createEmptyObservable();
    }

    const bucket = this.storage.forBucket(BUCKET_NAME);
    const initialLanguage = this.#getInitialLanguageValue(bucket);

    return new ObservableImpl<{ language: string }>(subscriber => {
      this.subscribers.add(subscriber);

      subscriber.next({ language: initialLanguage });

      const subscription = this.#subscribeToStorageChanges(bucket, subscriber);

      return () => {
        subscription.unsubscribe();
        this.subscribers.delete(subscriber);
      };
    });
  }

  /**
   * Create an observable that emits default language (no storage available).
   */
  #createEmptyObservable(): Observable<{ language: string }> {
    return new ObservableImpl<{ language: string }>(subscriber => {
      subscriber.next({ language: this.defaultLanguage });
    });
  }

  /**
   * Get initial language value from snapshot or cache.
   * Returns defaultLanguage if no valid value is available.
   */
  #getInitialLanguageValue(bucket: StorageApi): string {
    const snapshot = bucket.snapshot<string | null>(STORAGE_KEY);

    if (snapshot.presence !== 'unknown') {
      const language = this.#parseLanguageValue(snapshot.value);
      if (this.#isValidLanguage(language)) {
        if (this.lastStoredValue === undefined) {
          this.lastStoredValue = snapshot.value ?? null;
        }
        return language ?? this.defaultLanguage;
      }
      return this.defaultLanguage;
    }

    const cachedValue = this.#getCachedValue();
    if (cachedValue !== undefined) {
      const language = this.#parseLanguageValue(cachedValue);
      if (this.#isValidLanguage(language)) {
        if (this.lastStoredValue === undefined) {
          this.lastStoredValue = cachedValue;
        }
        return language ?? this.defaultLanguage;
      }
    }

    return this.defaultLanguage;
  }

  /**
   * Subscribe to storage changes and emit language updates.
   */
  #subscribeToStorageChanges(
    bucket: StorageApi,
    subscriber: ZenObservable.SubscriptionObserver<{ language: string }>,
  ): Subscription {
    return bucket.observe$(STORAGE_KEY).subscribe({
      next: stored => {
        const storedValue = stored?.value as string | null | undefined;
        const language = this.#parseLanguageValue(storedValue);

        if (!this.#isValidLanguage(language)) {
          return;
        }

        this.#updateStoredValue(storedValue);
        subscriber.next({ language: language ?? this.defaultLanguage });
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

  getLanguage(): { language: string } {
    if (!this.storage) {
      return { language: this.defaultLanguage };
    }

    const bucket = this.storage.forBucket(BUCKET_NAME);
    const snapshot = bucket.snapshot<string | null>(STORAGE_KEY);

    if (snapshot.presence !== 'unknown') {
      const language = this.#getLanguageFromValue(snapshot.value);
      return { language };
    }

    const cachedValue = this.#getCachedValue();
    const language =
      cachedValue !== undefined
        ? this.#getLanguageFromValue(cachedValue)
        : this.defaultLanguage;
    return { language };
  }

  /**
   * Parse and validate a stored value, returning the language if valid, otherwise default.
   */
  #getLanguageFromValue(value: string | null | undefined): string {
    const language = this.#parseLanguageValue(value);
    return this.#isValidLanguage(language)
      ? language ?? this.defaultLanguage
      : this.defaultLanguage;
  }

  setLanguage(language?: string | undefined): void {
    if (!this.storage) {
      throw new Error(
        'Storage not configured. Use createWithStorage() to create a selector with storage.',
      );
    }

    const targetLanguage = language ?? this.defaultLanguage;

    // Validate language if provided
    if (language && !this.languages.includes(language)) {
      throw new Error(
        `Failed to change language to '${language}', available languages are '${this.languages.join(
          "', '",
        )}'`,
      );
    }

    const valueToStore =
      targetLanguage === this.defaultLanguage ? null : targetLanguage;

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
        new Error(`Failed to save language to storage: ${error}`),
      );
    }
    this.lastStoredValue = undefined;
  }

  #parseLanguageValue(storedValue: any): string | undefined {
    if (storedValue === null) {
      return undefined;
    } else if (typeof storedValue === 'string' && storedValue) {
      return storedValue;
    }
    return undefined;
  }

  #isValidLanguage(language: string | undefined): boolean {
    return language === undefined || this.languages.includes(language);
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
