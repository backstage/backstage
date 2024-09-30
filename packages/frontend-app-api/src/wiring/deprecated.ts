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

// eslint-disable-next-line @backstage/no-relative-monorepo-imports
import {
  createApp as _createApp,
  CreateAppFeatureLoader as _CreateAppFeatureLoader,
} from '../../../frontend-defaults/src/createApp';

/**
 * @public
 * @deprecated Import from `@backstage/frontend-defaults` instead.
 */
export const createApp = _createApp;

/**
 * @public
 * @deprecated Import from `@backstage/frontend-defaults` instead.
 */
export type CreateAppFeatureLoader = _CreateAppFeatureLoader;
