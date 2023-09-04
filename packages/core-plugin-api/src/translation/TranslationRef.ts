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

import { TranslationRef, TranslationRefConfig } from './types';

/** @alpha */
export class TranslationRefImpl<Messages extends Record<keyof Messages, string>>
  implements TranslationRef<Messages>
{
  static create<Messages extends Record<keyof Messages, string>>(
    config: TranslationRefConfig<Messages>,
  ) {
    return new TranslationRefImpl(config);
  }

  getId() {
    return this.config.id;
  }

  getDefaultMessages(): Messages {
    return this.config.messages;
  }

  getLazyResources():
    | Record<string, () => Promise<{ messages: Messages }>>
    | undefined {
    return this.config.lazyResources;
  }

  getResources(): Record<string, Messages> | undefined {
    return this.config.resources;
  }

  toString() {
    return `TranslationRef(${this.getId()})`;
  }

  private constructor(
    private readonly config: TranslationRefConfig<Messages>,
  ) {}
}

/** @alpha */
export const createTranslationRef = <
  Messages extends Record<keyof Messages, string> = {},
>(
  config: TranslationRefConfig<Messages>,
): TranslationRef<Messages> => TranslationRefImpl.create(config);
