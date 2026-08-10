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
import { PageBlueprint } from '@backstage/frontend-plugin-api';
import { Link, Routes, Route, useParams } from 'react-router-dom';

/**
 * Wired-path coverage for opaque React Router children under the default
 * page adapter (default pageRouterApiRef).
 */
describe('ReactRouterV6PageRouter', () => {
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
        loader: async () => <OpaqueSettings />,
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
    //
    // Deliberately routed through the `pageRouterApiRef` default rather than a
    // `PageRouterBlueprint` override, because an override is handed to the
    // wrapper as a value the app built once, while the default is looked up
    // per render. Only the default path can lose the page to a fresh component
    // identity, so only the default path proves it does not.
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
        loader: async () => <Counting />,
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
});
