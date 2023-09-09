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

import {
  AppTranslationApi,
  TranslationRef,
} from '@backstage/core-plugin-api/alpha';
import i18next, { type i18n } from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import { TranslationMessages } from '../../../alpha';

/** @alpha */
export type ExperimentalI18n = {
  supportedLanguages: string[];
  fallbackLanguage?: string | string[];
  messages?: Array<{
    ref: TranslationRef;
    messages?: Record<string, TranslationMessages<TranslationRef>>;
    lazyMessages: Record<
      string,
      () => Promise<{ messages: TranslationMessages<TranslationRef> }>
    >;
  }>;
};

/** @alpha */
export class AppTranslationApiImpl implements AppTranslationApi {
  static create(options?: ExperimentalI18n) {
    const i18n = i18next.createInstance().use(initReactI18next);

    i18n.use(LanguageDetector);

    i18n.init({
      fallbackLng: options?.fallbackLanguage || 'en',
      supportedLngs: options?.supportedLanguages || ['en'],
      interpolation: {
        escapeValue: false,
      },
      react: {
        bindI18n: 'loaded languageChanged',
      },
    });

    return new AppTranslationApiImpl(i18n, options);
  }

  private readonly cache = new WeakSet<TranslationRef>();
  private readonly lazyCache = new WeakMap<TranslationRef, Set<string>>();

  getI18n() {
    return this.i18n;
  }

  initMessages(options?: ExperimentalI18n) {
    if (options?.messages?.length) {
      options.messages.forEach(appMessage => {
        if (appMessage.messages) {
          this.addResources(appMessage.ref, appMessage.messages);
        }

        if (appMessage.lazyMessages) {
          this.addLazyResources(appMessage.ref, appMessage.lazyMessages);
        }
      });
    }
  }

  addResourcesByRef<Messages extends Record<string, string>>(
    translationRef: TranslationRef<Messages>,
  ): void {
    this.addResources(translationRef);
    this.addLazyResources(translationRef);
  }

  addResources<Messages extends Record<string, string>>(
    translationRef: TranslationRef<Messages>,
    initResources?: Record<
      string,
      TranslationMessages<TranslationRef<Messages>>
    >,
  ) {
    const resources = initResources || translationRef.getResources();
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

  addLazyResources<Messages extends Record<string, string>>(
    translationRef: TranslationRef<Messages>,
    initResources?: Record<
      string,
      () => Promise<{ messages: TranslationMessages<TranslationRef> }>
    >,
  ) {
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
    const lazyResources = initResources || translationRef.getLazyResources();

    Promise.allSettled((options.supportedLngs || []).map(addLanguage)).then(
      results => {
        if (results.some(result => result.status === 'fulfilled')) {
          this.i18n.emit('loaded');
        }
      },
    );

    async function addLanguage(language: string) {
      if (cache!.has(language)) {
        return;
      }

      cache!.add(language);

      let loadBackend: Promise<void> | undefined;

      if (services.backendConnector?.backend) {
        loadBackend = reloadResources([language], [namespace]);
      }

      const loadLazyResources = lazyResources?.[language];

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

  private constructor(private readonly i18n: i18n, options?: ExperimentalI18n) {
    this.initMessages(options);
  }
}
