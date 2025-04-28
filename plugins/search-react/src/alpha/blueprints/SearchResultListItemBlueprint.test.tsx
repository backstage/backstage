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

import { SearchResultListItemBlueprint } from './SearchResultListItemBlueprint';
import {
  createExtensionTester,
  renderInTestApp,
} from '@backstage/frontend-test-utils';
import {
  PageBlueprint,
  createExtensionInput,
} from '@backstage/frontend-plugin-api';
import { searchResultListItemDataRef } from './types';
import _ from 'lodash';

describe('SearchResultListItemBlueprint', () => {
  it('should return an extension with sane defaults', () => {
    const extension = SearchResultListItemBlueprint.make({
      name: 'test',
      params: {
        component: async () => () => <div>Hello</div>,
        predicate: () => true,
      },
    });

    expect(extension).toMatchInlineSnapshot(`
      {
        "$$type": "@backstage/ExtensionDefinition",
        "T": undefined,
        "attachTo": {
          "id": "page:search",
          "input": "items",
        },
        "configSchema": {
          "parse": [Function],
          "schema": {
            "$schema": "http://json-schema.org/draft-07/schema#",
            "additionalProperties": false,
            "properties": {
              "noTrack": {
                "default": false,
                "type": "boolean",
              },
            },
            "type": "object",
          },
        },
        "disabled": false,
        "factory": [Function],
        "inputs": {},
        "kind": "search-result-list-item",
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

  it('defaults and passes on config properly', async () => {
    const extension = SearchResultListItemBlueprint.make({
      name: 'test',
      params: {
        component:
          async ({ config: { noTrack } }) =>
          () =>
            <div>noTrack: {String(noTrack)}</div>,
      },
    });

    const mockSearchPage = PageBlueprint.makeWithOverrides({
      name: 'search',
      inputs: {
        items: createExtensionInput([searchResultListItemDataRef]),
      },
      factory(originalFactory, { inputs }) {
        return originalFactory({
          defaultPath: '/',
          loader: async () => {
            const items = inputs.items.map(i =>
              i.get(searchResultListItemDataRef),
            );
            return (
              <div>
                {items.map((item, i) => (
                  <item.component key={i} />
                ))}
              </div>
            );
          },
        });
      },
    });

    await expect(
      renderInTestApp(
        createExtensionTester(mockSearchPage).add(extension).reactElement(),
      ).findByText('noTrack: false'),
    ).resolves.toBeInTheDocument();

    await expect(
      renderInTestApp(
        createExtensionTester(mockSearchPage)
          .add(extension, { config: { noTrack: true } })
          .reactElement(),
      ).findByText('noTrack: true'),
    ).resolves.toBeInTheDocument();
  });
});
