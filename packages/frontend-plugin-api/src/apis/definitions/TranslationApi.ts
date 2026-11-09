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

import { createApiRef } from '../system';
import { Expand, ExpandRecursive, Observable } from '@backstage/types';
import { TranslationRef } from '../../translation';
import { JSX } from 'react';

/**
 * Base translation options.
 *
 * @ignore
 */
interface BaseOptions {
  interpolation?: {
    /** Whether to HTML escape provided values, defaults to false  */
    escapeValue?: boolean;
  };
}

/**
 * All pluralization suffixes supported by i18next
 *
 * @ignore
 */
type TranslationPlural = 'zero' | 'one' | 'two' | 'few' | 'many' | 'other';

/**
 * A mapping of i18n formatting types to their corresponding types and options.
 * @ignore
 */
type I18nextFormatMap = {
  number: {
    type: number;
    options: Intl.NumberFormatOptions;
  };
  currency: {
    type: number;
    options: Intl.NumberFormatOptions;
  };
  datetime: {
    type: Date;
    options: Intl.DateTimeFormatOptions;
  };
  relativetime: {
    type: number;
    options: {
      range?: Intl.RelativeTimeFormatUnit;
    } & Intl.RelativeTimeFormatOptions;
  };
  list: {
    type: string[];
    options: Intl.ListFormatOptions;
  };
};

/**
 * Extracts all pluralized keys from the message map.
 *
 * @example
 * ```
 * { foo: 'foo', bar_one: 'bar', bar_other: 'bars' } -> 'bar'
 * ```
 *
 * @ignore
 */
type PluralKeys<TMessages extends { [key in string]: string }> = {
  [Key in keyof TMessages]: Key extends `${infer K}_${TranslationPlural}`
    ? K
    : never;
}[keyof TMessages];

/**
 * Collapses a message map into normalized keys with union values.
 *
 * @example
 * ```
 * { foo_one: 'foo', foo_other: 'foos' } -> { foo: 'foo' | 'foos' }
 * ```
 *
 * @ignore
 */
type CollapsedMessages<TMessages extends { [key in string]: string }> = {
  [key in keyof TMessages as key extends `${infer K}_${TranslationPlural}`
    ? K
    : key]: TMessages[key];
};

/**
 * Trim away whitespace
 *
 * @ignore
 */
type Trim<T> = T extends ` ${infer U}`
  ? Trim<U>
  : T extends `${infer U} `
  ? Trim<U>
  : T;

/**
 * Extracts the key and format from a replacement string.
 *
 * @example
 * ```
 * 'foo, number' -> { foo: number }, 'foo' -> { foo: undefined }
 * ```
 */
type ExtractFormat<Replacement extends string> =
  Replacement extends `${infer Key},${infer FullFormat}`
    ? {
        [key in Trim<Key>]: Lowercase<
          Trim<
            FullFormat extends `${infer Format}(${string})${string}`
              ? Format
              : FullFormat
          >
        >;
      }
    : { [key in Trim<Replacement>]: undefined };

/**
 * Expand the keys in a flat map to nested objects.
 *
 * @example
 * ```
 * { 'a.b': 'foo', 'a.c': 'bar' } -> { a: { b: 'foo', c: 'bar' }
 * ```
 *
 * @ignore
 */
type ExpandKeys<TMap extends {}> = {
  [Key in keyof TMap as Key extends `${infer Prefix}.${string}`
    ? Prefix
    : Key]: Key extends `${string}.${infer Rest}`
    ? ExpandKeys<{ [key in Rest]: TMap[Key] }>
    : TMap[Key];
};

/**
 * Extracts all option keys and their format from a message string.
 *
 * @example
 * ```
 * 'foo {{bar}} {{baz, number}}' -> { 'bar': undefined, 'baz': 'number' }
 * ```
 *
 * @ignore
 */
type ReplaceFormatsFromMessage<TMessage> =
  TMessage extends `${string}{{${infer Replacement}}}${infer Tail}` // no formatting, e.g. {{foo}}
    ? ExpandKeys<ExtractFormat<Replacement>> & ReplaceFormatsFromMessage<Tail>
    : {};

/**
 * Generates the replace options structure
 *
 * @ignore
 */
type ReplaceOptionsFromFormats<TFormats extends {}, TValueType> = {
  [Key in keyof TFormats]: TFormats[Key] extends keyof I18nextFormatMap
    ? I18nextFormatMap[TFormats[Key]]['type']
    : TFormats[Key] extends {}
    ? Expand<ReplaceOptionsFromFormats<TFormats[Key], TValueType>>
    : TValueType;
};

/**
 * Generates the formatParams options structure
 *
 * @ignore
 */
type ReplaceFormatParamsFromFormats<TFormats extends {}> = {
  [Key in keyof TFormats]?: TFormats[Key] extends keyof I18nextFormatMap
    ? I18nextFormatMap[TFormats[Key]]['options']
    : TFormats[Key] extends {}
    ? Expand<ReplaceFormatParamsFromFormats<TFormats[Key]>>
    : undefined;
};

/**
 * Extracts all nesting keys from a message string.
 *
 * @example
 * ```
 * 'foo $t(bar) $t(baz)' -> 'bar' | 'baz'
 * ```
 *
 * @ignore
 */
type NestingKeysFromMessage<TMessage extends string> =
  TMessage extends `${string}$t(${infer Key})${infer Tail}` // nesting options are not supported
    ? Trim<Key> | NestingKeysFromMessage<Tail>
    : never;

/**
 * Finds referenced message keys, tracking visited keys to stop at cycles.
 *
 * @ignore
 */
type NestedMessageKeys<
  TKey extends keyof TMessages,
  TMessages extends { [key in string]: string },
  TSeen = never,
> = TKey extends TSeen
  ? never
  :
      | TKey
      | NestedMessageKeys<
          Extract<NestingKeysFromMessage<TMessages[TKey]>, keyof TMessages>,
          TMessages,
          TSeen | TKey
        >;

/**
 * Converts a union type to an intersection type.
 *
 * @example
 * ```
 * { foo: 'foo' } | { bar: 'bar' } -> { foo: 'foo' } & { bar: 'bar' }
 * ```
 *
 * @ignore
 */
type UnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends (
  k: infer I,
) => void
  ? I
  : never;

/**
 * Collects different types of options into a single object
 *
 * @ignore
 */
type CollectOptions<
  TCount extends { count?: number },
  TFormats extends {},
  TValueType,
> = TCount &
  ('count' extends keyof TFormats ? { count: number } : {}) &
  // count is special, omit it from the replacements
  (keyof Omit<TFormats, 'count'> extends never
    ? {}
    : (
        | Expand<Omit<ReplaceOptionsFromFormats<TFormats, TValueType>, 'count'>>
        | {
            replace: Expand<
              Omit<ReplaceOptionsFromFormats<TFormats, TValueType>, 'count'>
            >;
          }
      ) & {
        formatParams?: Expand<ReplaceFormatParamsFromFormats<TFormats>>;
      });

/**
 * Helper type to only require options argument if needed
 *
 * @ignore
 */
type OptionArgs<TOptions extends {}> = keyof TOptions extends never
  ? [options?: Expand<BaseOptions>]
  : [options: Expand<BaseOptions & TOptions>];

/**
 * The required formatting options for normalized message keys.
 * @ignore
 */
type TranslationMessageOptions<
  TKeys extends keyof TMessages,
  TPluralKeys extends keyof TMessages,
  TMessages extends { [key in string]: string },
  TValueType = string,
> = Expand<
  CollectOptions<
    TKeys & TPluralKeys extends never ? {} : { count: number },
    ExpandRecursive<
      UnionToIntersection<ReplaceFormatsFromMessage<TMessages[TKeys]>>
    >,
    TValueType
  >
>;

/** @ignore */
type TranslationFunctionOptions<
  TKeys extends keyof TMessages,
  TPluralKeys extends keyof TMessages,
  TMessages extends { [key in string]: string },
  TValueType,
> = OptionArgs<
  TranslationMessageOptions<TKeys, TPluralKeys, TMessages, TValueType>
>;

/** @ignore */
export type TranslationMessageKey<TMessages extends { [key: string]: string }> =
  keyof CollapsedMessages<TMessages> & string;

/** @ignore */
export type TranslationTupleOptions<
  TMessages extends { [key: string]: string },
  TKey extends TranslationMessageKey<TMessages>,
> = string extends CollapsedMessages<TMessages>[NestedMessageKeys<
  TKey,
  CollapsedMessages<TMessages>
>]
  ? unknown
  : TranslationMessageOptions<
      NestedMessageKeys<TKey, CollapsedMessages<TMessages>>,
      PluralKeys<TMessages>,
      CollapsedMessages<TMessages>
    > extends infer TOptions extends {}
  ? keyof TOptions extends never
    ? undefined
    : Expand<BaseOptions & TOptions>
  : never;

/**
 * A translation function with inferred keys, formatting values, and nested message requirements.
 * @public
 */
export type TranslationFunction<TMessages extends { [key in string]: string }> =
  CollapsedMessages<TMessages> extends infer IMessages extends {
    [key in string]: string;
  }
    ? {
        /**
         * A translation function that returns a string.
         */
        <TKey extends keyof IMessages>(
          key: TKey,
          ...[args]: TranslationFunctionOptions<
            NestedMessageKeys<TKey, IMessages>,
            PluralKeys<TMessages>,
            IMessages,
            string
          >
        ): IMessages[TKey];
        /**
         * A translation function where at least one JSX.Element has been
         * provided as an interpolation value, and will therefore return a
         * JSX.Element.
         */
        <TKey extends keyof IMessages>(
          key: TKey,
          ...[args]: TranslationFunctionOptions<
            NestedMessageKeys<TKey, IMessages>,
            PluralKeys<TMessages>,
            IMessages,
            string | JSX.Element
          >
        ): JSX.Element;
      }
    : never;

/**
 * A synchronous translation snapshot, with fallback messages available while resources load.
 * @public
 */
export type TranslationSnapshot<TMessages extends { [key in string]: string }> =
  {
    /** Whether resources for the selected language have finished loading. */
    ready: boolean;
    /** Translates using the currently available messages and language fallbacks. */
    t: TranslationFunction<TMessages>;
  };

/** @public */
export type TranslationApi = {
  getTranslation<TMessages extends { [key in string]: string }>(
    translationRef: TranslationRef<string, TMessages>,
  ): TranslationSnapshot<TMessages>;

  translation$<TMessages extends { [key in string]: string }>(
    translationRef: TranslationRef<string, TMessages>,
  ): Observable<TranslationSnapshot<TMessages>>;
};

/**
 * @public
 * @deprecated Use {@link coreApis.translation} instead.
 */
export const translationApiRef = createApiRef<TranslationApi>().with({
  id: 'core.translation',
  pluginId: 'app',
});
