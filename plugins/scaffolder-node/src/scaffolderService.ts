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
  AuthService,
  BackstageCredentials,
  coreServices,
  createServiceFactory,
  createServiceRef,
  DiscoveryService,
} from '@backstage/backend-plugin-api';
import { ResponseError } from '@backstage/errors';
import { ScmIntegrations } from '@backstage/integration';
import {
  ListActionsResponse,
  ListTemplatingExtensionsResponse,
  LogEvent,
  ScaffolderClient,
  ScaffolderDryRunOptions,
  ScaffolderDryRunResponse,
  ScaffolderRequestOptions,
  ScaffolderScaffoldOptions,
  ScaffolderScaffoldResponse,
  ScaffolderTask,
  ScaffolderTaskStatus,
} from '@backstage/plugin-scaffolder-common';
import type { TemplateParameterSchema } from '@backstage/plugin-scaffolder-common';

/**
 * @public
 */
export interface ScaffolderServiceRequestOptions {
  credentials: BackstageCredentials;
}

/**
 * A backend service interface for the scaffolder that uses
 * {@link @backstage/backend-plugin-api#BackstageCredentials} instead of tokens.
 *
 * @public
 */
export interface ScaffolderService {
  getTemplateParameterSchema(
    request: { templateRef: string },
    options: ScaffolderServiceRequestOptions,
  ): Promise<TemplateParameterSchema>;

  scaffold(
    request: ScaffolderScaffoldOptions,
    options: ScaffolderServiceRequestOptions,
  ): Promise<ScaffolderScaffoldResponse>;

  getTask(
    request: { taskId: string },
    options: ScaffolderServiceRequestOptions,
  ): Promise<ScaffolderTask>;

  cancelTask(
    request: { taskId: string },
    options: ScaffolderServiceRequestOptions,
  ): Promise<{ status?: ScaffolderTaskStatus }>;

  retry(
    request: { taskId: string },
    options: ScaffolderServiceRequestOptions,
  ): Promise<{ id: string }>;

  listTasks(
    request: {
      createdBy?: string;
      limit?: number;
      offset?: number;
    },
    options: ScaffolderServiceRequestOptions,
  ): Promise<{ items: ScaffolderTask[]; totalItems: number }>;

  listActions(
    request?: {},
    options?: ScaffolderServiceRequestOptions,
  ): Promise<ListActionsResponse>;

  listTemplatingExtensions(
    request?: {},
    options?: ScaffolderServiceRequestOptions,
  ): Promise<ListTemplatingExtensionsResponse>;

  getLogs(
    request: {
      taskId: string;
      after?: number;
    },
    options: ScaffolderServiceRequestOptions,
  ): Promise<LogEvent[]>;

  dryRun(
    request: ScaffolderDryRunOptions,
    options: ScaffolderServiceRequestOptions,
  ): Promise<ScaffolderDryRunResponse>;

  autocomplete(
    request: {
      token: string;
      provider: string;
      resource: string;
      context: Record<string, string>;
    },
    options: ScaffolderServiceRequestOptions,
  ): Promise<{ results: { title?: string; id: string }[] }>;
}

class DefaultScaffolderService implements ScaffolderService {
  readonly #auth: AuthService;
  readonly #client: ScaffolderClient;
  readonly #discovery: DiscoveryService;

  constructor(options: {
    auth: AuthService;
    client: ScaffolderClient;
    discovery: DiscoveryService;
  }) {
    this.#auth = options.auth;
    this.#client = options.client;
    this.#discovery = options.discovery;
  }

  async getTemplateParameterSchema(
    request: { templateRef: string },
    options: ScaffolderServiceRequestOptions,
  ): Promise<TemplateParameterSchema> {
    return this.#client.getTemplateParameterSchema(
      request.templateRef,
      await this.#getOptions(options),
    );
  }

  async scaffold(
    request: ScaffolderScaffoldOptions,
    options: ScaffolderServiceRequestOptions,
  ): Promise<ScaffolderScaffoldResponse> {
    return this.#client.scaffold(request, await this.#getOptions(options));
  }

  async getTask(
    request: { taskId: string },
    options: ScaffolderServiceRequestOptions,
  ): Promise<ScaffolderTask> {
    return this.#client.getTask(
      request.taskId,
      await this.#getOptions(options),
    );
  }

  async cancelTask(
    request: { taskId: string },
    options: ScaffolderServiceRequestOptions,
  ): Promise<{ status?: ScaffolderTaskStatus }> {
    return this.#client.cancelTask(
      request.taskId,
      await this.#getOptions(options),
    );
  }

  async retry(
    request: { taskId: string },
    options: ScaffolderServiceRequestOptions,
  ): Promise<{ id: string }> {
    return this.#client.retry(request.taskId, await this.#getOptions(options));
  }

  async listTasks(
    request: {
      createdBy?: string;
      limit?: number;
      offset?: number;
    },
    options: ScaffolderServiceRequestOptions,
  ): Promise<{ items: ScaffolderTask[]; totalItems: number }> {
    const { token } = await this.#getOptions(options);
    const baseUrl = await this.#discovery.getBaseUrl('scaffolder');

    const params = new URLSearchParams();
    if (request.createdBy) {
      params.set('createdBy', request.createdBy);
    }
    if (request.limit !== undefined) {
      params.set('limit', String(request.limit));
    }
    if (request.offset !== undefined) {
      params.set('offset', String(request.offset));
    }

    const query = params.toString();
    const url = `${baseUrl}/v2/tasks${query ? `?${query}` : ''}`;

    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
      },
    });

    if (!response.ok) {
      throw await ResponseError.fromResponse(response);
    }

    const body = await response.json();
    return {
      items: body.tasks,
      totalItems: body.totalTasks ?? 0,
    };
  }

  async listActions(
    _request?: {},
    options?: ScaffolderServiceRequestOptions,
  ): Promise<ListActionsResponse> {
    return this.#client.listActions(
      options ? await this.#getOptions(options) : {},
    );
  }

  async listTemplatingExtensions(
    _request?: {},
    options?: ScaffolderServiceRequestOptions,
  ): Promise<ListTemplatingExtensionsResponse> {
    return this.#client.listTemplatingExtensions(
      options ? await this.#getOptions(options) : {},
    );
  }

  async getLogs(
    request: {
      taskId: string;
      after?: number;
    },
    options: ScaffolderServiceRequestOptions,
  ): Promise<LogEvent[]> {
    const { token } = await this.#getOptions(options);
    const baseUrl = await this.#discovery.getBaseUrl('scaffolder');

    const params = new URLSearchParams();
    if (request.after !== undefined) {
      params.set('after', String(request.after));
    }

    const query = params.toString();
    const taskId = encodeURIComponent(request.taskId);
    const url = `${baseUrl}/v2/tasks/${taskId}/events${
      query ? `?${query}` : ''
    }`;

    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
      },
    });

    if (!response.ok) {
      throw await ResponseError.fromResponse(response);
    }

    return response.json();
  }

  async dryRun(
    request: ScaffolderDryRunOptions,
    options: ScaffolderServiceRequestOptions,
  ): Promise<ScaffolderDryRunResponse> {
    return this.#client.dryRun(request, await this.#getOptions(options));
  }

  async autocomplete(
    request: {
      token: string;
      provider: string;
      resource: string;
      context: Record<string, string>;
    },
    options: ScaffolderServiceRequestOptions,
  ): Promise<{ results: { title?: string; id: string }[] }> {
    return this.#client.autocomplete(request, await this.#getOptions(options));
  }

  async #getOptions(
    options: ScaffolderServiceRequestOptions,
  ): Promise<ScaffolderRequestOptions> {
    return this.#auth.getPluginRequestToken({
      onBehalfOf: options.credentials,
      targetPluginId: 'scaffolder',
    });
  }
}

/**
 * A service ref for the scaffolder client, to be used by backend plugins
 * and modules that need to interact with the scaffolder API.
 *
 * @public
 */
export const scaffolderServiceRef = createServiceRef<ScaffolderService>({
  id: 'scaffolder-client',
  defaultFactory: async service =>
    createServiceFactory({
      service,
      deps: {
        auth: coreServices.auth,
        discovery: coreServices.discovery,
        config: coreServices.rootConfig,
      },
      async factory({ auth, discovery, config }) {
        const integrations = ScmIntegrations.fromConfig(config);
        const client = new ScaffolderClient({
          discoveryApi: discovery,
          fetchApi: { fetch },
          scmIntegrationsApi: integrations,
        });
        return new DefaultScaffolderService({
          auth,
          client,
          discovery,
        });
      },
    }),
});
