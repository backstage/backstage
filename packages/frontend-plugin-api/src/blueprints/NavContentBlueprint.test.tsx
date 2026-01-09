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
    const MockLogo = () => <span>Logo</span>;
    const MockSearch = () => <span>Search</span>;
    const extension = NavContentBlueprint.make({
      name: 'test',
      params: {
        component: ({ Logo, Search }) => (
          <div>
            {Logo ? <Logo /> : null}
            {Search ? <Search /> : null}
            Nav content
          </div>
        ),
      },
    });

    const tester = createExtensionTester(extension);

    expect(
      tester.get(NavContentBlueprint.dataRefs.component)({
        items: [],
        Logo: MockLogo,
        Search: MockSearch,
      }),
    ).toEqual(
      <div>
        <MockLogo />
        <MockSearch />
        Nav content
      </div>,
    );
  });

  it('should return a valid component with items', () => {
    const CustomItem = () => <span>Custom</span>;
    const extension = NavContentBlueprint.make({
      name: 'test',
      params: {
        component: ({ items }) => (
          <div>
            Items:
            {items.map((item, index) => {
              if (item.CustomComponent) {
                const ItemComponent = item.CustomComponent;
                return <ItemComponent key={`custom-${index}`} />;
              }

              return (
                <a
                  key={index}
                  href={item.to}
                  data-position={item.position}
                  data-divider={item.dividerBelow ? 'yes' : 'no'}
                  data-hidden={item.hide ? 'yes' : 'no'}
                >
                  {item.text}
                </a>
              );
            })}
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
            hide: false,
            position: 1,
            dividerBelow: true,
            routeRef,
          },
          {
            to: '/settings',
            text: 'Settings',
            title: 'Settings',
            icon: () => null,
            hide: true,
            CustomComponent: CustomItem,
            position: 2,
            dividerBelow: false,
            routeRef,
          },
        ],
      }),
    ).toEqual(
      <div>
        Items:
        {[
          <a
            key={0}
            href="/"
            data-position={1}
            data-divider="yes"
            data-hidden="no"
          >
            Home
          </a>,
          <CustomItem key="custom-1" />,
        ]}
      </div>,
    );
  });
});
