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

/** @ignore */
type AnyNestedMessages = { [key in string]: AnyNestedMessages | string };

/**
 * Flattens a nested message declaration into a flat object with dot-separated keys.
 *
 * @ignore
 */
type FlattenedMessages<TMessages extends AnyNestedMessages> =
  // Flatten out object keys into a union structure of objects, e.g. { a: 'a', b: 'b' } -> { a: 'a' } | { b: 'b' }
  // Any nested object will be flattened into the individual unions, e.g. { a: 'a', b: { x: 'x', y: 'y' } } -> { a: 'a' } | { 'b.x': 'x', 'b.y': 'y' }
  // We create this structure by first nesting the desired union types into the original object, and
  // then extract them by indexing with `keyof TMessages` to form the union.
  // Throughout this the objects are wrapped up in a function parameter, which allows us to have the
  // final step of flipping this unions around to an intersection by inferring the function parameter.
  {
    [TKey in keyof TMessages]: (
      _: TMessages[TKey] extends infer TValue // "local variable" for the value
        ? TValue extends AnyNestedMessages
          ? FlattenedMessages<TValue> extends infer TNested // Recurse into nested messages, "local variable" for the result
            ? {
                [TNestedKey in keyof TNested as `${TKey & string}.${TNestedKey &
                  string}`]: TNested[TNestedKey];
              }
            : never
          : { [_ in TKey]: TValue } // Primitive object values are passed through with the same key
        : never,
    ) => void;
    // The `[keyof TMessages]` extracts the object values union from our flattened structure, still wrapped up in function parameters.
    // The `extends (_: infer TIntersection) => void` flips the union to an intersection, at which point we have the correct type.
  }[keyof TMessages] extends (_: infer TIntersection) => void
    ? // This object mapping just expands similar to the Expand<> utility type, providing nicer type hints
      {
        readonly [TExpandKey in keyof TIntersection]: TIntersection[TExpandKey];
      }
    : never;

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
  TNestedMessages extends AnyNestedMessages,
  TTranslations extends {
    [language in string]: () => Promise<{
      default: {
        [key in keyof FlattenedMessages<TNestedMessages>]: string | null;
      };
    }>;
  },
> {
  id: TId;
  messages: TNestedMessages;
  translations?: TTranslations;
}

function flattenMessages(nested: AnyNestedMessages): AnyMessages {
  const entries = new Array<[string, string]>();

  function visit(obj: AnyNestedMessages, prefix: string): void {
    for (const [key, value] of Object.entries(obj)) {
      if (typeof value === 'string') {
        entries.push([prefix + key, value]);
      } else {
        visit(value, `${prefix}${key}.`);
      }
    }
  }

  visit(nested, '');

  return Object.fromEntries(entries);
}

/** @internal */
class TranslationRefImpl<
  TId extends string,
  TNestedMessages extends AnyNestedMessages,
> implements InternalTranslationRef<TId, FlattenedMessages<TNestedMessages>>
{
  #id: TId;
  #messages: FlattenedMessages<TNestedMessages>;
  #resources: TranslationResource | undefined;

  constructor(options: TranslationRefOptions<TId, TNestedMessages, any>) {
    this.#id = options.id;
    this.#messages = flattenMessages(
      options.messages,
    ) as FlattenedMessages<TNestedMessages>;
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
  const TNestedMessages extends AnyNestedMessages,
  TTranslations extends {
    [language in string]: () => Promise<{
      default: {
        [key in keyof FlattenedMessages<TNestedMessages>]: string | null;
      };
    }>;
  },
>(
  config: TranslationRefOptions<TId, TNestedMessages, TTranslations>,
): TranslationRef<TId, FlattenedMessages<TNestedMessages>> {
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
  TMessages extends AnyMessages,
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
