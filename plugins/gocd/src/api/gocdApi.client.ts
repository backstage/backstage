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
import { GoCdApi } from './gocdApi';
import { GoCdApiError, PipelineHistory } from './gocdApi.model';
import { DiscoveryApi } from '@backstage/core-plugin-api';
import { ResponseError } from '@backstage/errors';

const DEFAULT_PAGE_SIZE = 100;

export class GoCdClientApi implements GoCdApi {
  constructor(private readonly discoveryApi: DiscoveryApi) {}

  async getPipelineHistory(
    pipelineName: string,
  ): Promise<PipelineHistory | GoCdApiError> {
    const baseUrl = await this.discoveryApi.getBaseUrl('proxy');
    const pipelineHistoryResponse = await fetch(
      `${baseUrl}/gocd/pipelines/${pipelineName}/history?page_size=${DEFAULT_PAGE_SIZE}`,
      {
        headers: {
          Accept: 'application/vnd.go.cd+json',
        },
      },
    );

    if (!pipelineHistoryResponse.ok) {
      throw await ResponseError.fromResponse(pipelineHistoryResponse);
    }

    return await pipelineHistoryResponse.json();
  }
}
