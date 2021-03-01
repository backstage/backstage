/*
 * Copyright 2020 Spotify AB
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

import React, { useEffect } from 'react';
import { render } from '@testing-library/react';
import { wrapInTestApp, renderInTestApp } from './appWrappers';
import { Route, Routes } from 'react-router';
import { withLogCollector } from '@backstage/test-utils-core';
import {
  useApi,
  useRouteRef,
  errorApiRef,
  ApiProvider,
  ApiRegistry,
  createRouteRef,
} from '@backstage/core-api';
import { MockErrorApi } from './apis';

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

    expect(error).toEqual([
      expect.stringMatching(
        /^Warning: An update to %s inside a test was not wrapped in act\(...\)/,
      ),
    ]);
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
      expect.stringMatching(
        /^Error: Uncaught \[Error: MockErrorApi received unexpected error, Error: NOPE\]/,
      ),
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
      <ApiProvider apis={ApiRegistry.with(errorApiRef, mockErrorApi)}>
        <A />
      </ApiProvider>,
    );

    expect(rendered.getByText('foo')).toBeInTheDocument();
    expect(mockErrorApi.getErrors()).toEqual([{ error: new Error('NOPE') }]);
  });

  it('should allow route refs to be mounted on specific paths', async () => {
    const aRouteRef = createRouteRef({ title: 'A' });
    const bRouteRef = createRouteRef({ title: 'B', params: ['name'] });

    const MyComponent = () => {
      const a = useRouteRef(aRouteRef);
      const b = useRouteRef(bRouteRef);
      return (
        <div>
          <div>Link A: {a()}</div>
          <div>Link B: {b({ name: 'x' })}</div>
        </div>
      );
    };

    const rendered = await renderInTestApp(<MyComponent />, {
      mountedRoutes: {
        '/my-a-path': aRouteRef,
        '/my-b-path/:name': bRouteRef,
      },
    });
    expect(rendered.getByText('Link A: /my-a-path')).toBeInTheDocument();
    expect(rendered.getByText('Link B: /my-b-path/x')).toBeInTheDocument();
  });
});
