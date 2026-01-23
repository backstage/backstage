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

import { AppThemeApi, AppTheme, StorageApi } from '@backstage/core-plugin-api';
import { Observable } from '@backstage/types';
import { BehaviorSubject } from '../../../lib/subjects';

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
  storageApi?: StorageApi;
}

/**
 * Exposes the themes installed in the app, and permits switching the currently
 * active theme.
 *
 * @public
 */
export class AppThemeSelector implements AppThemeApi {
  static createWithStorage(options: AppThemeSelectorOptions) {
    const selector = new AppThemeSelector(options.themes);
    const storageApi = options.storageApi;

    // storageApi isn't available during early boot (before config/other APIs are ready)
    if (!storageApi) {
      return selector;
    }

    const readLastKnownValue = (): string | undefined => {
      if (typeof window === 'undefined' || !window.localStorage) {
        return undefined;
      }
      try {
        const cached = window.localStorage.getItem(CACHE_KEY);
        if (cached === 'undefined') {
          window.localStorage.removeItem(CACHE_KEY);
          return undefined;
        }
        if (cached === null) {
          return undefined;
        }
        const parsed = JSON.parse(cached);
        return typeof parsed === 'string' ? parsed : undefined;
      } catch {
        return undefined;
      }
    };

    const writeLastKnownValue = (themeId: string | undefined): void => {
      if (typeof window === 'undefined' || !window.localStorage) {
        return;
      }
      try {
        if (themeId === undefined) {
          window.localStorage.removeItem(CACHE_KEY);
          return;
        }
        window.localStorage.setItem(CACHE_KEY, JSON.stringify(themeId));
      } catch {
        // Ignore localStorage errors
      }
    };

    const bucket = storageApi.forBucket(BUCKET_NAME);
    const snapshot = bucket.snapshot<string | null>(STORAGE_KEY);
    const useCache = snapshot.presence === 'unknown';
    let hasLoadedFromStorage = false;
    if (snapshot.presence !== 'unknown') {
      const storedThemeId = snapshot.value ?? undefined;
      selector.setActiveThemeId(storedThemeId);
      if (useCache) {
        writeLastKnownValue(storedThemeId);
      }
      hasLoadedFromStorage = true;
    } else {
      const cachedThemeId = readLastKnownValue();
      if (cachedThemeId) {
        selector.setActiveThemeId(cachedThemeId);
      }
    }

    const writeSubscription = () => {
      selector.activeThemeId$().subscribe(themeId => {
        if (selector.suppressStorageWrite) {
          return;
        }
        bucket.set(STORAGE_KEY, themeId ?? null).catch(() => {});
        if (useCache) {
          writeLastKnownValue(themeId);
        }
      });
    };

    if (hasLoadedFromStorage) {
      writeSubscription();
    }

    bucket.observe$(STORAGE_KEY).subscribe(stored => {
      const themeId = stored?.value as string | null | undefined;
      if (themeId !== selector.getActiveThemeId()) {
        selector.suppressStorageWrite = true;
        selector.setActiveThemeId(themeId ?? undefined);
        selector.suppressStorageWrite = false;
      }
      if (useCache) {
        writeLastKnownValue(themeId ?? undefined);
      }
      if (!hasLoadedFromStorage) {
        hasLoadedFromStorage = true;
        writeSubscription();
      }
    });

    if (useCache && typeof window !== 'undefined' && window.addEventListener) {
      window.addEventListener('storage', event => {
        if (event.key !== CACHE_KEY) {
          return;
        }
        const cachedThemeId = readLastKnownValue();
        const currentThemeId = selector.getActiveThemeId();
        if (cachedThemeId !== currentThemeId) {
          selector.setActiveThemeId(cachedThemeId);
        }
      });
    }

    return selector;
  }

  private activeThemeId: string | undefined;
  private readonly subject = new BehaviorSubject<string | undefined>(undefined);
  private suppressStorageWrite = false;

  constructor(private readonly themes: AppTheme[]) {}

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
    if (themeId === this.activeThemeId) {
      return;
    }
    this.activeThemeId = themeId;
    this.subject.next(themeId);
  }
}
