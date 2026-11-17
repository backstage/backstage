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
 * API reference. Defaults to a reference to any API when no type argument is provided.
 *
 * @public
 */
export type ApiRef<T = unknown, TId extends string = string> = {
  readonly $$type?: '@backstage/ApiRef';
  readonly id: TId;
  readonly T: T;
};

/**
 * Catch-all {@link ApiRef} type.
 *
 * @deprecated Use {@link ApiRef} without type arguments instead.
 *
 * @public
 */
export type AnyApiRef = ApiRef<unknown>;

/**
 * Wraps a type with API properties into a type holding their respective {@link ApiRef}s.
 *
 * @public
 */
export type TypesToApiRefs<T> = { [key in keyof T]: ApiRef<T[key]> };

/**
 * Provides lookup of APIs through their {@link ApiRef}s.
 *
 * @public
 */
export type ApiHolder = {
  get<T>(api: ApiRef<T>): T | undefined;
};

/**
 * Describes type returning API implementations.
 *
 * @remarks
 *
 * Without type arguments, accepts factories for any API and dependencies.
 * When only the API type is provided, the implementation defaults to that API type.
 *
 * @public
 */
export type ApiFactory<
  Api = unknown,
  Impl extends Api = Api,
  Deps extends { [name in string]: unknown } = { [name in string]: unknown },
> = {
  api: ApiRef<Api>;
  deps: TypesToApiRefs<Deps>;
  factory(deps: Deps): Impl;
};

/**
 * Catch-all {@link ApiFactory} type.
 *
 * @deprecated Use {@link ApiFactory} without type arguments instead.
 *
 * @public
 */
export type AnyApiFactory = ApiFactory<
  unknown,
  unknown,
  { [key in string]: unknown }
>;
