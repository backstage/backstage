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
  AppLanguageApi,
  TranslationApi,
  TranslationFunction,
  TranslationMessages,
  TranslationRef,
  TranslationResource,
  TranslationSnapshot,
} from '@backstage/core-plugin-api/alpha';
import {
  createInstance as createI18n,
  FormatFunction,
  Interpolator,
  TFunction,
  type i18n as I18n,
} from 'i18next';
import ObservableImpl from 'zen-observable';

// Internal import to avoid code duplication, this will lead to duplication in build output
// eslint-disable-next-line @backstage/no-relative-monorepo-imports
import {
  toInternalTranslationResource,
  InternalTranslationResourceLoader,
} from '../../../../../frontend-plugin-api/src/translation/TranslationResource';
// eslint-disable-next-line @backstage/no-relative-monorepo-imports
import {
  toInternalTranslationRef,
  InternalTranslationRef,
} from '../../../../../frontend-plugin-api/src/translation/TranslationRef';
import { Observable } from '@backstage/types';
import { DEFAULT_LANGUAGE } from '../AppLanguageApi/AppLanguageSelector';
import { createElement, Fragment, ReactNode, isValidElement } from 'react';

/** @alpha */
export interface I18nextTranslationApiOptions {
  languageApi: AppLanguageApi;
  resources?: Array<TranslationMessages | TranslationResource>;
}

function removeNulls(
  messages: Record<string, string | null>,
): Record<string, string> {
  return Object.fromEntries(
    Object.entries(messages).filter(
      (e): e is [string, string] => e[1] !== null,
    ),
  );
}

/**
 * The built-in i18next backend loading logic doesn't handle on the fly switches
 * of language very well. It gets a bit confused about whether resources are actually
 * loaded or not, so instead we implement our own resource loader.
 */
class ResourceLoader {
  /** Loaded resources by loader key */
  #loaded = new Set<string>();
  /** Resource loading promises by loader key */
  #loading = new Map<string, Promise<void>>();
  /** Loaders for each resource language */
  #loaders = new Map<string, InternalTranslationResourceLoader>();

  constructor(
    private readonly onLoad: (loaded: {
      language: string;
      namespace: string;
      messages: Record<string, string | null>;
    }) => void,
  ) {}

  addTranslationResource(resource: TranslationResource) {
    const internalResource = toInternalTranslationResource(resource);
    for (const entry of internalResource.resources) {
      const key = this.#getLoaderKey(entry.language, internalResource.id);

      // First loader to register wins, this means that resources registered in the app
      // have priority over default resource from translation refs
      if (!this.#loaders.has(key)) {
        this.#loaders.set(key, entry.loader);
      }
    }
  }

  #getLoaderKey(language: string, namespace: string) {
    return `${language}/${namespace}`;
  }

  needsLoading(language: string, namespace: string) {
    const key = this.#getLoaderKey(language, namespace);
    const loader = this.#loaders.get(key);
    if (!loader) {
      return false;
    }

    return !this.#loaded.has(key);
  }

  async load(language: string, namespace: string): Promise<void> {
    const key = this.#getLoaderKey(language, namespace);

    const loader = this.#loaders.get(key);
    if (!loader) {
      return;
    }

    if (this.#loaded.has(key)) {
      return;
    }

    const loading = this.#loading.get(key);
    if (loading) {
      await loading;
      return;
    }

    const load = loader().then(
      result => {
        this.onLoad({ language, namespace, messages: result.messages });
        this.#loaded.add(key);
      },
      error => {
        this.#loaded.add(key); // Do not try to load failed resources again
        throw error;
      },
    );
    this.#loading.set(key, load);
    await load;
  }
}

/**
 * A helper for implementing JSX interpolation
 */
export class JsxInterpolator {
  readonly #setFormatHook: (hook: FormatFunction) => void;
  readonly #marker: string;
  readonly #pattern: RegExp;

  static fromI18n(i18n: I18n) {
    const interpolator = i18n.services.interpolator as Interpolator & {
      format: FormatFunction;
    };
    const originalFormat = interpolator.format;

    let formatHook: FormatFunction | undefined;

    // This is the only way to override the format function of the interpolator
    // without overriding the default formatters. See the behavior here:
    // https://github.com/i18next/i18next/blob/c633121e57e2b6024080142d78027842bf2a6e5e/src/i18next.js#L120-L125
    interpolator.format = (value, format, lng, formatOpts) => {
      if (format) {
        return originalFormat(value, format, lng, formatOpts);
      }
      return formatHook?.(value, format, lng, formatOpts) ?? value;
    };

    return new JsxInterpolator(
      // Using a random marker to ensure it can't be misused
      Math.random().toString(36).substring(2, 8),
      hook => {
        formatHook = hook;
      },
    );
  }

  private constructor(
    marker: string,
    setFormatHook: (hook: FormatFunction) => void,
  ) {
    this.#setFormatHook = setFormatHook;
    this.#marker = marker;
    this.#pattern = new RegExp(`\\$${marker}\\(([^)]+)\\)`);
  }

  wrapT<TMessages extends { [key in string]: string }>(
    originalT: TFunction,
  ): TranslationFunction<TMessages> {
    return ((key, options) => {
      let elementsMap: Map<string, ReactNode> | undefined = undefined;

      // There's no way to override the format hook via the translation function
      // options, event though types indicate that it might be possible.
      // Instead, override the format function hook before every invocation and
      // rely on synchronous execution.
      this.#setFormatHook(value => {
        if (isValidElement(value)) {
          if (!elementsMap) {
            elementsMap = new Map();
          }
          const elementKey = elementsMap.size.toString();
          elementsMap.set(elementKey, value);

          return `$${this.#marker}(${elementKey})`;
        }
        return value;
      });

      // Overriding the return options is not allowed via TranslationFunction,
      // so this will always be a string
      const result = originalT(key, options as any) as unknown as string;
      if (!elementsMap) {
        return result;
      }

      const split = result.split(this.#pattern);

      return createElement(
        Fragment,
        null,
        ...split
          .map((part, index) => {
            if (index % 2 === 0) {
              return part;
            }
            return elementsMap?.get(part);
          })
          .filter(Boolean),
      );
    }) as TranslationFunction<TMessages>;
  }
}

/** @alpha */
export class I18nextTranslationApi implements TranslationApi {
  static create(options: I18nextTranslationApiOptions) {
    const { languages } = options.languageApi.getAvailableLanguages();

    const i18n = createI18n({
      fallbackLng: DEFAULT_LANGUAGE,
      supportedLngs: languages,
      interpolation: {
        escapeValue: false,
        // Used for the JsxInterpolator format hook
        alwaysFormat: true,
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

    const interpolator = JsxInterpolator.fromI18n(i18n);

    const { language: initialLanguage } = options.languageApi.getLanguage();
    if (initialLanguage !== DEFAULT_LANGUAGE) {
      i18n.changeLanguage(initialLanguage);
    }

    const loader = new ResourceLoader(loaded => {
      i18n.addResourceBundle(
        loaded.language,
        loaded.namespace,
        removeNulls(loaded.messages),
        false, // do not merge with existing translations
        true, // overwrite translations
      );
    });

    const resources = options?.resources || [];
    // Iterate in reverse, giving higher priority to resources registered later
    for (let i = resources.length - 1; i >= 0; i--) {
      const resource = resources[i];
      if (resource.$$type === '@backstage/TranslationResource') {
        loader.addTranslationResource(resource);
      } else if (resource.$$type === '@backstage/TranslationMessages') {
        // Overrides for default messages, created with createTranslationMessages and installed via app
        i18n.addResourceBundle(
          DEFAULT_LANGUAGE,
          resource.id,
          removeNulls(resource.messages),
          true, // merge with existing translations
          false, // do not overwrite translations
        );
      }
    }

    const instance = new I18nextTranslationApi(
      i18n,
      loader,
      options.languageApi.getLanguage().language,
      interpolator,
    );

    options.languageApi.language$().subscribe(({ language }) => {
      instance.#changeLanguage(language);
    });

    return instance;
  }

  #i18n: I18n;
  #loader: ResourceLoader;
  #language: string;
  #jsxInterpolator: JsxInterpolator;

  /** Keep track of which refs we have registered default resources for */
  #registeredRefs = new Set<string>();
  /** Notify observers when language changes */
  #languageChangeListeners = new Set<() => void>();

  private constructor(
    i18n: I18n,
    loader: ResourceLoader,
    language: string,
    jsxInterpolator: JsxInterpolator,
  ) {
    this.#i18n = i18n;
    this.#loader = loader;
    this.#language = language;
    this.#jsxInterpolator = jsxInterpolator;
  }

  getTranslation<TMessages extends { [key in string]: string }>(
    translationRef: TranslationRef<string, TMessages>,
  ): TranslationSnapshot<TMessages> {
    const internalRef = toInternalTranslationRef(translationRef);

    this.#registerDefaults(internalRef);

    return this.#createSnapshot(internalRef);
  }

  translation$<TMessages extends { [key in string]: string }>(
    translationRef: TranslationRef<string, TMessages>,
  ): Observable<TranslationSnapshot<TMessages>> {
    const internalRef = toInternalTranslationRef(translationRef);

    this.#registerDefaults(internalRef);

    return new ObservableImpl<TranslationSnapshot<TMessages>>(subscriber => {
      let loadTicket = {}; // To check for stale loads

      const loadResource = () => {
        loadTicket = {};
        const ticket = loadTicket;
        this.#loader.load(this.#language, internalRef.id).then(
          () => {
            if (ticket === loadTicket) {
              const snapshot = this.#createSnapshot(internalRef);
              if (snapshot.ready) {
                subscriber.next(snapshot);
              }
            }
          },
          error => {
            if (ticket === loadTicket) {
              subscriber.error(Array.isArray(error) ? error[0] : error);
            }
          },
        );
      };

      const onChange = () => {
        const snapshot = this.#createSnapshot(internalRef);
        if (snapshot.ready) {
          subscriber.next(snapshot);
        } else {
          loadResource();
        }
      };

      if (this.#loader.needsLoading(this.#language, internalRef.id)) {
        loadResource();
      }

      this.#languageChangeListeners.add(onChange);
      return () => {
        this.#languageChangeListeners.delete(onChange);
      };
    });
  }

  #changeLanguage(language: string): void {
    if (this.#language !== language) {
      this.#language = language;
      this.#i18n.changeLanguage(language);
      this.#languageChangeListeners.forEach(listener => listener());
    }
  }

  #createSnapshot<TMessages extends { [key in string]: string }>(
    internalRef: InternalTranslationRef<string, TMessages>,
  ): TranslationSnapshot<TMessages> {
    if (this.#loader.needsLoading(this.#language, internalRef.id)) {
      return { ready: false };
    }

    const unwrappedT = this.#i18n.getFixedT(null, internalRef.id);
    const t = this.#jsxInterpolator.wrapT<TMessages>(unwrappedT);

    return {
      ready: true,
      t,
    };
  }

  #registerDefaults(internalRef: InternalTranslationRef): void {
    if (this.#registeredRefs.has(internalRef.id)) {
      return;
    }
    this.#registeredRefs.add(internalRef.id);

    const defaultMessages = internalRef.getDefaultMessages();
    this.#i18n.addResourceBundle(
      DEFAULT_LANGUAGE,
      internalRef.id,
      defaultMessages,
      true, // merge with existing translations
      false, // do not overwrite translations
    );

    const defaultResource = internalRef.getDefaultResource();
    if (defaultResource) {
      this.#loader.addTranslationResource(defaultResource);
    }
  }
}
