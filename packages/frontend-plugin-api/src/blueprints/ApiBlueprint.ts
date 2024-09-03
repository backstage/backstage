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
import { AnyApiFactory } from '@backstage/core-plugin-api';

const factoryDataRef = createExtensionDataRef<AnyApiFactory>().with({
  id: 'core.api.factory',
});

/**
 * Creates utility API extensions.
 *
 * @public
 */
export const ApiBlueprint = createExtensionBlueprint({
  kind: 'api',
  attachTo: { id: 'root', input: 'apis' },
  output: [factoryDataRef],
  dataRefs: {
    factory: factoryDataRef,
  },
  *factory(params: { factory: AnyApiFactory }) {
    yield factoryDataRef(params.factory);
  },
});
