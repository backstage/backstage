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
import { createRouteRef } from '../routing';
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
import { act, screen, waitFor } from '@testing-library/react';
import { useState } from 'react';
import { SubPageBlueprint } from './SubPageBlueprint';
import { PageRouterBlueprint } from './PageRouterBlueprint';
import type { PageRouterComponent } from '../apis/definitions/PageRouterApi';

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
          {
            "$$type": "@backstage/ExtensionDataRef",
            "config": {
              "optional": true,
            },
            "id": "core.page.subPagePaths",
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

  it('should compose SubPageBlueprint pages into tabs', async () => {
    const parentPage = PageBlueprint.make({
      params: {
        path: '/tools',
        title: 'Tools',
      },
    });

    const overviewSubPage = SubPageBlueprint.make({
      name: 'overview',
      params: {
        path: 'overview',
        title: 'Overview',
        loader: async () => <div data-testid="overview">Overview</div>,
      },
    });

    const settingsSubPage = SubPageBlueprint.make({
      name: 'settings',
      params: {
        path: 'settings',
        title: 'Settings',
        loader: async () => <div data-testid="settings">Settings</div>,
      },
    });

    renderTestApp({
      extensions: [parentPage, overviewSubPage, settingsSubPage],
      initialRouteEntries: ['/tools/overview'],
    });

    await waitFor(() =>
      expect(screen.getByTestId('overview')).toBeInTheDocument(),
    );
    expect(screen.getByRole('tab', { name: 'Overview' })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: 'Settings' })).toBeInTheDocument();
  });

  it('should support SubPageBlueprint pages input', async () => {
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

  it('should hand the selected sub-page to the router adapter as opaque content', async () => {
    const received: string[][] = [];

    // A deliberately non-routing adapter. It has no way to choose between
    // sub-pages, and does not need one: the selection has already been made by
    // the time the content reaches it.
    const RecordingRouter: PageRouterComponent = props => {
      received.push(Object.keys(props).sort());
      return <div data-testid="recording-router">{props.children}</div>;
    };

    const parentPage = PageBlueprint.make({
      params: { path: '/recorded', title: 'Recorded' },
    });
    const adapter = PageRouterBlueprint.make({
      name: 'recording',
      attachTo: { id: 'page:test', input: 'router' },
      params: { component: RecordingRouter },
    });
    const overviewSubPage = SubPageBlueprint.make({
      name: 'overview',
      params: {
        path: 'overview',
        title: 'Overview',
        loader: async () => <div data-testid="overview">Overview</div>,
      },
    });
    const settingsSubPage = SubPageBlueprint.make({
      name: 'settings',
      params: {
        path: 'settings',
        title: 'Settings',
        loader: async () => <div data-testid="settings">Settings</div>,
      },
    });

    renderTestApp({
      extensions: [parentPage, adapter, overviewSubPage, settingsSubPage],
      initialRouteEntries: ['/recorded/settings'],
    });

    expect(await screen.findByTestId('settings')).toBeInTheDocument();
    expect(screen.getByTestId('recording-router')).toContainElement(
      screen.getByTestId('settings'),
    );
    expect(screen.queryByTestId('overview')).not.toBeInTheDocument();

    // The whole public contract is the opaque content. Mount details stay in
    // the framework context for first-party adapters to consume privately.
    expect(received[0]).toEqual(['children']);

    // Breadcrumb wrapping stays framework-side: the adapter rendered nothing
    // but the element it was given, and the sub-page breadcrumb is present.
    // Awaited rather than read synchronously: breadcrumb entries register from
    // an effect, and the header renders no nav at all until the first one
    // arrives, so the content being on screen does not mean the nav is yet.
    const breadcrumbs = await screen.findByRole('navigation', {
      name: 'Breadcrumbs',
    });
    expect(breadcrumbs).toHaveTextContent('Recorded');
    expect(breadcrumbs).toHaveTextContent('Settings');
  });

  it('should keep the page shell mounted while the sub-page changes', async () => {
    // State held between the page chrome and the sub-page content: it survives
    // a tab change only if nothing from the page shell down to the adapter is
    // remounted. Asserted as a value rather than as a mount count, because the
    // `<Suspense>` above the page makes the initial mount count 2 and so turns
    // any counter into a measure of suspension as well.
    const StatefulRouter: PageRouterComponent = ({ children }) => {
      const [kept, setKept] = useState(0);
      return (
        <div>
          <span data-testid="shell-state">{kept}</span>
          <button type="button" onClick={() => setKept(n => n + 1)}>
            Keep
          </button>
          {children}
        </div>
      );
    };

    const parentPage = PageBlueprint.make({
      params: { path: '/kept', title: 'Kept' },
    });
    const adapter = PageRouterBlueprint.make({
      name: 'stateful',
      attachTo: { id: 'page:test', input: 'router' },
      params: { component: StatefulRouter },
    });
    const overviewSubPage = SubPageBlueprint.make({
      name: 'overview',
      params: {
        path: 'overview',
        title: 'Overview',
        loader: async () => <div data-testid="overview">Overview</div>,
      },
    });
    const settingsSubPage = SubPageBlueprint.make({
      name: 'settings',
      params: {
        path: 'settings',
        title: 'Settings',
        loader: async () => <div data-testid="settings">Settings</div>,
      },
    });

    const { appHistory } = renderTestApp({
      extensions: [parentPage, adapter, overviewSubPage, settingsSubPage],
      initialRouteEntries: ['/kept/overview'],
    });

    expect(await screen.findByTestId('overview')).toBeInTheDocument();
    await act(async () => {
      screen.getByRole('button', { name: 'Keep' }).click();
    });
    await act(async () => {
      screen.getByRole('button', { name: 'Keep' }).click();
    });
    expect(screen.getByTestId('shell-state')).toHaveTextContent('2');

    await act(async () => {
      appHistory.navigate('/kept/settings');
    });

    expect(await screen.findByTestId('settings')).toBeInTheDocument();
    expect(screen.queryByTestId('overview')).not.toBeInTheDocument();
    expect(screen.getByTestId('shell-state')).toHaveTextContent('2');
    expect(screen.getByRole('tab', { name: 'Overview' })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: 'Settings' })).toBeInTheDocument();
  });

  it('should redirect to the first subpage on the parent index route, and leave a page without sub-pages alone', async () => {
    const parentPage = PageBlueprint.make({
      params: {
        path: '/mixed',
        title: 'Mixed',
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

    // A page with no sub-pages at all: its own root must stay put, and so must
    // any deeper path it owns.
    const plainPage = PageBlueprint.make({
      name: 'plain',
      params: {
        path: '/plain',
        title: 'Plain',
        loader: async () => <div data-testid="plain-page">Plain</div>,
      },
    });

    const { appHistory } = renderTestApp({
      extensions: [parentPage, inputSubPage, plainPage],
      initialRouteEntries: ['/mixed?tab=1#here'],
    });

    expect(await screen.findByTestId('input-page')).toBeInTheDocument();
    // The URL says which tab is showing, and the query and fragment survive.
    expect(appHistory.location.pathname).toBe('/mixed/input');
    expect(appHistory.location.search).toBe('?tab=1');
    expect(appHistory.location.hash).toBe('#here');

    await act(async () => {
      appHistory.navigate('/plain');
    });
    expect(await screen.findByTestId('plain-page')).toBeInTheDocument();
    expect(appHistory.location.pathname).toBe('/plain');

    await act(async () => {
      appHistory.navigate('/plain/deeper');
    });
    expect(await screen.findByTestId('plain-page')).toBeInTheDocument();
    expect(appHistory.location.pathname).toBe('/plain/deeper');
  });
});
