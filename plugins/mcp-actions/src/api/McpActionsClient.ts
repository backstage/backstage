/*
 * Copyright 2025 The Backstage Authors
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
import {
  DiscoveryApi,
  FetchApi,
  createApiRef,
} from '@backstage/core-plugin-api';
import { ResponseError } from '@backstage/errors';
import { JsonObject } from '@backstage/types';
import { JSONSchema7 } from 'json-schema';

export interface ElicitationDetails {
  elicitationId: string;
  action: {
    id: string;
    title: string;
    description: string;
  };
  secretsSchema: JSONSchema7;
  csrfToken: string;
}

export interface McpActionsApi {
  getElicitation(elicitationId: string): Promise<ElicitationDetails>;
  submitSecrets(
    elicitationId: string,
    csrfToken: string,
    secrets: JsonObject,
  ): Promise<void>;
}

export const mcpActionsApiRef = createApiRef<McpActionsApi>({
  id: 'plugin.mcp-actions',
});

export class McpActionsClient implements McpActionsApi {
  private readonly discoveryApi: DiscoveryApi;
  private readonly fetchApi: FetchApi;

  constructor(opts: { discoveryApi: DiscoveryApi; fetchApi: FetchApi }) {
    this.discoveryApi = opts.discoveryApi;
    this.fetchApi = opts.fetchApi;
  }

  async getElicitation(elicitationId: string): Promise<ElicitationDetails> {
    const baseUrl = await this.discoveryApi.getBaseUrl('mcp-actions');
    const response = await this.fetchApi.fetch(
      `${baseUrl}/v1/elicitations/${encodeURIComponent(elicitationId)}`,
    );
    if (!response.ok) {
      throw await ResponseError.fromResponse(response);
    }
    return response.json();
  }

  async submitSecrets(
    elicitationId: string,
    csrfToken: string,
    secrets: JsonObject,
  ): Promise<void> {
    const baseUrl = await this.discoveryApi.getBaseUrl('mcp-actions');
    const response = await this.fetchApi.fetch(
      `${baseUrl}/v1/elicitations/${encodeURIComponent(elicitationId)}/secrets`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ csrfToken, secrets }),
      },
    );
    if (!response.ok) {
      throw await ResponseError.fromResponse(response);
    }
  }
}
