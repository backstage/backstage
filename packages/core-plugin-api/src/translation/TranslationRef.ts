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

export class TranslationRefImpl<
  LazyMessages extends Record<string, string>,
  Messages extends Record<string, string>,
> implements TranslationRef<LazyMessages, Messages>
{
  static create<
    LazyMessages extends Record<string, string>,
    Messages extends Record<string, string>,
  >(config: TranslationRefConfig<LazyMessages, Messages>) {
    return new TranslationRefImpl(config);
  }

  getId() {
    return this.config.id;
  }

  getLazyResources(): Record<
    string,
    () => Promise<{ messages: LazyMessages }>
  > {
    return this.config.lazyResources;
  }

  getResources(): Record<string, Messages> | undefined {
    return this.config.resources;
  }

  toString() {
    return `TranslationRef(${this.getId()})`;
  }

  private constructor(
    private readonly config: TranslationRefConfig<LazyMessages, Messages>,
  ) {}
}

export const createTranslationRef = <
  LazyMessages extends Record<string, string>,
  Messages extends Record<string, string> = {},
>(
  config: TranslationRefConfig<LazyMessages, Messages>,
): TranslationRef<LazyMessages, Messages> => TranslationRefImpl.create(config);
