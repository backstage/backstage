/*
 * Copyright 2023 The Backstage Authors
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
  coreServices,
  createServiceFactory,
  createServiceRef,
} from '@backstage/backend-plugin-api';
import { makeServiceFactoryTester } from './makeServiceFactoryTester';

const rootServiceRef = createServiceRef<string>({ id: 'a', scope: 'root' });
const pluginServiceRef = createServiceRef<string>({ id: 'b', scope: 'plugin' });
const sharedPluginServiceRef = createServiceRef<string>({
  id: 'c',
  scope: 'plugin',
});

const rootFactory = createServiceFactory({
  service: rootServiceRef,
  deps: {},
  factory: async () => 'root',
});

const pluginFactory = createServiceFactory({
  service: pluginServiceRef,
  deps: { plugin: coreServices.pluginMetadata },
  factory: async ({ plugin }) => `${plugin.getId()}-plugin`,
});

const sharedPluginFactory = createServiceFactory({
  service: sharedPluginServiceRef,
  deps: { plugin: coreServices.pluginMetadata },
  createRootContext() {
    return { counter: 0 };
  },
  factory: async ({ plugin }, state) => {
    state.counter += 1;
    return `${plugin.getId()}-${state.counter}-plugin`;
  },
});

describe('makeServiceFactoryTester', () => {
  it('should test a root service factory', async () => {
    const factoryTester = makeServiceFactoryTester(rootFactory());

    await expect(factoryTester()).resolves.toBe('root');
  });

  it('should test a plugin service factory', async () => {
    const factoryTester = makeServiceFactoryTester(pluginFactory());

    await expect(factoryTester('x')).resolves.toBe('x-plugin');
    await expect(factoryTester('y')).resolves.toBe('y-plugin');
    await expect(factoryTester('z')).resolves.toBe('z-plugin');
  });

  it('should test a plugin service factory with root context', async () => {
    const factoryTester = makeServiceFactoryTester(sharedPluginFactory());

    await expect(factoryTester('x')).resolves.toBe('x-1-plugin');
    await expect(factoryTester('y')).resolves.toBe('y-2-plugin');
    await expect(factoryTester('y')).resolves.toBe('y-2-plugin');
    await expect(factoryTester('y')).resolves.toBe('y-2-plugin');
    await expect(factoryTester('z')).resolves.toBe('z-3-plugin');

    const tester2 = makeServiceFactoryTester(sharedPluginFactory());

    await expect(tester2('z')).resolves.toBe('z-1-plugin');
    await expect(tester2('y')).resolves.toBe('y-2-plugin');
    await expect(tester2('x')).resolves.toBe('x-3-plugin');
    await expect(tester2('x')).resolves.toBe('x-3-plugin');
    await expect(tester2('y')).resolves.toBe('y-2-plugin');
    await expect(tester2('z')).resolves.toBe('z-1-plugin');
  });

  it('should use dependencies', async () => {
    const factoryTester = makeServiceFactoryTester(
      createServiceFactory({
        service: createServiceRef<string>({ id: 'concat' }),
        deps: { root: rootServiceRef, plugin: pluginServiceRef },
        factory: async ({ root, plugin }) => `${root}, ${plugin}`,
      }),
      [rootFactory, pluginFactory()],
    );

    await expect(factoryTester('x')).resolves.toBe('root, x-plugin');
  });

  it('should use dependencies with root context', async () => {
    const factoryTester = makeServiceFactoryTester(
      createServiceFactory({
        service: createServiceRef<string>({ id: 'concat' }),
        deps: { shared: sharedPluginServiceRef, plugin: pluginServiceRef },
        factory: async ({ shared, plugin }) => `${shared}, ${plugin}`,
      }),
      [sharedPluginFactory(), pluginFactory],
    );

    await expect(factoryTester('x')).resolves.toBe('x-1-plugin, x-plugin');
    await expect(factoryTester('y')).resolves.toBe('y-2-plugin, y-plugin');
    await expect(factoryTester('y')).resolves.toBe('y-2-plugin, y-plugin');
    await expect(factoryTester('y')).resolves.toBe('y-2-plugin, y-plugin');
    await expect(factoryTester('z')).resolves.toBe('z-3-plugin, z-plugin');
  });

  it('should prioritize the subject implementation', async () => {
    const factoryTester = makeServiceFactoryTester(
      createServiceFactory({
        service: rootServiceRef,
        deps: {},
        factory: async () => 'other-root',
      }),
      [rootFactory],
    );

    await expect(factoryTester()).resolves.toBe('other-root');
  });

  it('should throw on missing dependencies', async () => {
    const factoryTester = makeServiceFactoryTester(
      createServiceFactory({
        service: pluginServiceRef,
        deps: { root: rootServiceRef },
        factory: async () => 'plugin',
      }),
    );

    await expect(factoryTester('x')).rejects.toThrow(
      "Failed to instantiate service 'b' for 'x' because the following dependent services are missing: 'a'",
    );
  });
});
