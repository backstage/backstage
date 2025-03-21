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

import { IconComponent, IconsApi } from '@backstage/frontend-plugin-api';

/**
 * Implementation for the {@link IconsApi}
 *
 * @internal
 */
export class DefaultIconsApi implements IconsApi {
  #icons: Map<string, IconComponent>;

  constructor(icons: { [key in string]: IconComponent }) {
    this.#icons = new Map(Object.entries(icons));
  }

  getIcon(key: string): IconComponent | undefined {
    return this.#icons.get(key);
  }

  listIconKeys(): string[] {
    return Array.from(this.#icons.keys());
  }
}
