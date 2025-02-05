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

import { DiscoveryApi, FetchApi } from '@backstage/core-plugin-api';
import {
  ConfigInfo,
  DevToolsInfo,
  ExternalDependency,
} from '@backstage/plugin-devtools-common';
import { ResponseError } from '@backstage/errors';
import { DevToolsApi } from './DevToolsApi';
import { JsonObject } from '@backstage/types';

export class DevToolsClient implements DevToolsApi {
  private readonly discoveryApi: DiscoveryApi;
  private readonly fetchApi: FetchApi;

  public constructor(options: {
    discoveryApi: DiscoveryApi;
    fetchApi: FetchApi;
  }) {
    this.discoveryApi = options.discoveryApi;
    this.fetchApi = options.fetchApi;
  }

  public async getConfig(): Promise<ConfigInfo | undefined> {
    const urlSegment = 'config';

    const configInfo = await this.get<ConfigInfo | undefined>(urlSegment);
    return configInfo;
  }

  public async getExternalDependencies(): Promise<
    ExternalDependency[] | undefined
  > {
    const urlSegment = 'external-dependencies';

    const externalDependencies = await this.get<
      ExternalDependency[] | undefined
    >(urlSegment);
    return externalDependencies;
  }

  public async getInfo(): Promise<DevToolsInfo | undefined> {
    const urlSegment = 'info';

    const info = await this.get<DevToolsInfo | undefined>(urlSegment);
    return info;
  }

  public async getScheduleForPlugin(
    pluginId: string,
  ): Promise<JsonObject | undefined> {
    const baseUrl = `${await this.discoveryApi.getBaseUrl(pluginId)}/`;
    const url = new URL('.backstage/scheduler/v1/', baseUrl);

    const response = await this.fetchApi.fetch(url.toString());

    if (!response.ok) {
      throw await ResponseError.fromResponse(response);
    }

    return response.json() as Promise<any>;
  }

  private async get<T>(path: string): Promise<T> {
    const baseUrl = `${await this.discoveryApi.getBaseUrl('devtools')}/`;
    const url = new URL(path, baseUrl);

    const response = await this.fetchApi.fetch(url.toString());

    if (!response.ok) {
      throw await ResponseError.fromResponse(response);
    }

    return response.json() as Promise<T>;
  }
}
