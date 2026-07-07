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

import { BackendFeature } from '@backstage/backend-plugin-api';

/** @internal */
export function isPromise<T>(value: unknown | Promise<T>): value is Promise<T> {
  return (
    typeof value === 'object' &&
    value !== null &&
    'then' in value &&
    typeof value.then === 'function'
  );
}

/**
 * Unwraps a backend feature from a possibly double-nested default export.
 * This is a workaround where default exports get transpiled to
 * `exports['default'] = ...` in CommonJS modules, which in turn results
 * in a double `{ default: { default: ... } }` nesting when importing
 * using a dynamic import.
 *
 * @internal
 */
export function unwrapFeature(
  feature: BackendFeature | { default: BackendFeature },
): BackendFeature {
  if ('$$type' in feature) {
    return feature;
  }

  if ('default' in feature) {
    return feature.default;
  }

  return feature;
}
