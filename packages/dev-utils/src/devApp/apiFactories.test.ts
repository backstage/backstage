/*
 * Copyright 2020 Spotify AB
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

import * as apiFactories from './apiFactories';
import { ApiTestRegistry, ApiFactory } from '@backstage/core';

describe('apiFactories', () => {
  it('should be possible to get an instance of each API', () => {
    const registry = new ApiTestRegistry();
    const factories: ApiFactory<unknown, unknown, unknown>[] = Object.values(
      apiFactories,
    );

    for (const factory of factories) {
      registry.register(factory);
    }

    for (const factory of factories) {
      const api = registry.get(factory.implements);
      expect(api).toBeDefined();
    }
  });
});
