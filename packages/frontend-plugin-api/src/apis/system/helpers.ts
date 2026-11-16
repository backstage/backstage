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

import { ApiRef, ApiFactory, TypesToApiRefs } from './types';

/**
 * Used to infer types for a standalone {@link ApiFactory} that isn't immediately passed
 * to another function.
 *
 * @remarks
 *
 * This function doesn't actually do anything, it's only used to infer types.
 *
 * @public
 */
export function createApiFactory<
  Api,
  Impl extends Api,
  Deps extends { [name in string]: unknown },
  TLoading extends 'sync' | 'async' = 'sync',
>(
  factory: ApiFactory<Api, Impl, Deps, TLoading>,
): ApiFactory<Api, Impl, Deps, TLoading>;
/**
 * Used to infer types for a standalone {@link ApiFactory} that isn't immediately passed
 * to another function.
 *
 * @param api - Ref of the API that will be produced by the factory.
 * @param instance - Implementation of the API to use.
 * @public
 */
export function createApiFactory<
  Api,
  Impl extends Api,
  TLoading extends 'sync' | 'async' = 'sync',
>(
  api: ApiRef<Api, string, TLoading>,
  instance: Impl,
): ApiFactory<Api, Impl, {}, TLoading>;
/**
 * Used to infer types for a standalone {@link ApiFactory} that isn't immediately passed
 * to another function.
 *
 * @remarks
 *
 * Creates factory from {@link ApiRef} or returns the factory itself if provided.
 *
 * @param factory - Existing factory or {@link ApiRef}.
 * @param instance - The instance to be returned by the factory.
 * @public
 */
export function createApiFactory<
  Api,
  Impl extends Api,
  Deps extends { [name in string]: unknown },
  TLoading extends 'sync' | 'async' = 'sync',
>(
  factory:
    | ApiFactory<Api, Impl, Deps, TLoading>
    | ApiRef<Api, string, TLoading>,
  instance?: Impl,
): ApiFactory<Api, Impl, Deps, TLoading> {
  if ('id' in factory) {
    return {
      api: factory,
      deps: {} as TypesToApiRefs<
        Deps,
        NoInfer<TLoading> extends 'sync' ? 'sync' : 'sync' | 'async'
      >,
      factory: (() => instance!) as ApiFactory<
        Api,
        Impl,
        Deps,
        TLoading
      >['factory'],
    };
  }
  return factory;
}
