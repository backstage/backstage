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
import { createRouteDescriptor, createRouteRef } from '../routing';
import { PageBlueprint } from './PageBlueprint';
import {
  createExtensionTester,
  renderInTestApp,
  renderTestApp,
} from '@backstage/frontend-test-utils';
import {
  coreExtensionData,
  createExtensionBlueprint,
  createExtensionInput,
} from '../wiring';
import { screen, waitFor } from '@testing-library/react';
import { SubPageBlueprint } from './SubPageBlueprint';

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
                "id": "core.icon",
                "optional": [Function],
                "toString": [Function],
              },
            ],
            "replaces": undefined,
            "withContext": [Function],
          },
          "router": {
            "$$type": "@backstage/ExtensionInput",
            "config": {
              "internal": false,
              "optional": true,
              "singleton": true,
            },
            "context": {
              "input": "router",
              "kind": "page",
              "name": "test-page",
            },
            "extensionData": [
              [Function],
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

  it('should accept route descriptors for subpage tab routing', async () => {
    const myPage = PageBlueprint.make({
      name: 'descriptor-page',
      params: {
        path: '/tools',
        title: 'Tools',
        routes: [
          createRouteDescriptor({
            path: 'overview',
            title: 'Overview',
            loader: async () => <div data-testid="overview">Overview</div>,
          }),
          createRouteDescriptor({
            path: 'settings',
            title: 'Settings',
            loader: async () => <div data-testid="settings">Settings</div>,
          }),
        ],
      },
    });

    renderTestApp({
      extensions: [myPage],
      initialRouteEntries: ['/tools/overview'],
    });

    await waitFor(() =>
      expect(screen.getByTestId('overview')).toBeInTheDocument(),
    );
    expect(screen.getByRole('tab', { name: 'Overview' })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: 'Settings' })).toBeInTheDocument();
  });

  it('should still support SubPageBlueprint pages input alongside descriptors API', async () => {
    const parentPage = PageBlueprint.make({
      params: {
        path: '/devtools',
        title: 'DevTools',
      },
    });

    const infoSubPage = SubPageBlueprint.make({
      name: 'info',
      params: {
        path: 'info',
        title: 'Info',
        loader: async () => <div data-testid="info-page">Info</div>,
      },
    });

    renderTestApp({
      extensions: [parentPage, infoSubPage],
      initialRouteEntries: ['/devtools/info'],
    });

    await waitFor(() =>
      expect(screen.getByTestId('info-page')).toBeInTheDocument(),
    );
  });

  it('should prefer pages input over routes when both are present', async () => {
    const parentPage = PageBlueprint.make({
      params: {
        path: '/mixed',
        title: 'Mixed',
        routes: [
          createRouteDescriptor({
            path: 'descriptor',
            title: 'Descriptor',
            loader: async () => (
              <div data-testid="descriptor-page">Descriptor</div>
            ),
          }),
        ],
      },
    });

    const inputSubPage = SubPageBlueprint.make({
      name: 'input',
      params: {
        path: 'input',
        title: 'Input',
        loader: async () => <div data-testid="input-page">Input</div>,
      },
    });

    renderTestApp({
      extensions: [parentPage, inputSubPage],
      initialRouteEntries: ['/mixed/input'],
    });

    await waitFor(() =>
      expect(screen.getByTestId('input-page')).toBeInTheDocument(),
    );
    expect(screen.queryByTestId('descriptor-page')).not.toBeInTheDocument();
  });
});
