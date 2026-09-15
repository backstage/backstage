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
import { act, screen } from '@testing-library/react';
import { renderTestApp } from '@backstage/frontend-test-utils';
import {
  PageBlueprint,
  SubPageBlueprint,
  createExtension,
  createExtensionInput,
  coreExtensionData,
  ExtensionBoundary,
} from '@backstage/frontend-plugin-api';
import { Link, Routes, Route, useParams } from 'react-router-dom';
import { ReactRouterV6PageRouter } from './ReactRouterV6PageRouter';

/**
 * Wired-path coverage: a real page extension whose loader renders the v6
 * adapter around its own content, driven through the production AppRouteSwitch
 * / memory-history harness (not mock-contract-only).
 *
 * Each loader declares the adapter that supplies its page matches. The root
 * v6 context remains available for shared UI without matching the page.
 */
describe('ReactRouterV6PageRouter wired path', () => {
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
                    <ReactRouterV6PageRouter>
                      {children}
                    </ReactRouterV6PageRouter>
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
                  <ReactRouterV6PageRouter>
                    <Link to=".">Current</Link>
                    <Link to="..">Parent</Link>
                    <Link to="../..">Grandparent</Link>
                    <ReactRouterV6PageRouter>
                      <Link to="..">Repeated parent</Link>
                    </ReactRouterV6PageRouter>
                  </ReactRouterV6PageRouter>
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
          screen.getByText(`Parent param: ${nextParam}`),
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
  it('should support opaque React Router children under the page adapter', async () => {
    const OpaqueSettings = () => (
      <div data-testid="opaque-root">
        <Routes>
          <Route index element={<div data-testid="opaque-index">Index</div>} />
          <Route
            path="general"
            element={<div data-testid="opaque-general">General</div>}
          />
        </Routes>
        <Link to="./general" data-testid="opaque-general-link">
          General
        </Link>
      </div>
    );

    const settingsPage = PageBlueprint.make({
      name: 'opaque-v6',
      params: {
        path: '/opaque-v6',
        loader: async () => (
          <ReactRouterV6PageRouter>
            <OpaqueSettings />
          </ReactRouterV6PageRouter>
        ),
      },
    });

    const { appHistory } = renderTestApp({
      extensions: [settingsPage],
      initialRouteEntries: ['/opaque-v6'],
    });

    expect(await screen.findByTestId('opaque-index')).toHaveTextContent(
      'Index',
    );
    expect(screen.queryByTestId('opaque-general')).not.toBeInTheDocument();
    expect(screen.getByTestId('opaque-general-link')).toHaveAttribute(
      'href',
      '/opaque-v6/general',
    );

    await act(async () => {
      screen.getByTestId('opaque-general-link').click();
    });

    expect(await screen.findByTestId('opaque-general')).toHaveTextContent(
      'General',
    );
    expect(screen.queryByTestId('opaque-index')).not.toBeInTheDocument();
    expect(appHistory.location.pathname).toBe('/opaque-v6/general');
  });

  it('should keep page content mounted while the concrete mount prefix changes', async () => {
    // Entity A → entity B under one page pattern is the navigation that costs
    // the most to get wrong: the page stays, and everything it was holding —
    // in-page state, scroll position, in-flight requests — has to stay with it.
    const Counting = () => {
      const [bumped, setBumped] = useState(0);
      const { name } = useParams();
      return (
        <div data-testid="counting-page">
          <span data-testid="name">{name}</span>
          <span data-testid="bumped">{bumped}</span>
          <button type="button" onClick={() => setBumped(n => n + 1)}>
            Bump
          </button>
        </div>
      );
    };

    const entityPage = PageBlueprint.make({
      name: 'entity-v6',
      params: {
        path: '/e/:name',
        loader: async () => (
          <ReactRouterV6PageRouter>
            <Counting />
          </ReactRouterV6PageRouter>
        ),
      },
    });

    const { appHistory } = renderTestApp({
      extensions: [entityPage],
      initialRouteEntries: ['/e/a'],
    });

    expect(await screen.findByTestId('counting-page')).toBeInTheDocument();
    expect(screen.getByTestId('name')).toHaveTextContent('a');
    await act(async () => {
      screen.getByRole('button', { name: 'Bump' }).click();
    });
    await act(async () => {
      screen.getByRole('button', { name: 'Bump' }).click();
    });
    expect(screen.getByTestId('bumped')).toHaveTextContent('2');

    await act(async () => {
      appHistory.navigate('/e/b');
    });

    // The page really did move — the param is the new one — and it moved
    // without being torn down and rebuilt.
    expect(await screen.findByTestId('name')).toHaveTextContent('b');
    expect(screen.getByTestId('bumped')).toHaveTextContent('2');
  });

  it('should project omitted static-optional segments into route params and relative links', async () => {
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
      name: 'optional-static-v6',
      params: {
        path: '/project/task?/:taskId',
        loader: async () => (
          <ReactRouterV6PageRouter>
            <OptionalStaticPage />
          </ReactRouterV6PageRouter>
        ),
      },
    });

    renderTestApp({
      extensions: [optionalPage],
      initialRouteEntries: ['/project/123'],
    });

    expect(await screen.findByTestId('optional-task-id')).toHaveTextContent(
      '123',
    );
    expect(screen.getByTestId('optional-details-link')).toHaveAttribute(
      'href',
      '/project/123/details',
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
          <ReactRouterV6PageRouter>
            <Probe />
          </ReactRouterV6PageRouter>
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
          <ReactRouterV6PageRouter>
            <Probe />
          </ReactRouterV6PageRouter>
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
