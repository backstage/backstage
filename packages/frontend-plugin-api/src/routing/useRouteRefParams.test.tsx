/*
 * Copyright 2021 The Backstage Authors
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

import { PropsWithChildren, ReactNode } from 'react';
import { act, render, renderHook, screen } from '@testing-library/react';
import { TestApiProvider } from '@backstage/test-utils';
import {
  createMockAppHistory,
  type MockAppHistory,
} from '@backstage/frontend-test-utils';
import { PageMountProvider, type PageMount } from '@internal/frontend';
import { appHistoryApiRef } from './AppHistoryApi';
import { MemoryRouter, Route, Routes, useNavigate } from 'react-router-dom';
import { useRouteRefParams } from './useRouteRefParams';
import { createRouteRef } from './RouteRef';
import { createSubRouteRef } from './SubRouteRef';

/*
 * Nothing in this file renders a React Router provider, deliberately: the
 * framework provides no router context at page or sub-page depth, so params
 * have to come out of the mount chain and the app history alone.
 */

const entityRouteRef = createRouteRef({
  params: ['namespace', 'kind', 'name'],
});
const entityTabRouteRef = createSubRouteRef({
  parent: entityRouteRef,
  path: '/:tab',
});
const rootRouteRef = createRouteRef();

const pageMount: PageMount = {
  basePath: '/catalog/default/component/foo',
  routePattern: '/catalog/:namespace/:kind/:name',
};
const subPageMount: PageMount = {
  basePath: '/catalog/default/component/foo/ci-cd',
  routePattern: '/catalog/:namespace/:kind/:name/:tab',
};

/** Nests the given mounts, outermost first, under a framework app history. */
function createWrapper(options: {
  appHistory: MockAppHistory;
  mounts?: PageMount[];
}) {
  const { appHistory, mounts = [] } = options;
  return function Wrapper({ children }: PropsWithChildren<{}>) {
    const nested = mounts.reduceRight<ReactNode>(
      (inner, mount) => (
        <PageMountProvider mount={mount}>{inner}</PageMountProvider>
      ),
      children,
    );
    return (
      <TestApiProvider apis={[[appHistoryApiRef, appHistory]]}>
        {nested}
      </TestApiProvider>
    );
  };
}

describe('useRouteRefParams', () => {
  it('reads route params and follows navigation in the old frontend', () => {
    const Content = () => {
      const { namespace, kind, name } = useRouteRefParams(entityRouteRef);
      const navigate = useNavigate();
      return (
        <>
          <p>
            {namespace}/{kind}/{name}
          </p>
          <button onClick={() => navigate('/catalog/other/api/second')}>
            Next
          </button>
        </>
      );
    };
    render(
      <TestApiProvider apis={[]}>
        <MemoryRouter initialEntries={['/catalog/default/component/a%2Fb']}>
          <Routes>
            <Route
              path="/catalog/:namespace/:kind/:name"
              element={<Content />}
            />
          </Routes>
        </MemoryRouter>
      </TestApiProvider>,
    );
    expect(screen.getByText('default/component/a/b')).toBeInTheDocument();
    act(() => screen.getByRole('button', { name: 'Next' }).click());
    expect(screen.getByText('other/api/second')).toBeInTheDocument();
  });

  it('should resolve the params of a page with no React Router context present', () => {
    const appHistory = createMockAppHistory({
      initialLocation: '/catalog/default/component/foo',
    });
    const wrapper = createWrapper({ appHistory, mounts: [pageMount] });

    // Only the params the route ref declares, so the value matches its type.
    expect(
      renderHook(() => useRouteRefParams(entityRouteRef), { wrapper }).result
        .current,
    ).toEqual({ namespace: 'default', kind: 'component', name: 'foo' });
    expect(
      renderHook(() => useRouteRefParams(rootRouteRef), { wrapper }).result
        .current,
    ).toEqual({});

    // A splat page keeps its base while the location goes deeper, so the
    // params have to be read from the location rather than from the base.
    const docsHistory = createMockAppHistory({
      initialLocation: '/docs/default/component/foo/sub/page',
    });
    expect(
      renderHook(() => useRouteRefParams(entityRouteRef), {
        wrapper: createWrapper({
          appHistory: docsHistory,
          mounts: [
            {
              basePath: '/docs',
              routePattern: '/docs/*',
            },
            {
              basePath: '/docs/default/component/foo',
              routePattern: '/docs/:namespace/:kind/:name',
            },
          ],
        }),
      }).result.current,
    ).toEqual({ namespace: 'default', kind: 'component', name: 'foo' });
  });

  it('should resolve the params of a sub-page from the mount chain', () => {
    const appHistory = createMockAppHistory({
      initialLocation: '/catalog/default/component/foo/ci-cd',
    });
    const wrapper = createWrapper({
      appHistory,
      mounts: [pageMount, subPageMount],
    });

    expect(
      renderHook(() => useRouteRefParams(entityTabRouteRef), { wrapper }).result
        .current,
    ).toEqual({
      namespace: 'default',
      kind: 'component',
      name: 'foo',
      tab: 'ci-cd',
    });
    // The page's own ref declares none of the sub-page's params, so it still
    // sees exactly what it asked for at sub-page depth.
    expect(
      renderHook(() => useRouteRefParams(entityRouteRef), { wrapper }).result
        .current,
    ).toEqual({ namespace: 'default', kind: 'component', name: 'foo' });
  });

  it('should resolve sub-route params that only the sub-route pattern names', () => {
    // A page that routes below itself publishes only its own mount, so the
    // sub-route's own params are found by matching the pattern the sub-route
    // ref describes — its parent's, with its path appended.
    const appHistory = createMockAppHistory({
      initialLocation: '/catalog/default/component/foo/ci-cd',
    });
    const wrapper = createWrapper({ appHistory, mounts: [pageMount] });

    expect(
      renderHook(() => useRouteRefParams(entityTabRouteRef), { wrapper }).result
        .current,
    ).toEqual({
      namespace: 'default',
      kind: 'component',
      name: 'foo',
      tab: 'ci-cd',
    });
  });

  it('should follow the app history and answer with no params outside a page', () => {
    const appHistory = createMockAppHistory({
      initialLocation: '/catalog/default/component/foo',
    });

    const scoped = renderHook(() => useRouteRefParams(entityRouteRef), {
      wrapper: createWrapper({ appHistory, mounts: [pageMount] }),
    });
    expect(scoped.result.current).toEqual({
      namespace: 'default',
      kind: 'component',
      name: 'foo',
    });

    act(() => {
      appHistory.navigate('/catalog/default/component/bar');
    });
    expect(scoped.result.current).toEqual({
      namespace: 'default',
      kind: 'component',
      name: 'bar',
    });

    // An unscoped page declares no mount, so there is no pattern to read
    // params out of, exactly as an unscoped page has no router. The keys are
    // still the ones the ref declares; none of them has a value.
    expect(
      renderHook(() => useRouteRefParams(entityRouteRef), {
        wrapper: createWrapper({ appHistory }),
      }).result.current,
    ).toStrictEqual({
      namespace: undefined,
      kind: undefined,
      name: undefined,
    });
  });

  it('should report a declared param the location does not bind as undefined', () => {
    // React Router keeps the key and reports `undefined` for an optional
    // segment the location left out, and this hook used to be `useParams`, so
    // dropping the key would silently change `'id' in params`, `Object.keys`
    // and object spreads for every published plugin that calls it.
    const optionalRouteRef = createRouteRef({ params: ['id'] });
    const appHistory = createMockAppHistory({ initialLocation: '/foo' });
    const { result } = renderHook(() => useRouteRefParams(optionalRouteRef), {
      wrapper: createWrapper({
        appHistory,
        mounts: [{ basePath: '/foo', routePattern: '/foo/:id?' }],
      }),
    });

    // `toEqual` ignores undefined-valued keys, so the key set is asserted on
    // its own — it is the whole difference between the two behaviors.
    expect(Object.keys(result.current)).toEqual(['id']);
    expect('id' in result.current).toBe(true);
    expect(result.current).toStrictEqual({ id: undefined });

    // The same key carries a value once the location binds the segment.
    act(() => {
      appHistory.navigate('/foo/bar');
    });
    expect(result.current).toStrictEqual({ id: 'bar' });
  });

  it('should provide typed params', () => {
    const routeRef = createRouteRef({
      params: ['a', 'b'],
    });

    const Page = () => {
      const params: { a: string; b: string } = useRouteRefParams(routeRef);

      return (
        <div>
          <span>{params.a}</span>
          <span>{params.b}</span>
        </div>
      );
    };

    const appHistory = createMockAppHistory({ initialLocation: '/foo/bar' });
    const Wrapper = createWrapper({
      appHistory,
      mounts: [{ basePath: '/foo/bar', routePattern: '/:a/:b' }],
    });

    render(
      <Wrapper>
        <Page />
      </Wrapper>,
    );

    expect(screen.getByText('foo')).toBeInTheDocument();
    expect(screen.getByText('bar')).toBeInTheDocument();
  });
});
