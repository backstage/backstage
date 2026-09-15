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

import type { ReactNode } from 'react';
import { act, screen, waitFor } from '@testing-library/react';
import { renderTestApp } from '@backstage/frontend-test-utils';
import {
  PageBlueprint,
  coreExtensionData,
  createExtension,
} from '@backstage/frontend-plugin-api';
import {
  Link,
  Route,
  Routes,
  useHref,
  useLocation,
  useParams,
  useResolvedPath,
} from 'react-router-dom';
import { ReactRouterV6PageRouter } from './ReactRouterV6PageRouter';

/**
 * Two React Router v6 context projections from the *same* copy of the library,
 * stacked — which is what every page that wraps in `ReactRouterV6PageRouter`
 * actually produces, and so the most common shape in the product.
 *
 * The app root keeps a projection of its own for chrome (`RootReactRouterV6`),
 * at app scope and with no route matched. A page adapter is a second
 * projection of the same contexts, at page scope, rendered inside the first.
 * Nothing about that is exotic — it is the default — and yet it is the one
 * arrangement the coexistence tests next door cannot cover, because they pair
 * two *different* libraries, whose distinct context objects can never displace
 * one another. Here they can: same contexts, same providers, one inside the
 * other, and the inner one has to win for everything below it and for nothing
 * above it.
 *
 * The app is deployed under a basename throughout, because the failure that
 * stacking invites is applying something twice. Both projections publish
 * `basename: ''` and delegate `createHref` to the app history, which owns the
 * deploy prefix; if either one grew a basename of its own, or resolved a
 * target against a base that already contains the page prefix, it would show
 * up here as a doubled prefix rather than as a subtly wrong href nobody reads.
 */

const CONFIG_WITH_BASENAME = {
  app: { baseUrl: 'http://localhost:3000/backstage' },
  backend: { baseUrl: 'http://localhost:7007' },
};

/**
 * Everything a React Router v6 consumer can observe about which projection is
 * answering it, in one place: the match (`useParams`), the location, what a
 * relative target resolves to, and what that target renders as an href once
 * the deploy basename has been applied.
 */
function V6Probe(props: { id: string }) {
  const params = useParams();
  const location = useLocation();
  const resolved = useResolvedPath('edit');
  const href = useHref('edit');
  return (
    <div data-testid={props.id}>
      <span data-testid={`${props.id}-params`}>{JSON.stringify(params)}</span>
      <span data-testid={`${props.id}-location`}>{location.pathname}</span>
      <span data-testid={`${props.id}-resolved`}>{resolved.pathname}</span>
      <span data-testid={`${props.id}-href`}>{href}</span>
      <Link to="edit" data-testid={`${props.id}-link`}>
        Edit
      </Link>
    </div>
  );
}

function readProbe(id: string) {
  return {
    params: screen.getByTestId(`${id}-params`).textContent,
    location: screen.getByTestId(`${id}-location`).textContent,
    resolved: screen.getByTestId(`${id}-resolved`).textContent,
    href: screen.getByTestId(`${id}-href`).textContent,
    linkHref: screen.getByTestId(`${id}-link`).getAttribute('href'),
  };
}

/** A probe rendered where app-wide chrome goes: above every page. */
function chromeProbe(element: ReactNode) {
  return createExtension({
    name: 'chrome-probe',
    attachTo: { id: 'app/root', input: 'elements' },
    output: [coreExtensionData.reactElement],
    factory: () => [coreExtensionData.reactElement(<>{element}</>)],
  });
}

describe('React Router v6 nested inside React Router v6', () => {
  it('should scope the page without disturbing the app root projection above it', async () => {
    const entityPage = PageBlueprint.make({
      name: 'entity',
      params: {
        path: '/e/:id',
        loader: async () => (
          <ReactRouterV6PageRouter>
            <V6Probe id="page" />
          </ReactRouterV6PageRouter>
        ),
      },
    });
    const plainPage = PageBlueprint.make({
      name: 'plain',
      params: {
        path: '/plain/:id',
        loader: async () => <V6Probe id="plain" />,
      },
    });

    const { appHistory } = renderTestApp({
      extensions: [entityPage, plainPage, chromeProbe(<V6Probe id="chrome" />)],
      initialRouteEntries: ['/e/alpha'],
      config: CONFIG_WITH_BASENAME,
    });

    await waitFor(() => {
      expect(screen.getByTestId('page')).toBeInTheDocument();
    });

    // Inside the page adapter: the page's own match answers, and a relative
    // target resolves against where the page is mounted.
    expect(readProbe('page')).toEqual({
      params: JSON.stringify({ id: 'alpha', '*': '' }),
      location: '/e/alpha',
      resolved: '/e/alpha/edit',
      // The deploy basename, applied once, by the app history — the only
      // thing in the stack that owns it.
      href: '/backstage/e/alpha/edit',
      linkHref: '/backstage/e/alpha/edit',
    });

    // Above the page, the app root projection is untouched by the page's: no
    // route is matched there, so a relative target resolves from the app root.
    // Getting this wrong in the other direction — the inner projection leaking
    // upwards — is what would make every sidebar link acquire the current
    // page's prefix.
    expect(readProbe('chrome')).toEqual({
      params: '{}',
      location: '/e/alpha',
      resolved: '/edit',
      href: '/backstage/edit',
      linkHref: '/backstage/edit',
    });

    // Following the page-scoped link lands on an app-relative location: the
    // basename belongs to the href, not to the history.
    await act(async () => {
      screen.getByTestId('page-link').click();
    });
    expect(appHistory.location.pathname).toBe('/e/alpha/edit');

    // Unmigrated pages retain equivalent v6 matches through the fallback.
    await act(async () => {
      appHistory.navigate('/plain/beta');
    });
    await waitFor(() => {
      expect(screen.getByTestId('plain')).toBeInTheDocument();
    });
    expect(readProbe('plain')).toEqual({
      params: JSON.stringify({ id: 'beta', '*': '' }),
      location: '/plain/beta',
      resolved: '/plain/beta/edit',
      href: '/backstage/plain/beta/edit',
      linkHref: '/backstage/plain/beta/edit',
    });
    // ...and the chrome above it moved with the app, still at app scope.
    expect(readProbe('chrome')).toEqual({
      params: '{}',
      location: '/plain/beta',
      resolved: '/edit',
      href: '/backstage/edit',
      linkHref: '/backstage/edit',
    });
  });

  it('should let a second adapter at the same mount shadow the first without applying anything twice', async () => {
    // Adapters are added rather than selected, so a page that wraps itself and
    // a shared component inside it that also wraps produce two projections at
    // the same mount. The inner has to be indistinguishable from the outer:
    // it derives its match from the same pattern and the same location, and
    // the outer's route context it finds above it describes this very mount
    // rather than an ancestor, so it must be stood in for, not stacked on. If
    // it were stacked on, `..` would climb into the page instead of off it and
    // the prefix would appear twice.
    const doublyWrappedPage = PageBlueprint.make({
      name: 'doubly-wrapped',
      params: {
        path: '/e/:id',
        loader: async () => (
          <ReactRouterV6PageRouter>
            <V6Probe id="outer" />
            <ReactRouterV6PageRouter>
              <V6Probe id="inner" />
              <Routes>
                <Route
                  path="edit"
                  element={<span data-testid="inner-nested">edit</span>}
                />
              </Routes>
            </ReactRouterV6PageRouter>
          </ReactRouterV6PageRouter>
        ),
      },
    });

    const { appHistory } = renderTestApp({
      extensions: [doublyWrappedPage],
      initialRouteEntries: ['/e/alpha'],
      config: CONFIG_WITH_BASENAME,
    });

    await waitFor(() => {
      expect(screen.getByTestId('inner')).toBeInTheDocument();
    });

    const outer = readProbe('outer');
    expect(outer).toEqual({
      params: JSON.stringify({ id: 'alpha', '*': '' }),
      location: '/e/alpha',
      resolved: '/e/alpha/edit',
      href: '/backstage/e/alpha/edit',
      linkHref: '/backstage/e/alpha/edit',
    });
    // Same readings from inside the second projection: the page prefix appears
    // once and the deploy basename appears once, however many adapters the
    // page ended up with.
    expect(readProbe('inner')).toEqual(outer);

    // Descendant routes below the inner projection still match against the
    // tail of the page's own mount, not against the whole pathname.
    expect(screen.queryByTestId('inner-nested')).not.toBeInTheDocument();
    await act(async () => {
      appHistory.navigate('/e/alpha/edit');
    });
    await waitFor(() => {
      expect(screen.getByTestId('inner-nested')).toBeInTheDocument();
    });
    expect(readProbe('inner')).toEqual(readProbe('outer'));

    // The same page at a different concrete prefix: still exactly one prefix.
    await act(async () => {
      appHistory.navigate('/e/beta');
    });
    await waitFor(() => {
      expect(screen.getByTestId('inner-resolved')).toHaveTextContent(
        '/e/beta/edit',
      );
    });
    expect(readProbe('inner')).toEqual(readProbe('outer'));
    expect(screen.getByTestId('inner-href')).toHaveTextContent(
      '/backstage/e/beta/edit',
    );
  });
});
