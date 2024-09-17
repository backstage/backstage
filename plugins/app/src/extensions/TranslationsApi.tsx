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
import {
  ApiBlueprint,
  TranslationBlueprint,
  createApiFactory,
  createExtensionInput,
} from '@backstage/frontend-plugin-api';
import {
  appLanguageApiRef,
  translationApiRef,
} from '@backstage/core-plugin-api/alpha';

// eslint-disable-next-line @backstage/no-relative-monorepo-imports
import { I18nextTranslationApi } from '../../../../packages/core-app-api/src/apis/implementations/TranslationApi/I18nextTranslationApi';

/**
 * Contains translations that are installed in the app.
 */
export const TranslationsApi = ApiBlueprint.makeWithOverrides({
  name: 'translations',
  inputs: {
    translations: createExtensionInput(
      [TranslationBlueprint.dataRefs.translation],
      { replaces: [{ id: 'app', input: 'translations' }] },
    ),
  },
  factory: (originalFactory, { inputs }) => {
    return originalFactory({
      factory: createApiFactory({
        api: translationApiRef,
        deps: { languageApi: appLanguageApiRef },
        factory: ({ languageApi }) =>
          I18nextTranslationApi.create({
            languageApi,
            resources: inputs.translations.map(i =>
              i.get(TranslationBlueprint.dataRefs.translation),
            ),
          }),
      }),
    });
  },
});
