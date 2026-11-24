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

function scaffolderUrl(baseUrl: string, path: string): string {
  return new URL(`/api/scaffolder${path}`, baseUrl).toString();
}

export type DryRunInput = {
  template: unknown;
  values: Record<string, unknown>;
  secrets?: Record<string, string>;
  directoryContents?: Array<{ path: string; base64Content: string }>;
};

export type DryRunResult = {
  directoryContents: Array<{
    path: string;
    base64Content: string;
    executable?: boolean;
  }>;
  log: Array<{
    body: { message: string; stepId?: string; status?: string };
  }>;
  steps: Array<{ id: string; name: string; action: string }>;
  output: Record<string, unknown>;
};

export type ExecuteTemplateInput = {
  templateRef: string;
  values: Record<string, unknown>;
  secrets?: Record<string, string>;
};

/**
 * A thin client that talks directly to the scaffolder plugin's REST API of
 * the given Backstage instance.
 */
export class ScaffolderClient {
  constructor(
    private readonly baseUrl: string,
    private readonly accessToken: string,
  ) {}

  private authHeaders(): Record<string, string> {
    return { Authorization: `Bearer ${this.accessToken}` };
  }

  async dryRun(input: DryRunInput): Promise<DryRunResult> {
    return httpJson<DryRunResult>(scaffolderUrl(this.baseUrl, '/v2/dry-run'), {
      method: 'POST',
      headers: this.authHeaders(),
      body: {
        template: input.template,
        values: input.values,
        secrets: input.secrets,
        directoryContents: input.directoryContents ?? [],
      },
      signal: AbortSignal.timeout(30_000),
    });
  }

  async execute(input: ExecuteTemplateInput): Promise<{ taskId: string }> {
    const response = await httpJson<{ id: string }>(
      scaffolderUrl(this.baseUrl, '/v2/tasks'),
      {
        method: 'POST',
        headers: this.authHeaders(),
        body: {
          templateRef: input.templateRef,
          values: input.values,
          ...(input.secrets && { secrets: input.secrets }),
        },
        signal: AbortSignal.timeout(30_000),
      },
    );

    return { taskId: response.id };
  }
}
