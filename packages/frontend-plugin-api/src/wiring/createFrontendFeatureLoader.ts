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
import { FrontendFeature } from './types';

/** @public */
export interface CreateFrontendFeatureLoaderOptions {
  name: string;
  load(deps: { config: ConfigApi }): Promise<{
    features: FrontendFeature[];
  }>;
}

/** @public */
export interface FrontendFeatureLoader {
  readonly $$type: '@backstage/FrontendFeatureLoader';
  readonly name: string;
}

/** @internal */
export interface InternalFrontendFeatureLoader extends FrontendFeatureLoader {
  readonly version: 'v1';
  readonly load: CreateFrontendFeatureLoaderOptions['load'];
}

/** @public */
export function createFrontendFeatureLoader(
  options: CreateFrontendFeatureLoaderOptions,
): FrontendFeatureLoader {
  const { name, load } = options;

  return {
    $$type: '@backstage/FrontendFeatureLoader',
    version: 'v1',
    toString() {
      return `FeatureLoader{name=${name}}`;
    },
    name,
    load,
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
