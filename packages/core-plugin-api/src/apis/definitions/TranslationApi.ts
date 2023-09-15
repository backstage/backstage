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

import { ApiRef, createApiRef } from '@backstage/core-plugin-api';
import { Observable } from '@backstage/types';
import { TranslationRef } from '../../translation';

/**
 * Base translation options.
 *
 * @alpha
 */
interface BaseOptions {
  interpolation?: {};
}

/**
 * All pluralization suffixes supported by i18next
 *
 * @internal
 */
export type TranslationPlural =
  | 'zero'
  | 'one'
  | 'two'
  | 'few'
  | 'many'
  | 'other';

/**
 * Extracts all pluralized keys from the message map.
 *
 * e.g. { foo: 'foo', bar_one: 'bar', bar_other: 'bars' } -> 'bar'
 *
 * @internal
 */
type PluralKeys<TMessages extends { [key in string]: string }> = {
  [Key in keyof TMessages]: Key extends `${infer K}_${TranslationPlural}`
    ? K
    : never;
}[keyof TMessages];

/**
 * Collapses a message map into normalized keys with union values.
 *
 * e.g. { foo_one: 'foo', foo_other: 'foos' } -> { foo: 'foo' | 'foos' }
 *
 * @internal
 */
type CollapsedMessages<TMessages extends { [key in string]: string }> = {
  [key in keyof TMessages as key extends `${infer K}_${TranslationPlural}`
    ? K
    : key]: TMessages[key];
};

/**
 * Helper type that expands type hints
 * @ignore
 */
type Expand<T> = T extends infer O ? { [K in keyof O]: O[K] } : never;

/**
 * Helper type that expands type hints recursively
 * @ignore
 */
type ExpandRecursive<T> = T extends infer O
  ? { [K in keyof O]: ExpandRecursive<O[K]> }
  : never;

/**
 * Trim away whitespace
 *
 * @internal
 */
type Trim<T> = T extends ` ${infer U}`
  ? Trim<U>
  : T extends `${infer U} `
  ? Trim<U>
  : T;

/**
 * Extracts all option keys from a message string.
 *
 * e.g. 'foo {{bar}} {{baz, number}}' -> 'bar' | 'baz'
 *
 * @internal
 */
type OptionKeysFromMessage<TMessage> =
  TMessage extends `${string}{{${infer Key},${string}}}${infer Tail}` // ignore formatting, e.g. {{foo, number}}
    ? Trim<Key> | OptionKeysFromMessage<Tail>
    : TMessage extends `${string}{{${infer Key}}}${infer Tail}` // no formatting, e.g. {{foo}}
    ? Trim<Key> | OptionKeysFromMessage<Tail>
    : never;

/**
 * Extracts all nesting keys from a message string.
 *
 * e.g. 'foo $t(bar) $t(baz)' -> 'bar' | 'baz'
 *
 * @internal
 */
type NestingKeysFromMessage<TMessage extends string> =
  TMessage extends `${string}$t(${infer Key})${infer Tail}` // nesting options are not supported
    ? Trim<Key> | NestingKeysFromMessage<Tail>
    : never;

/**
 * Find all referenced keys, given a starting key and the full set of messages.
 *
 * This will only discover keys up to 3 levels deep.
 *
 * e.g. <'x', { x: '$t(y) $t(z)', y: 'y', z: '$t(w)', w: 'w', foo: 'foo' }> -> 'x' | 'y' | 'z' | 'w'
 *
 * @internal
 */
type NestedMessageKeys<
  TKey extends keyof TMessages,
  TMessages extends { [key in string]: string },
> =
  | TKey
  | NestedMessageKeys2<NestingKeysFromMessage<TMessages[TKey]>, TMessages>;
// Can't recursively reference ourself, so instead we got this beauty
type NestedMessageKeys2<
  TKey extends keyof TMessages,
  TMessages extends { [key in string]: string },
> =
  | TKey
  | NestedMessageKeys3<NestingKeysFromMessage<TMessages[TKey]>, TMessages>;
// Only support 3 levels of nesting
type NestedMessageKeys3<
  TKey extends keyof TMessages,
  TMessages extends { [key in string]: string },
> = TKey | NestingKeysFromMessage<TMessages[TKey]>;

/**
 * Converts a union type to an intersection type.
 *
 * e.g. { foo: 'foo' } | { bar: 'bar' } -> { foo: 'foo' } & { bar: 'bar' }
 *
 * @internal
 */
type UnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends (
  k: infer I,
) => void
  ? I
  : never;

/**
 * Extracts all options from a message string.
 *
 * e.g. 'foo {{bar}} {{x.y.z}}' -> { bar: <value>, x: { y: { z: <value> } } }
 *
 * @internal
 */
type ReplaceOptionsFromKeys<TKeys extends string> = UnionToIntersection<
  TKeys extends `${infer Prefix}.${infer Rest}`
    ? {
        [key in Prefix]: ReplaceOptionsFromKeys<Rest>;
      }
    : {
        [key in TKeys & string]: string | number | string[];
      }
>;

/**
 * Collects different types of options into a single object
 *
 * @internal
 */
type CollectOptions<
  TCount extends { count?: number },
  TReplaceOptions extends {},
> = TCount &
  (keyof TReplaceOptions extends never ? {} : { replace: TReplaceOptions });

/**
 * Helper type to only require options argument if needed
 *
 * @internal
 */
type OptionArgs<TOptions extends {}> = keyof TOptions extends never
  ? [options?: BaseOptions]
  : [options: BaseOptions & TOptions];

/** @ignore */
type TranslationFunctionOptions<
  TKeys extends keyof TMessages, // All normalized message keys to be considered, i.e. included nested ones
  TPluralKeys extends keyof TMessages, // All keys in the message map that are pluralized
  TMessages extends { [key in string]: string }, // Collapsed message map with normalized keys and union values
> = OptionArgs<
  Expand<
    CollectOptions<
      TKeys & TPluralKeys extends never ? {} : { count: number },
      ExpandRecursive<
        ReplaceOptionsFromKeys<OptionKeysFromMessage<TMessages[TKeys]>>
      >
    >
  >
>;

/** @alpha */
export interface TranslationFunction<
  TMessages extends { [key in string]: string },
> {
  <TKey extends keyof CollapsedMessages<TMessages>>(
    key: TKey,
    ...[args]: TranslationFunctionOptions<
      NestedMessageKeys<TKey, CollapsedMessages<TMessages>>,
      PluralKeys<TMessages>,
      CollapsedMessages<TMessages>
    >
  ): CollapsedMessages<TMessages>[TKey];
}

/** @alpha */
export type TranslationSnapshot<TMessages extends { [key in string]: string }> =
  { ready: false } | { ready: true; t: TranslationFunction<TMessages> };

/** @alpha */
export type TranslationApi = {
  getTranslation<TMessages extends { [key in string]: string }>(
    translationRef: TranslationRef<string, TMessages>,
  ): TranslationSnapshot<TMessages>;

  translation$<TMessages extends { [key in string]: string }>(
    translationRef: TranslationRef<string, TMessages>,
  ): Observable<TranslationSnapshot<TMessages>>;
};

/**
 * @alpha
 */
export const translationApiRef: ApiRef<TranslationApi> = createApiRef({
  id: 'core.translation',
});
