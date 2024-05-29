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

/*
 * NOTE(freben): This is a temporary hack. We use cross-package imports so that
 * we do not have to maintain double implementations for the time being, until
 * backend-common is properly removed.
 */

// eslint-disable-next-line @backstage/no-relative-monorepo-imports
export { CacheManager } from '../../../backend-defaults/src/entrypoints/cache/CacheManager';
// eslint-disable-next-line @backstage/no-relative-monorepo-imports
export {
  type PluginCacheManager,
  type CacheManagerOptions,
} from '../../../backend-defaults/src/entrypoints/cache/types';
