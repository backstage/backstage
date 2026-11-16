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

import type {
  ApiRef as FrontendApiRef,
  ApiFactory as FrontendApiFactory,
} from '@backstage/frontend-plugin-api';

/** API reference for the old frontend system. @public */
export type ApiRef<T, TId extends string = string> = FrontendApiRef<T, TId>;

/** Wraps API types in synchronous references. @public */
export type TypesToApiRefs<T> = { [key in keyof T]: ApiRef<T[key]> };

/** Synchronous API factory for the old frontend system. @public */
export type ApiFactory<
  Api,
  Impl extends Api,
  Deps extends { [name: string]: unknown },
> = FrontendApiFactory<Api, Impl, Deps, 'sync'>;

/** Catch-all API reference for the old frontend system. @public */
export type AnyApiRef = ApiRef<unknown>;

/** Provides synchronous API lookup in the old frontend system. @public */
export type ApiHolder = {
  get<T>(api: ApiRef<T>): T | undefined;
};

/** Catch-all synchronous API factory for the old frontend system. @public */
export type AnyApiFactory = ApiFactory<
  unknown,
  unknown,
  { [key: string]: unknown }
>;
