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

import type { IconsApi } from '@backstage/frontend-plugin-api';
import type { LegacyIconsApi as LegacyIconsApiContract } from './legacyApiRefs';
// eslint-disable-next-line @backstage/no-relative-monorepo-imports
import { createIconComponentLookup } from '../../../../packages/core-plugin-api/src/icons/createIconComponentLookup';

export class LegacyIconsApi implements LegacyIconsApiContract {
  readonly getIcon: LegacyIconsApiContract['getIcon'];

  constructor(private readonly iconsApi: IconsApi) {
    this.getIcon = createIconComponentLookup(key => iconsApi.icon(key));
  }

  icon(key: string) {
    return this.iconsApi.icon(key);
  }

  listIconKeys() {
    return this.iconsApi.listIconKeys();
  }
}
