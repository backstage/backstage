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
  PageBlueprint,
  createExtensionInput,
} from '@backstage/frontend-plugin-api';
import { SearchFilterBlueprint } from './SearchFilterBlueprint';
import { searchFilterDataRef } from './types';
import {
  createExtensionTester,
  renderInTestApp,
} from '@backstage/frontend-test-utils';

describe('SearchFilterBlueprint', () => {
  it('should return an extension', () => {
    const extension = SearchFilterBlueprint.make({
      name: 'test',
      params: {
        component: props => <p {...props}>test filter</p>,
      },
    });

    expect(extension).toMatchInlineSnapshot(`
      {
        "$$type": "@backstage/ExtensionDefinition",
        "T": undefined,
        "attachTo": {
          "id": "page:search",
          "input": "searchFilters",
        },
        "configSchema": {
          "parse": [Function],
          "schema": {
            "$schema": "http://json-schema.org/draft-07/schema#",
            "additionalProperties": false,
            "properties": {
              "types": {
                "description": "A list of result types where this search filter should be shown for",
                "items": {
                  "type": "string",
                },
                "type": "array",
              },
            },
            "type": "object",
          },
        },
        "disabled": false,
        "factory": [Function],
        "inputs": {},
        "kind": "search-filter",
        "name": "test",
        "output": [
          [Function],
        ],
        "override": [Function],
        "toString": [Function],
        "version": "v2",
      }
    `);
  });

  it('should create typeFilter from config types when provided', () => {
    const component = (props: any) => <p {...props}>test filter</p>;
    const extension = SearchFilterBlueprint.make({
      name: 'test',
      params: {
        component: component,
      },
    });

    const tester = createExtensionTester(extension, {
      config: { types: ['software-catalog', 'techdocs'] },
    });
    const searchFilterData = tester.get(
      SearchFilterBlueprint.dataRefs.searchFilters,
    );
    expect(searchFilterData.component).toBe(component);
    expect(searchFilterData.typeFilter).toBeDefined();

    // Test that typeFilter works correctly with config types
    expect(searchFilterData.typeFilter!(['software-catalog'])).toBe(true);
    expect(searchFilterData.typeFilter!(['techdocs'])).toBe(true);
    expect(searchFilterData.typeFilter!(['other-type'])).toBe(false);
    expect(
      searchFilterData.typeFilter!(['software-catalog', 'other-type']),
    ).toBe(true);
  });

  it('should use params typeFilter when config types are not provided', () => {
    const mockTypeFilter = jest.fn().mockReturnValue(true);

    const extension = SearchFilterBlueprint.make({
      name: 'test',
      params: {
        component: props => <p {...props}>Test Filter</p>,
        typeFilter: mockTypeFilter,
      },
    });

    const tester = createExtensionTester(extension);
    const searchFilterData = tester.get(
      SearchFilterBlueprint.dataRefs.searchFilters,
    );

    expect(searchFilterData.typeFilter).toBe(mockTypeFilter);
  });

  it('should use params typeFilter when config types is empty', () => {
    const mockTypeFilter = jest.fn().mockReturnValue(true);

    const extension = SearchFilterBlueprint.make({
      name: 'test',
      params: {
        component: props => <p {...props}>Test Filter</p>,
        typeFilter: mockTypeFilter,
      },
    });

    const tester = createExtensionTester(extension, {
      config: { types: [] },
    });
    const searchFilterData = tester.get(
      SearchFilterBlueprint.dataRefs.searchFilters,
    );

    expect(searchFilterData.typeFilter).toBe(mockTypeFilter);
  });

  it('should have no typeFilter when neither config types nor params typeFilter are provided', () => {
    const extension = SearchFilterBlueprint.make({
      name: 'test',
      params: {
        component: props => <p {...props}>Test Filter</p>,
      },
    });

    const tester = createExtensionTester(extension);
    const searchFilterData = tester.get(
      SearchFilterBlueprint.dataRefs.searchFilters,
    );

    expect(searchFilterData.typeFilter).toBe(undefined);
  });

  it('should prioritize config types over params typeFilter', () => {
    const mockTypeFilter = jest.fn().mockReturnValue(false);

    const extension = SearchFilterBlueprint.make({
      name: 'test',
      params: {
        component: props => <p {...props}>Test Filter</p>,
        typeFilter: mockTypeFilter,
      },
    });

    const tester = createExtensionTester(extension, {
      config: { types: ['software-catalog'] },
    });
    const searchFilterData = tester.get(
      SearchFilterBlueprint.dataRefs.searchFilters,
    );

    // Should use config-based typeFilter, not the params one
    expect(searchFilterData.typeFilter).not.toBe(mockTypeFilter);
    expect(searchFilterData.typeFilter!(['software-catalog'])).toBe(true);
    expect(searchFilterData.typeFilter!(['other-type'])).toBe(false);
  });

  it('should render filter components', async () => {
    const extension = SearchFilterBlueprint.make({
      name: 'test',
      params: {
        component: props => <p {...props}>Test Filter</p>,
      },
    });

    const searchPage = PageBlueprint.makeWithOverrides({
      name: 'search',
      inputs: {
        searchFilters: createExtensionInput([searchFilterDataRef]),
      },
      factory(originalFactory, { inputs }) {
        return originalFactory({
          path: '/',
          loader: async () => {
            const searchFilters = inputs.searchFilters.map(
              t => t.get(searchFilterDataRef).component,
            );
            return (
              <div>
                {searchFilters.map((Component, index) => (
                  <Component key={index} className="test" />
                ))}
              </div>
            );
          },
        });
      },
    });

    await expect(
      renderInTestApp(
        createExtensionTester(searchPage).add(extension).reactElement(),
      ).findByText('Test Filter'),
    ).resolves.toBeInTheDocument();
  });
});
