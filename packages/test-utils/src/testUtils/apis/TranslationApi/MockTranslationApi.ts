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
  TranslationApi,
  TranslationComponent,
  TranslationFunction,
  TranslationRef,
  TranslationSnapshot,
} from '@backstage/core-plugin-api/alpha';
import { createInstance as createI18n, type i18n as I18n } from 'i18next';
import ObservableImpl from 'zen-observable';

import { Observable } from '@backstage/types';
// Internal import to avoid code duplication, this will lead to duplication in build output
// eslint-disable-next-line @backstage/no-relative-monorepo-imports
import { toInternalTranslationRef } from '../../../../../core-plugin-api/src/translation/TranslationRef';

const DEFAULT_LANGUAGE = 'en';

/**
 * @alpha
 * @deprecated Use `mockApis` from `@backstage/test-utils` instead
 */
export class MockTranslationApi implements TranslationApi {
  static create() {
    const i18n = createI18n({
      fallbackLng: DEFAULT_LANGUAGE,
      supportedLngs: [DEFAULT_LANGUAGE],
      interpolation: {
        escapeValue: false,
      },
      ns: [],
      defaultNS: false,
      fallbackNS: false,

      // Disable resource loading on init, meaning i18n will be ready to use immediately
      initImmediate: false,
    });

    i18n.init();
    if (!i18n.isInitialized) {
      throw new Error('i18next was unexpectedly not initialized');
    }

    return new MockTranslationApi(i18n);
  }

  #i18n: I18n;
  #registeredRefs = new Set<string>();

  private constructor(i18n: I18n) {
    this.#i18n = i18n;
  }

  getTranslation<TMessages extends { [key in string]: string }>(
    translationRef: TranslationRef<string, TMessages>,
  ): TranslationSnapshot<TMessages> {
    const internalRef = toInternalTranslationRef(translationRef);

    if (!this.#registeredRefs.has(internalRef.id)) {
      this.#registeredRefs.add(internalRef.id);
      this.#i18n.addResourceBundle(
        DEFAULT_LANGUAGE,
        internalRef.id,
        internalRef.getDefaultMessages(),
        false, // do not merge
        true, // overwrite existing
      );
    }

    const t = this.#i18n.getFixedT(
      null,
      internalRef.id,
    ) as TranslationFunction<TMessages>;

    return {
      ready: true,
      t,
    };
  }

  translation$<TMessages extends { [key in string]: string }>(): Observable<
    TranslationSnapshot<TMessages>
  > {
    // No need to implement, getTranslation will always return a ready snapshot
    return new ObservableImpl<TranslationSnapshot<TMessages>>(_subscriber => {
      return () => {};
    });
  }

  getTranslationComponent<TMessages extends { [key in string]: string }>(
    _t: TranslationFunction<TMessages>,
  ): TranslationComponent<TMessages> {
    return ({ children }) => children;
  }
}
