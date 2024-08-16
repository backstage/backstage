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
import {
  createExtensionTester,
  renderInTestApp,
} from '@backstage/frontend-test-utils';
import { screen } from '@testing-library/react';
import React from 'react';
import { convertLegacyEntityCardExtension } from './convertLegacyEntityCardExtension';
import { convertLegacyRouteRef } from '@backstage/core-compat-api';
import { EntityContentBlueprint } from '../blueprints';

const routeRef = createLegacyRouteRef({ id: 'test' });
const legacyPlugin = createLegacyPlugin({
  id: 'test',
  routes: {
    test: routeRef,
  },
});

describe('convertLegacyEntityCardExtension', () => {
  it('should convert an entity card extension', async () => {
    const LegacyExtension = legacyPlugin.provide(
      createRoutableExtension({
        name: 'EntityExampleCard',
        mountPoint: routeRef,
        component: async () => () => <div>Hello</div>,
      }),
    );

    const converted = convertLegacyEntityCardExtension(LegacyExtension);
    expect(converted.kind).toBe('entity-card');
    expect(converted.namespace).toBe(undefined);
    expect(converted.name).toBe('example');

    const tester = createExtensionTester(converted);

    await renderInTestApp(tester.reactElement(), {
      mountedRoutes: {
        '/': convertLegacyRouteRef(routeRef),
      },
    });

    await expect(screen.findByText('Hello')).resolves.toBeInTheDocument();

    expect(tester.get(EntityContentBlueprint.dataRefs.filterExpression)).toBe(
      undefined,
    );
    expect(tester.get(EntityContentBlueprint.dataRefs.filterFunction)).toBe(
      undefined,
    );
  });

  it('should convert an entity card extension with overrides', async () => {
    const LegacyExtension = legacyPlugin.provide(
      createRoutableExtension({
        name: 'EntityExampleCard',
        mountPoint: routeRef,
        component: async () => () => <div>Hello</div>,
      }),
    );

    const converted = convertLegacyEntityCardExtension(LegacyExtension, {
      name: 'other',
      filter: 'my-filter',
    });
    expect(converted.kind).toBe('entity-card');
    expect(converted.namespace).toBe(undefined);
    expect(converted.name).toBe('other');

    const tester = createExtensionTester(converted);

    await renderInTestApp(tester.reactElement(), {
      mountedRoutes: {
        '/': convertLegacyRouteRef(routeRef),
      },
    });

    await expect(screen.findByText('Hello')).resolves.toBeInTheDocument();

    expect(tester.get(EntityContentBlueprint.dataRefs.filterExpression)).toBe(
      'my-filter',
    );
    expect(tester.get(EntityContentBlueprint.dataRefs.filterFunction)).toBe(
      undefined,
    );
  });

  it('should support various naming patterns for entity card extensions', async () => {
    const withName = (name: string) => {
      const converted = convertLegacyEntityCardExtension(
        legacyPlugin.provide(
          createRoutableExtension({
            name,
            mountPoint: routeRef,
            component: async () => () => <div>Hello</div>,
          }),
        ),
      );
      return converted.name;
    };

    expect(withName('EntityTestCard')).toBe(undefined);
    expect(withName('EntityTestTrimCard')).toBe('trim');
    expect(withName('EntityTeStTrimCard')).toBe('trim');
    expect(withName('EntityExampleCard')).toBe('example');
    expect(withName('EntityExAmpleCard')).toBe('ex-ample');
    expect(withName('ExampleCard')).toBe('example-card');
  });
});
