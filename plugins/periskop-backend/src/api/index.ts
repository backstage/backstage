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

import { Config } from '@backstage/config';
import { AggregatedError, NotFoundInLocation } from '../types';
import fetch from 'node-fetch';

export type Options = {
  config: Config;
};

type PeriskopLocation = {
  name: string;
  host: string;
};

export class PeriskopApi {
  private readonly locations: PeriskopLocation[];

  constructor(options: Options) {
    this.locations = options.config
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

  async getErrors(
    locationName: string,
    serviceName: string,
  ): Promise<AggregatedError[] | NotFoundInLocation> {
    const apiUrl = this.getApiUrl(locationName);
    if (!apiUrl) {
      throw new Error(
        `failed to fetch data, no periskop location with name ${locationName}`,
      );
    }
    const response = await fetch(`${apiUrl}/services/${serviceName}/errors/`);

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
