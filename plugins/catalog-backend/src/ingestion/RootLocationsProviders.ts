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

import { LocationSpec } from '@backstage/catalog-model';
import { Config } from '@backstage/config';
import { RootLocationsProvider } from './types';
import { LocationsCatalog } from '../catalog';

export class UserRegisteredLocationsProvider implements RootLocationsProvider {
  constructor(private readonly locationsCatalog: LocationsCatalog) {}

  async getLocations(): Promise<LocationSpec[]> {
    const all = await this.locationsCatalog.locations();
    return all
      .map(({ data: { type, target } }) => ({ type, target }))
      .filter(item => item.type !== 'bootstrap');
  }
}

export class ConfigLocationsProvider implements RootLocationsProvider {
  constructor(private readonly configRoot: Config) {}

  async getLocations(): Promise<LocationSpec[]> {
    const items = this.configRoot.getOptionalConfigArray('catalog.locations');
    if (!items) {
      return [];
    }

    return items.map(item => ({
      type: item.getString('type'),
      target: item.getString('target'),
    }));
  }
}

export class RootLocationsProviders implements RootLocationsProvider {
  constructor(private readonly providers: RootLocationsProvider[] = []) {}

  async getLocations(): Promise<LocationSpec[]> {
    const promises = this.providers.map(p => p.getLocations());
    return (await Promise.all(promises)).flat();
  }
}
