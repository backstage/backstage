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
export {
  type MockApiFactorySymbol,
  type ApiMock,
  type MockWithApiFactory,
  attachMockApiFactory,
} from './utils';

/**
 * @public
 */
export type { MockAlertApi } from './AlertApi';

/**
 * @public
 */
export type { MockAnalyticsApi } from './AnalyticsApi';

/**
 * @public
 */
export type { MockConfigApi } from './ConfigApi';

/**
 * @public
 */
export type {
  MockErrorApi,
  MockErrorApiOptions,
  ErrorWithContext,
} from './ErrorApi';

/**
 * @public
 */
export type { MockFetchApi, MockFetchApiOptions } from './FetchApi';

/**
 * @public
 */
export type {
  MockFeatureFlagsApi,
  MockFeatureFlagsApiOptions,
} from './FeatureFlagsApi';

/**
 * @public
 */
export type { MockPermissionApi } from './PermissionApi';

/**
 * @public
 */
export type { MockStorageApi, MockStorageBucket } from './StorageApi';

/**
 * @public
 */
export type { MockTranslationApi } from './TranslationApi';
