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

export { mockApis } from './mockApis';
export { createApiMock, type ApiMock } from './createApiMock';
export {
  type MockApiFactorySymbol,
  type MockWithApiFactory,
  attachMockApiFactory,
} from './MockWithApiFactory';
export {
  TestApiProvider,
  type TestApiProviderProps,
  type TestApiPair,
  type TestApiPairs,
} from './TestApiProvider';

/**
 * @public
 * @deprecated Use `mockApis.alert()` instead.
 */
export type { MockAlertApi } from './AlertApi';

/**
 * @public
 * @deprecated Use `mockApis.analytics()` instead.
 */
export type { MockAnalyticsApi } from './AnalyticsApi';

/**
 * @public
 * @deprecated Use `mockApis.config()` instead.
 */
export type { MockConfigApi } from './ConfigApi';

/**
 * @public
 * @deprecated Use `mockApis.error()` instead.
 */
export type { MockErrorApi } from './ErrorApi';

/**
 * @public
 * @deprecated Use `mockApis.error()` instead.
 */
export type { MockErrorApiOptions } from './ErrorApi/MockErrorApi';

/**
 * @public
 * @deprecated Use the return type of `MockErrorApi.getErrors` instead.
 */
export type { ErrorWithContext } from './ErrorApi/MockErrorApi';

/**
 * @public
 * @deprecated Use `mockApis.fetch()` instead.
 */
export type { MockFetchApi } from './FetchApi';

/**
 * @public
 */
export type { MockFetchApiOptions } from './FetchApi/MockFetchApi';

/**
 * @public
 * @deprecated Use `mockApis.featureFlags()` instead.
 */
export type { MockFeatureFlagsApi } from './FeatureFlagsApi';

/**
 * @public
 * @deprecated Use `mockApis.featureFlags()` instead.
 */
export type { MockFeatureFlagsApiOptions } from './FeatureFlagsApi/MockFeatureFlagsApi';

/**
 * @public
 * @deprecated Use `mockApis.permission()` instead.
 */
export type { MockPermissionApi } from './PermissionApi';

/**
 * @public
 * @deprecated Use `mockApis.storage()` instead.
 */
export type { MockStorageApi } from './StorageApi';

/**
 * @public
 * @deprecated Use `mockApis.translation()` instead.
 */
export type { MockTranslationApi } from './TranslationApi';
