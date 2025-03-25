/*
 * Copyright 2025 The Backstage Authors
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

import { AnalyticsImplementation, TypesToApiRefs } from '../apis';
import { createExtensionBlueprint, createExtensionDataRef } from '../wiring';

/** @public */
export type AnalyticsImplementationFactory<
  Deps extends { [name in string]: unknown } = {},
> = {
  deps: TypesToApiRefs<Deps>;
  factory(deps: Deps): AnalyticsImplementation;
};

const factoryDataRef =
  createExtensionDataRef<AnalyticsImplementationFactory>().with({
    id: 'core.analytics.factory',
  });

/**
 * Used to infer types for a standalone {@link AnalyticsImplementationFactory}
 * that isn't immediately passed to another function.
 *
 * @remarks
 *
 * This function doesn't actually do anything, it's only used to infer types.
 *
 * @public
 */
export function createAnalyticsImplementationFactory<
  Deps extends { [name in string]: unknown },
>(
  factory: AnalyticsImplementationFactory<Deps>,
): AnalyticsImplementationFactory<Deps> {
  return factory;
}

/**
 * Creates analytics implementations.
 *
 * @public
 */
export const AnalyticsBlueprint = createExtensionBlueprint({
  kind: 'analytics',
  attachTo: [{ id: 'api:app/analytics', input: 'analyticsImplementations' }],
  output: [factoryDataRef],
  dataRefs: {
    factory: factoryDataRef,
  },
  *factory(params: { factory: AnalyticsImplementationFactory }) {
    yield factoryDataRef(params.factory);
  },
});
