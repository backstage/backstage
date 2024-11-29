/*
 * Copyright 2024 The Backstage Authors
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

import { ServiceRef } from '../services';
import { BackendFeature } from '../types';
import { describeParentCallSite } from './describeParentCallSite';
import { InternalBackendFeatureLoader } from './types';

/**
 * @public
 * Options for creating a new backend feature loader.
 */
export interface CreateBackendFeatureLoaderOptions<
  TDeps extends { [name in string]: unknown },
> {
  deps?: {
    [name in keyof TDeps]: ServiceRef<TDeps[name], 'root'>;
  };
  loader(
    deps: TDeps,
  ):
    | Iterable<BackendFeature | Promise<{ default: BackendFeature }>>
    | Promise<Iterable<BackendFeature | Promise<{ default: BackendFeature }>>>
    | AsyncIterable<BackendFeature | { default: BackendFeature }>;
}

/**
 * @public
 * Creates a new backend feature loader.
 */
export function createBackendFeatureLoader<
  TDeps extends { [name in string]: unknown },
>(options: CreateBackendFeatureLoaderOptions<TDeps>): BackendFeature {
  return {
    $$type: '@backstage/BackendFeature',
    version: 'v1',
    featureType: 'loader',
    description: `created at '${describeParentCallSite()}'`,
    deps: options.deps,
    async loader(deps: TDeps) {
      const it = await options.loader(deps);
      const result = new Array<BackendFeature>();
      for await (const item of it) {
        if ('$$type' in item && item.$$type === '@backstage/BackendFeature') {
          result.push(item);
        } else if ('default' in item) {
          result.push(item.default);
        } else {
          throw new Error(`Invalid item "${item}"`);
        }
      }
      return result;
    },
  } as InternalBackendFeatureLoader;
}
