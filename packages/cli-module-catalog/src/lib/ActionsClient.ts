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

import { httpJson } from './httpJson';

type InvokeResponse = {
  output: unknown;
};

function pluginActionsUrl(baseUrl: string, pluginId: string): string {
  return new URL(
    `/api/${encodeURIComponent(pluginId)}/.backstage/actions/v1/actions`,
    baseUrl,
  ).toString();
}

export class ActionsClient {
  constructor(
    private readonly baseUrl: string,
    private readonly accessToken: string,
  ) {}

  async execute(actionId: string, input?: unknown): Promise<unknown> {
    const colonIndex = actionId.indexOf(':');
    if (colonIndex === -1) {
      throw new Error(
        `Invalid action ID "${actionId}". Expected format "pluginId:actionName".`,
      );
    }
    const pluginId = actionId.substring(0, colonIndex);
    const url = `${pluginActionsUrl(
      this.baseUrl,
      pluginId,
    )}/${encodeURIComponent(actionId)}/invoke`;

    const response = await httpJson<InvokeResponse>(url, {
      method: 'POST',
      headers: { Authorization: `Bearer ${this.accessToken}` },
      body: input ?? {},
      signal: AbortSignal.timeout(30_000),
    });

    return response.output;
  }
}
