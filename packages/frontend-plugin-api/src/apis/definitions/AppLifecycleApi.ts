/*
 * Copyright 2026 The Backstage Authors
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

import { createApiRef } from '../system';

/**
 * Provides information about the lifecycle of the app.
 *
 * @remarks
 *
 * The app is rendered before it has been fully initialized, for example while
 * the user is signing in. During this time only part of the app is available,
 * which for example means that routes to pages can not yet be resolved. Once
 * initialization completes the app is considered finalized.
 *
 * @public
 */
export interface AppLifecycleApi {
  /**
   * Returns `true` if the app has been finalized.
   */
  isFinalized(): boolean;

  /**
   * Returns a promise that resolves once the app has been finalized, or
   * immediately if it already has been.
   */
  waitForFinalization(): Promise<void>;
}

/**
 * The {@link ApiRef} of {@link AppLifecycleApi}.
 *
 * @public
 */
export const appLifecycleApiRef = createApiRef<AppLifecycleApi>().with({
  id: 'core.app-lifecycle',
  pluginId: 'app',
});
