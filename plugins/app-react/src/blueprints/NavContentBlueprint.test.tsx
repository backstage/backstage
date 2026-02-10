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

import { createRouteRef } from '@backstage/frontend-plugin-api';
import { NavContentBlueprint } from './NavContentBlueprint';
import { createExtensionTester } from '@backstage/frontend-test-utils';

const routeRef = createRouteRef();

describe('NavContentBlueprint', () => {
  it('should create an extension with sensible defaults', () => {
    const extension = NavContentBlueprint.make({
      params: {
        component: () => <div>Nav content</div>,
      },
    });

    expect(extension).toMatchInlineSnapshot(`
      {
        "$$type": "@backstage/ExtensionDefinition",
        "T": undefined,
        "attachTo": {
          "id": "app/nav",
          "input": "content",
        },
        "configSchema": undefined,
        "disabled": false,
        "enabled": undefined,
        "factory": [Function],
        "inputs": {},
        "kind": "nav-content",
        "name": undefined,
        "output": [
          [Function],
        ],
        "override": [Function],
        "toString": [Function],
        "version": "v2",
      }
    `);
  });

  it('should return a valid component', () => {
    const extension = NavContentBlueprint.make({
      name: 'test',
      params: {
        component: () => <div>Nav content</div>,
      },
    });

    const tester = createExtensionTester(extension);

    expect(
      tester.get(NavContentBlueprint.dataRefs.component)({ items: [] }),
    ).toEqual(<div>Nav content</div>);
  });

  it('should return a valid component with items', () => {
    const extension = NavContentBlueprint.make({
      name: 'test',
      params: {
        component: ({ items }) => (
          <div>
            Items:
            {items.map((item, index) => (
              <a key={index} href={item.to}>
                {item.title}
              </a>
            ))}
          </div>
        ),
      },
    });

    const tester = createExtensionTester(extension);

    expect(
      tester.get(NavContentBlueprint.dataRefs.component)({
        items: [
          {
            to: '/',
            text: 'Home',
            title: 'Home',
            icon: () => null,
            routeRef,
          },
        ],
      }),
    ).toEqual(
      <div>
        Items:
        {[
          <a key={0} href="/">
            Home
          </a>,
        ]}
      </div>,
    );
  });
});
