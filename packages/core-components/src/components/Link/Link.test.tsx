/*
 * Copyright 2020 The Backstage Authors
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

import { PropsWithChildren, ComponentType } from 'react';
import {
  fireEvent,
  waitFor,
  screen,
  renderHook,
  render,
} from '@testing-library/react';
import {
  mockApis,
  TestApiProvider,
  renderInTestApp,
} from '@backstage/test-utils';
import {
  createMockAppHistory,
  renderTestApp,
} from '@backstage/frontend-test-utils';
import { analyticsApiRef, configApiRef } from '@backstage/core-plugin-api';
import {
  PageBlueprint,
  SubPageBlueprint,
  appHistoryApiRef,
} from '@backstage/frontend-plugin-api';
import { PageMountProvider, type PageMount } from '@internal/frontend';
import { isExternalUri, Link, useResolvedPath } from './Link';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { ConfigReader } from '@backstage/config';

describe('<Link />', () => {
  it('navigates using react-router', async () => {
    const testString = 'This is test string';
    const linkText = 'Navigate!';
    await renderInTestApp(
      <>
        <Link to="/test">{linkText}</Link>
        <Routes>
          <Route path="/test" element={<p>{testString}</p>} />
        </Routes>
      </>,
    );
    expect(() => screen.getByText(testString)).toThrow();
    fireEvent.click(screen.getByText(linkText));
    await waitFor(() => {
      expect(screen.getByText(testString)).toBeInTheDocument();
    });
  });

  it('does not render external link icon if externalLinkIcon prop is not passed', async () => {
    const { container } = await renderInTestApp(
      <Link to="http://something.external">External Link</Link>,
    );
    const externalLink = screen.getByRole('link', {
      name: 'External Link, Opens in a new window',
    });
    const externalLinkIcon = container.querySelector('svg');
    expect(externalLink).not.toContainElement(externalLinkIcon);
  });

  it('renders external link icon if externalLinkIcon prop is passed', async () => {
    const { container } = await renderInTestApp(
      <Link to="http://something.external" externalLinkIcon>
        External Link
      </Link>,
    );
    // Note: when externalLinkIcon is present, the SVG adds whitespace to the accessible name
    const externalLink = screen.getByRole('link', {
      name: 'External Link , Opens in a new window',
    });
    const externalLinkIcon = container.querySelector('svg');
    expect(externalLink).toContainElement(externalLinkIcon);
  });

  it('hands upper-case and digit-bearing schemes to the browser', async () => {
    await renderInTestApp(
      <>
        <Link to="MAILTO:someone@example.com">Mail</Link>
        <Link to="HTTPS://example.com/docs">Docs</Link>
        <Link to="s3://bucket/key">Bucket</Link>
      </>,
    );

    // Schemes are case-insensitive, so these targets are passed through
    // verbatim rather than resolved as app-relative paths by the router.
    expect(
      screen.getByRole('link', { name: 'Mail, Opens in a new window' }),
    ).toHaveAttribute('href', 'MAILTO:someone@example.com');
    expect(
      screen.getByRole('link', { name: 'Bucket, Opens in a new window' }),
    ).toHaveAttribute('href', 's3://bucket/key');

    const docs = screen.getByRole('link', {
      name: 'Docs, Opens in a new window',
    });
    expect(docs).toHaveAttribute('href', 'HTTPS://example.com/docs');
    expect(docs).toHaveAttribute('target', '_blank');
  });

  it('captures click using analytics api', async () => {
    const linkText = 'Navigate!';
    const analyticsApi = mockApis.analytics();
    const customOnClick = jest.fn();

    await renderInTestApp(
      <TestApiProvider apis={[[analyticsApiRef, analyticsApi]]}>
        <Link to="/test" onClick={customOnClick}>
          {linkText}
        </Link>
      </TestApiProvider>,
    );

    fireEvent.click(screen.getByText(linkText));

    // Analytics event should have been fired.
    await waitFor(() => {
      expect(analyticsApi.captureEvent).toHaveBeenCalledWith(
        expect.objectContaining({
          action: 'click',
          subject: linkText,
          attributes: {
            to: '/test',
          },
        }),
      );

      // Custom onClick handler should have still been fired too.
      expect(customOnClick).toHaveBeenCalled();
    });
  });

  it('does not capture click when noTrack is set', async () => {
    const linkText = 'Navigate!';
    const analyticsApi = mockApis.analytics();
    const customOnClick = jest.fn();

    await renderInTestApp(
      <TestApiProvider apis={[[analyticsApiRef, analyticsApi]]}>
        <Link to="/test" onClick={customOnClick} noTrack>
          {linkText}
        </Link>
      </TestApiProvider>,
    );

    fireEvent.click(screen.getByText(linkText));

    // Analytics event should have been fired.
    await waitFor(() => {
      // Custom onClick handler should have been fired.
      expect(customOnClick).toHaveBeenCalled();

      // But there should be no analytics event.
      expect(analyticsApi.captureEvent).not.toHaveBeenCalled();
    });
  });

  describe('isExternalUri', () => {
    it.each([
      [true, 'http://'],
      [true, 'https://'],
      [true, 'https://some-host'],
      [true, 'https://some-host/path#fragment'],
      [true, 'https://some-host/path?param1=value'],
      [true, 'slack://'],
      [true, 'mailto:foo@example.org'],
      [true, 'ms-help://'],
      [true, 'ms.help://'],
      [true, 'ms+help://'],
      [true, '//'],
      [true, '//evil.example'],
      // Schemes are case-insensitive, so these are just as external as their
      // lower-case forms and must never be handed to the router
      [true, 'MAILTO:foo@example.org'],
      [true, 'HTTPS://some-host'],
      // eslint-disable-next-line no-script-url
      [true, 'JavaScript:alert(1)'],
      // Schemes may contain digits after the first character
      [true, 's3://bucket/key'],
      [true, 'web3://some-host'],
      [false, '123://'],
      [false, 'abc&xzy://'],
      [false, 'http'],
      [false, 'path/to'],
      [false, 'path/to/something#fragment'],
      [false, 'path/to/something?param1=value'],
      [false, '/path/to/something'],
      [false, '/path/to/something#fragment'],
      // A scheme has to start with a letter, so a first path segment that
      // begins with `+`, `-` or `.` is app-relative — as it is to a browser
      [false, '+foo:bar'],
      [false, '-foo:bar'],
      [false, '.foo:bar'],
      // A query or fragment may legitimately carry a URL of its own
      [false, '/search?q=https://example.com'],
      [false, '/search#https://example.com'],
      [false, 'search?q=https://example.com'],
    ])('should be %p when %p', (expected, uri) => {
      expect(isExternalUri(uri)).toBe(expected);
    });
  });

  describe('useResolvedPath', () => {
    const wrapper: ComponentType<PropsWithChildren<{}>> = ({ children }) => {
      const configApi = new ConfigReader({
        app: { baseUrl: 'http://localhost:3000/example' },
      });
      return (
        <TestApiProvider apis={[[configApiRef, configApi]]}>
          {children}
        </TestApiProvider>
      );
    };

    describe('concatenate base path', () => {
      it('when uri is internal and does not start with base path', () => {
        const path = '/catalog/default/component/artist-lookup';
        const { result } = renderHook(() => useResolvedPath(path), {
          wrapper,
        });
        expect(result.current).toBe('/example'.concat(path));
      });
    });

    describe('does not concatenate base path', () => {
      it('when uri is external', () => {
        const path = 'https://stackoverflow.com/questions/1/example';
        const { result } = renderHook(() => useResolvedPath(path), {
          wrapper,
        });
        expect(result.current).toBe(path);
      });

      it('when uri already starts with base path', () => {
        const path = '/example/catalog/default/component/artist-lookup';
        const { result } = renderHook(() => useResolvedPath(path), {
          wrapper,
        });
        expect(result.current).toBe(path);
      });
    });
  });

  it('throws an error when attempting to link to script code', async () => {
    await expect(
      // eslint-disable-next-line no-script-url
      renderInTestApp(<Link to="javascript:alert('hello')">Script</Link>),
    ).rejects.toThrowErrorMatchingInlineSnapshot(
      `"Link component rejected javascript: URL as a security precaution"`,
    );
  });

  describe('NFS Link shim', () => {
    const navigate = jest.fn();
    const appHistory = createMockAppHistory({ navigate });
    const scopedContract: PageMount = {
      basePath: '/create',
      routePattern: '/create',
    };

    beforeEach(() => {
      navigate.mockClear();
    });

    it('escalates cross-plugin absolute targets via the app history', () => {
      render(
        <TestApiProvider apis={[[appHistoryApiRef, appHistory]]}>
          <PageMountProvider mount={scopedContract}>
            <MemoryRouter>
              <Link to="/catalog/default/component/widget">Entity</Link>
            </MemoryRouter>
          </PageMountProvider>
        </TestApiProvider>,
      );

      fireEvent.click(screen.getByRole('link', { name: 'Entity' }));
      expect(navigate).toHaveBeenCalledWith(
        '/catalog/default/component/widget',
      );
    });

    it('renders an href that includes the app deploy basename', () => {
      const deployedAppHistory = createMockAppHistory({
        navigate,
        basename: '/backstage',
      });

      render(
        <TestApiProvider apis={[[appHistoryApiRef, deployedAppHistory]]}>
          <PageMountProvider mount={scopedContract}>
            <MemoryRouter>
              <Link to="/catalog?filter=owned">Catalog</Link>
            </MemoryRouter>
          </PageMountProvider>
        </TestApiProvider>,
      );

      // Middle-click, "open in new tab" and crawlers only ever see the href,
      // so it has to carry the basename even though the click is intercepted.
      expect(screen.getByRole('link', { name: 'Catalog' })).toHaveAttribute(
        'href',
        '/backstage/catalog?filter=owned',
      );

      fireEvent.click(screen.getByRole('link', { name: 'Catalog' }));
      expect(navigate).toHaveBeenCalledWith('/catalog?filter=owned');
    });

    it('does not escalate without NFS signals (OFS fallback)', async () => {
      const testString = 'Arrived';
      await renderInTestApp(
        <>
          <Link to="/test">Go</Link>
          <Routes>
            <Route path="/test" element={<p>{testString}</p>} />
          </Routes>
        </>,
      );

      fireEvent.click(screen.getByText('Go'));
      await waitFor(() => {
        expect(screen.getByText(testString)).toBeInTheDocument();
      });
      expect(navigate).not.toHaveBeenCalled();
    });
  });

  describe('relative targets', () => {
    const v7Page: PageMount = {
      basePath: '/demo-v7/v7-only',
      routePattern: '/demo-v7/v7-only',
    };
    const v6Page: PageMount = {
      basePath: '/demo/deep-link',
      routePattern: '/demo/deep-link',
    };

    it('resolves against the page mount inside a page with no React Router page scope', () => {
      const navigate = jest.fn();
      const appHistory = createMockAppHistory({
        navigate,
        basename: '/backstage',
      });

      render(
        <TestApiProvider apis={[[appHistoryApiRef, appHistory]]}>
          {/* A router with no matched routes is all a TanStack or React Router
              v7 page leaves in context for react-router v6 consumers, and is
              what the app-root projection publishes. */}
          <MemoryRouter initialEntries={['/demo-v7/v7-only']}>
            <PageMountProvider mount={v7Page}>
              <Link to="../v6-guest">Sibling tab</Link>
              <Link to="release/1-42">Child route</Link>
              <Link to="?tab=details">Same page</Link>
              <Link to="/catalog">Another page</Link>
              <Link to="https://example.com/docs">Docs</Link>
            </PageMountProvider>
          </MemoryRouter>
        </TestApiProvider>,
      );

      // Without the page mount these would resolve against the app root, to
      // `/v6-guest` and `/release/1-42`.
      expect(screen.getByRole('link', { name: 'Sibling tab' })).toHaveAttribute(
        'href',
        '/backstage/demo-v7/v6-guest',
      );
      expect(screen.getByRole('link', { name: 'Child route' })).toHaveAttribute(
        'href',
        '/backstage/demo-v7/v7-only/release/1-42',
      );
      // A target with no pathname of its own is relative to the location
      // rather than to any base, which React Router resolves correctly with or
      // without a match, so it is still handed over untouched.
      expect(screen.getByRole('link', { name: 'Same page' })).toHaveAttribute(
        'href',
        '/demo-v7/v7-only?tab=details',
      );
      expect(
        screen.getByRole('link', { name: 'Another page' }),
      ).toHaveAttribute('href', '/backstage/catalog');
      expect(
        screen.getByRole('link', { name: 'Docs, Opens in a new window' }),
      ).toHaveAttribute('href', 'https://example.com/docs');

      fireEvent.click(screen.getByRole('link', { name: 'Sibling tab' }));
      expect(navigate).toHaveBeenCalledWith('/demo-v7/v6-guest');
    });

    it('leaves relative targets to a page-scoped React Router, including `..` up a nested route', () => {
      const navigate = jest.fn();
      const appHistory = createMockAppHistory({
        navigate,
        basename: '/backstage',
      });
      const pageContent = (
        <PageMountProvider mount={v6Page}>
          <Link to="widget/blue">Child route</Link>
          <Link to="../elsewhere">Up from the page</Link>
          <Link to="/demo/deep-link/area/south">In-page absolute</Link>
          <Routes>
            <Route
              path="area/:area"
              element={<Link to="../sibling">Up from a nested route</Link>}
            />
          </Routes>
        </PageMountProvider>
      );

      render(
        <TestApiProvider apis={[[appHistoryApiRef, appHistory]]}>
          <MemoryRouter initialEntries={['/demo/deep-link/area/north']}>
            {/* Stands in for the React Router v6 page adapter, which projects
                the page's own route match into context. */}
            <Routes>
              <Route path="/demo/deep-link/*" element={pageContent} />
            </Routes>
          </MemoryRouter>
        </TestApiProvider>,
      );

      expect(screen.getByRole('link', { name: 'Child route' })).toHaveAttribute(
        'href',
        '/demo/deep-link/widget/blue',
      );
      // `..` is one route match to React Router, not one path segment: the
      // page is the only match here, so this leaves the page entirely rather
      // than resolving to `/demo/elsewhere`.
      expect(
        screen.getByRole('link', { name: 'Up from the page' }),
      ).toHaveAttribute('href', '/elsewhere');
      // One match deeper, `..` lands back on the page rather than above it.
      expect(
        screen.getByRole('link', { name: 'Up from a nested route' }),
      ).toHaveAttribute('href', '/demo/deep-link/sibling');
      expect(
        screen.getByRole('link', { name: 'In-page absolute' }),
      ).toHaveAttribute('href', '/demo/deep-link/area/south');

      fireEvent.click(screen.getByRole('link', { name: 'Child route' }));
      expect(navigate).not.toHaveBeenCalled();
    });

    it('leaves a subpage`s relative targets to its page adapter, which roots them at the parent page', async () => {
      const scaffolderPage = PageBlueprint.make({
        params: { path: '/create', title: 'Scaffolder' },
      });
      const templatesSubPage = SubPageBlueprint.make({
        name: 'templates',
        params: {
          path: 'templates',
          title: 'Templates',
          loader: async () => (
            <div>
              <Link to="../tasks">Sibling tab</Link>
              <Link to="..">Parent page</Link>
              <Link to="release/1-42">Child route</Link>
              <Link to="/catalog">Another page</Link>
            </div>
          ),
        },
      });
      const tasksSubPage = SubPageBlueprint.make({
        name: 'tasks',
        params: {
          path: 'tasks',
          title: 'Tasks',
          loader: async () => <p>Tasks</p>,
        },
      });

      const { appHistory } = renderTestApp({
        extensions: [scaffolderPage, templatesSubPage, tasksSubPage],
        initialRouteEntries: ['/create/templates'],
        config: {
          app: { baseUrl: 'http://localhost:3000/backstage' },
          backend: { baseUrl: 'http://localhost:7007' },
        },
      });

      // A subpage sits one route match below its page, so React Router has a
      // base of its own for every one of these and the page mount is not
      // consulted. `..` is the tab-to-tab idiom, and lands on the sibling tab
      // rather than at the app root.
      expect(
        await screen.findByRole('link', { name: 'Sibling tab' }),
      ).toHaveAttribute('href', '/backstage/create/tasks');
      expect(screen.getByRole('link', { name: 'Parent page' })).toHaveAttribute(
        'href',
        '/backstage/create',
      );
      expect(screen.getByRole('link', { name: 'Child route' })).toHaveAttribute(
        'href',
        '/backstage/create/templates/release/1-42',
      );
      // A cross-plugin absolute target still escalates to the app history.
      expect(
        screen.getByRole('link', { name: 'Another page' }),
      ).toHaveAttribute('href', '/backstage/catalog');

      fireEvent.click(screen.getByRole('link', { name: 'Sibling tab' }));
      await waitFor(() => {
        expect(appHistory.location.pathname).toBe('/create/tasks');
      });
    });

    it('delegates every relative target to React Router without an app history (OFS)', async () => {
      await renderInTestApp(
        <Routes>
          <Route
            path="/base/*"
            element={
              <PageMountProvider
                mount={{ basePath: '/base/deep', routePattern: '/base/deep' }}
              >
                <Link to="widget/blue">Child route</Link>
                <Link to="../up">Up one route</Link>
              </PageMountProvider>
            }
          />
        </Routes>,
        { routeEntries: ['/base/deep'] },
      );

      // Resolved against the matched route, not against the page mount, which
      // would have produced `/base/deep/widget/blue` and `/base/up`.
      expect(
        await screen.findByRole('link', { name: 'Child route' }),
      ).toHaveAttribute('href', '/base/widget/blue');
      expect(
        screen.getByRole('link', { name: 'Up one route' }),
      ).toHaveAttribute('href', '/up');
    });
  });
});

describe('window.open', () => {
  it('throws an error when attempting to open script code', () => {
    expect(() =>
      // eslint-disable-next-line no-script-url
      window.open("javascript:alert('hello')"),
    ).toThrowErrorMatchingInlineSnapshot(
      `"Rejected window.open() with a javascript: URL as a security precaution"`,
    );
  });
});
