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

import { Link as BuiLink } from '@backstage/ui';
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
import {
  PageBlueprint,
  RouterLink,
  useAppHref,
} from '@backstage/frontend-plugin-api';

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
          <BuiLink href="edit?tab=details#form">BUI Edit</BuiLink>
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
    expect(screen.getByRole('link', { name: 'BUI Edit' })).toHaveAttribute(
      'href',
      '/backstage/legacy/alpha/edit?tab=details#form',
    );
    fireEvent.click(screen.getByRole('link', { name: 'BUI Edit' }));
    expect(
      await screen.findByRole('heading', { name: 'Edit form' }),
    ).toBeVisible();
    expect(appHistory.getSnapshot().location).toMatchObject({
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

  it.each(['', '/backstage'])(
    'warns only when a BUI link needs implicit relative routing with basename "%s"',
    async basename => {
      const warn = jest.spyOn(console, 'warn').mockImplementation(() => {});
      function FrameworkContent() {
        const [relative, setRelative] = useState(false);
        return (
          <>
            <BuiLink href="/framework/alpha/other">Absolute</BuiLink>
            <RouterLink href="">Empty</RouterLink>
            <BuiLink href="">Empty BUI</BuiLink>
            <BuiLink href="?tab=details">Query</BuiLink>
            <BuiLink href="#form">Hash</BuiLink>
            <BuiLink href="https://example.com/docs">External</BuiLink>
            <button onClick={() => setRelative(true)}>
              Show relative link
            </button>
            {relative && <BuiLink href="edit">Relative</BuiLink>}
          </>
        );
      }
      const { appHistory } = renderTestApp({
        config: { app: { baseUrl: `http://localhost${basename}` } },
        initialRouteEntries: ['/framework/alpha/details?old=1#old'],
        extensions: [
          PageBlueprint.make({
            params: {
              path: '/framework/:id',
              noHeader: true,
              loader: async () => <FrameworkContent />,
            },
          }),
        ],
      });
      expect(
        await screen.findByRole('link', { name: 'Absolute' }),
      ).toHaveAttribute('href', `${basename}/framework/alpha/other`);
      for (const [name, suffix] of [
        ['Empty', ''],
        ['Query', '?tab=details'],
        ['Hash', '#form'],
      ]) {
        expect(screen.getByRole('link', { name })).toHaveAttribute(
          'href',
          `${basename}/framework/alpha/details${suffix}`,
        );
      }
      expect(screen.getByRole('link', { name: 'External' })).toHaveAttribute(
        'href',
        'https://example.com/docs',
      );
      expect(screen.getByText('Empty BUI')).toHaveAttribute('href', '');
      fireEvent.click(screen.getByRole('link', { name: 'Query' }));
      expect(appHistory.getSnapshot().location).toMatchObject({
        pathname: '/framework/alpha/details',
        search: '?tab=details',
        hash: '',
      });
      fireEvent.click(screen.getByRole('link', { name: 'Hash' }));
      expect(appHistory.getSnapshot().location).toMatchObject({
        pathname: '/framework/alpha/details',
        search: '',
        hash: '#form',
      });
      fireEvent.click(screen.getByRole('link', { name: 'Empty' }));
      expect(appHistory.getSnapshot().location).toMatchObject({
        pathname: '/framework/alpha/details',
        search: '',
        hash: '',
      });
      fireEvent.click(screen.getByRole('link', { name: 'Absolute' }), {
        ctrlKey: true,
      });
      expect(appHistory.getSnapshot().location.pathname).toBe(
        '/framework/alpha/details',
      );
      expect(
        warn.mock.calls.filter(([message]) =>
          String(message).includes('implicit React Router'),
        ),
      ).toHaveLength(0);

      fireEvent.click(
        screen.getByRole('button', { name: 'Show relative link' }),
      );
      expect(
        await screen.findByRole('link', { name: 'Relative' }),
      ).toHaveAttribute('href', `${basename}/framework/alpha/edit`);
      fireEvent.click(screen.getByRole('link', { name: 'Relative' }));
      expect(appHistory.getSnapshot().location.pathname).toBe(
        '/framework/alpha/edit',
      );
      const warnings = warn.mock.calls.filter(([message]) =>
        String(message).includes('implicit React Router'),
      );
      expect(warnings).toHaveLength(1);
      expect(warnings[0][0]).toContain('page:test');
    },
  );

  it('warns for native router hooks without contextual links', async () => {
    const warn = jest.spyOn(console, 'warn').mockImplementation(() => {});
    function NativeContent() {
      return <h1>Native {useParams().id}</h1>;
    }
    renderTestApp({
      initialRouteEntries: ['/native/alpha'],
      extensions: [
        PageBlueprint.make({
          params: {
            path: '/native/:id',
            noHeader: true,
            loader: async () => <NativeContent />,
          },
        }),
      ],
    });
    expect(
      await screen.findByRole('heading', { name: 'Native alpha' }),
    ).toBeVisible();
    expect(
      warn.mock.calls.filter(([message]) =>
        String(message).includes('implicit React Router'),
      ),
    ).toHaveLength(1);
  });

  it('does not warn for explicit adapters or pages using only framework routing', async () => {
    const warn = jest.spyOn(console, 'warn').mockImplementation(() => {});
    function ExplicitContent() {
      return <h1>Explicit {useParams().id}</h1>;
    }
    function FrameworkContent() {
      return <a href={useAppHref('/framework/details')}>Framework link</a>;
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
