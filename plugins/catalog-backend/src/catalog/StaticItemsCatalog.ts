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
import { Component, ItemsCatalog } from './types';

export class StaticItemsCatalog implements ItemsCatalog {
  private _components: Component[];

  constructor(components: Component[]) {
    this._components = components;
  }

  async components(): Promise<Component[]> {
    return this._components.slice();
  }

  async component(name: string): Promise<Component> {
    const item = this._components.find((i) => i.name === name);
    if (!item) {
      throw new NotFoundError(`Found no component with name ${name}`);
    }
    return item;
  }
}
