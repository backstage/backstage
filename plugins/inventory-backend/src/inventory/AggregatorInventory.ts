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

export class AggregatorInventory implements Inventory {
  inventories: Inventory[] = [];

  async list(): Promise<Component[]> {
    const lists = await Promise.all(this.inventories.map((i) => i.list()));
    return lists.flat();
  }

  item(id: string): Promise<Component> {
    return new Promise((resolve, reject) => {
      const promises = this.inventories.map((i) =>
        i.item(id).then(resolve, () => {
          // For now, just swallow errors in individual inventories;
          // should handle partial errors better
        }),
      );
      Promise.all(promises).then(() =>
        reject(new NotFoundError(`Found no component with ID ${id}`)),
      );
    });
  }

  enlist(inventory: Inventory) {
    this.inventories.push(inventory);
  }
}
