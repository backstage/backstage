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
  TranslationMessages,
  TranslationRef,
  TranslationResource,
  TranslationSnapshot,
} from '@backstage/core-plugin-api/alpha';
import { createInstance as createI18n, type i18n as I18n } from 'i18next';
import ObservableImpl from 'zen-observable';

// Internal import to avoid code duplication, this will lead to duplication in build output
// eslint-disable-next-line @backstage/no-relative-monorepo-imports
import {
  toInternalTranslationResource,
  InternalTranslationResourceLoader,
} from '../../../../../core-plugin-api/src/translation/TranslationResource';
// eslint-disable-next-line @backstage/no-relative-monorepo-imports
import {
  toInternalTranslationRef,
  InternalTranslationRef,
} from '../../../../../core-plugin-api/src/translation/TranslationRef';
import { Observable } from '@backstage/types';
import { DEFAULT_LANGUAGE } from '../AppLanguageApi/AppLanguageSelector';

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
  /** The resources that have been registered */
  #seen = new Set<TranslationResource>();

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
    if (this.#seen.has(resource)) {
      return;
    }
    this.#seen.add(resource);
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

    const load = loader().then(result => {
      this.onLoad({ language, namespace, messages: result.messages });
      this.#loaded.add(key);
    });
    this.#loading.set(key, load);
    await load;
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
      },
      ns: [],
      defaultNS: false,
      fallbackNS: false,
    });

    i18n.init();

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
    );

    options.languageApi.language$().subscribe(({ language }) => {
      instance.#changeLanguage(language);
    });

    return instance;
  }

  #i18n: I18n;
  #loader: ResourceLoader;
  #language: string;

  private constructor(i18n: I18n, loader: ResourceLoader, language: string) {
    this.#i18n = i18n;
    this.#loader = loader;
    this.#language = language;
  }

  getTranslation<TMessages extends { [key in string]: string }>(
    translationRef: TranslationRef<string, TMessages>,
  ): TranslationSnapshot<TMessages> {
    const internalRef = toInternalTranslationRef(translationRef);

    this.#registerDefaultResource(internalRef);

    return this.#createSnapshot(internalRef);
  }

  translation$<TMessages extends { [key in string]: string }>(
    translationRef: TranslationRef<string, TMessages>,
  ): Observable<TranslationSnapshot<TMessages>> {
    const internalRef = toInternalTranslationRef(translationRef);

    this.#registerDefaultResource(internalRef);

    return new ObservableImpl<TranslationSnapshot<TMessages>>(subscriber => {
      let loadTicket = {}; // To check for stale loads
      let lastSnapshotWasReady = false;

      const loadResource = () => {
        loadTicket = {};
        const ticket = loadTicket;
        this.#loader.load(this.#language, internalRef.id).then(
          () => {
            if (ticket === loadTicket) {
              const snapshot = this.#createSnapshot(internalRef);
              if (snapshot.ready || lastSnapshotWasReady) {
                lastSnapshotWasReady = snapshot.ready;
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
        if (lastSnapshotWasReady && !snapshot.ready) {
          lastSnapshotWasReady = snapshot.ready;
          subscriber.next(snapshot);
        }

        if (!snapshot.ready) {
          loadResource();
        }
      };

      const wasInitialized = this.#i18n.isInitialized;
      if (!wasInitialized) {
        this.#i18n.on('initialized', onChange);
      }
      this.#i18n.on('languageChanged', onChange);

      if (this.#loader.needsLoading(this.#language, internalRef.id)) {
        loadResource();
      }

      return () => {
        if (!wasInitialized) {
          this.#i18n.off('initialized', onChange);
        }
        this.#i18n.off('languageChanged', onChange);
      };
    });
  }

  #changeLanguage(language: string): void {
    if (this.#language !== language) {
      this.#language = language;
      this.#i18n.changeLanguage(language);
    }
  }

  #createSnapshot<TMessages extends { [key in string]: string }>(
    internalRef: InternalTranslationRef<string, TMessages>,
  ): TranslationSnapshot<TMessages> {
    if (this.#loader.needsLoading(this.#language, internalRef.id)) {
      return { ready: false };
    }

    const t = this.#i18n.getFixedT(null, internalRef.id);
    const defaultMessages = internalRef.getDefaultMessages() as TMessages;

    return {
      ready: true,
      t: (key, options) => {
        return t(key as string, {
          ...options,
          defaultValue: defaultMessages[key],
        });
      },
    };
  }

  #registerDefaultResource(internalRef: InternalTranslationRef): void {
    const defaultResource = internalRef.getDefaultResource();
    if (defaultResource) {
      this.#loader.addTranslationResource(defaultResource);
    }
  }
}
