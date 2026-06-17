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

import { Suspense } from 'react';
import {
  createExtensionTester,
  renderInTestApp,
} from '@backstage/frontend-test-utils';
import { screen } from '@testing-library/react';
import { Entity } from '@backstage/catalog-model';
import {
  EntityLayoutBlueprint,
  EntityLayoutBlueprintProps,
} from './EntityLayoutBlueprint';

const TestLayout = (props: EntityLayoutBlueprintProps) => (
  <div data-testid="custom-layout">
    {props.header}
    {props.groupedRoutes.map(route => (
      <span key={route.path}>{route.title}</span>
    ))}
  </div>
);

describe('EntityLayoutBlueprint', () => {
  it('emits a component data ref that renders the loaded layout', async () => {
    const extension = EntityLayoutBlueprint.make({
      name: 'test',
      params: { loader: async () => TestLayout },
    });

    const Component = createExtensionTester(extension).get(
      EntityLayoutBlueprint.dataRefs.component,
    );
    expect(Component).toBeDefined();

    await renderInTestApp(
      <Suspense fallback="loading">
        <Component
          header={<h1>My Header</h1>}
          groupedRoutes={[
            { group: 'group', path: '/p', title: 'Tab', children: <div /> },
          ]}
          groupDefinitions={{}}
        />
      </Suspense>,
    );

    expect(await screen.findByText('My Header')).toBeInTheDocument();
    expect(await screen.findByText('Tab')).toBeInTheDocument();
  });

  it('emits the order data ref when an order is provided', () => {
    const tester = createExtensionTester(
      EntityLayoutBlueprint.make({
        name: 'test',
        params: { loader: async () => TestLayout, order: 5 },
      }),
    );

    expect(tester.get(EntityLayoutBlueprint.dataRefs.order)).toBe(5);
  });

  it('emits an explicit order of 0', () => {
    const tester = createExtensionTester(
      EntityLayoutBlueprint.make({
        name: 'test',
        params: { loader: async () => TestLayout, order: 0 },
      }),
    );

    expect(tester.get(EntityLayoutBlueprint.dataRefs.order)).toBe(0);
  });

  it('does not emit an order data ref when no order is provided', () => {
    const tester = createExtensionTester(
      EntityLayoutBlueprint.make({
        name: 'test',
        params: { loader: async () => TestLayout },
      }),
    );

    expect(tester.get(EntityLayoutBlueprint.dataRefs.order)).toBeUndefined();
  });

  it.each([
    { name: 'object filter', filter: { kind: 'Api' } },
    {
      name: 'function filter',
      filter: (e: Entity) => e.kind.toLowerCase() === 'api',
    },
  ])('emits a filter function - $name', ({ filter }) => {
    const tester = createExtensionTester(
      EntityLayoutBlueprint.make({
        name: 'test',
        params: { loader: async () => TestLayout, filter },
      }),
    );

    const filterFn = tester.get(EntityLayoutBlueprint.dataRefs.filterFunction);
    expect(filterFn).toBeDefined();
    expect(filterFn?.({ kind: 'Api' } as Entity)).toBe(true);
    expect(filterFn?.({ kind: 'Component' } as Entity)).toBe(false);
  });
});
