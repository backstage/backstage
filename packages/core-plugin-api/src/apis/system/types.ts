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
 * API reference.
 *
 * @public
 */
export type ApiRef<T> = {
  id: string;
  T: T;
};

/**
 * Catch-all {@link ApiRef} type.
 *
 * @public
 */
export type AnyApiRef = ApiRef<unknown>;

/**
 * Transforms ApiRef type into its inner API type.
 *
 * @public
 * @deprecated unused type.
 */
export type ApiRefType<T> = T extends ApiRef<infer U> ? U : never;

/**
 * Wraps a type with API properties into a type holding their respective {@link ApiRef}s.
 * Reverse type transform of {@link ApiRefsToTypes}.
 *
 * @public
 */
export type TypesToApiRefs<T> = { [key in keyof T]: ApiRef<T[key]> };

/**
 * Unwraps type with {@link ApiRef} properties into a type holding their respective API types.
 * Reverse type transform of {@link TypesToApiRefs}.
 *
 * @public
 * @deprecated unused type.
 */
export type ApiRefsToTypes<T extends { [key in string]: ApiRef<unknown> }> = {
  [key in keyof T]: ApiRefType<T[key]>;
};

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
 * @public
 */
export type ApiFactory<
  Api,
  Impl extends Api,
  Deps extends { [name in string]: unknown },
> = {
  api: ApiRef<Api>;
  deps: TypesToApiRefs<Deps>;
  factory(deps: Deps): Impl;
};

/**
 * Catch-all {@link ApiFactory} type.
 *
 * @public
 */
export type AnyApiFactory = ApiFactory<
  unknown,
  unknown,
  { [key in string]: unknown }
>;
