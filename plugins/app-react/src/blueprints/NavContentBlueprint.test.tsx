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

import { AppNode, createRouteRef } from '@backstage/frontend-plugin-api';
import {
  NavContentBlueprint,
  NavContentNavItem,
  NavContentNavItems,
} from './NavContentBlueprint';
import { createExtensionTester } from '@backstage/frontend-test-utils';
import { render, screen } from '@testing-library/react';

const routeRef = createRouteRef();

function mockNode(id: string): AppNode {
  return { spec: { id } } as AppNode;
}

function mockNavItems(items: NavContentNavItem[]): NavContentNavItems {
  const taken = new Set<string>();
  return {
    take(id: string) {
      const item = items.find(i => i.node.spec.id === id);
      if (item) {
        taken.add(id);
      }
      return item;
    },
    rest: () => items.filter(i => !taken.has(i.node.spec.id)),
    clone() {
      return mockNavItems(items);
    },
    withComponent(Component: (props: NavContentNavItem) => JSX.Element) {
      return {
        take: (id: string) => {
          const item = items.find(i => i.node.spec.id === id);
          if (item) {
            taken.add(id);
            return <Component {...item} />;
          }
          return null;
        },
        rest: (options?: { sortBy?: 'title' }) => {
          const remaining = items.filter(i => !taken.has(i.node.spec.id));
          if (options?.sortBy === 'title') {
            remaining.sort((a, b) => a.title.localeCompare(b.title));
          }
          return remaining.map(item => (
            <Component key={item.node.spec.id} {...item} />
          ));
        },
      };
    },
  };
}

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

  it('should return a valid component with legacy items', () => {
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
        navItems: mockNavItems([]),
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

  it('should return a valid component with navItems', () => {
    const items: NavContentNavItem[] = [
      {
        node: mockNode('page:home'),
        href: '/',
        title: 'Home',
        icon: <span>home</span>,
        routeRef,
      },
      {
        node: mockNode('page:catalog'),
        href: '/catalog',
        title: 'Catalog',
        icon: <span>catalog</span>,
        routeRef,
      },
      {
        node: mockNode('page:docs'),
        href: '/docs',
        title: 'Docs',
        icon: <span>docs</span>,
        routeRef,
      },
    ];

    const extension = NavContentBlueprint.make({
      name: 'test',
      params: {
        component: ({ navItems }) => (
          <div>
            {navItems.rest().map(item => (
              <a key={item.node.spec.id} href={item.href}>
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
        navItems: mockNavItems(items),
        items: [],
      }),
    ).toEqual(
      <div>
        {[
          <a key="page:home" href="/">
            Home
          </a>,
          <a key="page:catalog" href="/catalog">
            Catalog
          </a>,
          <a key="page:docs" href="/docs">
            Docs
          </a>,
        ]}
      </div>,
    );
  });

  it('should support withComponent for take and rest', () => {
    const items: NavContentNavItem[] = [
      {
        node: mockNode('page:home'),
        href: '/',
        title: 'Home',
        icon: <span>home</span>,
        routeRef,
      },
      {
        node: mockNode('page:catalog'),
        href: '/catalog',
        title: 'Catalog',
        icon: <span>catalog</span>,
        routeRef,
      },
      {
        node: mockNode('page:docs'),
        href: '/docs',
        title: 'Docs',
        icon: <span>docs</span>,
        routeRef,
      },
    ];

    const extension = NavContentBlueprint.make({
      name: 'test',
      params: {
        component: ({ navItems }) => {
          const nav = navItems.withComponent(item => (
            <a href={item.href}>{item.title}</a>
          ));
          return (
            <div>
              <header>{nav.take('page:home')}</header>
              <nav>{nav.rest()}</nav>
            </div>
          );
        },
      },
    });

    const tester = createExtensionTester(extension);
    const Component = tester.get(NavContentBlueprint.dataRefs.component);

    render(<Component navItems={mockNavItems(items)} items={[]} />);

    const homeLink = screen.getByText('Home');
    expect(homeLink).toBeInTheDocument();
    expect(homeLink.closest('header')).toBeTruthy();

    const catalogLink = screen.getByText('Catalog');
    expect(catalogLink).toBeInTheDocument();
    expect(catalogLink.closest('nav')).toBeTruthy();

    const docsLink = screen.getByText('Docs');
    expect(docsLink).toBeInTheDocument();
    expect(docsLink.closest('nav')).toBeTruthy();
  });
});
