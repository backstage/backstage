/*
 * Copyright 2025 The Backstage Authors
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

import { AppLanguageApi } from '@backstage/core-plugin-api/alpha';
import { Observable, Subscription } from '@backstage/types';
import { StorageApi, ErrorApi } from '@backstage/core-plugin-api';
import { SignalApi, SignalSubscriber } from '@backstage/plugin-signals-react';
import { UserSettingsSignal } from '@backstage/plugin-user-settings-common';
// eslint-disable-next-line @backstage/no-relative-monorepo-imports
import { WebStorage } from '../../../../packages/core-app-api/src';
// eslint-disable-next-line @backstage/no-relative-monorepo-imports
import { BehaviorSubject } from '../../../../packages/core-app-api/src/lib/subjects';

const STORAGE_KEY = 'language';
export const DEFAULT_LANGUAGE = 'en';
const BUCKET_NAME = 'userSettings';

/** @alpha */
export interface DefaultAppLanguageSelectorOptions {
  defaultLanguage?: string;
  availableLanguages?: string[];
  storageApi?: StorageApi;
  errorApi?: ErrorApi;
  signalApi?: SignalApi;
}

/**
 * Exposes the available languages in the app and allows for switching of the active language.
 *
 * @alpha
 */
export class DefaultAppLanguageSelector implements AppLanguageApi {
  static create(options?: DefaultAppLanguageSelectorOptions) {
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

    return new DefaultAppLanguageSelector(
      languages,
      initialLanguage,
      options?.storageApi,
      options?.errorApi,
      options?.signalApi,
    );
  }

  static createWithStorage(
    options: Omit<DefaultAppLanguageSelectorOptions, 'storageApi' | 'errorApi'>,
    storageApi: StorageApi,
    errorApi: ErrorApi,
    signalApi?: SignalApi,
  ) {
    return DefaultAppLanguageSelector.create({
      ...options,
      storageApi,
      errorApi,
      signalApi,
    });
  }
  readonly #localStorageKey = `/${BUCKET_NAME}/${STORAGE_KEY}`;
  readonly #languages: string[];
  #language!: string;
  #subject!: BehaviorSubject<{ language: string }>;
  #storage?: StorageApi;
  #errorApi?: ErrorApi;
  #signalApi?: SignalApi;
  #storageSubscription?: Subscription;
  #persistSubscription?: Subscription;
  #signalSubscription?: SignalSubscriber;
  #isUpdatingFromStorage = false;
  #lastStoredValue: any = undefined;
  #isInitialLoad = true;
  #lastKnownValue?: string;
  #storageSetupRequired = false;
  #localCacheSubscription?: StorageApi;
  #isUpdatingFromCache = false;

  private constructor(
    languages: string[],
    initialLanguage: string,
    storageApi?: StorageApi,
    errorApi?: ErrorApi,
    signalApi?: SignalApi,
  ) {
    this.#languages = languages;
    this.#storage = storageApi;
    this.#errorApi = errorApi;
    this.#signalApi = signalApi;

    this.#initializeLanguageFromCache(initialLanguage);
    this.#setupInitialState();
  }

  #initializeLanguageFromCache(initialLanguage: string): void {
    // Try to load from localStorage first (only if not using WebStorage)
    this.#lastKnownValue = this.#shouldUseLocalStorageCache()
      ? this.#loadFromLocalStorage()
      : undefined;

    // Use cached value if valid, otherwise use initialLanguage
    const cachedLanguage =
      this.#lastKnownValue && this.#languages.includes(this.#lastKnownValue)
        ? this.#lastKnownValue
        : initialLanguage;

    this.#language = cachedLanguage;
  }

  #setupInitialState(): void {
    this.#subject = new BehaviorSubject<{ language: string }>({
      language: this.#language,
    });

    // Set up localStorage event listener for cross-tab synchronization
    this.#setupStorageEventListener();

    if (this.#storage) {
      this.#setupStorage();
    } else {
      // Mark that storage setup is required when using create() without storageApi
      this.#storageSetupRequired = true;
    }
  }

  setStorage(
    storageApi: StorageApi,
    errorApi: ErrorApi,
    signalApi?: SignalApi,
  ) {
    this.#cleanupStorage();

    this.#storage = storageApi;
    this.#errorApi = errorApi;
    this.#localCacheSubscription = WebStorage.create({
      errorApi: this.#errorApi,
    });
    if (signalApi) {
      this.#signalApi = signalApi;
    }
    this.#storageSetupRequired = false;

    // Re-setup localStorage event listener based on SignalApi availability
    this.#setupStorageEventListener();

    this.#setupStorage();
  }

  #shouldUseLocalStorageCache(): boolean {
    // Only use localStorage cache if storage is NOT WebStorage
    // WebStorage already uses localStorage, so no need to duplicate
    return Boolean(this.#storage && !(this.#storage instanceof WebStorage));
  }

  #ensureStorageSetup(): void {
    if (this.#storageSetupRequired) {
      throw new Error(
        'Storage not configured. Call setStorage() after creating the selector with create().',
      );
    }
  }

  #loadFromLocalStorage(): string | undefined {
    if (typeof window !== 'undefined' && window.localStorage) {
      return window.localStorage.getItem(this.#localStorageKey) || undefined;
    }
    return undefined;
  }

  #saveToLocalStorage(language: string): void {
    try {
      if (typeof window !== 'undefined' && this.#localCacheSubscription) {
        this.#localCacheSubscription
          .forBucket(BUCKET_NAME)
          .set(STORAGE_KEY, language);
      }
    } catch {
      // eslint-disable-next-line no-console
      console.warn('Failed to save language to local storage');
    }
  }

  #setupStorageEventListener(): void {
    if (typeof window === 'undefined') return;

    // Skip if using WebStorage (handles its own events)
    if (this.#storage instanceof WebStorage) return;

    // Skip if using SignalApi for cross-device sync (no need for localStorage events)
    if (this.#signalApi && !(this.#storage instanceof WebStorage)) return;

    this.#localCacheSubscription
      ?.forBucket(BUCKET_NAME)
      .observe$(STORAGE_KEY)
      .subscribe(stored => {
        if (stored?.value === null) {
          this.setLanguage();
        } else {
          try {
            const parsedLanguage = stored?.value;
            if (parsedLanguage !== this.#language) {
              this.#isUpdatingFromCache = true;
              this.setLanguage(parsedLanguage as string);
              this.#isUpdatingFromCache = false;
            }
          } catch {
            this.setLanguage();
          }
        }
      });
  }

  #setupStorage() {
    if (!this.#storage) {
      return;
    }

    // Load initial value from storage
    const initialLanguage = this.#getInitialLanguageFromStorage();
    if (initialLanguage) {
      this.#updateLanguageFromStorage(initialLanguage);
    }

    // Set up observer for future changes - always needed for initial load
    this.#storageSubscription = this.#storage
      .forBucket(BUCKET_NAME)
      .observe$(STORAGE_KEY)
      .subscribe(stored => {
        // Skip if we're already updating from storage (SignalApi is handling it)
        if (this.#isUpdatingFromStorage) {
          return;
        }

        // Skip if this is the same value we just stored (prevent circular updates)
        if (stored?.value === this.#lastStoredValue) {
          return;
        }

        const language = this.#parseLanguageValue(stored?.value);
        this.#updateLanguageFromStorage(language);
      });

    // Set up cross-device synchronization via UserSettingsStorage signals
    if (this.#signalApi) {
      this.#signalSubscription = this.#signalApi.subscribe(
        'user-settings',
        (message: UserSettingsSignal) => {
          if (message.key === STORAGE_KEY && message.type === 'key-changed') {
            // Fetch the latest value from storage (which will be the backend value)
            // Use observe$ to get the actual value, not snapshot which may be 'unknown'
            let hasReceivedValue = false;
            const subscription = this.#storage!.forBucket(BUCKET_NAME)
              .observe$(STORAGE_KEY)
              .subscribe(stored => {
                if (hasReceivedValue) return;
                hasReceivedValue = true;
                setTimeout(() => subscription.unsubscribe(), 0);

                const language = this.#parseLanguageValue(stored?.value);
                this.#updateLanguageFromStorage(language);
              });
          }
        },
      );
    }

    // Persist changes to storage (only when not updating from storage and not initial load)
    this.#persistSubscription = this.#subject.subscribe(({ language }) => {
      if (this.#isUpdatingFromStorage) {
        return;
      }

      if (this.#isInitialLoad) {
        this.#isInitialLoad = false;
        return;
      }

      // Store the language state
      this.#lastStoredValue = language;

      if (this.#storage && !this.#isUpdatingFromCache) {
        this.#storage
          .forBucket(BUCKET_NAME)
          .set(STORAGE_KEY, language)
          .catch(error => {
            // eslint-disable-next-line no-console
            console.warn('Failed to save language to local storage', error);
          });
      }
    });
  }

  getAvailableLanguages(): { languages: string[] } {
    return { languages: this.#languages.slice() };
  }

  setLanguage(language?: string | undefined): void {
    this.#ensureStorageSetup();

    const lng = language ?? DEFAULT_LANGUAGE;
    if (lng === this.#language) {
      return;
    }
    if (lng && !this.#languages.includes(lng)) {
      throw new Error(
        `Failed to change language to '${lng}', available languages are '${this.#languages.join(
          "', '",
        )}'`,
      );
    }

    this.#language = lng;

    // Immediately save to localStorage cache if using it
    if (this.#shouldUseLocalStorageCache()) {
      this.#saveToLocalStorage(lng);
    }

    this.#subject.next({ language: lng });
  }

  getLanguage(): { language: string } {
    return { language: this.#language };
  }

  language$(): Observable<{ language: string }> {
    return this.#subject;
  }

  #cleanupStorage() {
    if (this.#storageSubscription) {
      this.#storageSubscription.unsubscribe();
      this.#storageSubscription = undefined;
    }
    if (this.#persistSubscription) {
      this.#persistSubscription.unsubscribe();
      this.#persistSubscription = undefined;
    }
    if (this.#signalSubscription) {
      this.#signalSubscription.unsubscribe();
      this.#signalSubscription = undefined;
    }
  }

  #getInitialLanguageFromStorage(): string | undefined {
    if (this.#storage instanceof WebStorage) {
      // For WebStorage, get the current value immediately since observe$ doesn't emit on subscription
      const bucket = this.#storage.forBucket(BUCKET_NAME);
      const currentValue = bucket.get<string>(STORAGE_KEY);
      return this.#parseLanguageValue(currentValue);
    }
    return undefined;
  }

  #parseLanguageValue(storedValue: any): string | undefined {
    if (storedValue === null) {
      return undefined; // default language
    } else if (typeof storedValue === 'string' && storedValue) {
      return storedValue;
    }
    return undefined;
  }

  #isValidLanguage(language: string | undefined): boolean {
    return language === undefined || this.#languages.includes(language);
  }

  #updateLanguageFromStorage(language: string | undefined): void {
    const targetLanguage = language ?? DEFAULT_LANGUAGE;
    if (targetLanguage !== this.#language && this.#isValidLanguage(language)) {
      this.#isUpdatingFromStorage = true;
      this.setLanguage(language);
      this.#isUpdatingFromStorage = false;
    }
  }

  /**
   * Clean up resources when the selector is no longer needed
   */
  destroy() {
    this.#cleanupStorage();
    if (!this.#subject.closed) {
      this.#subject.complete();
    }
  }
}
