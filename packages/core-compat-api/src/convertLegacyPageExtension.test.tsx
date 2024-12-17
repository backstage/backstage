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
  createPlugin as createLegacyPlugin,
  createRouteRef as createLegacyRouteRef,
  createRoutableExtension,
} from '@backstage/core-plugin-api';
import { coreExtensionData } from '@backstage/frontend-plugin-api';
import {
  createExtensionTester,
  renderInTestApp,
} from '@backstage/frontend-test-utils';
import { screen } from '@testing-library/react';
import { convertLegacyPageExtension } from './convertLegacyPageExtension';
import { convertLegacyRouteRef } from './convertLegacyRouteRef';

const routeRef = createLegacyRouteRef({ id: 'test' });
const legacyPlugin = createLegacyPlugin({
  id: 'test',
  routes: {
    test: routeRef,
  },
});

describe('convertLegacyPageExtension', () => {
  it('should convert a page extension', async () => {
    const LegacyExtension = legacyPlugin.provide(
      createRoutableExtension({
        name: 'ExamplePage',
        mountPoint: routeRef,
        component: async () => () => <div>Hello</div>,
      }),
    );

    const converted = convertLegacyPageExtension(LegacyExtension);

    const tester = createExtensionTester(converted);

    expect(tester.query(converted).node.spec.id).toBe('page:example');

    await renderInTestApp(tester.reactElement(), {
      mountedRoutes: {
        '/': convertLegacyRouteRef(routeRef),
      },
    });

    await expect(screen.findByText('Hello')).resolves.toBeInTheDocument();

    expect(tester.get(coreExtensionData.routePath)).toBe('/example');
    expect(tester.get(coreExtensionData.routeRef)).toBe(routeRef);
  });

  it('should convert a page extension with overrides', async () => {
    const LegacyExtension = legacyPlugin.provide(
      createRoutableExtension({
        name: 'ExamplePage',
        mountPoint: routeRef,
        component: async () => () => <div>Hello</div>,
      }),
    );

    const converted = convertLegacyPageExtension(LegacyExtension, {
      name: 'other',
      defaultPath: '/other',
    });

    const tester = createExtensionTester(converted);

    expect(tester.query(converted).node.spec.id).toBe('page:other');

    await renderInTestApp(tester.reactElement(), {
      mountedRoutes: {
        '/': convertLegacyRouteRef(routeRef),
      },
    });

    await expect(screen.findByText('Hello')).resolves.toBeInTheDocument();

    expect(tester.get(coreExtensionData.routePath)).toBe('/other');
    expect(tester.get(coreExtensionData.routeRef)).toBe(routeRef);
  });
});
