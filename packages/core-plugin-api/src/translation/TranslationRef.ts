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
  createTranslationResource,
  TranslationResource,
} from './TranslationResource';

/** @alpha */
export interface TranslationRef<
  TId extends string = string,
  TMessages extends { [key in string]: string } = { [key in string]: string },
> {
  $$type: '@backstage/TranslationRef';

  id: TId;

  T: TMessages;
}

/** @internal */
type AnyMessages = { [key in string]: string };

/** @internal */
export interface InternalTranslationRef<
  TId extends string = string,
  TMessages extends { [key in string]: string } = { [key in string]: string },
> extends TranslationRef<TId, TMessages> {
  version: 'v1';

  getDefaultMessages(): AnyMessages;

  getDefaultResource(): TranslationResource | undefined;
}

/** @alpha */
export interface TranslationRefOptions<
  TId extends string,
  TMessages extends { [key in string]: string },
  TTranslations extends {
    [language in string]: () => Promise<{
      default: { [key in keyof TMessages]: string | null };
    }>;
  },
> {
  id: TId;
  messages: TMessages;
  translations?: TTranslations;
}

/** @internal */
class TranslationRefImpl<
  TId extends string,
  TMessages extends { [key in string]: string },
> implements InternalTranslationRef<TId, TMessages>
{
  #id: TId;
  #messages: TMessages;
  #resources: TranslationResource | undefined;

  constructor(options: TranslationRefOptions<TId, TMessages, any>) {
    this.#id = options.id;
    this.#messages = options.messages;
  }

  $$type = '@backstage/TranslationRef' as const;

  version = 'v1' as const;

  get id(): TId {
    return this.#id;
  }

  get T(): never {
    throw new Error('Not implemented');
  }

  getDefaultMessages(): AnyMessages {
    return this.#messages;
  }

  setDefaultResource(resources: TranslationResource): void {
    this.#resources = resources;
  }

  getDefaultResource(): TranslationResource | undefined {
    return this.#resources;
  }

  toString() {
    return `TranslationRef{id=${this.id}}`;
  }
}

/** @alpha */
export function createTranslationRef<
  TId extends string,
  const TMessages extends { [key in string]: string },
  TTranslations extends {
    [language in string]: () => Promise<{
      default: { [key in keyof TMessages]: string | null };
    }>;
  },
>(
  config: TranslationRefOptions<TId, TMessages, TTranslations>,
): TranslationRef<TId, TMessages> {
  const ref = new TranslationRefImpl(config);
  if (config.translations) {
    ref.setDefaultResource(
      createTranslationResource({
        ref,
        translations: config.translations as any,
      }),
    );
  }
  return ref;
}

/** @internal */
export function toInternalTranslationRef<
  TId extends string,
  TMessages extends { [key in string]: string },
>(ref: TranslationRef<TId, TMessages>): InternalTranslationRef<TId, TMessages> {
  const r = ref as InternalTranslationRef<TId, TMessages>;
  if (r.$$type !== '@backstage/TranslationRef') {
    throw new Error(`Invalid translation ref, bad type '${r.$$type}'`);
  }
  if (r.version !== 'v1') {
    throw new Error(`Invalid translation ref, bad version '${r.version}'`);
  }
  return r;
}
