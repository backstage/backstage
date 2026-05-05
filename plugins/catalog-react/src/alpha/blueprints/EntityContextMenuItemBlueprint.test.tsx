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
import {
  createExtensionTester,
  renderInTestApp,
} from '@backstage/frontend-test-utils';
import { EntityContextMenuItemBlueprint } from './EntityContextMenuItemBlueprint';
import { screen, waitFor } from '@testing-library/react';
import { EntityProvider } from '@backstage/plugin-catalog-react';
import { Entity } from '@backstage/catalog-model';

jest.mock('../../hooks/useEntityContextMenu', () => ({
  useEntityContextMenu: () => ({
    onMenuClose: jest.fn(),
  }),
}));

describe('EntityContextMenuItemBlueprint', () => {
  const data = [
    {
      icon: <span>Test</span>,
      useProps: () => ({
        title: 'Test',
        href: '/somewhere',
        component: 'a',
        disabled: true,
      }),
    },
    {
      icon: <span>Test</span>,
      useProps: () => ({
        title: 'Test',
        onClick: async () => {},
      }),
    },
  ];

  it.each(data)('should produce a valid extension, %#', params => {
    const extension = EntityContextMenuItemBlueprint.make({
      name: 'test',
      params,
    });
    expect(extension.$$type).toBe('@backstage/ExtensionDefinition');
  });

  it('should yield static data when called with raw params', () => {
    const extension = EntityContextMenuItemBlueprint.make({
      name: 'static',
      params: {
        icon: <span>Icon</span>,
        title: 'Static title',
        onClick: () => {},
      },
    });
    const tester = createExtensionTester(extension);

    expect(tester.get(EntityContextMenuItemBlueprint.dataRefs.data)).toEqual({
      icon: expect.anything(),
      title: 'Static title',
      href: undefined,
      onClick: expect.any(Function),
      disabled: undefined,
    });
  });

  it('should render a menu item', async () => {
    const extension = EntityContextMenuItemBlueprint.make({
      name: 'test',
      params: {
        icon: <span>Icon</span>,
        useProps: () => ({
          title: 'Test',
          onClick: () => {},
        }),
      },
    });

    renderInTestApp(
      <EntityProvider
        entity={{
          apiVersion: 'v1',
          kind: 'Component',
          metadata: { name: 'test' },
        }}
      >
        <ul>{createExtensionTester(extension).reactElement()}</ul>
      </EntityProvider>,
    );

    await waitFor(() => {
      expect(screen.getByText('Test')).toBeInTheDocument();
    });
  });

  it.each([
    { filter: { kind: 'Api' } },
    { filter: (e: Entity) => e.kind.toLowerCase() === 'api' },
  ])('should return a filter function, %#', async ({ filter }) => {
    const extension = EntityContextMenuItemBlueprint.make({
      name: 'test',
      params: {
        icon: <span>Icon</span>,
        useProps: () => ({ title: 'Test', onClick: () => {} }),
        filter,
      },
    });

    const tester = createExtensionTester(extension);

    const filterFn = tester.get(
      EntityContextMenuItemBlueprint.dataRefs.filterFunction,
    );

    expect(filterFn).toBeDefined();
    expect(filterFn?.({ kind: 'Api' } as Entity)).toBe(true);
    expect(filterFn?.({ kind: 'Component' } as Entity)).toBe(false);
  });
});
