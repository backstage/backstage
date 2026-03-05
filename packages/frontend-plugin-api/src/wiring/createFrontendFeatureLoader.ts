/*
 * Copyright 2025 The Backstage Authors
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

import { ConfigApi } from '../apis/definitions';
import { describeParentCallSite } from '../routing/describeParentCallSite';
import { FrontendFeature } from './types';

/** @public */
export interface CreateFrontendFeatureLoaderOptions {
  loader(deps: {
    config: ConfigApi;
  }):
    | Iterable<
        | FrontendFeature
        | FrontendFeatureLoader
        | Promise<{ default: FrontendFeature | FrontendFeatureLoader }>
      >
    | Promise<
        Iterable<
          | FrontendFeature
          | FrontendFeatureLoader
          | Promise<{ default: FrontendFeature | FrontendFeatureLoader }>
        >
      >
    | AsyncIterable<
        | FrontendFeature
        | FrontendFeatureLoader
        | { default: FrontendFeature | FrontendFeatureLoader }
      >;
}

/** @public */
export interface FrontendFeatureLoader {
  readonly $$type: '@backstage/FrontendFeatureLoader';
}

/** @internal */
export interface InternalFrontendFeatureLoader extends FrontendFeatureLoader {
  readonly version: 'v1';
  readonly description: string;
  readonly loader: (deps: {
    config: ConfigApi;
  }) => Promise<(FrontendFeature | FrontendFeatureLoader)[]>;
}

/** @public */
export function createFrontendFeatureLoader(
  options: CreateFrontendFeatureLoaderOptions,
): FrontendFeatureLoader {
  const description = `created at '${describeParentCallSite()}'`;
  return {
    $$type: '@backstage/FrontendFeatureLoader',
    version: 'v1',
    description,
    toString() {
      return `FeatureLoader{description=${description}}`;
    },
    async loader(deps: {
      config: ConfigApi;
    }): Promise<(FrontendFeature | FrontendFeatureLoader)[]> {
      const it = await options.loader(deps);
      const result = new Array<FrontendFeature | FrontendFeatureLoader>();
      for await (const item of it) {
        if (isFeatureOrLoader(item)) {
          result.push(item);
        } else if ('default' in item) {
          result.push(item.default);
        } else {
          throw new Error(`Invalid item "${item}"`);
        }
      }
      return result;
    },
  } as InternalFrontendFeatureLoader;
}

/** @internal */
export function isInternalFrontendFeatureLoader(opaque: {
  $$type: string;
}): opaque is InternalFrontendFeatureLoader {
  if (opaque.$$type === '@backstage/FrontendFeatureLoader') {
    // Make sure we throw if invalid
    toInternalFrontendFeatureLoader(opaque as FrontendFeatureLoader);
    return true;
  }
  return false;
}

/** @internal */
export function toInternalFrontendFeatureLoader(
  plugin: FrontendFeatureLoader,
): InternalFrontendFeatureLoader {
  const internal = plugin as InternalFrontendFeatureLoader;
  if (internal.$$type !== '@backstage/FrontendFeatureLoader') {
    throw new Error(`Invalid plugin instance, bad type '${internal.$$type}'`);
  }
  if (internal.version !== 'v1') {
    throw new Error(
      `Invalid plugin instance, bad version '${internal.version}'`,
    );
  }
  return internal;
}

function isFeatureOrLoader(
  obj: unknown,
): obj is FrontendFeature | FrontendFeatureLoader {
  if (obj !== null && typeof obj === 'object' && '$$type' in obj) {
    return (
      obj.$$type === '@backstage/FrontendPlugin' ||
      obj.$$type === '@backstage/FrontendModule' ||
      obj.$$type === '@backstage/FrontendFeatureLoader'
    );
  }
  return false;
}
