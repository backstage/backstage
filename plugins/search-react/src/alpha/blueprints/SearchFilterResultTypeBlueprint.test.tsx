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
import { SearchFilterResultTypeBlueprint } from './SearchFilterResultTypeBlueprint';
import { searchResultTypeDataRef } from './types';
import {
  createExtensionTester,
  renderInTestApp,
} from '@backstage/frontend-test-utils';

describe('SearchFilterResultTypeBlueprint', () => {
  it('should return an extension', () => {
    const extension = SearchFilterResultTypeBlueprint.make({
      name: 'test',
      params: {
        value: 'test',
        name: 'Test',
        icon: <div>Hello</div>,
      },
    });

    expect(extension).toMatchInlineSnapshot(`
      {
        "$$type": "@backstage/ExtensionDefinition",
        "T": undefined,
        "attachTo": {
          "id": "page:search",
          "input": "resultTypes",
        },
        "configSchema": undefined,
        "disabled": false,
        "factory": [Function],
        "inputs": {},
        "kind": "search-filter-result-type",
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

  it('should render result types', async () => {
    const extension = SearchFilterResultTypeBlueprint.make({
      name: 'test',
      params: {
        value: 'test',
        name: 'Test Result Type',
        icon: <div>Hello</div>,
      },
    });

    const searchPage = PageBlueprint.makeWithOverrides({
      name: 'search',
      inputs: {
        resultTypes: createExtensionInput([searchResultTypeDataRef]),
      },
      factory(originalFactory, { inputs }) {
        return originalFactory({
          defaultPath: '/',
          loader: async () => {
            const resultTypes = inputs.resultTypes.map(t =>
              t.get(searchResultTypeDataRef),
            );
            return (
              <div>
                {resultTypes.map((t, i) => (
                  <div key={i}>{t.name}</div>
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
      ).findByText('Test Result Type'),
    ).resolves.toBeInTheDocument();
  });
});
