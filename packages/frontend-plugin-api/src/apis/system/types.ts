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

/**
 * API reference. Set `loading: 'async'` when creating a ref to allow asynchronous
 * factories and dependencies. Ref types and creation default to synchronous loading.
 * Async refs require their loading marker; synchronous and older refs may omit it.
 *
 * @public
 */
export type ApiRef<
  T,
  TId extends string = string,
  TLoading extends 'sync' | 'async' = 'sync',
> = {
  readonly $$type?: '@backstage/ApiRef';
  readonly id: TId;
  readonly T: T;
  /** How implementations are loaded. Defaults to synchronous loading. */
  readonly loading?: TLoading;
} & ('sync' extends NoInfer<TLoading>
  ? {}
  : { readonly loading: NoInfer<TLoading> });

/**
 * Catch-all {@link ApiRef} type.
 *
 * @public
 */
export type AnyApiRef<T = unknown> = ApiRef<T, string, 'sync' | 'async'>;

/**
 * Result of looking up an API through an {@link ApiHolder}.
 *
 * Refs without a loading member are synchronous. Refs that retain their loading
 * mode preserve the corresponding result type, including through generic helpers.
 *
 * @public
 */
export type ApiLookupResult<TApiRef extends AnyApiRef = AnyApiRef> =
  | (TApiRef extends { readonly loading?: infer TLoading }
      ? 'async' extends TLoading
        ? 'sync' extends TLoading
          ? TApiRef['T'] | Promise<TApiRef['T']>
          : Promise<TApiRef['T']>
        : TApiRef['T']
      : TApiRef['T'])
  | undefined;

/**
 * Wraps a type with API properties into a type holding their respective {@link ApiRef}s.
 *
 * @public
 */
export type TypesToApiRefs<
  T,
  TLoading extends 'sync' | 'async' = 'sync' | 'async',
> = {
  [key in keyof T]: ApiRef<T[key], string, TLoading>;
};

/**
 * Provides lookup of APIs through their {@link ApiRef}s.
 *
 * @remarks
 *
 * Missing APIs return `undefined` immediately. Present async-capable APIs return
 * a promise, even for synchronous implementations. Holders must return the same
 * promise for repeated lookups so `useApi` can resume after suspension.
 *
 * @public
 */
export type ApiHolder = {
  get<TApi = unknown, TApiRef extends AnyApiRef = ApiRef<TApi>>(
    api: TApiRef,
  ): ApiLookupResult<TApiRef>;
};

/**
 * Describes a factory returning API implementations.
 *
 * Async-capable refs allow promises and async dependencies. All dependencies
 * are resolved before the factory is called. Synchronous refs only allow
 * synchronous factories and dependencies. Factory types default to synchronous
 * loading; use {@link AnyApiFactory} to accept both modes.
 *
 * @public
 */
export type ApiFactory<
  Api,
  Impl extends Api,
  Deps extends { [name in string]: unknown },
  TLoading extends 'sync' | 'async' = 'sync',
> = {
  api: ApiRef<Api, string, TLoading>;
  deps: TypesToApiRefs<
    Deps,
    NoInfer<TLoading> extends 'sync' ? 'sync' : 'sync' | 'async'
  >;
  factory(
    deps: Deps,
  ): NoInfer<TLoading> extends 'sync' ? Impl : Impl | Promise<Impl>;
};

/**
 * Catch-all {@link ApiFactory} type.
 *
 * @public
 */
export type AnyApiFactory = ApiFactory<
  unknown,
  unknown,
  { [key in string]: unknown },
  'sync' | 'async'
>;
