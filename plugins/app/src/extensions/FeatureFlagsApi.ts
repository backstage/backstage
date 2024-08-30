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
  createApiFactory,
  featureFlagsApiRef,
} from '@backstage/frontend-plugin-api';
// eslint-disable-next-line @backstage/no-relative-monorepo-imports
import { LocalStorageFeatureFlags } from '../../../../packages/core-app-api/src/apis/implementations/FeatureFlagsApi/LocalStorageFeatureFlags';

/**
 * Contains the shareable icons installed into the app.
 */
export const FeatureFlagsApi = ApiBlueprint.make({
  name: 'feature-flags',
  params: {
    // TODO: properly discovery feature flags, maybe rework the whole thing
    factory: createApiFactory({
      api: featureFlagsApiRef,
      deps: {},
      factory: () => new LocalStorageFeatureFlags(),
    }),
  },
});
