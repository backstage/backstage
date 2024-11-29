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

import {
  createExternalRouteRef,
  createRouteRef,
  createSubRouteRef,
  errorApiRef,
  useApi,
  useApp,
  useRouteRef,
} from '@backstage/core-plugin-api';
import { withLogCollector } from './logCollector';
import { render } from '@testing-library/react';
import React, { useEffect } from 'react';
import { Route, Routes } from 'react-router-dom';
import { MockErrorApi } from './apis';
import { renderInTestApp, wrapInTestApp } from './appWrappers';
import { TestApiProvider } from './TestApiProvider';

describe('wrapInTestApp', () => {
  it('should provide routing and warn about missing act()', async () => {
    const { error } = await withLogCollector(['error'], async () => {
      const rendered = render(
        wrapInTestApp(
          <Routes>
            <Route path="/route1" element={<p>Route 1</p>} />
            <Route path="/route2" element={<p>Route 2</p>} />
          </Routes>,
          { routeEntries: ['/route2'] },
        ),
      );

      expect(rendered.getByText('Route 2')).toBeInTheDocument();
      // Wait for async actions to trigger the act() warnings that we assert below
      await Promise.resolve();
    });

    expect(
      error.some(e =>
        e.includes(
          'Warning: An update to %s inside a test was not wrapped in act(...)',
        ),
      ),
    ).toBeTruthy();
  });

  it('should render a component in a test app without warning about missing act()', async () => {
    const { error } = await withLogCollector(['error'], async () => {
      const Foo = () => {
        return <p>foo</p>;
      };

      const rendered = await renderInTestApp(Foo);
      expect(rendered.getByText('foo')).toBeInTheDocument();
    });

    expect(error).toEqual([]);
  });

  it('should render a node in a test app', async () => {
    const Foo = () => {
      return <p>foo</p>;
    };

    const rendered = await renderInTestApp(<Foo />);
    expect(rendered.getByText('foo')).toBeInTheDocument();
  });

  it('should provide mock API implementations', async () => {
    const A = () => {
      const errorApi = useApi(errorApiRef);
      errorApi.post(new Error('NOPE'));
      return null;
    };

    const { error } = await withLogCollector(['error'], async () => {
      await expect(renderInTestApp(A)).rejects.toThrow('NOPE');
    });

    expect(error).toEqual([
      expect.objectContaining({
        detail: new Error(
          'MockErrorApi received unexpected error, Error: NOPE',
        ),
      }),
      expect.objectContaining({
        detail: new Error(
          'MockErrorApi received unexpected error, Error: NOPE',
        ),
      }),
      expect.stringMatching(/^The above error occurred in the <A> component:/),
    ]);
  });

  it('should allow custom API implementations', async () => {
    const mockErrorApi = new MockErrorApi({ collect: true });

    const A = () => {
      const errorApi = useApi(errorApiRef);
      useEffect(() => {
        errorApi.post(new Error('NOPE'));
      }, [errorApi]);
      return <p>foo</p>;
    };

    const rendered = await renderInTestApp(
      <TestApiProvider apis={[[errorApiRef, mockErrorApi]]}>
        <A />
      </TestApiProvider>,
    );

    expect(rendered.getByText('foo')).toBeInTheDocument();
    expect(mockErrorApi.getErrors()).toEqual([{ error: new Error('NOPE') }]);
  });

  it('should allow route refs to be mounted on specific paths', async () => {
    const aRouteRef = createRouteRef({ id: 'A' });
    const bRouteRef = createRouteRef({ id: 'B', params: ['name'] });
    const subRouteRef = createSubRouteRef({
      id: 'S',
      parent: bRouteRef,
      path: '/:page',
    });
    const externalRouteRef = createExternalRouteRef({
      id: 'E',
      params: ['name'],
    });

    const MyComponent = () => {
      const a = useRouteRef(aRouteRef);
      const b = useRouteRef(bRouteRef);
      const s = useRouteRef(subRouteRef);
      const e = useRouteRef(externalRouteRef);
      return (
        <div>
          <div>Link A: {a()}</div>
          <div>Link B: {b({ name: 'x' })}</div>
          <div>Link S: {s({ name: 'y', page: 'p' })}</div>
          <div>Link E: {e({ name: 'z' })}</div>
        </div>
      );
    };

    const rendered = await renderInTestApp(<MyComponent />, {
      mountedRoutes: {
        '/my-a-path': aRouteRef,
        '/my-b-path/:name': bRouteRef,
        '/my-e-path/:name': externalRouteRef,
      },
    });
    expect(rendered.getByText('Link A: /my-a-path')).toBeInTheDocument();
    expect(rendered.getByText('Link B: /my-b-path/x')).toBeInTheDocument();
    expect(rendered.getByText('Link S: /my-b-path/y/p')).toBeInTheDocument();
    expect(rendered.getByText('Link E: /my-e-path/z')).toBeInTheDocument();
  });

  it('should not make route mounting elements visible during tests', async () => {
    const routeRef = createRouteRef({ id: 'foo' });

    const rendered = await renderInTestApp(<span>foo</span>, {
      mountedRoutes: { '/foo': routeRef },
    });

    const [root] = rendered.baseElement.children;
    expect(root).toBeInTheDocument();
    expect(root.children.length).toBe(1);
    expect(root.children[0].textContent).toBe('foo');
  });

  it('should support rerenders', async () => {
    const MyComponent = () => {
      const app = useApp();
      const { Progress } = app.getComponents();
      return <Progress />;
    };

    const rendered = await renderInTestApp(<MyComponent />);
    expect(rendered.getByTestId('progress')).toBeInTheDocument();

    rendered.rerender(<MyComponent />);
    expect(rendered.getByTestId('progress')).toBeInTheDocument();
  });
});
