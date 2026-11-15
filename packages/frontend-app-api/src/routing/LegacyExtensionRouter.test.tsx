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

import { useEffect, useRef, useState, type ReactElement } from 'react';
import { act, fireEvent, screen } from '@testing-library/react';
import { renderTestApp } from '@backstage/frontend-test-utils';
import {
  AppRootElementBlueprint,
  PageLayout,
  RouterLink,
  coreExtensionData,
  createExtension,
  createExtensionInput,
  createRouteRef,
  useNavigation,
  useRouteRef,
  useRouteRefParams,
} from '@backstage/frontend-plugin-api';
import { Link, Navigate, Route, Routes, useParams } from 'react-router-dom';

// Preserve the shape of pre-scoped-routing PageBlueprint: the header and
// Routes are outside any ExtensionBoundary. Relative tab hrefs are passed to
// the host's swappable PageLayout unchanged.
const oldTabsPage = createExtension({
  kind: 'old-page',
  name: 'tabs',
  attachTo: { id: 'app/routes', input: 'routes' },
  inputs: {
    pages: createExtensionInput([
      coreExtensionData.routePath,
      coreExtensionData.reactElement,
    ]),
  },
  output: [coreExtensionData.routePath, coreExtensionData.reactElement],
  *factory({ inputs }) {
    const tabs = inputs.pages.map(page => {
      const path = page.get(coreExtensionData.routePath);
      return { id: path, label: path, href: path };
    });
    yield coreExtensionData.reactElement(
      <PageLayout title="Old tabs" tabs={tabs}>
        <Routes>
          <Route index element={<Navigate to="overview" replace />} />
          {inputs.pages.map(page => (
            <Route
              key={page.node.spec.id}
              path={`${page.get(coreExtensionData.routePath)}/*`}
              element={page.get(coreExtensionData.reactElement)}
            />
          ))}
        </Routes>
      </PageLayout>,
    );
    // Deliberately emitted after the React element: eligibility depends on
    // the validated outputs rather than factory yield order or blueprint kind.
    yield coreExtensionData.routePath('/legacy/:team');
  },
});

function OldTab({ name }: { name: string }) {
  const { team } = useParams();
  const [count, setCount] = useState(0);
  return (
    <>
      <h1>
        {name} for {team}
      </h1>
      <button onClick={() => setCount(count + 1)}>Count {count}</button>
      <RouterLink href="edit">Edit tab</RouterLink>
      <Routes>
        <Route path="edit" element={<h2>Editing {name}</h2>} />
      </Routes>
    </>
  );
}

it.each(['', '/backstage'])(
  'scopes an old page shell and its independently emitted children with basename "%s"',
  async basename => {
    const { appHistory } = renderTestApp({
      config: { app: { baseUrl: `http://localhost${basename}` } },
      initialRouteEntries: ['/legacy/otters?keep=1#anchor'],
      extensions: [
        oldTabsPage,
        ...['overview', 'details'].map(name =>
          createExtension({
            kind: 'old-tab',
            name,
            attachTo: { id: 'old-page:test/tabs', input: 'pages' },
            output: [
              coreExtensionData.routePath,
              coreExtensionData.reactElement,
            ],
            factory: () => [
              coreExtensionData.routePath(name),
              coreExtensionData.reactElement(<OldTab name={name} />),
            ],
          }),
        ),
      ],
    });
    expect(
      await screen.findByRole('heading', { name: 'overview for otters' }),
    ).toBeVisible();
    const overview = screen.getByRole('tab', { name: 'overview' });
    const details = screen.getByRole('tab', { name: 'details' });
    expect(overview).toHaveAttribute(
      'href',
      `${basename}/legacy/otters/overview`,
    );
    expect(overview).toHaveAttribute('aria-selected', 'true');
    expect(details).toHaveAttribute(
      'href',
      `${basename}/legacy/otters/details`,
    );
    // This is the old blueprint's own Navigate, which historically replaces
    // the index entry and drops its query and fragment.
    expect(appHistory.getSnapshot().location.pathname).toBe(
      '/legacy/otters/overview',
    );
    expect(appHistory.getSnapshot().action).toBe('REPLACE');
    fireEvent.click(details);
    expect(
      await screen.findByRole('heading', { name: 'details for otters' }),
    ).toBeVisible();
    expect(details).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByRole('link', { name: 'Edit tab' })).toHaveAttribute(
      'href',
      `${basename}/legacy/otters/details/edit`,
    );
    fireEvent.click(screen.getByRole('button', { name: 'Count 0' }));
    fireEvent.click(screen.getByRole('link', { name: 'Edit tab' }));
    expect(
      await screen.findByRole('heading', { name: 'Editing details' }),
    ).toBeVisible();
    expect(screen.getByRole('button', { name: 'Count 1' })).toBeVisible();
    expect(screen.getByRole('tab', { name: 'overview' })).toBe(overview);
    await act(async () => appHistory.navigate(-1));
    expect(appHistory.getSnapshot().location.pathname).toBe(
      '/legacy/otters/details',
    );
    expect(
      screen.queryByRole('heading', { name: 'Editing details' }),
    ).not.toBeInTheDocument();
    await act(async () => appHistory.navigate('/legacy/belugas/overview'));
    expect(
      await screen.findByRole('heading', { name: 'overview for belugas' }),
    ).toBeVisible();
  },
);

it('keeps root compatibility and native descendant scope through empty-path mounts and pathless extensions', async () => {
  function PathlessContent() {
    return (
      <>
        <h1>Settings for {useParams().id}</h1>
        <RouterLink href="edit">Edit settings</RouterLink>
        <Link to="edit">Native edit</Link>
      </>
    );
  }
  const pathless = createExtension({
    name: 'pathless',
    attachTo: { id: 'test/child', input: 'content' },
    output: [
      coreExtensionData.reactElement,
      coreExtensionData.routePath.optional(),
    ],
    factory: () => [coreExtensionData.reactElement(<PathlessContent />)],
  });
  const child = createExtension({
    name: 'child',
    attachTo: { id: 'test/empty', input: 'content' },
    inputs: {
      content: createExtensionInput([coreExtensionData.reactElement], {
        singleton: true,
      }),
    },
    output: [coreExtensionData.routePath, coreExtensionData.reactElement],
    factory: ({ inputs }) => [
      coreExtensionData.routePath('child/:id'),
      coreExtensionData.reactElement(
        <Routes>
          <Route
            path="settings/*"
            element={inputs.content.get(coreExtensionData.reactElement)}
          />
        </Routes>,
      ),
    ],
  });
  const empty = createExtension({
    name: 'empty',
    attachTo: { id: 'app/routes', input: 'routes' },
    inputs: {
      content: createExtensionInput([coreExtensionData.reactElement], {
        singleton: true,
      }),
    },
    output: [coreExtensionData.routePath, coreExtensionData.reactElement],
    factory: ({ inputs }) => [
      coreExtensionData.routePath(''),
      coreExtensionData.reactElement(
        <>
          <RouterLink href="child/alpha/settings">Empty mount link</RouterLink>
          {inputs.content.get(coreExtensionData.reactElement)}
        </>,
      ),
    ],
  });
  const { appHistory } = renderTestApp({
    config: { app: { baseUrl: 'http://localhost/backstage' } },
    initialRouteEntries: ['/child/alpha/settings'],
    extensions: [
      empty,
      child,
      pathless,
      AppRootElementBlueprint.make({
        params: { element: <Link to="support">Root support</Link> },
      }),
    ],
  });
  expect(
    await screen.findByRole('heading', { name: 'Settings for alpha' }),
  ).toBeVisible();
  expect(screen.getByRole('link', { name: 'Root support' })).toHaveAttribute(
    'href',
    '/backstage/support',
  );
  expect(
    screen.getByRole('link', { name: 'Empty mount link' }),
  ).toHaveAttribute('href', '/backstage/child/alpha/settings');
  expect(screen.getByRole('link', { name: 'Edit settings' })).toHaveAttribute(
    'href',
    '/backstage/child/alpha/settings/edit',
  );
  expect(screen.getByRole('link', { name: 'Native edit' })).toHaveAttribute(
    'href',
    '/backstage/child/alpha/settings/edit',
  );
  fireEvent.click(screen.getByRole('link', { name: 'Edit settings' }));
  expect(appHistory.getSnapshot().location.pathname).toBe(
    '/child/alpha/settings/edit',
  );
});

const tabRouteRef = createRouteRef({ params: ['team'] });

function RefPage() {
  const { team } = useParams();
  // Resolution goes through the ref object the factory emitted: if the
  // routing seam replaced or cloned route refs, these hooks would not resolve.
  const link = useRouteRef(tabRouteRef);
  const params = useRouteRefParams(tabRouteRef);
  return (
    <>
      <h1>Ref page for {team}</h1>
      <span>params:{JSON.stringify(params)}</span>
      {link && (
        <RouterLink href={link({ team: 'belugas' })}>Belugas page</RouterLink>
      )}
    </>
  );
}

it('scopes an emitted routeRef and resolves its parameters', async () => {
  const { appHistory } = renderTestApp({
    config: { app: { baseUrl: 'http://localhost/backstage' } },
    initialRouteEntries: ['/refs/otters'],
    extensions: [
      createExtension({
        name: 'ref-page',
        attachTo: { id: 'app/routes', input: 'routes' },
        output: [
          coreExtensionData.routePath,
          coreExtensionData.routeRef,
          coreExtensionData.reactElement,
        ],
        factory: () => [
          coreExtensionData.routePath('/refs/:team'),
          coreExtensionData.routeRef(tabRouteRef),
          coreExtensionData.reactElement(<RefPage />),
        ],
      }),
    ],
  });
  expect(
    await screen.findByRole('heading', { name: 'Ref page for otters' }),
  ).toBeVisible();
  expect(screen.getByText('params:{"team":"otters"}')).toBeVisible();
  // The resolved target reflects the page's scoped route path, including the
  // deployment basename, and interpolates the caller's parameters.
  expect(screen.getByRole('link', { name: 'Belugas page' })).toHaveAttribute(
    'href',
    '/backstage/refs/belugas',
  );
  fireEvent.click(screen.getByRole('link', { name: 'Belugas page' }));
  expect(
    await screen.findByRole('heading', { name: 'Ref page for belugas' }),
  ).toBeVisible();
  expect(screen.getByText('params:{"team":"belugas"}')).toBeVisible();
  expect(appHistory.getSnapshot().location.pathname).toBe('/refs/belugas');
});

it('mounts routes whose react element is omitted or null without routing errors', async () => {
  const { appHistory } = renderTestApp({
    initialRouteEntries: ['/ghosts/otters/ghost'],
    extensions: [
      createExtension({
        kind: 'old-page',
        name: 'ghosts',
        attachTo: { id: 'app/routes', input: 'routes' },
        inputs: {
          pages: createExtensionInput([
            coreExtensionData.routePath,
            coreExtensionData.reactElement.optional(),
          ]),
        },
        output: [coreExtensionData.routePath, coreExtensionData.reactElement],
        factory: ({ inputs }) => [
          coreExtensionData.routePath('/ghosts/:team'),
          coreExtensionData.reactElement(
            <Routes>
              <Route index element={<h2>Ghost index</h2>} />
              {inputs.pages.map(page => (
                <Route
                  key={page.node.spec.id}
                  path={`${page.get(coreExtensionData.routePath)}/*`}
                  element={page.get(coreExtensionData.reactElement)}
                />
              ))}
            </Routes>,
          ),
        ],
      }),
      createExtension({
        kind: 'old-tab',
        name: 'ghost',
        attachTo: { id: 'old-page:test/ghosts', input: 'pages' },
        output: [
          coreExtensionData.routePath,
          coreExtensionData.reactElement.optional(),
        ],
        factory: () => [coreExtensionData.routePath('ghost')],
      }),
      createExtension({
        kind: 'old-tab',
        name: 'hollow',
        attachTo: { id: 'old-page:test/ghosts', input: 'pages' },
        output: [coreExtensionData.routePath, coreExtensionData.reactElement],
        factory: () => [
          coreExtensionData.routePath('hollow'),
          // The runtime accepts a null element; the ref type does not.
          coreExtensionData.reactElement(null as unknown as ReactElement),
        ],
      }),
      createExtension({
        kind: 'old-tab',
        name: 'solid',
        attachTo: { id: 'old-page:test/ghosts', input: 'pages' },
        output: [coreExtensionData.routePath, coreExtensionData.reactElement],
        factory: () => [
          coreExtensionData.routePath('solid'),
          coreExtensionData.reactElement(<h2>Solid tab</h2>),
        ],
      }),
    ],
  });
  // The omitted-element route mounts and matches, rendering no content.
  await act(async () => {});
  expect(screen.queryByText('Ghost index')).not.toBeInTheDocument();
  expect(screen.queryByText('Solid tab')).not.toBeInTheDocument();
  expect(appHistory.getSnapshot().location.pathname).toBe(
    '/ghosts/otters/ghost',
  );
  // Same for a null react element output.
  await act(async () => appHistory.navigate('/ghosts/otters/hollow'));
  expect(screen.queryByText('Ghost index')).not.toBeInTheDocument();
  expect(screen.queryByText('Solid tab')).not.toBeInTheDocument();
  // A sibling route with content still renders, and the empty ones still
  // match afterwards.
  await act(async () => appHistory.navigate('/ghosts/otters/solid'));
  expect(await screen.findByText('Solid tab')).toBeVisible();
  await act(async () => appHistory.navigate('/ghosts/otters/ghost'));
  expect(screen.queryByText('Solid tab')).not.toBeInTheDocument();
  await act(async () => appHistory.navigate('/ghosts/otters'));
  expect(await screen.findByText('Ghost index')).toBeVisible();
});

describe('direct history navigation teardown', () => {
  beforeEach(() => {
    jest.replaceProperty(process, 'env', {
      ...process.env,
      NODE_ENV: 'development',
    });
  });
  afterEach(() => {
    jest.restoreAllMocks();
  });

  function leavingPage(id: string) {
    return createExtension({
      name: id,
      attachTo: { id: 'app/routes', input: 'routes' },
      output: [coreExtensionData.routePath, coreExtensionData.reactElement],
      factory: () => [
        coreExtensionData.routePath(`/${id}/:entity`),
        coreExtensionData.reactElement(<LeavingPage key={id} />),
      ],
    });
  }

  function LeavingPage() {
    const navigation = useNavigation();
    const { entity } = useParams();
    return (
      <>
        <h1>Leaving {entity}</h1>
        <RouterLink href="sub">Relative sub</RouterLink>
        <button onClick={() => navigation.navigate('/landing')}>
          Leave page
        </button>
      </>
    );
  }

  const landingPage = createExtension({
    name: 'landing',
    attachTo: { id: 'app/routes', input: 'routes' },
    output: [coreExtensionData.routePath, coreExtensionData.reactElement],
    factory: () => [
      coreExtensionData.routePath('/landing'),
      coreExtensionData.reactElement(<h1>Landing</h1>),
    ],
  });

  it('completes navigation that unmounts the page navigating away', async () => {
    const warn = jest.spyOn(console, 'warn').mockImplementation(() => {});
    const { appHistory } = renderTestApp({
      extensions: [leavingPage('leave'), landingPage],
      initialRouteEntries: ['/leave/alpha'],
    });
    expect(
      await screen.findByRole('heading', { name: 'Leaving alpha' }),
    ).toBeVisible();
    expect(screen.getByRole('link', { name: 'Relative sub' })).toHaveAttribute(
      'href',
      '/leave/alpha/sub',
    );
    expect(appHistory.getSnapshot().entry?.index).toBe(0);

    // The page initiating this navigation is unmounted by it.
    fireEvent.click(screen.getByRole('button', { name: 'Leave page' }));
    expect(
      await screen.findByRole('heading', { name: 'Landing' }),
    ).toBeVisible();
    expect(appHistory.getSnapshot().location.pathname).toBe('/landing');
    expect(appHistory.getSnapshot().action).toBe('PUSH');
    expect(appHistory.getSnapshot().entry?.index).toBe(1);

    await act(async () => appHistory.navigate(-1));
    expect(
      await screen.findByRole('heading', { name: 'Leaving alpha' }),
    ).toBeVisible();
    expect(appHistory.getSnapshot().entry?.index).toBe(0);

    const warnings = warn.mock.calls.filter(([message]) =>
      String(message).includes('implicit React Router'),
    );
    expect(warnings).toHaveLength(1);
    expect(warnings[0][0]).toContain("'test/leave'");
  });

  it('applies a navigation callback retained past its page unmount', async () => {
    const warn = jest.spyOn(console, 'warn').mockImplementation(() => {});
    function RetainingPage() {
      const navigation = useNavigation();
      const navigationRef = useRef(navigation);
      navigationRef.current = navigation;
      useEffect(
        () => () => {
          // A callback captured while the page was mounted — e.g. held by a
          // pending promise — firing while the page unmounts.
          navigationRef.current.navigate('/after-cleanup');
        },
        [],
      );
      return (
        <>
          <h1>Retaining</h1>
          <RouterLink href="sub">Relative sub</RouterLink>
          <button onClick={() => navigation.navigate('/landing')}>
            Leave page
          </button>
        </>
      );
    }
    const retainingPage = createExtension({
      name: 'retaining',
      attachTo: { id: 'app/routes', input: 'routes' },
      output: [coreExtensionData.routePath, coreExtensionData.reactElement],
      factory: () => [
        coreExtensionData.routePath('/retain'),
        coreExtensionData.reactElement(<RetainingPage />),
      ],
    });
    const afterCleanupPage = createExtension({
      name: 'after-cleanup',
      attachTo: { id: 'app/routes', input: 'routes' },
      output: [coreExtensionData.routePath, coreExtensionData.reactElement],
      factory: () => [
        coreExtensionData.routePath('/after-cleanup'),
        coreExtensionData.reactElement(<h1>After cleanup</h1>),
      ],
    });
    const { appHistory } = renderTestApp({
      extensions: [retainingPage, landingPage, afterCleanupPage],
      initialRouteEntries: ['/retain'],
    });
    expect(
      await screen.findByRole('heading', { name: 'Retaining' }),
    ).toBeVisible();
    expect(appHistory.getSnapshot().entry?.index).toBe(0);

    // Navigating away unmounts the page, whose cleanup navigates again.
    fireEvent.click(screen.getByRole('button', { name: 'Leave page' }));
    expect(
      await screen.findByRole('heading', { name: 'After cleanup' }),
    ).toBeVisible();
    expect(appHistory.getSnapshot().location.pathname).toBe('/after-cleanup');
    expect(appHistory.getSnapshot().action).toBe('PUSH');
    expect(appHistory.getSnapshot().entry?.index).toBe(2);

    await act(async () => appHistory.navigate(-1));
    expect(
      await screen.findByRole('heading', { name: 'Landing' }),
    ).toBeVisible();
    await act(async () => appHistory.navigate(-1));
    expect(
      await screen.findByRole('heading', { name: 'Retaining' }),
    ).toBeVisible();

    const warnings = warn.mock.calls.filter(([message]) =>
      String(message).includes('implicit React Router'),
    );
    expect(warnings).toHaveLength(1);
    expect(warnings[0][0]).toContain("'test/retaining'");
  });
});
