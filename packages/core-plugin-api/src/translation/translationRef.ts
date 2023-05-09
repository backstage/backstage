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

import { Resources, TranslationRef } from './types';

/**
 * @internal
 */
export class TranslationRefImpl implements TranslationRef {
  constructor(readonly id: string, readonly resources: Resources) {}

  toString() {
    return `translationRefRef{id=${this.id}}`;
  }
}

/**
 * Create a {@link TranslationRef} from a translation descriptor.
 *
 * @param config - Description of the translation reference to be created.
 * @public
 */
export function createTranslationRef(config: {
  /** The id of the translation ref, used to identify it when printed */
  id: string;
  /** A translating resources to be use in plugin */
  resources: Resources;
}): TranslationRef {
  return new TranslationRefImpl(config.id, config.resources);
}
