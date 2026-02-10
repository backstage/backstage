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
import { StorageApi } from '@backstage/core-plugin-api';
import { AppLanguageApi } from '@backstage/core-plugin-api/alpha';
import { Observable } from '@backstage/types';
import { BehaviorSubject } from '../../../lib';

const STORAGE_KEY = 'language';
export const DEFAULT_LANGUAGE = 'en';
const BUCKET_NAME = 'userSettings';
const CACHE_KEY = `/${BUCKET_NAME}/${STORAGE_KEY}`;

/** @alpha */
export interface AppLanguageSelectorOptions {
  defaultLanguage?: string;
  availableLanguages?: string[];
  storageApi?: StorageApi;
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

    return new AppLanguageSelector(languages, initialLanguage);
  }

  static createWithStorage(options?: AppLanguageSelectorOptions) {
    const selector = AppLanguageSelector.create(options);
    const storageApi = options?.storageApi;

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
        if (cached === null) return undefined;
        const parsed = JSON.parse(cached);
        return typeof parsed === 'string' ? parsed : undefined;
      } catch {
        return undefined;
      }
    };

    const writeLastKnownValue = (language: string | undefined): void => {
      if (typeof window === 'undefined' || !window.localStorage) {
        return;
      }
      try {
        if (language === undefined) {
          window.localStorage.removeItem(CACHE_KEY);
          return;
        }
        window.localStorage.setItem(CACHE_KEY, JSON.stringify(language));
      } catch {
        // Ignore localStorage errors
      }
    };

    const bucket = storageApi.forBucket(BUCKET_NAME);
    const snapshot = bucket.snapshot<string | null>(STORAGE_KEY);
    const useCache = snapshot.presence === 'unknown';
    let hasLoadedFromStorage = false;
    if (snapshot.presence !== 'unknown') {
      const storedLanguage = snapshot.value ?? undefined;
      const { languages } = selector.getAvailableLanguages();
      if (storedLanguage && languages.includes(storedLanguage)) {
        selector.setLanguage(storedLanguage);
      }
      if (useCache) {
        writeLastKnownValue(storedLanguage);
      }
      hasLoadedFromStorage = true;
    } else {
      const cachedLanguage = readLastKnownValue();
      const { languages } = selector.getAvailableLanguages();
      if (cachedLanguage && languages.includes(cachedLanguage)) {
        selector.setLanguage(cachedLanguage);
      }
    }

    const writeSubscription = () => {
      selector.language$().subscribe(({ language }) => {
        bucket.set(STORAGE_KEY, language).catch(() => {});
        if (useCache) {
          writeLastKnownValue(language);
        }
      });
    };

    if (hasLoadedFromStorage) {
      writeSubscription();
    }

    bucket.observe$(STORAGE_KEY).subscribe(stored => {
      const language = stored?.value as string | null | undefined;
      if (language && language !== selector.getLanguage().language) {
        selector.setLanguage(language);
      }
      if (useCache) {
        writeLastKnownValue(language ?? undefined);
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
        const cachedLanguage = readLastKnownValue();
        if (
          cachedLanguage &&
          cachedLanguage !== selector.getLanguage().language
        ) {
          selector.setLanguage(cachedLanguage);
        }
      });
    }

    return selector;
  }

  #languages: string[];
  #language: string;
  #subject: BehaviorSubject<{ language: string }>;

  private constructor(languages: string[], initialLanguage: string) {
    this.#languages = languages;
    this.#language = initialLanguage;
    this.#subject = new BehaviorSubject<{ language: string }>({
      language: this.#language,
    });
  }

  getAvailableLanguages(): { languages: string[] } {
    return { languages: this.#languages.slice() };
  }

  setLanguage(language?: string | undefined): void {
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
    this.#subject.next({ language: lng });
  }

  getLanguage(): { language: string } {
    return { language: this.#language };
  }

  language$(): Observable<{ language: string }> {
    return this.#subject;
  }
}
