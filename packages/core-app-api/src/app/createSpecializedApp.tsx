/*
 * Copyright 2020 The Backstage Authors
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

import { AppManager } from './AppManager';
import { AppOptions, BackstageApp } from './types';

/**
 * Creates a new Backstage App where the full set of options are required.
 *
 * @public
 * @param options - A set of options for creating the app
 * @returns
 * @remarks
 *
 * You will most likely want to use {@link @backstage/app-defaults#createApp},
 * however, this low-level API allows you to provide a full set of options,
 * including your own `components`, `icons`, `defaultApis`, and `themes`. This
 * is particularly useful if you are not using `@backstage/core-components` or
 * Material UI, as it allows you to avoid those dependencies completely.
 */
export function createSpecializedApp(options: AppOptions): BackstageApp {
  return new AppManager(options);
}
