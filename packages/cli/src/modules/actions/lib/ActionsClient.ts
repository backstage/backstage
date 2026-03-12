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

import { JSONSchema7 } from 'json-schema';
import { httpJson } from '../../auth/lib/http';

export type Action = {
  id: string;
  name: string;
  title: string;
  description: string;
  schema: { input: JSONSchema7; output: JSONSchema7 };
  attributes: { readOnly: boolean; destructive: boolean; idempotent: boolean };
};

export class ActionsClient {
  private readonly baseUrl: string;
  private readonly accessToken: string;

  constructor(baseUrl: string, accessToken: string) {
    this.baseUrl = baseUrl;
    this.accessToken = accessToken;
  }

  async list(pluginSources: string[]): Promise<Action[]> {
    const results = await Promise.all(
      pluginSources.map(async pluginId => {
        try {
          const { actions } = await httpJson<{ actions: Action[] }>(
            `${this.baseUrl}/api/${pluginId}/.backstage/actions/v1/actions`,
            { headers: { Authorization: `Bearer ${this.accessToken}` } },
          );
          return actions;
        } catch (error) {
          console.warn(`Failed to fetch actions from ${pluginId}`, error);
          return [];
        }
      }),
    );
    return results.flat();
  }

  async execute(
    actionId: string,
    input?: Record<string, unknown>,
  ): Promise<{ output: unknown }> {
    const colonIndex = actionId.indexOf(':');
    if (colonIndex === -1) {
      throw new Error(`Invalid action id: ${actionId}`);
    }
    const pluginId = actionId.substring(0, colonIndex);

    return httpJson<{ output: unknown }>(
      `${
        this.baseUrl
      }/api/${pluginId}/.backstage/actions/v1/actions/${encodeURIComponent(
        actionId,
      )}/invoke`,
      {
        method: 'POST',
        body: input,
        headers: { Authorization: `Bearer ${this.accessToken}` },
      },
    );
  }
}
