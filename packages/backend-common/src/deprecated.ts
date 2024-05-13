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
  resolvePackagePath as _resolvePackagePath,
  resolveSafeChildPath as _resolveSafeChildPath,
  isChildPath as _isChildPath,
} from '@backstage/backend-plugin-api';

/**
 * @public
 * @deprecated This type is deprecated and will be removed in a future release, see https://github.com/backstage/backstage/issues/24493.
 * Please use the `resolvePackagePath` function from the `@backstage/backend-plugin-api` package instead.
 */
export const resolvePackagePath = _resolvePackagePath;

/**
 * @public
 * @deprecated This type is deprecated and will be removed in a future release, see
 * Please use the `resolveSafeChildPath` function from the `@backstage/backend-plugin-api` package instead.
 */
export const resolveSafeChildPath = _resolveSafeChildPath;

/**
 * @public
 * @deprecated This type is deprecated and will be removed in a future release, see
 * Please use the `isChildPath` function from the `@backstage/cli-common` package instead.
 */
export const isChildPath = _isChildPath;
