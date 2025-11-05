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

import {
  AppThemeApi,
  AppTheme,
  StorageApi,
  ErrorApi,
} from '@backstage/core-plugin-api';
import { Observable, Subscription } from '@backstage/types';
import { SignalApi, SignalSubscriber } from '@backstage/plugin-signals-react';
// eslint-disable-next-line @backstage/no-relative-monorepo-imports
import { WebStorage } from '../../../../packages/core-app-api/src';
// eslint-disable-next-line @backstage/no-relative-monorepo-imports
import { BehaviorSubject } from '../../../../packages/core-app-api/src/lib/subjects';

const STORAGE_KEY = 'theme';
const BUCKET_NAME = 'userSettings';

/**
 * Exposes the themes installed in the app, and permits switching the currently
 * active theme.
 *
 * @public
 */
export class DefaultAppThemeSelector implements AppThemeApi {
  static create(themes: AppTheme[]) {
    return new DefaultAppThemeSelector(themes);
  }

  static createWithStorage(
    themes: AppTheme[],
    storageApi: StorageApi,
    errorApi: ErrorApi,
    signalApi?: SignalApi,
  ) {
    const selector = new DefaultAppThemeSelector(themes);
    selector.setStorage(storageApi, errorApi, signalApi);
    return selector;
  }

  private activeThemeId: string | undefined;
  private subject = new BehaviorSubject<string | undefined>(undefined);
  private storage?: StorageApi;
  private signalApi?: SignalApi;
  private errorApi?: ErrorApi;
  private storageSubscription?: Subscription;
  private persistSubscription?: Subscription;
  private signalSubscription?: SignalSubscriber;
  private isUpdatingFromStorage = false;
  private lastStoredValue: any = undefined;
  private isInitialLoad = true;
  private readonly localStorageKey = `/${BUCKET_NAME}/${STORAGE_KEY}`;
  private lastKnownValue?: string | null;
  private storageSetupRequired = false;
  private localCacheSubscription?: StorageApi;
  private isUpdatingFromCache = false;

  constructor(private readonly themes: AppTheme[]) {
    this.#initializeThemeFromCache();
    this.#setupInitialState();
  }

  #initializeThemeFromCache(): void {
    // Try to load from localStorage first (only if not using WebStorage)
    this.lastKnownValue = this.#shouldUseLocalStorageCache()
      ? this.#loadFromLocalStorage()
      : undefined;

    // Use cached value if valid, otherwise use undefined (auto theme)
    let cachedThemeId: string | undefined = undefined;
    if (
      this.lastKnownValue !== undefined &&
      (this.lastKnownValue === null ||
        this.themes.some(theme => theme.id === this.lastKnownValue))
    ) {
      cachedThemeId =
        this.lastKnownValue === null ? undefined : this.lastKnownValue;
    }

    this.activeThemeId = cachedThemeId;
  }

  #setupInitialState(): void {
    this.subject = new BehaviorSubject<string | undefined>(this.activeThemeId);

    // Set up localStorage event listener for cross-tab synchronization
    if (this.storage) {
      this.#setupStorageEventListener();
    }

    // Mark that storage setup is required when using create() without storageApi
    this.storageSetupRequired = true;
  }

  getInstalledThemes(): AppTheme[] {
    return this.themes.slice();
  }

  activeThemeId$(): Observable<string | undefined> {
    return this.subject;
  }

  getActiveThemeId(): string | undefined {
    return this.activeThemeId;
  }

  setActiveThemeId(themeId?: string): void {
    this.#ensureStorageSetup();

    this.activeThemeId = themeId;

    // Immediately save to localStorage cache if using it
    if (this.#shouldUseLocalStorageCache()) {
      this.#saveToLocalStorage(themeId);
    }

    this.subject.next(themeId);
  }

  setStorage(
    storageApi: StorageApi,
    errorApi: ErrorApi,
    signalApi?: SignalApi,
  ) {
    this.#cleanupStorage();

    this.storage = storageApi;
    this.errorApi = errorApi;
    this.localCacheSubscription = WebStorage.create({
      errorApi: this.errorApi,
    });
    if (signalApi) {
      this.signalApi = signalApi;
    }
    this.storageSetupRequired = false;

    // Re-setup localStorage event listener based on SignalApi availability
    this.#setupStorageEventListener();

    this.#setupStorage();
  }

  #shouldUseLocalStorageCache(): boolean {
    // Only use localStorage cache if storage is NOT WebStorage
    // WebStorage already uses localStorage, so no need to duplicate
    return Boolean(this.storage && !(this.storage instanceof WebStorage));
  }

  #ensureStorageSetup(): void {
    if (this.storageSetupRequired) {
      throw new Error(
        'Storage not configured. Call setStorage() after creating the selector with create().',
      );
    }
  }

  #loadFromLocalStorage(): string | null | undefined {
    if (typeof window !== 'undefined' && window.localStorage) {
      const stored = window.localStorage.getItem(this.localStorageKey);
      if (stored === null) return null;
      if (stored === 'null') return null;
      return stored;
    }
    return undefined;
  }

  #saveToLocalStorage(themeId: string | undefined): void {
    try {
      if (typeof window !== 'undefined' && this.localCacheSubscription) {
        const valueToStore = themeId ?? 'null';
        this.localCacheSubscription
          .forBucket(BUCKET_NAME)
          .set(STORAGE_KEY, valueToStore);
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.warn('Failed to save theme to local storage', error);
    }
  }

  #setupStorageEventListener(): void {
    if (typeof window === 'undefined') return;

    // Skip if using WebStorage (handles its own events)
    if (this.storage instanceof WebStorage) return;

    // Skip if using SignalApi for cross-device sync (no need for localStorage events)
    if (this.signalApi && !(this.storage instanceof WebStorage)) return;

    this.localCacheSubscription
      ?.forBucket(BUCKET_NAME)
      .observe$(STORAGE_KEY)
      .subscribe(stored => {
        if (stored?.value === null) {
          this.setActiveThemeId();
        } else {
          try {
            const parsedThemeId = stored?.value;
            if (parsedThemeId !== this.activeThemeId) {
              this.isUpdatingFromCache = true;
              this.setActiveThemeId(parsedThemeId as string);
              this.isUpdatingFromCache = false;
            }
          } catch {
            this.setActiveThemeId();
          }
        }
      });
  }

  #setupStorage() {
    if (!this.storage) {
      return;
    }

    // Load initial value from storage
    const initialThemeId = this.#getInitialThemeFromStorage();
    if (initialThemeId !== undefined) {
      this.#updateThemeFromStorage(initialThemeId);
    }

    // Set up observer for future changes - always needed for initial load
    this.storageSubscription = this.storage
      .forBucket(BUCKET_NAME)
      .observe$(STORAGE_KEY)
      .subscribe(stored => {
        // Skip if we're already updating from storage (SignalApi is handling it)
        if (this.isUpdatingFromStorage) {
          return;
        }

        // Skip if this is the same value we just stored (prevent circular updates)
        if (stored?.value === this.lastStoredValue) {
          return;
        }

        const themeId = this.#parseThemeValue(stored?.value);
        this.#updateThemeFromStorage(themeId);
      });

    // Set up cross-device synchronization via UserSettingsStorage signals
    if (this.signalApi) {
      this.signalSubscription = this.signalApi.subscribe(
        'user-settings',
        (message: any) => {
          if (message.key === STORAGE_KEY && message.type === 'key-changed') {
            // Fetch the latest value from storage (which will be the backend value)
            // Use observe$ to get the actual value, not snapshot which may be 'unknown'
            let hasReceivedValue = false;
            const subscription = this.storage!.forBucket(BUCKET_NAME)
              .observe$(STORAGE_KEY)
              .subscribe(stored => {
                if (hasReceivedValue) return;
                hasReceivedValue = true;
                setTimeout(() => subscription.unsubscribe(), 0);

                const themeId = this.#parseThemeValue(stored?.value);
                this.#updateThemeFromStorage(themeId);
              });
          }
        },
      );
    }

    // Persist changes to storage (only when not updating from storage and not initial load)
    this.persistSubscription = this.subject.subscribe(themeId => {
      if (this.isUpdatingFromStorage) {
        return;
      }

      if (this.isInitialLoad) {
        this.isInitialLoad = false;
        return;
      }

      // Store the theme state
      const valueToStore = themeId ?? null;
      this.lastStoredValue = valueToStore;

      if (this.storage && !this.isUpdatingFromCache) {
        this.storage.forBucket(BUCKET_NAME).set(STORAGE_KEY, valueToStore);
      }
    });
  }

  #getInitialThemeFromStorage(): string | undefined {
    if (this.storage instanceof WebStorage) {
      // For WebStorage, get the current value immediately since observe$ doesn't emit on subscription
      const bucket = this.storage.forBucket(BUCKET_NAME);
      const currentValue = bucket.get<string | null>(STORAGE_KEY);
      return this.#parseThemeValue(currentValue);
    }
    return undefined;
  }

  #parseThemeValue(storedValue: any): string | undefined {
    if (storedValue === null) {
      return undefined; // auto theme
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

  #updateThemeFromStorage(themeId: string | undefined): void {
    if (themeId !== this.activeThemeId && this.#isValidTheme(themeId)) {
      this.isUpdatingFromStorage = true;
      this.setActiveThemeId(themeId);
      this.isUpdatingFromStorage = false;
    }
  }

  #cleanupStorage() {
    if (this.storageSubscription) {
      this.storageSubscription.unsubscribe();
      this.storageSubscription = undefined;
    }
    if (this.persistSubscription) {
      this.persistSubscription.unsubscribe();
      this.persistSubscription = undefined;
    }
    if (this.signalSubscription) {
      this.signalSubscription.unsubscribe();
      this.signalSubscription = undefined;
    }
  }

  /**
   * Clean up resources when the selector is no longer needed
   */
  destroy() {
    this.#cleanupStorage();
    if (!this.subject.closed) {
      this.subject.complete();
    }
  }
}
