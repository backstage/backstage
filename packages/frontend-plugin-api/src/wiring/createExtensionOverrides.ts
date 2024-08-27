/*
 * Copyright 2023 The Backstage Authors
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

import { ExtensionDefinition } from './createExtension';
import {
  Extension,
  resolveExtensionDefinition,
} from './resolveExtensionDefinition';
import { ExtensionOverrides, FeatureFlagConfig } from './types';

/** @public */
export interface ExtensionOverridesOptions {
  extensions: ExtensionDefinition[];
  featureFlags?: FeatureFlagConfig[];
}

/** @internal */
export interface InternalExtensionOverrides extends ExtensionOverrides {
  readonly version: 'v1';
  readonly extensions: Extension<unknown>[];
  readonly featureFlags: FeatureFlagConfig[];
}

/** @public */
export function createExtensionOverrides(
  options: ExtensionOverridesOptions,
): ExtensionOverrides {
  const extensions = options.extensions.map(def =>
    resolveExtensionDefinition(def),
  );
  const featureFlags = options.featureFlags ?? [];
  return {
    $$type: '@backstage/ExtensionOverrides',
    version: 'v1',
    extensions,
    featureFlags,
    toString() {
      const ex = extensions.map(String).join(',');
      const ff = featureFlags.map(f => f.name).join(',');
      return `ExtensionOverrides{extensions=[${ex}],featureFlags=[${ff}]}`;
    },
  } as InternalExtensionOverrides;
}

/** @internal */
export function toInternalExtensionOverrides(
  overrides: ExtensionOverrides,
): InternalExtensionOverrides {
  const internal = overrides as InternalExtensionOverrides;
  if (internal.$$type !== '@backstage/ExtensionOverrides') {
    throw new Error(
      `Invalid extension overrides instance, bad type '${internal.$$type}'`,
    );
  }
  if (internal.version !== 'v1') {
    throw new Error(
      `Invalid extension overrides instance, bad version '${internal.version}'`,
    );
  }
  return internal;
}
