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

import { createVersionedContext } from '@backstage/version-bridge';
import type { UseAnalyticsFn } from '../analytics/types';
import type { BUIRoutingIntegration } from '../navigation/types';

/** @internal */
export type BUIContextValueV1 = {
  useAnalytics?: UseAnalyticsFn;
};

/** @internal */
export type BUIContextValueV2 = {
  useAnalytics?: UseAnalyticsFn;
  routing: BUIRoutingIntegration;
};

/** @internal */
export type BUIContextVersions = {
  1: BUIContextValueV1;
  2: BUIContextValueV2;
};

/** @internal */
export const BUIContext = createVersionedContext<BUIContextVersions>('bui');
