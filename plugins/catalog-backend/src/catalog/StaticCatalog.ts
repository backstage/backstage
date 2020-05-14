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
import { v4 as uuidv4 } from 'uuid';
import { AddLocationRequest, Catalog, Component, Location } from './types';

export class StaticCatalog implements Catalog {
  private _components: Component[];
  private _locations: Location[];

  constructor(components: Component[], locations: Location[]) {
    this._components = components;
    this._locations = locations;
  }

  async addOrUpdateComponent(component: Component): Promise<Component> {
    this._components = this._components
      .filter((c) => c.name !== component.name)
      .concat([component]);
    return component;
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

  async addLocation(location: AddLocationRequest): Promise<Location> {
    const l = { id: uuidv4(), type: location.type, target: location.target };
    this._locations.push(l);
    return l;
  }

  async removeLocation(id: string): Promise<void> {
    this._locations = this._locations.filter((l) => l.id !== id);
  }

  async location(id: string): Promise<Location> {
    const location = this._locations.find((l) => l.id === id);
    if (!location) {
      throw new NotFoundError(`Found no location with ID ${id}`);
    }
    return location;
  }

  async locations(): Promise<Location[]> {
    return this._locations;
  }
}
