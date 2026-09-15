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
import { ReactNode, useEffect } from 'react';
import { SubPageBlueprint } from './SubPageBlueprint';
import { usePageMount } from '@internal/frontend';
import { useAppNode } from '../components/AppNodeProvider';
import { pluginWrapperApiRef } from '../apis/definitions/PluginWrapperApi';
import { analyticsApiRef } from '../apis/definitions/AnalyticsApi';
import { withLogCollector } from '@backstage/test-utils';
import { useAnalytics } from '../analytics';

describe('PageBlueprint', () => {
  const mockRouteRef = createRouteRef();

  it('keeps the shell visible while loading and applies the page lifecycle once', async () => {
    let finishLoading: (element: JSX.Element) => void;
    const loaded = new Promise<JSX.Element>(resolve => {
      finishLoading = resolve;
    });
    const page = PageBlueprint.make({
      name: 'lifecycle',
      params: { path: '/lifecycle', title: 'Lifecycle', loader: () => loaded },
    });
    const captureEvent = jest.fn();
    const RootWrapper = ({ children }: { children: ReactNode }) => (
      <>{children}</>
    );
    const Wrapper = ({ children }: { children: ReactNode }) => {
      const nodeId = useAppNode()?.spec.id;
      const analytics = useAnalytics();
      useEffect(() => {
        analytics.captureEvent('wrapper-mounted', nodeId ?? 'unknown');
      }, [analytics, nodeId]);
      return <section aria-label={`Wrapper for ${nodeId}`}>{children}</section>;
    };
    renderTestApp({
      extensions: [page],
      initialRouteEntries: ['/lifecycle'],
      apis: [
        [analyticsApiRef, { captureEvent }],
        [
          pluginWrapperApiRef,
          {
            getRootWrapper: () => RootWrapper,
            getPluginWrapper: () => Wrapper,
          },
        ],
      ],
    });

    await waitFor(() =>
      expect(screen.getByRole('heading', { name: 'Lifecycle' })).toBeVisible(),
    );
    expect(screen.queryByText('Loaded content')).not.toBeInTheDocument();
    await act(async () => finishLoading!(<p>Loaded content</p>));
    expect(await screen.findByText('Loaded content')).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Lifecycle' })).toBeVisible();
    expect(
      screen.getAllByRole('region', {
        name: 'Wrapper for page:test/lifecycle',
      }),
    ).toHaveLength(1);
    expect(
      captureEvent.mock.calls.filter(
        ([event]) =>
          event.action === 'wrapper-mounted' &&
          event.subject === 'page:test/lifecycle',
      ),
    ).toHaveLength(1);
  });

  it('keeps the shell visible when the page loader fails', async () => {
    const page = PageBlueprint.make({
      params: {
        path: '/failed',
        title: 'Failed page',
        loader: async () => {
          throw new Error('Page load failed');
        },
      },
    });
    await withLogCollector(['error'], async () => {
      renderTestApp({ extensions: [page], initialRouteEntries: ['/failed'] });
      expect(await screen.findByText('Page load failed')).toBeInTheDocument();
      expect(
        screen.getByRole('heading', { name: 'Failed page' }),
      ).toBeVisible();
    });
  });

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

  it('should mount the first sub-page, and any router it declares, at the sub-page mount in an isolated render', async () => {
    const SubPageRouter = ({ children }: { children?: ReactNode }) => (
      <div data-testid="sub-page-router" data-mount={usePageMount()?.basePath}>
        {children}
      </div>
    );
    const FirstSubPage = () => (
      <div data-testid="first-page" data-mount={usePageMount()?.basePath} />
    );
    const parentPage = PageBlueprint.make({
      name: 'isolated',
      params: { path: '/isolated', title: 'Isolated' },
    });
    const firstSubPage = SubPageBlueprint.make({
      name: 'first',
      attachTo: { id: 'page:isolated', input: 'pages' },
      params: {
        path: 'first',
        title: 'First',
        loader: async () => (
          <SubPageRouter>
            <FirstSubPage />
          </SubPageRouter>
        ),
      },
    });
    const tester = createExtensionTester(parentPage).add(firstSubPage);

    renderInTestApp(tester.reactElement(), {
      mountPath: '/isolated',
      initialRouteEntries: ['/isolated'],
    });

    // The isolated extension tree uses the app's matcher and index redirect,
    // so the child adapter receives the same mount as it does in production.
    expect(await screen.findByTestId('first-page')).toHaveAttribute(
      'data-mount',
      '/isolated/first',
    );
    expect(screen.getByTestId('sub-page-router')).toHaveAttribute(
      'data-mount',
      '/isolated/first',
    );
  });

  it.each([
    { mountPath: undefined, basePath: '' },
    { mountPath: '/teams/:team/tools', basePath: '/teams/acme/tools' },
  ])(
    'matches isolated sub-pages at $mountPath and redirects their index',
    async ({ mountPath, basePath }) => {
      const Child = ({ name }: { name: string }) => (
        <p>
          {name} at {usePageMount()?.basePath}
        </p>
      );
      const parent = PageBlueprint.make({
        name: 'isolated-routing',
        params: { path: '/production-path', title: 'Isolated routing' },
      });
      const tester = createExtensionTester(parent);
      for (const name of ['first', 'second']) {
        tester.add(
          SubPageBlueprint.make({
            name,
            attachTo: { id: 'page:isolated-routing', input: 'pages' },
            params: {
              path: name,
              title: name,
              loader: async () => <Child name={name} />,
            },
          }),
        );
      }
      const { appHistory } = renderInTestApp(tester.reactElement(), {
        mountPath,
        initialRouteEntries: [`${basePath}/second`],
      });
      expect(
        await screen.findByText(`second at ${basePath}/second`),
      ).toBeInTheDocument();
      expect(
        screen.queryByText(`first at ${basePath}/first`),
      ).not.toBeInTheDocument();
      await act(async () =>
        appHistory.navigate(`${basePath}/?mode=test#section`),
      );
      expect(
        await screen.findByText(`first at ${basePath}/first`),
      ).toBeInTheDocument();
      expect(appHistory.location).toMatchObject({
        pathname: `${basePath}/first`,
        search: '?mode=test',
        hash: '#section',
      });
      await act(async () => appHistory.navigate(-1));
      expect(
        await screen.findByText(`second at ${basePath}/second`),
      ).toBeInTheDocument();
      await act(async () => appHistory.navigate(`${basePath}/missing`));
      expect(
        screen.queryByText(`first at ${basePath}/first`),
      ).not.toBeInTheDocument();
      expect(
        screen.queryByText(`second at ${basePath}/second`),
      ).not.toBeInTheDocument();
    },
  );

  it('should render only the selected sub-page, with framework breadcrumbs outside whatever it declares', async () => {
    // A deliberately non-routing stand-in for an adapter, declared the way a
    // real one is. It has no way to choose between sub-pages and does not need
    // one: selection was made by top-level route matching long before the
    // content, let alone this, was rendered.
    const RecordingRouter = ({ children }: { children?: ReactNode }) => (
      <div data-testid="recording-router">{children}</div>
    );

    const parentPage = PageBlueprint.make({
      params: { path: '/recorded', title: 'Recorded' },
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
        loader: async () => (
          <RecordingRouter>
            <div data-testid="settings">Settings</div>
          </RecordingRouter>
        ),
      },
    });

    renderTestApp({
      extensions: [parentPage, overviewSubPage, settingsSubPage],
      initialRouteEntries: ['/recorded/settings'],
    });

    expect(await screen.findByTestId('settings')).toBeInTheDocument();
    expect(screen.getByTestId('recording-router')).toContainElement(
      screen.getByTestId('settings'),
    );
    expect(screen.queryByTestId('overview')).not.toBeInTheDocument();

    // Breadcrumb registration stays framework-side, above the content and so
    // above anything the content declares: the page and sub-page crumbs are
    // there whether or not the sub-page brought a router with it.
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
    // The shell is framework-owned, so it is the shell's own DOM that has to
    // survive a tab change. Element identity rather than a mount count,
    // because the `<Suspense>` above the page makes the initial mount count 2
    // and so turns any counter into a measure of suspension as well.
    const parentPage = PageBlueprint.make({
      params: { path: '/kept', title: 'Kept' },
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
      extensions: [parentPage, overviewSubPage, settingsSubPage],
      initialRouteEntries: ['/kept/overview'],
    });

    expect(await screen.findByTestId('overview')).toBeInTheDocument();
    const tabList = screen.getByRole('tablist');
    const overviewTab = screen.getByRole('tab', { name: 'Overview' });

    await act(async () => {
      appHistory.navigate('/kept/settings');
    });

    expect(await screen.findByTestId('settings')).toBeInTheDocument();
    expect(screen.queryByTestId('overview')).not.toBeInTheDocument();
    expect(screen.getByRole('tablist')).toBe(tabList);
    expect(screen.getByRole('tab', { name: 'Overview' })).toBe(overviewTab);
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
