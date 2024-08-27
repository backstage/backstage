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

// eslint-disable-next-line @backstage/no-relative-monorepo-imports
import { AppLanguageSelector } from '../../../../packages/core-app-api/src/apis/implementations/AppLanguageApi';
import { appLanguageApiRef } from '@backstage/core-plugin-api/alpha';
import { ApiBlueprint, createApiFactory } from '@backstage/frontend-plugin-api';

export const AppLanguageApi = ApiBlueprint.make({
  name: 'app-language',
  params: {
    factory: createApiFactory(
      appLanguageApiRef,
      AppLanguageSelector.createWithStorage(),
    ),
  },
});
