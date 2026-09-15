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
import { act, fireEvent, screen } from '@testing-library/react';
import {
  Link,
  Route,
  Routes,
  useLocation,
  useNavigate,
  useParams,
} from 'react-router-dom';
import { renderTestApp } from '@backstage/frontend-test-utils';
import { ReactRouterV6PageRouter } from './ReactRouterV6PageRouter';
import { PageBlueprint, useHref } from '@backstage/frontend-plugin-api';

describe('implicit page router compatibility', () => {
  beforeEach(() => {
    jest.replaceProperty(process, 'env', {
      ...process.env,
      NODE_ENV: 'development',
    });
  });
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('preserves unmigrated page navigation and state, and warns once per extension', async () => {
    const warn = jest.spyOn(console, 'warn').mockImplementation(() => {});
    function LegacyPage() {
      const { id } = useParams();
      const location = useLocation();
      const navigate = useNavigate();
      const [count, setCount] = useState(0);
      return (
        <>
          <h1>Legacy {id}</h1>
          <span>
            {location.pathname}
            {location.search}
            {location.hash}
          </span>
          <button onClick={() => setCount(count + 1)}>Count {count}</button>
          <Link to="edit?tab=details#form">Edit</Link>
          <Link to="/other">Other page</Link>
          <button onClick={() => navigate('/legacy/beta', { replace: true })}>
            Replace entity
          </button>
          <Routes>
            <Route path="edit" element={<h2>Edit form</h2>} />
          </Routes>
        </>
      );
    }
    const page = PageBlueprint.make({
      name: 'legacy',
      params: {
        path: '/legacy/:id',
        noHeader: true,
        loader: async () => <LegacyPage />,
      },
    });
    const other = PageBlueprint.make({
      name: 'other',
      params: {
        path: '/other',
        noHeader: true,
        loader: async () => <h1>Other</h1>,
      },
    });
    const { appHistory } = renderTestApp({
      extensions: [page, other],
      initialRouteEntries: ['/legacy/alpha'],
      config: { app: { baseUrl: 'http://localhost/backstage' } },
    });
    expect(
      await screen.findByRole('heading', { name: 'Legacy alpha' }),
    ).toBeVisible();
    fireEvent.click(screen.getByRole('button', { name: 'Count 0' }));
    expect(screen.getByRole('link', { name: 'Edit' })).toHaveAttribute(
      'href',
      '/backstage/legacy/alpha/edit?tab=details#form',
    );
    fireEvent.click(screen.getByRole('link', { name: 'Edit' }));
    expect(
      await screen.findByRole('heading', { name: 'Edit form' }),
    ).toBeVisible();
    expect(appHistory.location).toMatchObject({
      pathname: '/legacy/alpha/edit',
      search: '?tab=details',
      hash: '#form',
    });
    expect(screen.getByRole('button', { name: 'Count 1' })).toBeVisible();
    await act(async () => appHistory.navigate(-1));
    expect(
      screen.queryByRole('heading', { name: 'Edit form' }),
    ).not.toBeInTheDocument();
    await act(async () => appHistory.navigate(1));
    expect(
      await screen.findByRole('heading', { name: 'Edit form' }),
    ).toBeVisible();
    fireEvent.click(screen.getByRole('button', { name: 'Replace entity' }));
    expect(
      await screen.findByRole('heading', { name: 'Legacy beta' }),
    ).toBeVisible();
    expect(screen.getByRole('button', { name: 'Count 1' })).toBeVisible();
    fireEvent.click(screen.getByRole('link', { name: 'Other page' }));
    expect(await screen.findByRole('heading', { name: 'Other' })).toBeVisible();
    await act(async () => appHistory.navigate(-1));
    expect(
      await screen.findByRole('heading', { name: 'Legacy beta' }),
    ).toBeVisible();
    const warnings = warn.mock.calls.filter(([message]) =>
      String(message).includes('implicit React Router'),
    );
    expect(warnings).toHaveLength(1);
    expect(warnings[0][0]).toContain('page:test/legacy');
    expect(warnings[0][0]).toContain('ReactRouterV6PageRouter');
  });

  it('does not warn for explicit adapters or pages using only framework routing', async () => {
    const warn = jest.spyOn(console, 'warn').mockImplementation(() => {});
    function ExplicitContent() {
      return <h1>Explicit {useParams().id}</h1>;
    }
    function FrameworkContent() {
      return <a href={useHref('details')}>Framework link</a>;
    }
    const explicit = PageBlueprint.make({
      name: 'explicit',
      params: {
        path: '/explicit/:id',
        noHeader: true,
        loader: async () => (
          <ReactRouterV6PageRouter>
            <ExplicitContent />
          </ReactRouterV6PageRouter>
        ),
      },
    });
    const framework = PageBlueprint.make({
      name: 'framework',
      params: {
        path: '/framework',
        noHeader: true,
        loader: async () => <FrameworkContent />,
      },
    });
    const { appHistory } = renderTestApp({
      extensions: [explicit, framework],
      initialRouteEntries: ['/explicit/alpha'],
    });
    expect(
      await screen.findByRole('heading', { name: 'Explicit alpha' }),
    ).toBeVisible();
    await act(async () => appHistory.navigate('/framework'));
    expect(
      await screen.findByRole('link', { name: 'Framework link' }),
    ).toHaveAttribute('href', '/framework/details');
    expect(
      warn.mock.calls.filter(([message]) =>
        String(message).includes('implicit React Router'),
      ),
    ).toEqual([]);
  });
});
