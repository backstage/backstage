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

import { Database } from '../database';
import { AddLocation, Location, LocationsCatalog } from './types';
import { LocationReader } from '../ingestion';

export class DatabaseLocationsCatalog implements LocationsCatalog {
  constructor(
    private readonly database: Database,
    private readonly reader: LocationReader,
  ) {}

  async addLocation(location: AddLocation): Promise<Location> {
    const outputs = await this.reader.read(location.type, location.target);
    outputs.forEach(output => {
      if (output.type === 'error') {
        throw new Error(
          `Can't read location at ${location.target}, ${output.error}`,
        );
      }
    });

    const added = await this.database.addLocation(location);
    return added;
  }

  async removeLocation(id: string): Promise<void> {
    await this.database.removeLocation(id);
  }

  async locations(): Promise<Location[]> {
    const items = await this.database.locations();
    return items;
  }

  async location(id: string): Promise<Location> {
    const item = await this.location(id);
    return item;
  }
}
