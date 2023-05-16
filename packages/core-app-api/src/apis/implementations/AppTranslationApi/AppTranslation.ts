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
  AppTranslationApi,
  LocalConfig,
  Locals,
} from '@backstage/core-plugin-api';
import { Observable } from '@backstage/types';
import { BehaviorSubject } from '../../../lib/subjects';
import i18n, { i18n as i18nType } from 'i18next';
import { initReactI18next } from 'react-i18next';

const STORAGE_KEY = 'language';
const DEFAULT_OPTIONS = {
  lng: 'en',
  interpolation: {
    escapeValue: false,
  },
  languageOptions: [],
};

/**
 * Exposes the locals installed in the app, and permits switching the currently
 * active language.
 *
 * @public
 */
export class AppTranslation implements AppTranslationApi {
  instance!: i18nType;

  static createWithStorage(options?: LocalConfig) {
    const finallyOptions = {
      ...DEFAULT_OPTIONS,
      ...(options || {}),
    };

    if (finallyOptions?.resources) {
      const languages = Object.keys(finallyOptions.resources);
      finallyOptions.languageOptions = new Set([
        ...finallyOptions.languageOptions,
        ...languages,
      ]);
    }

    const i18nInstance = i18n.createInstance();
    i18nInstance.use(initReactI18next).init(finallyOptions);

    if (finallyOptions?.lazyResources) {
      finallyOptions?.lazyResources().then(_resources => {
        const resources = _resources || {};
        const languages = Object.keys(resources);
        languages.forEach(l => {
          Object.keys(resources[l]).forEach(ns => {
            i18nInstance.addResourceBundle?.(
              l,
              ns,
              resources[l][ns],
              true,
              true,
            );
          });
        });

        finallyOptions.languageOptions = new Set([
          ...finallyOptions.languageOptions,
          ...languages,
        ]);
      });
    }

    const appTranslation = new AppTranslation(finallyOptions);
    appTranslation.instance = i18nInstance;

    if (!window.localStorage) {
      return appTranslation;
    }

    const initialLanguage =
      window.localStorage.getItem(STORAGE_KEY) ??
      finallyOptions.lng ??
      finallyOptions.fallbackLng;

    appTranslation.setActiveLanguage(initialLanguage);

    appTranslation.activeLanguage$().subscribe(language => {
      if (language) {
        window.localStorage.setItem(STORAGE_KEY, language);
      } else {
        window.localStorage.removeItem(STORAGE_KEY);
      }
    });

    window.addEventListener('storage', event => {
      if (event.key === STORAGE_KEY) {
        const language =
          localStorage.getItem(STORAGE_KEY) ??
          (finallyOptions.fallbackLng as string);
        appTranslation.setActiveLanguage(language);
      }
    });

    return appTranslation;
  }

  private activeLanguage!: string;
  private readonly subject = new BehaviorSubject<string>('');
  private constructor(private readonly options: LocalConfig) {}

  getI18next() {
    return this.instance;
  }

  activeLanguage$(): Observable<string> {
    return this.subject;
  }

  getActiveLanguage(): string {
    return this.activeLanguage;
  }

  setActiveLanguage(language: string | undefined): void {
    this.activeLanguage = language || (this.options.fallbackLng as string);
    this.instance.changeLanguage(this.activeLanguage);
    this.subject.next(this.activeLanguage);
  }

  addResources(locals: Locals, ns: string) {
    Object.keys(locals).forEach(l => {
      // set overwrite to false, then locals set by createApp will be effected
      this.instance.addResourceBundle(l, ns, locals[l], true, false);
    });
  }

  getLanguages() {
    return Array.from(this.options.languageOptions as Set<string>);
  }
}
