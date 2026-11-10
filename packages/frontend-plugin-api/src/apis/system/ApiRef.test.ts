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

import { createApiRef } from './ApiRef';
import type {
  AnyApiRef,
  ApiHolder,
  ApiLookupResult,
  ApiRef as ApiRefType,
} from './types';
import { createApiFactory } from './helpers';

describe('ApiRef', () => {
  it('should preserve async capability in refs, factories, and lookups', async () => {
    const sync = createApiRef<{ value: string }>().with({ id: 'sync' });
    const asyncRef = createApiRef<{ value: string }>().with({
      id: 'async',
      loading: 'async',
    });
    const typedRef: ApiRefType<{ value: string }, 'async', 'async'> = asyncRef;
    expect(typedRef.loading).toBe('async');
    expect(sync.loading).toBeUndefined();
    const defaultSync: ApiRefType<{ value: string }> = sync;
    const broadSync: AnyApiRef<{ value: string }> = sync;
    const broadAsync: AnyApiRef<{ value: string }> = asyncRef;
    const broadLiteral: ApiRefType<
      { value: string },
      'async',
      'sync' | 'async'
    > = asyncRef;
    expect(defaultSync).toBe(sync);
    expect(broadSync).toBe(sync);
    expect(broadLiteral).toBe(asyncRef);
    // @ts-expect-error Widening loading mode must preserve the API's type.
    const wrongApi: AnyApiRef<{ value: number }> = asyncRef;
    expect(wrongApi).toBe(asyncRef);
    // @ts-expect-error Async capability cannot be erased into a synchronous ref.
    const syncRef: ApiRefType<{ value: string }> = asyncRef;
    expect(syncRef).toBe(asyncRef);

    const factory = createApiFactory({
      api: asyncRef,
      deps: { sync },
      factory: async ({ sync: dependency }) => ({ value: dependency.value }),
    });
    await expect(factory.factory({ sync: { value: 'lazy' } })).resolves.toEqual(
      {
        value: 'lazy',
      },
    );
    createApiFactory({
      api: sync,
      deps: {},
      // @ts-expect-error Only opted-in refs support asynchronous factories.
      factory: async () => ({ value: 'invalid' }),
    });
    createApiFactory({
      api: sync,
      // @ts-expect-error Synchronous APIs cannot depend on async-capable APIs.
      deps: { dependency: asyncRef },
      factory: () => ({ value: 'invalid' }),
    });

    const promise = Promise.resolve({ value: 'loaded' });
    const holder: ApiHolder = {
      get: ((ref: AnyApiRef) =>
        ref.loading === 'async'
          ? promise
          : { value: 'sync' }) as ApiHolder['get'],
    };

    function lookup<TApiRef extends AnyApiRef>(ref: TApiRef) {
      return holder.get(ref);
    }

    function lookupSync<TApi, TId extends string>(
      ref: ApiRefType<TApi, TId>,
    ): TApi | undefined {
      return holder.get(ref);
    }

    const previousRef: Pick<
      ApiRefType<{ value: string }>,
      '$$type' | 'id' | 'T'
    > = sync;
    const previous: { value: string } | undefined = lookup(previousRef);
    const explicit: { value: string } | undefined = holder.get<{
      value: string;
    }>(sync);
    const legacy: { value: string } | undefined = lookup(
      createApiRef<{ value: string }>({ id: 'legacy' }),
    );
    const synchronous: { value: string } | undefined = lookup(sync);
    const genericSynchronous: { value: string } | undefined = lookupSync(sync);
    const annotated: { value: string } | undefined = lookup(defaultSync);
    const asynchronous: Promise<{ value: string }> | undefined =
      lookup(asyncRef);
    const broadResult:
      | { value: string }
      | Promise<{ value: string }>
      | undefined = lookup(broadAsync);
    // @ts-expect-error An unspecified mode cannot promise synchronous lookup.
    const invalidSync: { value: string } | undefined = lookup(broadAsync);
    // @ts-expect-error An unspecified mode cannot promise asynchronous lookup either.
    const invalidAsync: Promise<{ value: string }> | undefined =
      lookup(broadSync);
    const missing: ApiLookupResult<typeof asyncRef> = undefined;
    // @ts-expect-error Missing APIs must not be represented by a promise.
    const invalidMissing: ApiLookupResult<typeof asyncRef> =
      Promise.resolve(undefined);
    expect(missing).toBeUndefined();
    await expect(invalidMissing).resolves.toBeUndefined();
    expect(broadResult).toBe(promise);
    expect(invalidSync).toBe(promise);
    expect(invalidAsync).toEqual({ value: 'sync' });
    expect(previous?.value).toBe('sync');
    expect(explicit?.value).toBe('sync');
    expect(legacy?.value).toBe('sync');
    expect(annotated?.value).toBe('sync');
    // @ts-expect-error Explicit API arguments still check the implementation type.
    const invalidExplicit = holder.get<number>(sync);
    expect(invalidExplicit).toEqual({ value: 'sync' });
    // @ts-expect-error A present async API is returned as a promise.
    const incorrect: { value: string } | undefined = lookup(asyncRef);
    expect(incorrect).toBe(promise);
    expect(synchronous?.value).toBe('sync');
    expect(genericSynchronous?.value).toBe('sync');
    await expect(asynchronous).resolves.toEqual({ value: 'loaded' });
  });

  it('should preserve IDs and loading modes through generic refs', () => {
    type Api = { value: string };
    const ref = createApiRef<Api>().with({ id: 'legacy-id' });
    const legacy: ApiRefType<Api, 'legacy-id'> = ref;
    const explicit: ApiRefType<Api, 'legacy-id', 'sync'> = legacy;
    const roundTrip: ApiRefType<Api, 'legacy-id'> = explicit;
    const defaultRef: ApiRefType<Api> = roundTrip;

    function widenId<TId extends string>(
      api: ApiRefType<Api, TId>,
    ): ApiRefType<Api, string, 'sync'> {
      return api;
    }
    function forwardRef<TId extends string, TLoading extends 'sync' | 'async'>(
      api: ApiRefType<Api, TId, TLoading>,
    ) {
      return api;
    }

    const asyncRef = createApiRef<Api>().with({
      id: 'async',
      loading: 'async',
    });
    const forwarded: ApiRefType<Api, 'async', 'async'> = forwardRef(asyncRef);
    const unspecified: AnyApiRef<Api> = asyncRef;
    expect(widenId(legacy)).toBe(ref);
    expect(defaultRef).toBe(ref);
    expect(forwarded).toBe(asyncRef);
    expect(unspecified).toBe(asyncRef);
    // @ts-expect-error Omitting the loading parameter requires a synchronous ref.
    const invalidLegacy: ApiRefType<Api, 'async'> = asyncRef;
    expect(invalidLegacy).toBe(asyncRef);
    // @ts-expect-error Invalid loading modes are rejected.
    const invalidMode: ApiRefType<Api, string, 'lazy'> = ref;
    expect(invalidMode).toBe(ref);
  });

  it('should be created with config', () => {
    const ref = createApiRef({ id: 'abc' });
    expect(ref.$$type).toBe('@backstage/ApiRef');
    expect(ref.id).toBe('abc');
    expect(String(ref)).toBe('apiRef{abc}');
    expect(ref.T).toBeNull();
  });

  it('should not accept pluginId with deprecated config form', () => {
    expect(createApiRef<string>({ id: 'abc' }).id).toBe('abc');

    // @ts-expect-error pluginId is only supported through .with(...)
    createApiRef<string>({ id: 'abc', pluginId: 'test' });
  });

  it('should keep the deprecated config form id wide', () => {
    const ref = createApiRef<string>({ id: 'abc' });
    const wideRef: ApiRefType<string> = ref;
    expect(wideRef.id).toBe('abc');

    // @ts-expect-error deprecated config form should not infer literal ids
    const literalRef: ApiRefType<string, 'abc'> = ref;
    expect(literalRef.id).toBe('abc');
  });

  it('should be created with builder pattern', () => {
    const ref = createApiRef<string>().with({ id: 'abc', pluginId: 'test' });
    expect(ref.$$type).toBe('@backstage/ApiRef');
    expect(ref.id).toBe('abc');
    expect(String(ref)).toBe('apiRef{abc}');
    expect(ref.T).toBeNull();
    expect((ref as { pluginId?: string }).pluginId).toBe('test');

    // @ts-expect-error pluginId is internal runtime metadata
    expect(ref.pluginId).toBe('test');
  });

  it('should infer literal ids with builder pattern', () => {
    const ref = createApiRef<string>().with({ id: 'abc', pluginId: 'test' });
    const literalRef: ApiRefType<string, 'abc'> = ref;
    expect(literalRef.id).toBe('abc');

    // @ts-expect-error builder pattern should preserve literal ids
    const wrongLiteralRef: ApiRefType<string, 'def'> = ref;
    expect(wrongLiteralRef.id).toBe('abc');
  });

  it('should reject invalid ids', () => {
    for (const id of ['a', 'abc', 'ab-c', 'a.b.c', 'a-b.c', 'abc.a-b-c.abc3']) {
      expect(createApiRef({ id }).id).toBe(id);
    }

    for (const id of [
      '123',
      'ab-3',
      'ab_c',
      '.',
      '2ac',
      'ab.3a',
      '.abc',
      'abc.',
      'ab..s',
      '',
      '_',
    ]) {
      expect(() => createApiRef({ id }).id).toThrow(
        `API id must only contain period separated lowercase alphanum tokens with dashes, got '${id}'`,
      );
    }
  });

  it('should reject invalid ids with builder pattern', () => {
    expect(() => createApiRef().with({ id: '123' })).toThrow(
      `API id must only contain period separated lowercase alphanum tokens with dashes, got '123'`,
    );
  });
});
