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

/** @internal */
export interface BackendFeatureFactory<
  TOptions extends [options?: object] = [],
> {
  (...options: TOptions): BackendFeature;
  $$type: '@backstage/BackendFeatureFactory';
}

/** @public */
export interface BackendFeature {
  // NOTE: This type is opaque in order to simplify future API evolution.
  $$type: '@backstage/BackendFeature';
}

/**
 * @public
 * @deprecated This type exists only as a helper for old code that relied on `createBackendFeature` and `createBackendPlugin` to return `() => BackendFeature` instead of `BackendFeature`. You should remove the `()` parentheses at the end of your usages. This type will be removed in a future release.
 */
export interface BackendFeatureCompat extends BackendFeature {
  /**
   * @deprecated You do not need to use this call signature; use the type directly instead by removing the `()` parentheses at the end. This call signature will be removed in a future release.
   */
  (): this;
}
