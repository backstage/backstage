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
import { useState } from 'react';
import { createRouteRef } from '../routing';
import { PageBlueprint } from './PageBlueprint';
import { SubPageBlueprint } from './SubPageBlueprint';
import {
  createExtensionTester,
  renderInTestApp,
} from '@backstage/frontend-test-utils';
import {
  coreExtensionData,
  createExtensionBlueprint,
  createExtensionInput,
} from '../wiring';
import { fireEvent, screen, waitFor } from '@testing-library/react';

describe('PageBlueprint', () => {
  const mockRouteRef = createRouteRef();

  it('should return an extension when calling make with sensible defaults', () => {
    const myPage = PageBlueprint.make({
      name: 'test-page',
      params: {
        loader: () => Promise.resolve(<div>Test</div>),
        path: '/test',
        routeRef: mockRouteRef,
      },
    });

    expect(myPage).toMatchInlineSnapshot(`
      {
        "$$type": "@backstage/ExtensionDefinition",
        "T": undefined,
        "attachTo": {
          "id": "app/routes",
          "input": "routes",
        },
        "configSchema": {
          "parse": [Function],
          "schema": [Function],
        },
        "disabled": false,
        "factory": [Function],
        "if": undefined,
        "inputs": {
          "pages": {
            "$$type": "@backstage/ExtensionInput",
            "config": {
              "internal": false,
              "optional": false,
              "singleton": false,
            },
            "context": {
              "input": "pages",
              "kind": "page",
              "name": "test-page",
            },
            "extensionData": [
              [Function],
              {
                "$$type": "@backstage/ExtensionDataRef",
                "config": {
                  "optional": true,
                },
                "id": "core.routing.ref",
                "optional": [Function],
                "toString": [Function],
              },
              [Function],
              {
                "$$type": "@backstage/ExtensionDataRef",
                "config": {
                  "optional": true,
                },
                "id": "core.title",
                "optional": [Function],
                "toString": [Function],
              },
              {
                "$$type": "@backstage/ExtensionDataRef",
                "config": {
                  "optional": true,
                },
                "id": "core.titleElement",
                "optional": [Function],
                "toString": [Function],
              },
              {
                "$$type": "@backstage/ExtensionDataRef",
                "config": {
                  "optional": true,
                },
                "id": "core.icon",
                "optional": [Function],
                "toString": [Function],
              },
            ],
            "replaces": undefined,
            "withContext": [Function],
          },
        },
        "kind": "page",
        "name": "test-page",
        "output": [
          [Function],
          [Function],
          {
            "$$type": "@backstage/ExtensionDataRef",
            "config": {
              "optional": true,
            },
            "id": "core.routing.ref",
            "optional": [Function],
            "toString": [Function],
          },
          {
            "$$type": "@backstage/ExtensionDataRef",
            "config": {
              "optional": true,
            },
            "id": "core.title",
            "optional": [Function],
            "toString": [Function],
          },
          {
            "$$type": "@backstage/ExtensionDataRef",
            "config": {
              "optional": true,
            },
            "id": "core.titleElement",
            "optional": [Function],
            "toString": [Function],
          },
          {
            "$$type": "@backstage/ExtensionDataRef",
            "config": {
              "optional": true,
            },
            "id": "core.icon",
            "optional": [Function],
            "toString": [Function],
          },
        ],
        "override": [Function],
        "toString": [Function],
        "version": "v2",
      }
    `);
  });

  it('should output a routeRef with the input routeRef', async () => {
    const myPage = PageBlueprint.make({
      name: 'test-page',
      params: {
        loader: () => Promise.resolve(<div data-testid="test">Test</div>),
        path: '/test',
        routeRef: mockRouteRef,
      },
    });

    const tester = createExtensionTester(myPage);

    // TODO(blam): test for the routePath output doesn't work, due to the way the test harness works
    // expect(tester.data(coreExtensionData.routePath)).toBe('/test');

    expect(tester.get(coreExtensionData.routeRef)).toBe(mockRouteRef);

    const { getByTestId } = renderInTestApp(tester.reactElement());

    await waitFor(() => expect(getByTestId('test')).toBeInTheDocument());
  });

  it('should allow defining additional inputs to the extension', async () => {
    const myPage = PageBlueprint.makeWithOverrides({
      name: 'test-page',
      inputs: {
        cards: createExtensionInput([coreExtensionData.reactElement], {
          optional: false,
          singleton: false,
        }),
      },
      factory(originalFactory, { inputs }) {
        return originalFactory({
          loader: async () => (
            <div data-testid="test">
              {inputs.cards.map(c => c.get(coreExtensionData.reactElement))}
            </div>
          ),
          path: '/test',
          routeRef: mockRouteRef,
        });
      },
    });

    const CardBlueprint = createExtensionBlueprint({
      kind: 'card',
      attachTo: { id: 'page:test-page', input: 'cards' },
      output: [coreExtensionData.reactElement],
      factory() {
        return [
          coreExtensionData.reactElement(
            <div data-testid="card">I'm a lovely card</div>,
          ),
        ];
      },
    });

    const tester = createExtensionTester(myPage).add(
      CardBlueprint.make({ name: 'card', params: {} }),
    );

    const { getByTestId, getByText } = renderInTestApp(tester.reactElement());

    await waitFor(() => expect(getByTestId('card')).toBeInTheDocument());
    await waitFor(() =>
      expect(getByText("I'm a lovely card")).toBeInTheDocument(),
    );
  });

  it('should produce a correct extension tree snapshot with child extensions', () => {
    const myPage = PageBlueprint.makeWithOverrides({
      name: 'test-page',
      inputs: {
        cards: createExtensionInput([coreExtensionData.reactElement], {
          optional: false,
          singleton: false,
        }),
      },
      factory(originalFactory, { inputs }) {
        return originalFactory({
          loader: async () => (
            <div>
              {inputs.cards.map(c => c.get(coreExtensionData.reactElement))}
            </div>
          ),
          path: '/test',
          routeRef: mockRouteRef,
        });
      },
    });

    const CardBlueprint = createExtensionBlueprint({
      kind: 'card',
      attachTo: { id: 'page:test-page', input: 'cards' },
      output: [coreExtensionData.reactElement],
      factory() {
        return [coreExtensionData.reactElement(<div>I'm a lovely card</div>)];
      },
    });

    const tester = createExtensionTester(myPage).add(
      CardBlueprint.make({ name: 'card', params: {} }),
    );

    expect(tester.snapshot()).toMatchInlineSnapshot(`
      {
        "children": {
          "cards": [
            {
              "id": "card:card",
              "outputs": [
                "core.reactElement",
              ],
            },
          ],
        },
        "id": "page:test-page",
        "outputs": [
          "core.reactElement",
          "core.routing.path",
          "core.routing.ref",
        ],
      }
    `);
  });

  it('should reactively re-render a sub-page tab/breadcrumb label provided via titleElement', async () => {
    // Simulates a translated title: the *value* changes at render time
    // (e.g. in response to a language switch), unlike a plain `title`
    // string which is fixed once when the extension factory runs.
    function DynamicTitle() {
      const [label, setLabel] = useState('General');
      return (
        <button
          data-testid="toggle-title"
          onClick={() => setLabel('Allgemein')}
        >
          {label}
        </button>
      );
    }

    const rootPage = PageBlueprint.make({
      name: 'title-test-page',
      params: {
        path: '/test',
        routeRef: mockRouteRef,
      },
    });

    const subPage = SubPageBlueprint.make({
      name: 'general',
      attachTo: { id: 'page:title-test-page', input: 'pages' },
      params: {
        path: 'general',
        title: 'General',
        titleElement: <DynamicTitle />,
        loader: () => Promise.resolve(<div data-testid="content" />),
      },
    });

    const tester = createExtensionTester(rootPage).add(subPage);

    renderInTestApp(tester.reactElement());

    // Initially renders the titleElement's current value, in both the tab
    // and the breadcrumb it registers - not the plain fallback `title`.
    await waitFor(() =>
      expect(screen.getAllByText('General').length).toBeGreaterThan(0),
    );

    // Simulate a language switch: the titleElement is mounted independently
    // wherever it's consumed (tab label, breadcrumb label, and any hidden
    // measurement copies the real tab bar renders for overflow handling) -
    // toggle every mounted instance to prove each one re-renders in place,
    // rather than being frozen at extension-construction time like a plain
    // `title` string would be. Some instances mount asynchronously, so this
    // polls and clicks any newly-appeared ones until none show 'General'.
    await waitFor(() => {
      for (const toggle of screen.queryAllByText('General')) {
        fireEvent.click(toggle);
      }
      expect(screen.queryAllByText('General').length).toBe(0);
    });
    expect(screen.getAllByText('Allgemein').length).toBeGreaterThan(0);
  });
});
