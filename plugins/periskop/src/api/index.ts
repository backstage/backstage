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
import { ResponseError } from '@backstage/errors';
import { AggregatedError, NotFoundInInstance } from '../types';

/** @public */
export type PeriskopApiOptions = {
  discoveryApi: DiscoveryApi;
  configApi: ConfigApi;
};

type PeriskopInstance = {
  name: string;
  url: string;
};

/**
 * API abstraction to interact with Periskop's backends.
 *
 * @public
 */
export interface PeriskopApi {
  /**
   * Returns the list of registered Periskop instance names.
   */
  getInstanceNames(): string[];

  /**
   * For the given instance and service, returns the URL pointing to the specific error instance occurrence.
   * Note: This method might point to an external route.
   */
  getErrorInstanceUrl(
    instanceName: string,
    serviceName: string,
    error: AggregatedError,
  ): string;

  /**
   * Fetches all errors for the given service from the specified Periskop instance, given its name.
   */
  getErrors(
    instanceName: string,
    serviceName: string,
  ): Promise<AggregatedError[] | NotFoundInInstance>;
}

/**
 * API implementation to interact with Periskop's backends.
 *
 * @public
 */
export class PeriskopClient implements PeriskopApi {
  private readonly discoveryApi: DiscoveryApi;
  private readonly instances: PeriskopInstance[];

  constructor(options: PeriskopApiOptions) {
    this.discoveryApi = options.discoveryApi;
    this.instances = options.configApi
      .getConfigArray('periskop.instances')
      .flatMap(locConf => {
        const name = locConf.getString('name');
        const url = locConf.getString('url');
        return { name: name, url: url };
      });
  }

  private getApiUrl(instanceName: string): string | undefined {
    return this.instances.find(instance => instance.name === instanceName)?.url;
  }

  getInstanceNames(): string[] {
    return this.instances.map(e => e.name);
  }

  getErrorInstanceUrl(
    instanceName: string,
    serviceName: string,
    error: AggregatedError,
  ): string {
    return `${this.getApiUrl(
      instanceName,
    )}/#/${serviceName}/errors/${encodeURIComponent(error.aggregation_key)}`;
  }

  async getErrors(
    instanceName: string,
    serviceName: string,
  ): Promise<AggregatedError[] | NotFoundInInstance> {
    const apiUrl = `${await this.discoveryApi.getBaseUrl(
      'periskop',
    )}/${instanceName}/${serviceName}`;
    const response = await fetch(apiUrl);

    if (!response.ok) {
      if (response.status === 404) {
        return {
          body: await response.text(),
        };
      }
      throw await ResponseError.fromResponse(response);
    }
    return response.json();
  }
}
