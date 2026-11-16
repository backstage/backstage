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

import { createApiRef } from './ApiRef';
import { createApiFactory } from './helpers';
import { AnyApiFactory, AnyApiRef, ApiFactory, ApiRef } from './types';

describe('utility API type defaults', () => {
  it('should preserve broad API references and explicit API and ID types', () => {
    const ref = createApiRef<string>().with({ id: 'test.string' });
    const broad: ApiRef = ref;
    const legacy: AnyApiRef = broad;
    const compatible: ApiRef<unknown, string, 'sync' | 'async'> = legacy;
    expect(compatible).toBe(ref);

    const asyncRef = createApiRef<string>().with({
      id: 'test.async',
      loading: 'async',
    });
    const legacyAsync: AnyApiRef = asyncRef;
    expect(legacyAsync).toBe(asyncRef);
    // @ts-expect-error The default loading mode remains synchronous.
    const syncOnly: ApiRef = asyncRef;
    expect(syncOnly).toBe(asyncRef);

    // @ts-expect-error The broad API type is unknown, not any.
    const value: string = broad.T;
    expect(value).toBeNull();

    // @ts-expect-error Explicit API types must still be checked.
    const wrongApi: ApiRef<number> = ref;
    expect(wrongApi).toBe(ref);

    // @ts-expect-error Explicit reference IDs must still be checked.
    const wrongId: ApiRef<string, 'test.other'> = ref;
    expect(wrongId).toBe(ref);
  });

  it('should accept typed factories without losing inference or constraints', async () => {
    const api = createApiRef<{ value: string }>().with({ id: 'test.value' });
    const dependency = createApiRef<number>().with({ id: 'test.number' });
    const factory = createApiFactory({
      api,
      deps: { number: dependency },
      factory: ({ number }) => ({ value: number.toFixed(), extra: true }),
    });
    const typed: ApiFactory<
      { value: string },
      { value: string; extra: boolean },
      { number: number }
    > = factory;
    expect(typed.factory({ number: 1 })).toEqual({ value: '1', extra: true });
    expect(factory.factory({ number: 2 }).extra).toBe(true);

    const broad: ApiFactory = factory;
    const legacy: AnyApiFactory = broad;
    const compatible: ApiFactory<
      unknown,
      unknown,
      { [name: string]: unknown },
      'sync' | 'async'
    > = legacy;
    expect(compatible).toBe(factory);
    const broadDependency: ApiRef = broad.deps.number;
    expect(broadDependency).toBe(dependency);

    // @ts-expect-error The broad implementation type is unknown, not any.
    const result: { value: string } = broad.factory({ number: 3 });
    expect(result).toEqual({ value: '3', extra: true });

    const wrongDeps: Parameters<typeof factory.factory>[0] = {
      // @ts-expect-error Inferred dependencies retain their API types.
      number: 'wrong',
    };
    expect(wrongDeps.number).toBe('wrong');

    const partial: ApiFactory<{ value: string }> = factory;
    expect(partial.factory({ number: 4 }).value).toBe('4');
    const instance = createApiFactory(api, { value: 'instance', extra: true });
    const noDeps: ApiFactory = instance;
    expect(noDeps.factory({})).toEqual({ value: 'instance', extra: true });
    expect(instance.factory({}).extra).toBe(true);

    const wrongImpl: ApiFactory<{ value: string }> = {
      api,
      deps: {},
      // @ts-expect-error The default implementation must implement the explicit API.
      factory: () => 1,
    };
    expect(wrongImpl.api).toBe(api);

    const asyncRef = createApiRef<{ value: string }>().with({
      id: 'test.async',
      loading: 'async',
    });
    const asyncFactory = createApiFactory({
      api: asyncRef,
      deps: {},
      factory: async () => ({ value: 'async' }),
    });
    const legacyAsync: AnyApiFactory = asyncFactory;
    await expect(legacyAsync.factory({})).resolves.toEqual({ value: 'async' });
    // @ts-expect-error Factory defaults remain synchronous.
    const syncOnly: ApiFactory = asyncFactory;
    expect(syncOnly).toBe(asyncFactory);
  });
});
