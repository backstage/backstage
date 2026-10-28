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

import { createApiRef } from '../system';
import { IconElement } from '../../icons';

/**
 * API for accessing app icons.
 *
 * @remarks
 * Implementations must retain a runtime `getIcon(key: string)` method returning
 * a legacy icon component or `undefined` for older consumers of `core.icons`.
 * This method is omitted from the public type to guide new consumers to `icon`,
 * but cannot be removed at runtime until a new version of the icons API is introduced.
 *
 * @public
 */
export interface IconsApi {
  /**
   * Look up an icon element by key.
   */
  icon(key: string): IconElement | undefined;

  listIconKeys(): string[];
}

/**
 * The `ApiRef` of {@link IconsApi}.
 *
 * @public
 * @deprecated Use {@link coreApis.icons} instead.
 */
export const iconsApiRef = createApiRef<IconsApi>().with({
  id: 'core.icons',
  pluginId: 'app',
});
