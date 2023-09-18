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
  TranslationMessages,
  TranslationRef,
} from '@backstage/core-plugin-api/alpha';

/** @alpha */
export interface TranslationResource<TId extends string = string> {
  $$type: '@backstage/TranslationResource';
  id: TId;
}

/** @internal */
export type InternalTranslationResourceLoader = () => Promise<{
  messages: { [key in string]: string | null };
}>;

/** @internal */
export interface InternalTranslationResource<TId extends string = string>
  extends TranslationResource<TId> {
  version: 'v1';
  resources: Array<{
    language: string;
    loader: InternalTranslationResourceLoader;
  }>;
}

/** @internal */
export function toInternalTranslationResource<TId extends string>(
  resource: TranslationResource<TId>,
): InternalTranslationResource<TId> {
  const r = resource as InternalTranslationResource<TId>;
  if (r.$$type !== '@backstage/TranslationResource') {
    throw new Error(`Invalid translation resource, bad type '${r.$$type}'`);
  }
  if (r.version !== 'v1') {
    throw new Error(`Invalid translation resource, bad version '${r.version}'`);
  }

  return r;
}

/** @alpha */
export interface TranslationResourceOptions<
  TId extends string,
  TMessages extends { [key in string]: string },
  TTranslations extends {
    [language in string]: () => Promise<{
      default:
        | TranslationMessages<TId>
        | { [key in keyof TMessages]: string | null };
    }>;
  },
> {
  ref: TranslationRef<TId, TMessages>;

  translations: TTranslations;
}

/** @alpha */
export function createTranslationResource<
  TId extends string,
  TMessages extends { [key in string]: string },
  TTranslations extends {
    [language in string]: () => Promise<{
      default:
        | TranslationMessages<TId>
        | { [key in keyof TMessages]: string | null };
    }>;
  },
>(
  options: TranslationResourceOptions<TId, TMessages, TTranslations>,
): TranslationResource<TId> {
  return {
    $$type: '@backstage/TranslationResource',
    version: 'v1',
    id: options.ref.id,
    resources: Object.entries(options.translations).map(
      ([language, loader]) => ({
        language,
        loader: () =>
          loader().then(m => {
            const value = m.default;
            return {
              messages:
                value?.$$type === '@backstage/TranslationMessages'
                  ? value.messages
                  : value,
            };
          }),
      }),
    ),
  } as InternalTranslationResource<TId>;
}
