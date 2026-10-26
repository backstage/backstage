/*
 * Copyright 2026 The Backstage Authors
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

import { TranslationRef } from './TranslationRef';

/**
 * A reference to a directly displayable message without interpolation or nesting.
 * @public
 */
export type TranslationMessageRef<
  TMessages extends { [key: string]: string } = { [key: string]: string },
> = {
  [TKey in Extract<keyof TMessages, string>]: {
    /** The translation ref that owns the message. */
    ref: TranslationRef<string, TMessages>;
    /** The message key within the ref. */
    key: TKey;
  };
}[Extract<keyof TMessages, string>];
