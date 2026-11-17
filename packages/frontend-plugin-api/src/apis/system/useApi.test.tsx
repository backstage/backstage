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

import { act, render, renderHook, screen } from '@testing-library/react';
import { Component, PropsWithChildren, StrictMode, Suspense } from 'react';
import { withLogCollector } from '@backstage/test-utils';
import { createVersionedContextForTesting } from '@backstage/version-bridge';
import { createApiRef } from './ApiRef';
import { useApi, useApiHolder } from './useApi';

class TestErrorBoundary extends Component<
  PropsWithChildren,
  { error?: Error }
> {
  static getDerivedStateFromError(error: Error) {
    return { error };
  }

  state: { error?: Error } = {};

  render() {
    return this.state.error ? (
      <div role="alert">{this.state.error.message}</div>
    ) : (
      this.props.children
    );
  }
}

describe('useApiHolder', () => {
  const context = createVersionedContextForTesting('api-context');

  afterEach(() => context.reset());

  it('should forward context lookups without unwrapping promise values', () => {
    const promise = Promise.resolve({ value: 'API' });
    const holder = { get: jest.fn(() => promise) };
    context.set({ 1: holder });
    const ref = createApiRef<Promise<{ value: string }>>().with({
      id: 'test.api',
    });
    const rendered = renderHook(() => useApiHolder());
    expect(rendered.result.current).toBe(holder);
    const value: Promise<{ value: string }> | undefined =
      rendered.result.current.get(ref);
    expect(value).toBe(promise);
    expect(holder.get).toHaveBeenCalledWith(ref);
    rendered.rerender();
    expect(rendered.result.current).toBe(holder);
  });

  it('should return an empty holder when there is no context', () => {
    const holder = renderHook(() => useApiHolder()).result.current;
    expect(
      holder.get(createApiRef<string>().with({ id: 'test.api' })),
    ).toBeUndefined();
  });
});

describe('useApi', () => {
  const context = createVersionedContextForTesting('api-context');

  afterEach(() => context.reset());

  it('should return synchronous API values immediately, including falsy values', () => {
    for (const value of ['API', false, 0, '', null]) {
      const get = jest.fn(() => value);
      context.set({ 1: { get } });
      const ref = createApiRef<typeof value>().with({ id: 'test.api' });
      const rendered = renderHook(() => useApi(ref));
      expect(rendered.result.current).toBe(value);
      expect(get).toHaveBeenCalledWith(ref);
      rendered.unmount();
    }
  });

  it('should suspend shared consumers and reuse settled values across retries', async () => {
    const ref = createApiRef<Promise<{ value: string }>>().with({
      id: 'test.api',
    });
    let resolve!: (api: { value: string }) => void;
    const promise = new Promise<{ value: string }>(r => {
      resolve = r;
    });
    const get = jest.fn(() => promise);
    context.set({ 1: { get } });
    function Consumer() {
      const api: { value: string } = useApi(ref);
      return <div>{api.value}</div>;
    }
    const element = (
      <StrictMode>
        <Suspense fallback="Loading API">
          <Consumer />
          <Consumer />
        </Suspense>
      </StrictMode>
    );
    const rendered = render(element);
    expect(screen.getByText('Loading API')).toBeInTheDocument();
    await act(async () => {
      resolve({ value: 'Loaded API' });
      await promise;
    });
    expect(await screen.findAllByText('Loaded API')).toHaveLength(2);
    rendered.rerender(element);
    expect(screen.queryByText('Loading API')).not.toBeInTheDocument();
    expect(screen.getAllByText('Loaded API')).toHaveLength(2);
    expect(get).toHaveBeenCalledWith(ref);
  });

  it('should normalize thenables once and recursively unwrap their values', async () => {
    let calls = 0;
    const thenable = {
      then(resolve: (value: Promise<{ value: string }>) => void) {
        calls++;
        resolve(Promise.resolve({ value: 'Thenable API' }));
      },
    };
    const ref = createApiRef<typeof thenable>().with({ id: 'test.thenable' });
    context.set({ 1: { get: () => thenable } });
    function Consumer() {
      const api: { value: string } = useApi(ref);
      return <div>{api.value}</div>;
    }
    render(
      <Suspense fallback="Loading API">
        <Consumer />
        <Consumer />
      </Suspense>,
    );
    expect(await screen.findAllByText('Thenable API')).toHaveLength(2);
    expect(calls).toBe(1);
  });

  it('should preserve fulfilled values, including undefined and other falsy values', async () => {
    for (const value of [undefined, null, false, 0, '']) {
      const ref = createApiRef<Promise<typeof value>>().with({
        id: 'test.value',
      });
      const promise = Promise.resolve(value);
      context.set({ 1: { get: () => promise } });
      const Consumer = () => {
        const api = useApi(ref);
        return (
          <div>
            {typeof api}:{String(api)}
          </div>
        );
      };
      const rendered = render(
        <Suspense fallback="Loading API">
          <Consumer />
        </Suspense>,
      );
      expect(
        await screen.findByText(`${typeof value}:${String(value)}`),
      ).toBeInTheDocument();
      rendered.unmount();
    }
  });

  it('should propagate rejections and report missing APIs without suspending', async () => {
    const ref = createApiRef<Promise<string>>().with({ id: 'test.api' });
    let reject!: (error: Error) => void;
    const promise = new Promise<string>((_, r) => {
      reject = r;
    });
    context.set({ 1: { get: () => promise } });
    function Consumer() {
      return <div>{useApi(ref)}</div>;
    }
    await withLogCollector(['error'], async () => {
      const rendered = render(
        <TestErrorBoundary>
          <Suspense fallback="Loading API">
            <Consumer />
          </Suspense>
        </TestErrorBoundary>,
      );
      expect(screen.getByText('Loading API')).toBeInTheDocument();
      await act(async () => {
        reject(new Error('API initialization failed'));
        await promise.catch(() => {});
      });
      expect(await screen.findByRole('alert')).toHaveTextContent(
        'API initialization failed',
      );
      rendered.unmount();
      context.set({ 1: { get: () => undefined } });
      render(
        <TestErrorBoundary>
          <Suspense fallback="Loading API">
            <Consumer />
          </Suspense>
        </TestErrorBoundary>,
      );
      expect(screen.queryByText('Loading API')).not.toBeInTheDocument();
      expect(screen.getByRole('alert')).toHaveTextContent(
        'No implementation available',
      );
    });
  });
});
