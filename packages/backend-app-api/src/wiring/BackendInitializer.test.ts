/*
 * Copyright 2022 The Backstage Authors
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
  createServiceRef,
  createServiceFactory,
} from '@backstage/backend-plugin-api';
import { BackendInitializer } from './BackendInitializer';
import { ServiceRegistry } from './ServiceRegistry';

const rootRef = createServiceRef<{ x: number }>({
  id: '1',
  scope: 'root',
});

const pluginRef = createServiceRef<{ x: number }>({
  id: '2',
});

describe('BackendInitializer', () => {
  it('should initialize root scoped services', async () => {
    const rootFactory = jest.fn();
    const pluginFactory = jest.fn();

    const registry = new ServiceRegistry([
      createServiceFactory({
        service: rootRef,
        deps: {},
        factory: rootFactory,
      })(),
      createServiceFactory({
        service: pluginRef,
        deps: {},
        factory: pluginFactory,
      })(),
    ]);

    const init = new BackendInitializer(registry);
    await init.start();

    expect(rootFactory).toHaveBeenCalled();
    expect(pluginFactory).not.toHaveBeenCalled();
  });
});
