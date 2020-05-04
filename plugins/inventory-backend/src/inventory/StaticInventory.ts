/*
 * Copyright 2020 Spotify AB
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

import { NotFoundError } from '@backstage/backend-common';
import { Component, Inventory } from './types';

export class StaticInventory implements Inventory {
  constructor(private components: Component[]) {}

  async list(): Promise<Component[]> {
    return this.components.slice();
  }

  async item(id: string): Promise<Component> {
    const item = this.components.find((i) => i.id === id);
    if (!item) {
      throw new NotFoundError(`Found no component with ID ${id}`);
    }
    return item;
  }
}
