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
import React from 'react';
import { convertLegacyEntityContentExtension } from './convertLegacyEntityContentExtension';
import { convertLegacyRouteRef } from '@backstage/core-compat-api';
import { EntityContentBlueprint } from '../blueprints';

const routeRef = createLegacyRouteRef({ id: 'test' });
const legacyPlugin = createLegacyPlugin({
  id: 'test',
  routes: {
    test: routeRef,
  },
});

describe('convertLegacyEntityContentExtension', () => {
  it('should convert an entity content extension', async () => {
    const LegacyExtension = legacyPlugin.provide(
      createRoutableExtension({
        name: 'EntityExampleContent',
        mountPoint: routeRef,
        component: async () => () => <div>Hello</div>,
      }),
    );

    const converted = convertLegacyEntityContentExtension(LegacyExtension);

    const tester = createExtensionTester(converted);

    expect(tester.query(converted).node.spec.id).toBe('entity-content:example');

    await renderInTestApp(tester.reactElement(), {
      mountedRoutes: {
        '/': convertLegacyRouteRef(routeRef),
      },
    });

    await expect(screen.findByText('Hello')).resolves.toBeInTheDocument();

    expect(tester.get(coreExtensionData.routePath)).toBe('/example');
    expect(tester.get(coreExtensionData.routeRef)).toBe(routeRef);
    expect(tester.get(EntityContentBlueprint.dataRefs.filterExpression)).toBe(
      undefined,
    );
    expect(tester.get(EntityContentBlueprint.dataRefs.filterFunction)).toBe(
      undefined,
    );
  });

  it('should convert an entity content extension with overrides', async () => {
    const LegacyExtension = legacyPlugin.provide(
      createRoutableExtension({
        name: 'EntityExampleContent',
        mountPoint: routeRef,
        component: async () => () => <div>Hello</div>,
      }),
    );

    const converted = convertLegacyEntityContentExtension(LegacyExtension, {
      name: 'other',
      defaultPath: '/other',
      defaultTitle: 'Other',
      filter: 'my-filter',
    });

    const tester = createExtensionTester(converted);

    expect(tester.query(converted).node.spec.id).toBe('entity-content:other');

    await renderInTestApp(tester.reactElement(), {
      mountedRoutes: {
        '/': convertLegacyRouteRef(routeRef),
      },
    });

    await expect(screen.findByText('Hello')).resolves.toBeInTheDocument();

    expect(tester.get(coreExtensionData.routePath)).toBe('/other');
    expect(tester.get(coreExtensionData.routeRef)).toBe(routeRef);
    expect(tester.get(EntityContentBlueprint.dataRefs.filterExpression)).toBe(
      'my-filter',
    );
    expect(tester.get(EntityContentBlueprint.dataRefs.filterFunction)).toBe(
      undefined,
    );
  });

  it('should support various naming patterns for entity content extensions', async () => {
    const withName = (name: string) => {
      const converted = convertLegacyEntityContentExtension(
        legacyPlugin.provide(
          createRoutableExtension({
            name,
            mountPoint: routeRef,
            component: async () => () => <div>Hello</div>,
          }),
        ),
      );
      return createExtensionTester(converted).query(converted).node.spec.id;
    };

    expect(withName('EntityTestContent')).toBe('entity-content:test'); // falls back to test namespace
    expect(withName('EntityTestTrimContent')).toBe('entity-content:trim');
    expect(withName('EntityTeStTrimContent')).toBe('entity-content:trim');
    expect(withName('EntityExampleContent')).toBe('entity-content:example');
    expect(withName('EntityExAmpleContent')).toBe('entity-content:ex-ample');
    expect(withName('ExampleContent')).toBe('entity-content:example-content');
  });
});
