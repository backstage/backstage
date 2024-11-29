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

import { TranslationRef } from '@backstage/core-plugin-api/alpha';

/**
 * Represents a collection of messages to be provided for a given translation ref.
 *
 * @alpha
 * @remarks
 *
 * This collection of messages can either be used directly as an override for the
 * default messages, or it can be used to provide translations for a language by
 * by being referenced by a {@link TranslationResource}.
 */
export interface TranslationMessages<
  TId extends string = string,
  TMessages extends { [key in string]: string } = { [key in string]: string },
  TFull extends boolean = boolean,
> {
  $$type: '@backstage/TranslationMessages';
  /** The ID of the translation ref that these messages are for */
  id: TId;
  /** Whether or not these messages override all known messages */
  full: TFull;
  /** The messages provided for the given translation ref */
  messages: TMessages;
}

/**
 * Options for {@link createTranslationMessages}.
 *
 * @alpha
 */
export interface TranslationMessagesOptions<
  TId extends string,
  TMessages extends { [key in string]: string },
  TFull extends boolean,
> {
  ref: TranslationRef<TId, TMessages>;

  full?: TFull;

  messages: false extends TFull
    ? { [key in keyof TMessages]?: string | null }
    : { [key in keyof TMessages]: string | null };
}

/**
 * Creates a collection of messages for a given translation ref.
 *
 * @alpha
 */
export function createTranslationMessages<
  TId extends string,
  TMessages extends { [key in string]: string },
  TFull extends boolean,
>(
  options: TranslationMessagesOptions<TId, TMessages, TFull>,
): TranslationMessages<TId, TMessages, TFull> {
  return {
    $$type: '@backstage/TranslationMessages',
    id: options.ref.id,
    full: Boolean(options.full) as TFull,
    messages: options.messages as TMessages,
  };
}
