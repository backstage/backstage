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

import { default as React, PropsWithChildren, ComponentType } from 'react';
import {
  default as tlr,
  fireEvent,
  waitFor,
  screen,
  renderHook,
  render,
  within,
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
import {
  isExternalTarget,
  PageMountProvider,
  type PageMount,
} from '@internal/frontend';
import { Link, useResolvedPath } from './Link';
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

  // `Link` renders two ways for the same target — React Router's `Link` under a
  // router, a plain anchor without one — and the second resolves its href
  // through `useAppHref`, which classifies with the framework's own
  // `isExternalTarget`. Asking the same question two ways is what let a
  // backslash target be internal to one path and external to the other, so
  // `Link` now asks the framework, and this table is the contract it depends
  // on.
  describe('the externality rule Link shares with the framework', () => {
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
      // A browser folds a backslash into a slash, so any two of them open an
      // authority and the target leaves the app's origin
      [true, '\\\\evil.example'],
      [true, '\\/evil.example'],
      [true, '/\\evil.example'],
      // ...but a single leading backslash is only a path separator, so this is
      // `/evil.example` on the app's own origin
      [false, '\\evil.example'],
      // Leading spaces and C0 control characters are trimmed before a browser
      // parses a target, and tabs and newlines are removed outright, so the
      // rule has to read what the browser will read rather than what was
      // written
      [true, '  https://evil.example'],
      [true, '\u0001https://evil.example'],
      // A tab inside a scheme is removed before the browser parses it, so this
      // is the same `javascript:` URL and must not be handed to the router
      [true, 'java\tscript:alert(1)'],
      [false, '  /catalog'],
      [false, '\u0001/catalog'],
    ])('should be %p when %p', (expected, uri) => {
      expect(isExternalTarget(uri)).toBe(expected);
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

  describe('without an ambient React Router', () => {
    // Every shape a chrome target comes in: app-absolute, app-absolute with a
    // query, relative, deeper relative, climbing, fragment-only, query-only and
    // external — followed by the shapes a crafted link comes in, which a
    // browser reads differently from how they are written. A backslash opens an
    // authority just as a slash does, and leading spaces and C0 control
    // characters are trimmed before anything is parsed, so each of these is a
    // target the two paths could disagree about — and the router path calling
    // `\/evil.com` same-origin while the anchor path sent the browser to
    // `http://evil.com/` is exactly the disagreement that has to stay fixed.
    const targets = [
      '/catalog',
      '/catalog?kind=component',
      'widgets',
      'a/b',
      '..',
      '#section',
      '?tab=readme',
      'https://example.com/docs',
      '\\/evil.com',
      '\\\\evil.com',
      '  /catalog',
      '\u0001/catalog',
    ];

    const ChromeLinks = () => (
      <>
        {targets.map(to => (
          <Link key={to} to={to}>
            {to}
          </Link>
        ))}
      </>
    );

    const linksIn = (name: string) =>
      within(screen.getByRole('navigation', { name })).getAllByRole('link');

    const hrefsIn = (name: string) =>
      linksIn(name).map(link => link.getAttribute('href'));

    /**
     * Every attribute each link in a nav carries, with the href reduced to the
     * URL a browser resolves it to.
     *
     * The whole attribute set rather than the href alone, because a prop that
     * reaches the DOM on one path and not the other is a difference between the
     * two links just as much as a different destination is — `to` used to be
     * one, and this is what would catch the next one.
     *
     * The href is compared as a browser reads it rather than as it is spelled:
     * `AppHistory.createHref` normalizes through `URL` where React Router hands
     * its resolved path straight to the navigator, so a target carrying a space
     * or a control character comes out percent-encoded on one path and literal
     * on the other. Both address the same URL, and that is the property that
     * has to hold.
     */
    const linkAttributesIn = (
      name: string,
      spelling: (href: string) => string,
    ) =>
      linksIn(name).map(link => ({
        ...Object.fromEntries(
          Array.from(link.attributes, attr => [attr.name, attr.value]),
        ),
        href: new URL(spelling(link.getAttribute('href')!), 'http://localhost/')
          .href,
      }));

    /**
     * The framework spelling of a React Router href.
     *
     * `AppHistory.createHref` normalizes every target through `URL`, so a
     * target that lands on the app root renders as `${basename}/` where React
     * Router renders it as `${basename}`. Both address the app root, and only
     * a deploy basename makes the two spellings distinguishable at all — the
     * same divergence `AppRouting.test.tsx` pins between the two authorities.
     */
    const appRootSpelling = (routerHref: string, basename: string) => {
      if (!basename || !routerHref.startsWith(basename)) {
        return routerHref;
      }
      const rest = routerHref.slice(basename.length);
      const atAppRoot =
        rest === '' || rest.startsWith('?') || rest.startsWith('#');
      return atAppRoot ? `${basename}/${rest}` : routerHref;
    };

    it.each([
      {
        name: 'at the app root',
        basename: '',
        expected: [
          '/catalog',
          '/catalog?kind=component',
          '/widgets',
          '/a/b',
          '/',
          '/catalog/foo#section',
          '/catalog/foo?tab=readme',
          'https://example.com/docs',
          // Handed back as written, because both paths now read these as
          // leaving the app rather than one of them rewriting them into
          // same-origin paths.
          '\\/evil.com',
          '\\\\evil.com',
          '/%20%20/catalog',
          '/%01/catalog',
        ],
      },
      {
        name: 'under a deploy basename',
        basename: '/backstage',
        expected: [
          '/backstage/catalog',
          '/backstage/catalog?kind=component',
          '/backstage/widgets',
          '/backstage/a/b',
          '/backstage/',
          '/backstage/catalog/foo#section',
          '/backstage/catalog/foo?tab=readme',
          'https://example.com/docs',
          '\\/evil.com',
          '\\\\evil.com',
          '/backstage/%20%20/catalog',
          '/backstage/%01/catalog',
        ],
      },
    ])(
      'renders the hrefs React Router renders, without one ($name)',
      ({ basename, expected }) => {
        const appHistory = createMockAppHistory({
          initialLocation: `${basename}/catalog/foo`,
          basename,
        });

        render(
          <TestApiProvider apis={[[appHistoryApiRef, appHistory]]}>
            <nav aria-label="with a router">
              <MemoryRouter
                basename={basename || undefined}
                initialEntries={[`${basename}/catalog/foo`]}
              >
                <ChromeLinks />
              </MemoryRouter>
            </nav>
            <nav aria-label="without a router">
              <ChromeLinks />
            </nav>
          </TestApiProvider>,
        );

        // Rendering an anchor instead of React Router's own Link is only safe
        // if it renders the same link, so both are rendered in the same tree,
        // at the same location, and compared target by target.
        expect(linkAttributesIn('without a router', href => href)).toEqual(
          linkAttributesIn('with a router', href =>
            appRootSpelling(href, basename),
          ),
        );
        // Pinned as literals too, so that both sides going wrong together, or
        // rendering nothing at all, still fails.
        expect(hrefsIn('without a router')).toEqual(expected);
        expect(hrefsIn('with a router')).toHaveLength(targets.length);
      },
    );

    it('hands the target back as written when there is no app history either', async () => {
      const analyticsApi = mockApis.analytics();

      // An old frontend system app whose `components.Router` is a passthrough:
      // no router to resolve against, and no deploy basename to apply.
      render(
        <TestApiProvider apis={[[analyticsApiRef, analyticsApi]]}>
          <Link to="/catalog">Catalog</Link>
          <Link to="widgets">Widgets</Link>
          <Link to="#section">Section</Link>
        </TestApiProvider>,
      );

      expect(
        await screen.findByRole('link', { name: 'Catalog' }),
      ).toHaveAttribute('href', '/catalog');
      expect(screen.getByRole('link', { name: 'Widgets' })).toHaveAttribute(
        'href',
        'widgets',
      );
      expect(screen.getByRole('link', { name: 'Section' })).toHaveAttribute(
        'href',
        '#section',
      );

      fireEvent.click(screen.getByRole('link', { name: 'Section' }));
      expect(analyticsApi.captureEvent).toHaveBeenCalledWith(
        expect.objectContaining({
          action: 'click',
          subject: 'Section',
          attributes: { to: '#section' },
        }),
      );
    });

    it('warns about each router-only prop it drops, outside production builds', async () => {
      const warn = jest.spyOn(console, 'warn').mockImplementation(() => {});
      const appHistory = createMockAppHistory({
        initialLocation: '/catalog/foo',
      });
      const routerOnlyProps = [
        'state',
        'replace',
        'relative',
        'preventScrollReset',
        'reloadDocument',
      ];
      const link = (
        <TestApiProvider apis={[[appHistoryApiRef, appHistory]]}>
          <Link
            to="widgets"
            state={{ from: 'chrome' }}
            replace
            relative="path"
            preventScrollReset
            reloadDocument
          >
            Widgets
          </Link>
        </TestApiProvider>
      );

      const { unmount } = render(link);

      const anchor = await screen.findByRole('link', { name: 'Widgets' });
      expect(anchor).toHaveAttribute('href', '/widgets');
      // `to` is React Router's prop for what this renders as `href`, and is not
      // an attribute a browser knows.
      expect(anchor).not.toHaveAttribute('to');
      for (const name of routerOnlyProps) {
        // Dropped rather than forwarded to the DOM, which is what the warning
        // is there to make visible.
        expect(anchor).not.toHaveAttribute(name);
        expect(warn).toHaveBeenCalledWith(expect.stringContaining(`'${name}'`));
      }

      unmount();
      warn.mockClear();
      // Typed read-only, but the warning is gated on it at runtime and that is
      // what needs exercising: a production build must stay silent.
      const env = process.env as { NODE_ENV?: string };
      const nodeEnv = env.NODE_ENV;
      env.NODE_ENV = 'production';
      try {
        render(link);
        expect(
          await screen.findByRole('link', { name: 'Widgets' }),
        ).toHaveAttribute('href', '/widgets');
        expect(warn).not.toHaveBeenCalled();
      } finally {
        env.NODE_ENV = nodeEnv;
        warn.mockRestore();
      }
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

/**
 * React Router v6 beta is still a supported version — `AppManager.compat.test`
 * runs the old frontend system against both, and the migration CLI writes
 * `'6.0.0-beta.0 || ^6.3.0'` — and it exports no `UNSAFE_` name at all, so any
 * context object `Link` reads off the module is `undefined` there and
 * `useContext` throws before a link can render. Only running the suite against
 * stable is why that shipped, so both versions render here.
 *
 * The harness mirrors `AppManager.compat.test.tsx`: the module registry is
 * reset so `Link` is re-required against the mocked router, and React and
 * Testing Library are pinned to the instances this file already loaded so the
 * re-required tree still renders through them. The version aliases are the ones
 * `@backstage/core-app-api` declares.
 */
describe.each(['beta', 'stable'])('react-router %s', rrVersion => {
  beforeAll(() => {
    jest.resetModules();
    jest.doMock('react', () => React);
    jest.doMock('@testing-library/react', () => tlr);
    jest.doMock('react-router', () =>
      rrVersion === 'beta'
        ? jest.requireActual('react-router-beta')
        : jest.requireActual('react-router-stable'),
    );
    jest.doMock('react-router-dom', () =>
      rrVersion === 'beta'
        ? jest.requireActual('react-router-dom-beta')
        : jest.requireActual('react-router-dom-stable'),
    );
  });

  afterAll(() => {
    jest.resetModules();
  });

  /**
   * The component under test and the router that gives it context, both out of
   * the registry the mocks apply to. Named one by one rather than spread
   * together, because `react-router-dom` exports a `Link` of its own.
   */
  function requireVersioned() {
    const { Link: VersionedLink } =
      require('./Link') as typeof import('./Link');
    const { MemoryRouter: VersionedMemoryRouter } =
      require('react-router-dom') as typeof import('react-router-dom');
    return { VersionedLink, VersionedMemoryRouter };
  }

  it('renders every kind of target inside a router', async () => {
    const { VersionedLink, VersionedMemoryRouter } = requireVersioned();

    render(
      <VersionedMemoryRouter initialEntries={['/catalog/foo']}>
        <VersionedLink to="/widgets">Absolute</VersionedLink>
        <VersionedLink to="widgets">Relative</VersionedLink>
        <VersionedLink to="a/b">Deeper</VersionedLink>
        <VersionedLink to="https://example.com/docs">Docs</VersionedLink>
      </VersionedMemoryRouter>,
    );

    // The same hrefs on both versions. Beta cannot report a route match stack,
    // and the stand-in context answers "no matches" — which is also what this
    // router says on stable, because nothing here matched a route, so relative
    // targets resolve against the app root on both.
    expect(
      await screen.findByRole('link', { name: 'Absolute' }),
    ).toHaveAttribute('href', '/widgets');
    expect(screen.getByRole('link', { name: 'Relative' })).toHaveAttribute(
      'href',
      '/widgets',
    );
    expect(screen.getByRole('link', { name: 'Deeper' })).toHaveAttribute(
      'href',
      '/a/b',
    );
    const docs = screen.getByRole('link', {
      name: 'Docs, Opens in a new window',
    });
    expect(docs).toHaveAttribute('href', 'https://example.com/docs');
    expect(docs).toHaveAttribute('target', '_blank');
  });

  /**
   * The page-mount branch, which the case above never reaches: it needs an app
   * history, a page mount, no ambient route match and a relative target all at
   * once. That branch resolves the target itself, and the `createPath` half of
   * that is another name the beta does not export — hence the vendored copy in
   * `@internal/frontend`. The mount and API contexts are global singletons
   * shared via `@backstage/version-bridge`, so the providers imported at the
   * top of this file still reach the re-required `Link`.
   */
  it('resolves a relative target against the page mount, in either version', async () => {
    const { VersionedLink, VersionedMemoryRouter } = requireVersioned();
    const navigate = jest.fn();
    const appHistory = createMockAppHistory({
      navigate,
      basename: '/backstage',
    });

    render(
      <TestApiProvider apis={[[appHistoryApiRef, appHistory]]}>
        {/* A router with nothing matched is all a page hosted by another
            routing library leaves in context, and is the one thing beta can
            report as well as stable. */}
        <VersionedMemoryRouter initialEntries={['/demo-v7/v7-only']}>
          <PageMountProvider
            mount={{
              basePath: '/demo-v7/v7-only',
              routePattern: '/demo-v7/v7-only',
            }}
          >
            <VersionedLink to="release/1-42">Child route</VersionedLink>
            <VersionedLink to="../v6-guest">Sibling tab</VersionedLink>
          </PageMountProvider>
        </VersionedMemoryRouter>
      </TestApiProvider>,
    );

    expect(
      await screen.findByRole('link', { name: 'Child route' }),
    ).toHaveAttribute('href', '/backstage/demo-v7/v7-only/release/1-42');
    expect(screen.getByRole('link', { name: 'Sibling tab' })).toHaveAttribute(
      'href',
      '/backstage/demo-v7/v6-guest',
    );

    fireEvent.click(screen.getByRole('link', { name: 'Child route' }));
    expect(navigate).toHaveBeenCalledWith('/demo-v7/v7-only/release/1-42');
  });
});
