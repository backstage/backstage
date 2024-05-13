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

import {
  overridePackagePathResolution as _overridePackagePathResolution,
  OverridePackagePathResolutionOptions as _OverridePackagePathResolutionOptions,
  PackagePathResolutionOverride as _PackagePathResolutionOverride,
} from '@backstage/backend-plugin-api/testUtils';

/**
 * @public
 * @deprecated This function is deprecated and will be removed in future release, see https://github.com/backstage/backstage/issues/24493.
 * Please use the `overridePackagePathResolution` function from the `@backstage/backend-plugin-api/testUtils` package instead.
 */
export const overridePackagePathResolution = _overridePackagePathResolution;

/**
 * @public
 * @deprecated This type is deprecated and will be removed in a future release, see https://github.com/backstage/backstage/issues/24493.
 * Please use the `OverridePackagePathResolutionOptions` type from the `@backstage/backend-plugin-api/testUtils` package instead.
 */
export type OverridePackagePathResolutionOptions =
  _OverridePackagePathResolutionOptions;

/**
 * @public
 * @deprecated This type is deprecated and will be removed in a future release, see https://github.com/backstage/backstage/issues/24493.
 * Please use the `PackagePathResolutionOverride` type from the `@backstage/backend-plugin-api/testUtils` package instead.
 */
export type PackagePathResolutionOverride = _PackagePathResolutionOverride;
