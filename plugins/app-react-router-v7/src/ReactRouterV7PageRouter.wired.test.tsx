/*
 * Copyright 2026 The Backstage Authors
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
import { act, screen, waitFor } from '@testing-library/react';
import { renderTestApp } from '@backstage/frontend-test-utils';
import {
  PageBlueprint,
  SubPageBlueprint,
  createExtension,
  createExtensionInput,
  coreExtensionData,
  ExtensionBoundary,
} from '@backstage/frontend-plugin-api';
import { Link, useLocation, useParams } from 'react-router';
import { ReactRouterV7PageRouter } from './ReactRouterV7PageRouter';

/**
 * Wired-path coverage: a real page extension whose loader renders the v7
 * adapter around its own content, driven through the production AppRouteSwitch
 * / memory-history harness (not mock-contract-only).
 *
 * Lives in this package so the page content can import React Router v7 APIs
 * without conflicting with the app plugin's v6 peer dependency.
 */
describe('ReactRouterV7PageRouter wired path', () => {
  it.each([
    { childPath: '', parentHref: '/' },
    { childPath: ':id?', parentHref: '/catalog' },
    { childPath: 'optional?', parentHref: '/catalog' },
    {
      parentPath: '/catalog/:id?',
      childPath: 'edit',
      parentHref: '/catalog',
      initialPath: '/catalog/edit',
      nextPath: '/catalog/foo/edit',
      nextParentHref: '/catalog/foo',
      nextParam: 'foo',
    },
    {
      parentPath: '/touch\u00e9/a b',
      childPath: '',
      parentHref: '/',
      initialPath: '/touch%C3%A9/a%20b',
    },
  ])(
    'preserves the authored boundary and parent state for child "$childPath"',
    async ({
      childPath,
      parentHref,
      parentPath = '/catalog',
      initialPath = '/catalog',
      nextPath = initialPath,
      nextParentHref = parentHref,
      nextParam = 'none',
    }) => {
      function ParentProbe() {
        const [count, setCount] = useState(0);
        const { id } = useParams();
        return (
          <>
            <button onClick={() => setCount(value => value + 1)}>
              Count {count}
            </button>
            <span>Parent param: {id ?? 'none'}</span>
          </>
        );
      }
      for (const parentHasAdapter of [false, true]) {
        const parent = createExtension({
          name: 'catalog',
          attachTo: { id: 'app/routes', input: 'routes' },
          inputs: {
            children: createExtensionInput([coreExtensionData.reactElement]),
          },
          output: [coreExtensionData.routePath, coreExtensionData.reactElement],
          factory({ node, inputs }) {
            const children = (
              <>
                <ParentProbe />
                {inputs.children[0].get(coreExtensionData.reactElement)}
              </>
            );
            return [
              coreExtensionData.routePath(parentPath),
              coreExtensionData.reactElement(
                <ExtensionBoundary node={node}>
                  {parentHasAdapter ? (
                    <ReactRouterV7PageRouter>
                      {children}
                    </ReactRouterV7PageRouter>
                  ) : (
                    children
                  )}
                </ExtensionBoundary>,
              ),
            ];
          },
        });
        const child = createExtension({
          name: 'child',
          attachTo: { id: 'test/catalog', input: 'children' },
          output: [coreExtensionData.routePath, coreExtensionData.reactElement],
          factory({ node }) {
            return [
              coreExtensionData.routePath(childPath),
              coreExtensionData.reactElement(
                <ExtensionBoundary node={node}>
                  <ReactRouterV7PageRouter>
                    <Link to=".">Current</Link>
                    <Link to="..">Parent</Link>
                    <Link to="../..">Grandparent</Link>
                    <ReactRouterV7PageRouter>
                      <Link to="..">Repeated parent</Link>
                    </ReactRouterV7PageRouter>
                  </ReactRouterV7PageRouter>
                </ExtensionBoundary>,
              ),
            ];
          },
        });
        const rendered = renderTestApp({
          extensions: [parent, child],
          initialRouteEntries: [initialPath],
        });
        expect(
          await screen.findByRole('link', { name: 'Parent' }),
        ).toHaveAttribute('href', parentHref);
        expect(screen.getByRole('link', { name: 'Current' })).toHaveAttribute(
          'href',
          initialPath,
        );
        expect(
          screen.getByRole('link', { name: 'Grandparent' }),
        ).toHaveAttribute('href', '/');
        expect(
          screen.getByRole('link', { name: 'Repeated parent' }),
        ).toHaveAttribute('href', parentHref);
        expect(screen.getByText('Parent param: none')).toBeInTheDocument();
        await act(async () =>
          screen.getByRole('button', { name: 'Count 0' }).click(),
        );
        await act(async () => rendered.appHistory.navigate(nextPath));
        expect(
          screen.getByRole('button', { name: 'Count 1' }),
        ).toBeInTheDocument();
        expect(screen.getByRole('link', { name: 'Parent' })).toHaveAttribute(
          'href',
          nextParentHref,
        );
        expect(
          screen.getByText(
            `Parent param: ${parentHasAdapter ? nextParam : 'none'}`,
          ),
        ).toBeInTheDocument();
        await act(async () => rendered.appHistory.navigate(initialPath));
        expect(
          screen.getByRole('button', { name: 'Count 1' }),
        ).toBeInTheDocument();
        expect(screen.getByText('Parent param: none')).toBeInTheDocument();
        rendered.unmount();
      }
    },
  );
  it('should run a page that declares v7 with in-plugin nav and cross-page navigate', async () => {
    const SettingsWithNav = () => {
      const location = useLocation();
      return (
        <div data-testid="settings-page">
          <div data-testid="pathname">{location.pathname}</div>
          <div data-testid="router-version">v7</div>
          <Link to="./general" data-testid="general-link">
            General
          </Link>
          <Link to="./auth" data-testid="auth-link">
            Auth
          </Link>
        </div>
      );
    };

    const settingsPage = PageBlueprint.make({
      name: 'settings-v7',
      params: {
        path: '/settings-v7',
        loader: async () => (
          <ReactRouterV7PageRouter>
            <SettingsWithNav />
          </ReactRouterV7PageRouter>
        ),
      },
    });

    const { appHistory } = renderTestApp({
      extensions: [settingsPage],
      initialRouteEntries: ['/settings-v7'],
    });

    await waitFor(() => {
      expect(screen.getByTestId('settings-page')).toBeInTheDocument();
      expect(screen.getByTestId('router-version')).toHaveTextContent('v7');
      expect(screen.getByTestId('pathname')).toHaveTextContent('/settings-v7');
    });

    await act(async () => {
      screen.getByTestId('general-link').click();
    });

    await waitFor(() => {
      expect(screen.getByTestId('pathname')).toHaveTextContent(
        '/settings-v7/general',
      );
    });

    // v7 relative splat resolution uses the full matched pathname for `./`
    // links, so return to the page root before the next relative hop.
    // AppHistoryApi has no programmatic `go` — navigate directly instead.
    await act(async () => {
      appHistory.navigate('/settings-v7');
    });

    await waitFor(() => {
      expect(screen.getByTestId('pathname')).toHaveTextContent('/settings-v7');
    });

    await act(async () => {
      screen.getByTestId('auth-link').click();
    });

    await waitFor(() => {
      expect(screen.getByTestId('pathname')).toHaveTextContent(
        '/settings-v7/auth',
      );
    });

    await act(async () => {
      appHistory.navigate('/settings-v7');
    });

    await waitFor(() => {
      expect(screen.getByTestId('pathname')).toHaveTextContent('/settings-v7');
    });

    await act(async () => {
      appHistory.navigate('/settings-v7/auth');
    });

    await waitFor(() => {
      expect(screen.getByTestId('pathname')).toHaveTextContent(
        '/settings-v7/auth',
      );
    });

    // Page stayed on the v7 adapter through in-plugin nav and app history nav.
    expect(screen.getByTestId('router-version')).toHaveTextContent('v7');
  });

  it('should expose route params to a page that declares the v7 adapter', async () => {
    const EntityParams = () => {
      const params = useParams();
      return (
        <div data-testid="entity-page">
          <span data-testid="namespace">{params.namespace}</span>
          <span data-testid="kind">{params.kind}</span>
          <span data-testid="name">{params.name}</span>
          <span data-testid="splat">{params['*'] ?? ''}</span>
        </div>
      );
    };

    const entityPage = PageBlueprint.make({
      name: 'entity-v7',
      params: {
        path: '/entity-v7/:namespace/:kind/:name',
        loader: async () => (
          <ReactRouterV7PageRouter>
            <EntityParams />
          </ReactRouterV7PageRouter>
        ),
      },
    });

    renderTestApp({
      extensions: [entityPage],
      initialRouteEntries: ['/entity-v7/default/component/my-entity/overview'],
    });

    await waitFor(() => {
      expect(screen.getByTestId('namespace')).toHaveTextContent('default');
      expect(screen.getByTestId('kind')).toHaveTextContent('component');
      expect(screen.getByTestId('name')).toHaveTextContent('my-entity');
      expect(screen.getByTestId('splat')).toHaveTextContent('overview');
    });
  });

  it('should project omitted static-optional segments through the v7 adapter', async () => {
    const OptionalStaticPage = () => {
      const { taskId } = useParams();
      return (
        <>
          <span data-testid="optional-task-id">{taskId}</span>
          <Link to="./details" data-testid="optional-details-link">
            Details
          </Link>
        </>
      );
    };

    const optionalPage = PageBlueprint.make({
      name: 'optional-static-v7',
      params: {
        path: '/project-v7/task?/:taskId',
        loader: async () => (
          <ReactRouterV7PageRouter>
            <OptionalStaticPage />
          </ReactRouterV7PageRouter>
        ),
      },
    });

    renderTestApp({
      extensions: [optionalPage],
      initialRouteEntries: ['/project-v7/123'],
    });

    expect(await screen.findByTestId('optional-task-id')).toHaveTextContent(
      '123',
    );
    expect(screen.getByTestId('optional-details-link')).toHaveAttribute(
      'href',
      '/project-v7/123/details',
    );
  });
  it('resolves parent links from matched extension ancestry', async () => {
    function Probe() {
      const { name, id } = useParams();
      return (
        <div>
          <span>
            Params: {name}/{id}
          </span>
          <Link to="..">Parent</Link>
        </div>
      );
    }
    const standalone = PageBlueprint.make({
      name: 'standalone',
      params: {
        path: '/catalog/list',
        loader: async () => (
          <ReactRouterV7PageRouter>
            <Probe />
          </ReactRouterV7PageRouter>
        ),
      },
    });
    const parent = PageBlueprint.make({
      name: 'catalog',
      params: { path: '/catalog/:name', title: 'Catalog' },
    });
    const child = SubPageBlueprint.make({
      name: 'tab',
      attachTo: { id: 'page:test/catalog', input: 'pages' },
      params: {
        path: 'tab/:id',
        title: 'Tab',
        loader: async () => (
          <ReactRouterV7PageRouter>
            <Probe />
          </ReactRouterV7PageRouter>
        ),
      },
    });
    const { appHistory } = renderTestApp({
      extensions: [standalone, parent, child],
      initialRouteEntries: ['/catalog/list'],
    });
    expect(await screen.findByRole('link', { name: 'Parent' })).toHaveAttribute(
      'href',
      '/',
    );

    await act(async () => appHistory.navigate('/catalog/foo/tab/blue'));
    expect(await screen.findByText('Params: foo/blue')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Parent' })).toHaveAttribute(
      'href',
      '/catalog/foo',
    );
    await act(async () => appHistory.navigate('/catalog/bar/tab/green'));
    expect(await screen.findByText('Params: bar/green')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Parent' })).toHaveAttribute(
      'href',
      '/catalog/bar',
    );
  });
});
