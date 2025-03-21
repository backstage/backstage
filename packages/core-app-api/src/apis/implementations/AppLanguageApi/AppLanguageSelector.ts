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
import { Observable } from '@backstage/types';
import { BehaviorSubject } from '../../../lib';

const STORAGE_KEY = 'language';
export const DEFAULT_LANGUAGE = 'en';

/** @alpha */
export interface AppLanguageSelectorOptions {
  defaultLanguage?: string;
  availableLanguages?: string[];
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
    if (!languages.includes(DEFAULT_LANGUAGE)) {
      throw new Error(`Supported languages must include '${DEFAULT_LANGUAGE}'`);
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

    if (!window.localStorage) {
      return selector;
    }

    const storedLanguage = window.localStorage.getItem(STORAGE_KEY);
    const { languages } = selector.getAvailableLanguages();
    if (storedLanguage && languages.includes(storedLanguage)) {
      selector.setLanguage(storedLanguage);
    }

    selector.language$().subscribe(({ language }) => {
      if (language !== window.localStorage.getItem(STORAGE_KEY)) {
        window.localStorage.setItem(STORAGE_KEY, language);
      }
    });

    window.addEventListener('storage', event => {
      if (event.key === STORAGE_KEY) {
        const language = localStorage.getItem(STORAGE_KEY) ?? undefined;
        if (language) {
          selector.setLanguage(language);
        }
      }
    });

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
