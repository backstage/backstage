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

import { Fragment, createRef } from 'react';
import { render, screen } from '@testing-library/react';
import { TestMemoryRouterProvider } from '@backstage/frontend-test-utils';
import {
  createRoutesFromChildren,
  Link,
  NavLink,
  Outlet,
  Route,
  Routes,
} from './components';

describe('Link', () => {
  it('forwards ref to the underlying anchor element', async () => {
    const ref = createRef<HTMLAnchorElement>();

    render(
      <TestMemoryRouterProvider>
        <Link to="/test" ref={ref}>
          Test Link
        </Link>
      </TestMemoryRouterProvider>,
    );

    const anchor = await screen.findByText('Test Link');
    expect(ref.current).toBe(anchor);
    expect(ref.current).toBeInstanceOf(HTMLAnchorElement);
  });
});

describe('NavLink', () => {
  it('forwards ref to the underlying anchor element', async () => {
    const ref = createRef<HTMLAnchorElement>();

    render(
      <TestMemoryRouterProvider>
        <NavLink to="/test" ref={ref}>
          Test NavLink
        </NavLink>
      </TestMemoryRouterProvider>,
    );

    const anchor = await screen.findByText('Test NavLink');
    expect(ref.current).toBe(anchor);
    expect(ref.current).toBeInstanceOf(HTMLAnchorElement);
  });
});

describe('createRoutesFromChildren', () => {
  it('creates route objects from Route children', () => {
    const routes = createRoutesFromChildren(
      <>
        <Route path="/" element={<div>Home</div>} />
        <Route path="/about" element={<div>About</div>} />
      </>,
    );

    expect(routes).toHaveLength(2);
    expect(routes[0].path).toBe('/');
    expect(routes[1].path).toBe('/about');
  });

  it('flattens Fragment children', () => {
    const routes = createRoutesFromChildren(
      <>
        <Fragment>
          <Route path="/a" element={<div>A</div>} />
          <Route path="/b" element={<div>B</div>} />
        </Fragment>
        <Route path="/c" element={<div>C</div>} />
      </>,
    );

    expect(routes).toHaveLength(3);
    expect(routes[0].path).toBe('/a');
    expect(routes[1].path).toBe('/b');
    expect(routes[2].path).toBe('/c');
  });

  it('ignores non-element children like null and strings', () => {
    const routes = createRoutesFromChildren(
      <>
        {null}
        <Route path="/" element={<div>Home</div>} />
        some text
        {undefined}
      </>,
    );

    expect(routes).toHaveLength(1);
    expect(routes[0].path).toBe('/');
  });

  it('warns about elements without Route-like props in development', () => {
    const warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});

    createRoutesFromChildren(
      <>
        <Route path="/" element={<div>Home</div>} />
        <div>Not a route</div>
        <span className="oops" />
      </>,
    );

    expect(warnSpy).toHaveBeenCalledTimes(2);
    expect(warnSpy).toHaveBeenCalledWith(
      expect.stringContaining('is not a <Route> component'),
    );

    warnSpy.mockRestore();
  });

  it('does not warn about elements that have Route-like props', () => {
    const warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});

    const CustomRoute = (
      _props: { path: string; element: React.ReactElement } & {
        children?: React.ReactNode;
      },
    ) => null;

    createRoutesFromChildren(
      <>
        <CustomRoute path="/custom" element={<div>Custom</div>} />
      </>,
    );

    expect(warnSpy).not.toHaveBeenCalled();

    warnSpy.mockRestore();
  });

  it('warns about multi-segment splat paths but not root splats', () => {
    const warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});

    createRoutesFromChildren(
      <>
        <Route path="dashboard/*" element={<div>Dashboard</div>} />
        <Route path="/*" element={<div>Root splat</div>} />
        <Route path="*" element={<div>Catch all</div>} />
      </>,
    );

    expect(warnSpy).toHaveBeenCalledTimes(1);
    expect(warnSpy).toHaveBeenCalledWith(
      expect.stringContaining('dashboard/*'),
    );

    warnSpy.mockRestore();
  });

  it('processes nested children into route objects with children', () => {
    const routes = createRoutesFromChildren(
      <>
        <Route path="/parent" element={<div>Parent</div>}>
          <Route path="child-a" element={<div>A</div>} />
          <Route path="child-b" element={<div>B</div>} />
        </Route>
      </>,
    );

    expect(routes).toHaveLength(1);
    expect(routes[0].path).toBe('/parent');
    expect(routes[0].children).toHaveLength(2);
    expect(routes[0].children![0].path).toBe('child-a');
    expect(routes[0].children![1].path).toBe('child-b');
  });
});

describe('Routes', () => {
  it('renders the matching route element', async () => {
    render(
      <TestMemoryRouterProvider initialEntries={['/about']}>
        <Routes>
          <Route path="/" element={<div>Home</div>} />
          <Route path="/about" element={<div>About Page</div>} />
        </Routes>
      </TestMemoryRouterProvider>,
    );

    expect(await screen.findByText('About Page')).toBeInTheDocument();
    expect(screen.queryByText('Home')).not.toBeInTheDocument();
  });

  it('renders nested routes with Outlet', async () => {
    function Layout() {
      return (
        <div>
          <h1>Layout</h1>
          <Outlet />
        </div>
      );
    }

    render(
      <TestMemoryRouterProvider initialEntries={['/parent/child']}>
        <Routes>
          <Route path="/parent" element={<Layout />}>
            <Route path="child" element={<div>Child Content</div>} />
          </Route>
        </Routes>
      </TestMemoryRouterProvider>,
    );

    expect(await screen.findByText('Layout')).toBeInTheDocument();
    expect(await screen.findByText('Child Content')).toBeInTheDocument();
  });
});
