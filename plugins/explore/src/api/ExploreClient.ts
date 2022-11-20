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
import { ResponseError } from '@backstage/errors';
import {
  GetExploreToolsRequest,
  GetExploreToolsResponse,
} from '@backstage/plugin-explore-common';
import { ExploreToolsConfig } from '@backstage/plugin-explore-react';
import { ExploreApi } from './ExploreApi';

/**
 * Default implementation of the ExploreApi.
 *
 * @public
 */
export class ExploreClient implements ExploreApi {
  private readonly discoveryApi: DiscoveryApi;
  private readonly fetchApi: FetchApi;
  // NOTE: This will be removed in the future as it is replaced by the ExploreApi.getTools method
  private readonly exploreToolsConfig: ExploreToolsConfig | undefined;

  /**
   * @remarks The exploreToolsConfig is for backwards compatibility with the exporeToolsConfigRef
   * and will be removed in the future.
   */
  constructor({
    discoveryApi,
    fetchApi,
    exploreToolsConfig = undefined,
  }: {
    discoveryApi: DiscoveryApi;
    fetchApi: FetchApi;
    exploreToolsConfig?: ExploreToolsConfig;
  }) {
    this.discoveryApi = discoveryApi;
    this.fetchApi = fetchApi;
    this.exploreToolsConfig = exploreToolsConfig;
  }

  async getTools(
    request: GetExploreToolsRequest = {},
  ): Promise<GetExploreToolsResponse> {
    // NOTE: This will be removed in the future as it is replaced by the ExploreApi.getTools method
    if (this.exploreToolsConfig) {
      const tools = await this.exploreToolsConfig.getTools();
      if (tools) {
        return { tools };
      }
    }

    const { fetch } = this.fetchApi;

    const filter = request.filter ?? {};
    const baseUrl = await this.discoveryApi.getBaseUrl('explore');

    const tags = filter?.tags?.map(t => `tag=${encodeURIComponent(t)}`) ?? [];
    const lifecycles =
      filter?.lifecycle?.map(l => `lifecycle=${encodeURIComponent(l)}`) ?? [];
    const query = [...tags, ...lifecycles].join('&');

    const response = await fetch(`${baseUrl}/tools?${query}`);

    if (!response.ok) {
      throw await ResponseError.fromResponse(response);
    }

    return response.json() as Promise<GetExploreToolsResponse>;
  }
}
