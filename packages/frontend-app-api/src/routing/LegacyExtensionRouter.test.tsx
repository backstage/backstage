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
import { renderTestApp } from '@backstage/frontend-test-utils';
import {
  AppRootElementBlueprint,
  PageLayout,
  RouterLink,
  coreExtensionData,
  createExtension,
  createExtensionInput,
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
