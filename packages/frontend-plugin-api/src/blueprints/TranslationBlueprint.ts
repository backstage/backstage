/*
 * Copyright 2024 The Backstage Authors
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

import { createExtensionBlueprint, createExtensionDataRef } from '../wiring';
import { TranslationMessages, TranslationResource } from '../translation';

const translationDataRef = createExtensionDataRef<
  TranslationResource | TranslationMessages
>().with({ id: 'core.translation.translation' });

/**
 * Creates an extension that adds translations to your app.
 *
 * @public
 */
export const TranslationBlueprint = createExtensionBlueprint({
  kind: 'translation',
  attachTo: { id: 'api:app/translations', input: 'translations' },
  output: [translationDataRef],
  dataRefs: {
    translation: translationDataRef,
  },
  factory: ({
    resource,
  }: {
    resource: TranslationResource | TranslationMessages;
  }) => [translationDataRef(resource)],
});
