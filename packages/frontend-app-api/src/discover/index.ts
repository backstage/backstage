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

import { BackstagePlugin } from '@backstage/frontend-plugin-api';

// eslint-disable-next-line @backstage/no-undeclared-imports
import { modules } from '__backstage-autodetected-plugins__';

/**
 * @public
 */
export function getAvailablePlugins(): BackstagePlugin[] {
  return modules.flatMap(({ module: mod }) =>
    Object.values(mod).flatMap(val => (isBackstagePlugin(val) ? [val] : [])),
  );
}

function isBackstagePlugin(obj: unknown): obj is BackstagePlugin {
  if (obj !== null && typeof obj === 'object' && '$$type' in obj) {
    return obj.$$type === 'backstage-plugin';
  }
  return false;
}
