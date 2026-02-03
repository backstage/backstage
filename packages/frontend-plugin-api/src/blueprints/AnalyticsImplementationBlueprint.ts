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
import {
  createExtensionBlueprint,
  createExtensionBlueprintParams,
  createExtensionDataRef,
} from '../wiring';

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
 * Creates analytics implementations.
 *
 * @public
 */
export const AnalyticsImplementationBlueprint = createExtensionBlueprint({
  kind: 'analytics',
  attachTo: { id: 'api:app/analytics', input: 'implementations' },
  output: [factoryDataRef],
  dataRefs: {
    factory: factoryDataRef,
  },
  defineParams: <TDeps extends { [name in string]: unknown }>(
    params: AnalyticsImplementationFactory<TDeps>,
  ) => createExtensionBlueprintParams(params as AnalyticsImplementationFactory),
  *factory(params) {
    yield factoryDataRef(params);
  },
});
