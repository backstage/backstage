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

/** @alpha */
export interface TranslationRef<
  TMessages extends { [key in string]: string } = { [key in string]: string },
  TId extends string = string,
> {
  $$type: '@backstage/TranslationRef';

  id: TId;

  T: TMessages;
}

/** @internal */
type AnyMessages = { [key in string]: string };

/** @internal */
export interface InternalTranslationRef<
  TMessages extends { [key in string]: string } = { [key in string]: string },
  TId extends string = string,
> extends TranslationRef<TMessages, TId> {
  version: 'v1';

  getDefaultMessages(): AnyMessages;

  getResources(): Record<string, AnyMessages> | undefined;

  getLazyResources():
    | Record<string, () => Promise<{ messages: AnyMessages }>>
    | undefined;
}

/** @alpha */
export interface TranslationRefOptions<
  TMessages extends { [key in string]: string },
  TId extends string = string,
> {
  id: TId;
  messages: TMessages;
  lazyResources?: Record<string, () => Promise<{ messages: TMessages }>>;
  resources?: Record<string, TMessages>;
}

/** @internal */
class TranslationRefImpl<
  TMessages extends { [key in string]: string },
  TId extends string = string,
> implements InternalTranslationRef<TMessages, TId>
{
  constructor(
    private readonly options: TranslationRefOptions<TMessages, TId>,
  ) {}

  $$type = '@backstage/TranslationRef' as const;

  version = 'v1' as const;

  get id(): TId {
    return this.options.id;
  }

  get T(): never {
    throw new Error('Not implemented');
  }

  getDefaultMessages(): AnyMessages {
    return this.options.messages;
  }

  getLazyResources():
    | Record<string, () => Promise<{ messages: AnyMessages }>>
    | undefined {
    return this.options.lazyResources;
  }

  getResources(): Record<string, AnyMessages> | undefined {
    return this.options.resources;
  }

  toString() {
    return `TranslationRef{id=${this.id}}`;
  }
}

/** @alpha */
export function createTranslationRef<
  TMessages extends { [key in string]: string },
  TId extends string = string,
>(
  config: TranslationRefOptions<TMessages, TId>,
): TranslationRef<TMessages, TId> {
  return new TranslationRefImpl(config);
}

/** @internal */
export function toInternalTranslationRef(
  ref: TranslationRef,
): InternalTranslationRef {
  const r = ref as InternalTranslationRef;
  if (r.$$type !== '@backstage/TranslationRef') {
    throw new Error(`Invalid translation ref, bad type '${r.$$type}'`);
  }
  if (r.version !== 'v1') {
    throw new Error(`Invalid translation ref, bad version '${r.version}'`);
  }
  return r;
}
