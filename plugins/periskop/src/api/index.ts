/*
 * Copyright 2022 The Backstage Authors
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

import { ConfigApi, DiscoveryApi } from '@backstage/core-plugin-api';
import { AggregatedError, NotFoundInLocation } from '../types';

type Options = {
  discoveryApi: DiscoveryApi;
  configApi: ConfigApi;
};

type PeriskopLocation = {
  name: string;
  host: string;
};

/**
 * API abstraction to interact with Periskop's backends.
 *
 * @public
 */
export class PeriskopApi {
  private readonly discoveryApi: DiscoveryApi;
  private readonly locations: PeriskopLocation[];

  constructor(options: Options) {
    this.discoveryApi = options.discoveryApi;
    this.locations = options.configApi
      .getConfigArray('periskop.locations')
      .flatMap(locConf => {
        const name = locConf.getString('name');
        const host = locConf.getString('host');
        return { name: name, host: host };
      });
  }

  private getApiUrl(locationName: string): string | undefined {
    return this.locations.find(loc => loc.name === locationName)?.host;
  }

  getLocationNames(): string[] {
    return this.locations.map(e => e.name);
  }

  getErrorInstanceUrl(
    locationName: string,
    serviceName: string,
    error: AggregatedError,
  ): string {
    return `${this.getApiUrl(
      locationName,
    )}/#/${serviceName}/errors/${encodeURIComponent(error.aggregation_key)}`;
  }

  async getErrors(
    locationName: string,
    serviceName: string,
  ): Promise<AggregatedError[] | NotFoundInLocation> {
    const apiUrl = `${await this.discoveryApi.getBaseUrl(
      'periskop',
    )}/${locationName}/${serviceName}`;
    const response = await fetch(apiUrl);

    if (!response.ok) {
      if (response.status === 404) {
        return {
          body: await response.text(),
        };
      }
      throw new Error(
        `failed to fetch data, status ${response.status}: ${response.statusText}`,
      );
    }
    return response.json();
  }
}
