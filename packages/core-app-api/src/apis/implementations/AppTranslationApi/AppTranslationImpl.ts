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
  TranslationMessages,
  TranslationRef,
  TranslationResource,
} from '@backstage/core-plugin-api/alpha';
import {
  BackendModule,
  createInstance as createI18n,
  type i18n,
} from 'i18next';
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

const DEFAULT_LANGUAGE = 'en';

/** @alpha */
export type ExperimentalI18n = {
  supportedLanguages?: string[];
  resources?: Array<TranslationMessages | TranslationResource>;
};

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
 * A wrapper around a i18next plugin that helps us lazy load resources that have been
 * registered in the app or provided through translation refs.
 *
 * Since all resources are registered before use it is safe to just look at the
 * existing resources when loading a namespace + language tuple.
 */
class LazyResources {
  #seen = new Set<TranslationResource>();
  #loaders = new Map<string, InternalTranslationResourceLoader>();

  addResource(resource: TranslationResource) {
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

  hasResource(lng: string, ns: string) {
    return this.#loaders.has(this.#getLoaderKey(lng, ns));
  }

  async #loadResource(lng: string, ns: string) {
    const loader = this.#loaders.get(this.#getLoaderKey(lng, ns));
    if (!loader) {
      return undefined;
    }

    return loader().then(result => removeNulls(result.messages));
  }

  #getLoaderKey(lng: string, ns: string) {
    return `${lng}/${ns}`;
  }

  plugin: BackendModule = {
    type: 'backend',
    init() {},
    read: (lng, ns) => this.#loadResource(lng, ns),
    save() {},
    create() {},
  };
}

/** @alpha */
export interface TranslationOptions {
  /* no options supported for now */
}

export type TranslationSnapshot<TMessages extends { [key in string]: string }> =

    | { ready: false }
    | {
        ready: true;
        t<TKey extends keyof TMessages>(
          key: TKey,
          options?: TranslationOptions,
        ): TMessages[TKey];
      };

/** @alpha */
export class AppTranslationApiImpl implements AppTranslationApi {
  static create(options?: ExperimentalI18n) {
    const languages = options?.supportedLanguages || [DEFAULT_LANGUAGE];
    if (!languages.includes(DEFAULT_LANGUAGE)) {
      throw new Error(`Supported languages must include '${DEFAULT_LANGUAGE}'`);
    }
    const lazyResources = new LazyResources();
    const i18n = createI18n({
      fallbackLng: DEFAULT_LANGUAGE,
      supportedLngs: languages,
      interpolation: {
        escapeValue: false,
      },
      ns: [],
      defaultNS: false,
      fallbackNS: false,
    }).use(lazyResources.plugin);

    i18n.init();

    const resources = options?.resources || [];
    // Iterate in reverse, giving higher priority to resources registered later
    for (let i = resources.length - 1; i >= 0; i--) {
      const resource = resources[i];
      if (resource.$$type === '@backstage/TranslationResource') {
        lazyResources.addResource(resource);
      } else if (resource.$$type === '@backstage/TranslationMessages') {
        // Overrides for default messages, created with createTranslationMessages and installed via app
        i18n.addResourceBundle(
          DEFAULT_LANGUAGE,
          resource.id,
          removeNulls(resource.messages),
          true,
          false,
        );
      }
    }

    return new AppTranslationApiImpl(i18n, lazyResources, languages);
  }

  #i18n: i18n;
  #lazyResources: LazyResources;
  #language: string;
  #languages: string[];

  private constructor(
    i18n: i18n,
    lazyResources: LazyResources,
    languages: string[],
  ) {
    this.#i18n = i18n;
    this.#lazyResources = lazyResources;
    this.#language = DEFAULT_LANGUAGE;
    this.#languages = languages;
  }

  getAvailableLanguages(): string[] {
    return this.#languages.slice();
  }

  async changeLanguage(language?: string): Promise<void> {
    const lng = language ?? DEFAULT_LANGUAGE;
    if (lng && !this.#languages.includes(lng)) {
      throw new Error(
        `Failed to change language to '${lng}', available languages are '${this.#languages.join(
          "', '",
        )}'`,
      );
    }
    this.#language = lng;
    await this.#i18n.changeLanguage(lng);
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
        this.#i18n.loadNamespaces(internalRef.id, error => {
          if (ticket !== loadTicket) {
            return;
          }
          if (error) {
            subscriber.error(Array.isArray(error) ? error[0] : error);
          } else {
            const snapshot = this.#createSnapshot(internalRef);
            if (snapshot.ready || lastSnapshotWasReady) {
              lastSnapshotWasReady = snapshot.ready;
              subscriber.next(snapshot);
            }
          }
        });
      };

      const onChange = () => {
        const snapshot = this.#createSnapshot(internalRef);
        if (lastSnapshotWasReady && !snapshot.ready) {
          subscriber.next(snapshot);
        }

        if (!snapshot.ready) {
          loadResource();
        }
      };

      this.#i18n.on('initialized', onChange);
      this.#i18n.on('languageChanged', onChange);

      if (this.#needsToLoadResource(internalRef)) {
        loadResource();
      }

      return () => {
        this.#i18n.off('initialized', onChange);
        this.#i18n.off('languageChanged', onChange);
      };
    });
  }

  #createSnapshot<TMessages extends { [key in string]: string }>(
    internalRef: InternalTranslationRef<string, TMessages>,
  ): TranslationSnapshot<TMessages> {
    if (this.#needsToLoadResource(internalRef)) {
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

  #needsToLoadResource({ id }: InternalTranslationRef): boolean {
    if (!this.#lazyResources.hasResource(this.#language, id)) {
      return false;
    }
    return !this.#i18n.hasResourceBundle(this.#language, id);
  }

  #registerDefaultResource(internalRef: InternalTranslationRef): void {
    const defaultResource = internalRef.getDefaultResource();
    if (defaultResource) {
      this.#lazyResources.addResource(defaultResource);
    }
  }
}
