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
import { createApiFactory } from './helpers';
// eslint-disable-next-line @backstage/no-relative-monorepo-imports
import {
  FrontendApiRegistry,
  FrontendApiResolver,
} from '../../../../frontend-app-api/src/wiring/FrontendApiRegistry';

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

  afterEach(() => {
    context.reset();
  });

  it('should return a stable holder that forwards context lookups', () => {
    const holder = { get: jest.fn() };
    context.set({ 1: holder });

    const renderedHook = renderHook(() => useApiHolder());
    const apiHolder = renderedHook.result.current;
    expect(apiHolder).toBe(holder);
    const ref = createApiRef<string>().with({ id: 'x' });
    expect(apiHolder.get(ref)).toBeUndefined();
    expect(holder.get).toHaveBeenCalledWith(ref);
    renderedHook.rerender();
    expect(renderedHook.result.current).toBe(apiHolder);
  });

  it('should preserve native promise identity and invalidation', async () => {
    const ref = createApiRef<{ value: string }>().with({
      id: 'native',
      loading: 'async',
    });
    const registry = new FrontendApiRegistry();
    registry.register(
      createApiFactory({
        api: ref,
        deps: {},
        factory: () => ({ value: 'native instance' }),
      }),
    );
    const resolver = new FrontendApiResolver({ primaryRegistry: registry });
    context.set({ 1: resolver });
    const holder = renderHook(() => useApiHolder()).result.current;
    expect(holder).toBe(resolver);
    const promise = resolver.get(ref);
    expect(holder.get(ref)).toBe(promise);
    await expect(promise).resolves.toEqual({ value: 'native instance' });
    resolver.invalidate([ref.id]);
    const replacement = resolver.get(ref);
    expect(holder.get(ref)).toBe(replacement);
    expect(replacement).not.toBe(promise);
    await expect(replacement).resolves.toEqual({ value: 'native instance' });
  });

  it('should return an empty API holder when there is no context', () => {
    const renderedHook = renderHook(() => useApiHolder());

    const holder = renderedHook.result.current;
    expect(
      holder.get(createApiRef<string>().with({ id: 'x' })),
    ).toBeUndefined();
    expect(
      holder.get(
        createApiRef<string>().with({ id: 'async', loading: 'async' }),
      ),
    ).toBeUndefined();
  });
});

describe('useApi', () => {
  const context = createVersionedContextForTesting('api-context');

  afterEach(() => {
    context.reset();
  });

  it.each(['sync', 'async'] as const)(
    'should consume a %s API using its declared loading mode',
    async loading => {
      const apiRef = createApiRef<{ value: string }>().with({
        id: 'example',
        loading,
      });
      const factory = jest.fn(() => ({ value: 'Loaded API' }));
      const registry = new FrontendApiRegistry();
      registry.register(createApiFactory({ api: apiRef, deps: {}, factory }));
      const resolver = new FrontendApiResolver({ primaryRegistry: registry });
      const get = jest.spyOn(resolver, 'get');
      context.set({ 1: resolver });
      function Consumer() {
        return <div>{useApi(apiRef).value}</div>;
      }
      render(
        <Suspense fallback="Loading">
          <Consumer />
        </Suspense>,
      );
      expect(screen.queryByText('Loaded API') !== null).toBe(
        loading === 'sync',
      );
      expect(screen.queryByText('Loading') !== null).toBe(loading === 'async');
      expect(await screen.findByText('Loaded API')).toBeInTheDocument();
      expect(factory).toHaveBeenCalledTimes(1);
      expect(get).toHaveBeenCalledWith(apiRef);
    },
  );

  it.each([
    ['sync', 'async'],
    ['async', 'sync'],
  ] as const)(
    'should reject a %s ref backed by a %s factory without suspending',
    (consumerMode, factoryMode) => {
      const apiRef = createApiRef<string>().with({
        id: 'changed',
        loading: consumerMode,
      });
      const factoryRef = createApiRef<string>().with({
        id: apiRef.id,
        loading: factoryMode,
      });
      const factory = jest.fn(() => 'implementation');
      const registry = new FrontendApiRegistry();
      registry.register(
        createApiFactory({ api: factoryRef, deps: {}, factory }),
      );
      context.set({
        1: new FrontendApiResolver({ primaryRegistry: registry }),
      });
      function Consumer() {
        return <div>{useApi(apiRef)}</div>;
      }
      withLogCollector(['error'], () => {
        render(
          <TestErrorBoundary>
            <Suspense fallback="Loading">
              <Consumer />
            </Suspense>
          </TestErrorBoundary>,
        );
        expect(screen.getByRole('alert')).toHaveTextContent(
          "Conflicting loading mode for API 'changed'",
        );
        expect(screen.getByRole('alert')).toHaveTextContent(
          'matching versions of the API ref',
        );
        expect(screen.queryByText('Loading')).not.toBeInTheDocument();
        expect(factory).not.toHaveBeenCalled();
      });
    },
  );

  it('should expose async factory failures and stale dependency refs', async () => {
    const oldRef = createApiRef<string>().with({ id: 'migrated' });
    const newRef = createApiRef<string>().with({
      id: 'migrated',
      loading: 'async',
    });
    const factory = jest.fn(() => {
      throw new Error('Failed migrated API');
    });
    const registry = new FrontendApiRegistry();
    registry.register(createApiFactory({ api: newRef, deps: {}, factory }));
    const resolver = new FrontendApiResolver({ primaryRegistry: registry });
    context.set({ 1: resolver });
    function Consumer() {
      return <div>{useApi(newRef)}</div>;
    }
    await withLogCollector(['error'], async () => {
      const rendered = render(
        <TestErrorBoundary>
          <Suspense fallback="Loading">
            <Consumer />
          </Suspense>
        </TestErrorBoundary>,
      );
      expect(await screen.findByRole('alert')).toHaveTextContent(
        'Failed migrated API',
      );
      expect(factory).toHaveBeenCalledTimes(1);
      rendered.unmount();
      const parent = createApiRef<string>().with({ id: 'parent' });
      registry.register(
        createApiFactory({
          api: parent,
          deps: { child: oldRef },
          factory: ({ child }) => child,
        }),
      );
      function ParentConsumer() {
        return <div>{useApi(parent)}</div>;
      }
      const get = jest.spyOn(resolver, 'get');
      render(
        <TestErrorBoundary>
          <Suspense fallback="Loading">
            <ParentConsumer />
          </Suspense>
        </TestErrorBoundary>,
      );
      expect(await screen.findByRole('alert')).toHaveTextContent(
        'Dependency path: parent[child] -> migrated',
      );
      expect(screen.queryByText('Loading')).not.toBeInTheDocument();
      expect(get.mock.calls.every(([ref]) => ref.loading !== 'async')).toBe(
        true,
      );
    });
  });

  it('should suspend shared consumers and reuse settled values across render retries', async () => {
    const apiRef = createApiRef<{ value: string }>().with({
      id: 'async',
      loading: 'async',
    });
    let resolve: (api: { value: string }) => void;
    const promise = new Promise<{ value: string }>(r => {
      resolve = r;
    });
    const get = jest.fn(() => promise);
    context.set({ 1: { get } });
    function Consumer() {
      return <div>{useApi(apiRef).value}</div>;
    }
    const element = (
      <StrictMode>
        <Suspense fallback={<div>Loading API</div>}>
          <Consumer />
          <Consumer />
        </Suspense>
      </StrictMode>
    );
    const rendered = render(element);
    expect(screen.getByText('Loading API')).toBeInTheDocument();
    await act(async () => {
      resolve!({ value: 'Loaded API' });
      await promise;
    });
    expect(await screen.findAllByText('Loaded API')).toHaveLength(2);
    rendered.rerender(element);
    expect(screen.queryByText('Loading API')).not.toBeInTheDocument();
    expect(screen.getAllByText('Loaded API')).toHaveLength(2);
  });

  it('should propagate rejected and missing async APIs to error boundaries', async () => {
    const apiRef = createApiRef<string>().with({
      id: 'async',
      loading: 'async',
    });
    let reject: (error: Error) => void;
    const promise = new Promise<string>((_, r) => {
      reject = r;
    });
    context.set({ 1: { get: () => promise } });
    function Consumer() {
      return <div>{useApi(apiRef)}</div>;
    }
    await withLogCollector(['error'], async () => {
      const rendered = render(
        <TestErrorBoundary>
          <Suspense fallback="Loading">
            <Consumer />
          </Suspense>
        </TestErrorBoundary>,
      );
      await act(async () => {
        reject!(new Error('API chunk failed'));
        await promise.catch(() => {});
      });
      expect(await screen.findByRole('alert')).toHaveTextContent(
        'API chunk failed',
      );
      rendered.unmount();
      context.set({ 1: { get: () => undefined } });
      render(
        <TestErrorBoundary>
          <Suspense fallback="Loading">
            <Consumer />
          </Suspense>
        </TestErrorBoundary>,
      );
      expect(screen.queryByText('Loading')).not.toBeInTheDocument();
      expect(screen.getByRole('alert')).toHaveTextContent(
        'No implementation available',
      );
    });
  });

  it('should accept falsy synchronous API implementations', () => {
    context.set({ 1: { get: () => false } });
    const apiRef = createApiRef<boolean>().with({ id: 'false' });
    expect(renderHook(() => useApi(apiRef)).result.current).toBe(false);
  });

  it('should resolve routes', () => {
    const get = jest.fn(() => 'my-api-impl');
    context.set({ 1: { get } });

    const apiRef = createApiRef<string>().with({ id: 'x' });
    const renderedHook = renderHook(() => useApi(apiRef));

    const value = renderedHook.result.current;
    expect(value).toBe('my-api-impl');
    expect(get).toHaveBeenCalledWith(apiRef);
  });
});
