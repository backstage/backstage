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

import { AppTranslationApi } from '@backstage/core-plugin-api';
import i18next, { type i18n } from 'i18next';
import { initReactI18next } from 'react-i18next';

import type { AppOptions } from './types';

class AppTranslationApiImpl implements AppTranslationApi {
  static create({ modules, options }: AppOptions['initI18next'] = {}) {
    const i18n = i18next.createInstance().use(initReactI18next);

    if (modules?.length) {
      for (const module of modules) {
        i18n.use(module);
      }
    }

    const appTranslationApi = new AppTranslationApiImpl(i18n);

    i18n.on('initialized', () => {
      // If there is no backend used, there is no need to reload resources on missing key at all
      if (
        !i18n.services.backendConnector?.backend ||
        i18n.options.parseMissingKeyHandler
      ) {
        return;
      }
      i18n.options.parseMissingKeyHandler =
        appTranslationApi.parseMissingKeyHandler.bind(appTranslationApi);
    });

    i18n.init({
      fallbackLng: 'en',
      interpolation: {
        escapeValue: false,
      },
      appendNamespaceToMissingKey: true,
      ...options,
      react: {
        bindI18n: 'loaded languageChanged',
        ...options?.react,
      },
    });

    return appTranslationApi;
  }

  getI18n() {
    return this.i18n;
  }

  private readonly remoteCache = new Map<string, Set<string>>();

  private constructor(private readonly i18n: i18n) {}

  private parseMissingKeyHandler(keyWithNs: string, defaultValue?: string) {
    const { services, options, language, reloadResources } = this.i18n;

    const fallbackLanguages = services.languageUtils.getFallbackCodes(
      options.fallbackLng,
      language,
    ) as string[];

    const [ns] = keyWithNs.split(':');
    const languages = [language, ...fallbackLanguages];
    for (const lng of languages) {
      let cache = this.remoteCache.get(lng);
      if (!cache) {
        cache = new Set<string>();
        this.remoteCache.set(lng, cache);
      }
      if (cache.has(ns)) {
        continue;
      }
      cache.add(ns);
      reloadResources([lng], [ns]);
    }

    return defaultValue;
  }
}

export function createAppTranslation(initI18next?: AppOptions['initI18next']) {
  return AppTranslationApiImpl.create(initI18next);
}
