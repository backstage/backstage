/*
 * Copyright 2021 The Backstage Authors
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

import { DiscoveryApi } from '@backstage/core-plugin-api';
import { ResponseError } from '@backstage/errors';
import { BuildItem, BuildsResult, XcmetricsApi } from './types';

interface Options {
  discoveryApi: DiscoveryApi;
}

export class XcmetricsClient implements XcmetricsApi {
  private readonly discoveryApi: DiscoveryApi;

  constructor(options: Options) {
    this.discoveryApi = options.discoveryApi;
  }

  async getBuilds(): Promise<BuildItem[]> {
    const baseUrl = `${await this.discoveryApi.getBaseUrl('proxy')}/xcmetrics`;
    const response = await fetch(`${baseUrl}/build`);

    if (!response.ok) {
      throw await ResponseError.fromResponse(response);
    }

    return ((await response.json()) as BuildsResult).items;
  }
}
