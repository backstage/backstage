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
  Resources,
  TranslationRef,
} from '@backstage/core-plugin-api';
import i18next, { type i18n } from 'i18next';
import { initReactI18next } from 'react-i18next';

/**
 * Exposes the locals installed in the app, and permits switching the currently
 * active language.
 *
 * @public
 */
export class AppTranslation implements AppTranslationApi {
  static create(
    initI18next: (i18next: i18n) => void = this.defaultInitI18next,
  ) {
    const i18n = i18next.createInstance();

    initI18next(i18n.use(initReactI18next));

    return new AppTranslation(i18n);
  }

  private static defaultInitI18next(i18n: i18n) {
    i18n.init({
      supportedLngs: [],
      interpolation: {
        escapeValue: false,
      },
      react: {
        useSuspense: false,
      },
    });
  }

  private readonly translationRefCache = new WeakMap<
    TranslationRef,
    Set<string>
  >();

  private constructor(private instance: i18n) {}

  getI18next() {
    return this.instance;
  }

  addResources(ns: string, resources: Resources) {
    Object.keys(resources).forEach(l => {
      // set overwrite to false, otherwise resources set by createApp will be effected
      this.instance.addResourceBundle(l, ns, resources[l], true, false);
    });
  }

  addPluginResources(translationRef: TranslationRef) {
    let cache = this.translationRefCache.get(translationRef);

    if (!cache) {
      cache = new Set<string>();
      this.translationRefCache.set(translationRef, cache);
    }

    const { language, services, options } = this.instance;

    if (cache.has(language)) {
      return;
    }

    cache.add(language);

    // when there is a backend used, we enforce a reload of resources once
    // for overriding the ones set by plugin
    if (services.backendConnector?.backend) {
      // current language could also rely on fallbackLng to be functional
      // correctly, we need to load all fallbackCodes as well
      const fallbackCodes: string[] = services.languageUtils.getFallbackCodes(
        options.fallbackLng,
        language,
      );
      for (const lng of fallbackCodes) {
        cache.add(lng);
      }
      const loadLngs = new Set([language, ...fallbackCodes]);
      this.instance.reloadResources([...loadLngs], translationRef.id);
    }

    if (translationRef.resources) {
      this.addResources(translationRef.id, translationRef.resources);
    }
  }
}
