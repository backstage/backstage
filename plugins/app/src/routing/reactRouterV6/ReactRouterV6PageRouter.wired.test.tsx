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

import { act, screen } from '@testing-library/react';
import { renderTestApp } from '@backstage/frontend-test-utils';
import { PageBlueprint } from '@backstage/frontend-plugin-api';
import { Link, Routes, Route } from 'react-router-dom';

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
});
