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
  createApiRef,
  useApi,
  useApiHolder,
} from '@backstage/frontend-plugin-api';
import { StrictMode, Suspense } from 'react';
import { TestApiProvider, resolveTestApiEntries } from './TestApiProvider';
import { createApiMock } from './createApiMock';
import { mockApis } from './mockApis';
import { render, screen } from '@testing-library/react';

const xApiRef = createApiRef<{ a: string; b: number }>({
  id: 'x',
});
const yApiRef = createApiRef<string>({
  id: 'y',
});

describe('TestApiProvider', () => {
  it('should read inline async mocks synchronously under an outer Suspense boundary', () => {
    for (const implementation of [{ value: 'Mock API' }, 'Mock API']) {
      const apiRef = createApiRef<typeof implementation>().with({
        id: 'async',
        loading: 'async',
      });
      const promises: unknown[] = [];
      const Consumer = () => {
        promises.push(useApiHolder().get(apiRef));
        const api = useApi(apiRef);
        return <div>{typeof api === 'string' ? api : api.value}</div>;
      };
      const Provider = () => {
        return (
          <TestApiProvider
            apis={[
              [
                apiRef,
                typeof implementation === 'string'
                  ? implementation
                  : { ...implementation },
              ],
            ]}
          >
            <Consumer />
          </TestApiProvider>
        );
      };
      const rendered = render(
        <StrictMode>
          <Suspense fallback="Loading API">
            <Provider />
          </Suspense>
        </StrictMode>,
      );
      expect(screen.getByText('Mock API')).toBeInTheDocument();
      expect(screen.queryByText('Loading API')).not.toBeInTheDocument();
      expect(promises.every(promise => promise instanceof Promise)).toBe(true);
      expect(new Set(promises).size).toBe(1);
      rendered.unmount();
    }
  });

  it('should fall back to parent async APIs and keep lookup promises stable', async () => {
    const apiRef = createApiRef<{ value: string }>().with({
      id: 'async',
      loading: 'async',
    });
    expect(resolveTestApiEntries([]).get(apiRef)).toBeUndefined();
    const promises: (Promise<{ value: string }> | undefined)[] = [];
    function Consumer() {
      const apis = useApiHolder();
      promises.push(apis.get(apiRef));
      return <div>{useApi(apiRef).value}</div>;
    }
    const rendered = render(
      <TestApiProvider apis={[[apiRef, { value: 'Parent API' }]]}>
        <TestApiProvider apis={[]}>
          <Suspense fallback="Loading API">
            <Consumer />
          </Suspense>
        </TestApiProvider>
      </TestApiProvider>,
    );
    expect(await screen.findByText('Parent API')).toBeInTheDocument();
    expect(promises).not.toContain(undefined);
    expect(new Set(promises).size).toBe(1);

    rendered.rerender(
      <TestApiProvider apis={[[apiRef, { value: 'Parent API' }]]}>
        <TestApiProvider apis={[[apiRef, { value: 'Child API' }]]}>
          <Suspense fallback="Loading API">
            <Consumer />
          </Suspense>
        </TestApiProvider>
      </TestApiProvider>,
    );
    expect(await screen.findByText('Child API')).toBeInTheDocument();

    const mock = createApiMock(apiRef, () => ({ value: 'Mock API' }))();
    rendered.rerender(
      <TestApiProvider apis={[mock]}>
        <Suspense fallback="Loading API">
          <Consumer />
        </Suspense>
      </TestApiProvider>,
    );
    expect(await screen.findByText('Mock API')).toBeInTheDocument();
  });

  it('should provide tuple APIs and check types', () => {
    render(
      <TestApiProvider
        apis={[
          [xApiRef, { a: 'a', b: 3 }],
          [yApiRef, 'y'],
        ]}
      >
        <div />
      </TestApiProvider>,
    );

    expect(document.body).toBeInTheDocument();
  });

  it('should allow partial API implementations', () => {
    render(
      <TestApiProvider apis={[[xApiRef, { a: 'a' }]]}>
        <div />
      </TestApiProvider>,
    );

    expect(document.body).toBeInTheDocument();
  });

  it('should reject mismatched types in tuple syntax', () => {
    render(
      // @ts-expect-error - a should be a string, not a number
      <TestApiProvider apis={[[xApiRef, { a: 3 }]]}>
        <div />
      </TestApiProvider>,
    );

    expect(document.body).toBeInTheDocument();
  });

  it('should accept MockWithApiFactory entries', () => {
    render(
      <TestApiProvider apis={[mockApis.alert()]}>
        <div />
      </TestApiProvider>,
    );

    expect(document.body).toBeInTheDocument();
  });

  it('should accept a mix of tuples and MockWithApiFactory entries', () => {
    render(
      <TestApiProvider apis={[[xApiRef, { a: 'a' }], mockApis.alert()]}>
        <div />
      </TestApiProvider>,
    );

    expect(document.body).toBeInTheDocument();
  });

  it('should allow empty APIs', () => {
    render(
      <TestApiProvider apis={[]}>
        <div />
      </TestApiProvider>,
    );

    expect(document.body).toBeInTheDocument();
  });

  it('should provide APIs at runtime', async () => {
    const alertApi = mockApis.alert();

    render(
      <TestApiProvider apis={[[xApiRef, { a: 'hello', b: 42 }], alertApi]}>
        <span>rendered</span>
      </TestApiProvider>,
    );

    expect(await screen.findByText('rendered')).toBeInTheDocument();
  });
});
