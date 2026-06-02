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
import { CatalogFilterBlueprint } from './CatalogFilterBlueprint';
import { createExtensionTester } from '@backstage/frontend-test-utils';
import { z } from 'zod/v4';

describe('CatalogFilterBlueprint', () => {
  it('should create a facet filter descriptor from model-based params', () => {
    const extension = CatalogFilterBlueprint.make({
      name: 'test',
      params: {
        label: 'Test',
        path: 'metadata.test',
        mode: 'multi',
        defaultValue: ['a', 'b'],
      },
    });

    const tester = createExtensionTester(extension);
    const descriptor = tester.get(
      CatalogFilterBlueprint.dataRefs.filterDescriptor,
    );

    expect(descriptor).toEqual({
      type: 'facet',
      label: 'Test',
      filterKey: 'metadata.test',
      path: 'metadata.test',
      mode: 'multi',
      defaultValue: ['a', 'b'],
    });
  });

  it('should create a facet filter descriptor with single mode and no default', () => {
    const extension = CatalogFilterBlueprint.make({
      name: 'kind',
      params: {
        label: 'Kind',
        path: 'kind',
        mode: 'single',
      },
    });

    const tester = createExtensionTester(extension);
    const descriptor = tester.get(
      CatalogFilterBlueprint.dataRefs.filterDescriptor,
    );

    expect(descriptor).toEqual({
      type: 'facet',
      label: 'Kind',
      filterKey: 'kind',
      path: 'kind',
      mode: 'single',
      defaultValue: undefined,
    });
  });

  it('should create a custom filter descriptor from deprecated loader params', () => {
    const extension = CatalogFilterBlueprint.make({
      name: 'custom',
      params: {
        loader: async () => <div>custom filter</div>,
      },
    });

    const tester = createExtensionTester(extension);
    const descriptor = tester.get(
      CatalogFilterBlueprint.dataRefs.filterDescriptor,
    );

    expect(descriptor.type).toBe('custom');
    expect(descriptor).toHaveProperty('element');
  });

  it('should create an options filter descriptor with static options and toFilter', () => {
    const toFilter = jest.fn((selected: string[]) => {
      if (!selected.length) return undefined;
      return {
        getCatalogFilters: () => ({ status: selected }),
      };
    });

    const extension = CatalogFilterBlueprint.make({
      name: 'status',
      params: {
        label: 'Status',
        mode: 'multi',
        options: [
          { label: 'Active', value: 'active' },
          { label: 'Inactive', value: 'inactive' },
        ],
        toFilter,
      },
    });

    const tester = createExtensionTester(extension);
    const descriptor = tester.get(
      CatalogFilterBlueprint.dataRefs.filterDescriptor,
    );

    expect(descriptor).toMatchObject({
      type: 'options',
      label: 'Status',
      filterKey: 'Status',
      mode: 'multi',
      deps: {},
      options: [
        { label: 'Active', value: 'active' },
        { label: 'Inactive', value: 'inactive' },
      ],
    });

    const optionsDescriptor = descriptor as Extract<
      typeof descriptor,
      { type: 'options' }
    >;
    const filter = optionsDescriptor.toFilter(['active'], {});
    expect(toFilter).toHaveBeenCalledWith(['active'], {});
    expect(filter).toEqual({
      getCatalogFilters: expect.any(Function),
    });
  });

  it('should support makeWithOverrides to inject config into model params', () => {
    const extension = CatalogFilterBlueprint.makeWithOverrides({
      name: 'with-config',
      configSchema: {
        initialFilter: z.string().default('component'),
      },
      factory(originalFactory, { config }) {
        return originalFactory({
          label: 'Kind',
          path: 'kind',
          mode: 'single',
          defaultValue: config.initialFilter,
        });
      },
    });

    const tester = createExtensionTester(extension);
    const descriptor = tester.get(
      CatalogFilterBlueprint.dataRefs.filterDescriptor,
    );

    expect(descriptor).toEqual({
      type: 'facet',
      label: 'Kind',
      filterKey: 'kind',
      path: 'kind',
      mode: 'single',
      defaultValue: 'component',
    });
  });
});
