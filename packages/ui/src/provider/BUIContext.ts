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
import type { BUINavigation } from './BUINavigation';

/** @internal */
export type BUIContextValueV1 = {
  useAnalytics?: UseAnalyticsFn;
};

/** @internal */
export type BUIContextValueV3 = BUIContextValueV1 & {
  useNavigation?: () => BUINavigation;
};

/** @internal */
export type BUIContextVersions = {
  1: BUIContextValueV1;
  // Legacy routing is opaque here; the app supplies the frozen V2 contract.
  2?: BUIContextValueV1 & { routing?: unknown };
  3?: BUIContextValueV3;
};

// Requiring only V1 permits legacy providers to supply analytics while new
// providers add the optional host capability through the same shared context.
/** @internal */
export const BUIContext = createVersionedContext<BUIContextVersions>('bui');
