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

import React from 'react';
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
        "configSchema": undefined,
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
          defaultPath: '/',
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
