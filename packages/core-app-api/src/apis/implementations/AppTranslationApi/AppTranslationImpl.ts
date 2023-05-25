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

import { AppTranslationApi, TranslationRef } from '@backstage/core-plugin-api';
import i18next, { type i18n } from 'i18next';
import { initReactI18next } from 'react-i18next';

import { AppOptions } from '../../../app';

export class AppTranslationApiImpl implements AppTranslationApi {
  static create({ modules, options }: AppOptions['initI18next'] = {}) {
    const i18n = i18next.createInstance().use(initReactI18next);

    if (modules?.length) {
      for (const module of modules) {
        i18n.use(module);
      }
    }

    i18n.init({
      fallbackLng: 'en',
      interpolation: {
        escapeValue: false,
      },
      ...options,
      react: {
        bindI18n: 'loaded languageChanged',
        ...options?.react,
      },
    });

    return new AppTranslationApiImpl(i18n);
  }

  private readonly cache = new WeakSet<TranslationRef>();
  private readonly lazyCache = new WeakMap<TranslationRef, Set<string>>();

  getI18n() {
    return this.i18n;
  }

  useTranslationRef<
    LazyMessages extends Record<string, string>,
    Messages extends Record<string, string>,
  >(translationRef: TranslationRef<LazyMessages, Messages>): void {
    this.useResources(translationRef);
    this.useLazyResources(translationRef);
  }

  useResources<
    LazyMessages extends Record<string, string>,
    Messages extends Record<string, string>,
  >(translationRef: TranslationRef<LazyMessages, Messages>) {
    const resources = translationRef.getResources();
    if (!resources || this.cache.has(translationRef)) {
      return;
    }
    this.cache.add(translationRef);
    Object.entries(resources).forEach(([language, messages]) => {
      this.i18n.addResourceBundle(
        language,
        translationRef.getId(),
        messages,
        true,
        false,
      );
    });
  }

  useLazyResources<
    LazyMessages extends Record<string, string>,
    Messages extends Record<string, string>,
  >(translationRef: TranslationRef<LazyMessages, Messages>) {
    let cache = this.lazyCache.get(translationRef);

    if (!cache) {
      cache = new Set();
      this.lazyCache.set(translationRef, cache);
    }

    const {
      language: currentLanguage,
      services,
      options,
      addResourceBundle,
      reloadResources,
    } = this.i18n;

    if (cache.has(currentLanguage)) {
      return;
    }

    const namespace = translationRef.getId();
    const lazyResources = translationRef.getLazyResources();

    const fallbackLanguages = services.languageUtils.getFallbackCodes(
      options.fallbackLng,
      currentLanguage,
    ) as string[];

    Promise.allSettled(
      [...fallbackLanguages, currentLanguage].map(addLanguage),
    ).then(results => {
      if (results.some(result => result.status === 'fulfilled')) {
        this.i18n.emit('loaded');
      }
    });

    async function addLanguage(language: string) {
      if (cache!.has(language)) {
        return;
      }

      cache!.add(language);

      let loadBackend: Promise<void> | undefined;

      if (services.backendConnector?.backend) {
        loadBackend = reloadResources([language], [namespace]);
      }

      const loadLazyResources = lazyResources[language];

      if (!loadLazyResources) {
        await loadBackend;
        return;
      }

      const [result] = await Promise.allSettled([
        loadLazyResources(),
        loadBackend,
      ]);

      if (result.status === 'rejected') {
        throw result.reason;
      }

      addResourceBundle(
        language,
        namespace,
        result.value.messages,
        true,
        false,
      );
    }
  }

  private constructor(private readonly i18n: i18n) {}
}
