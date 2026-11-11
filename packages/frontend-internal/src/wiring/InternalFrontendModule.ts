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

import {
  Extension,
  FeatureFlagConfig,
  FrontendModule,
} from '@backstage/frontend-plugin-api';
import { FilterPredicate } from '@backstage/filter-predicates';
import { OpaqueType } from '@internal/opaque';

/**
 * The internal shape of a frontend module, which is created by
 * `createFrontendModule` in `@backstage/frontend-plugin-api`.
 */
export const OpaqueFrontendModule = OpaqueType.create<{
  public: FrontendModule;
  versions: {
    readonly version: 'v1';
    readonly extensions: Extension<unknown>[];
    readonly featureFlags: FeatureFlagConfig[];
    readonly if?: FilterPredicate;
  };
}>({
  type: '@backstage/FrontendModule',
  versions: ['v1'],
});
