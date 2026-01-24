/*
 * Copyright 2020 The Backstage Authors
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

import { parseEntityRef } from '@backstage/catalog-model';
import { ResponseError } from '@backstage/errors';
import { ScmIntegrationRegistry } from '@backstage/integration';
import { Observable } from '@backstage/types';
import {
  EventSourceMessage,
  fetchEventSource,
} from '@microsoft/fetch-event-source';
import ObservableImpl from 'zen-observable';

import { type TemplateParameterSchema } from './TemplateEntityV1beta3';
import {
  ListActionsResponse,
  ListTemplatingExtensionsResponse,
  LogEvent,
  ScaffolderApi,
  ScaffolderDryRunOptions,
  ScaffolderDryRunResponse,
  ScaffolderGetIntegrationsListOptions,
  ScaffolderGetIntegrationsListResponse,
  ScaffolderRequestOptions,
  ScaffolderScaffoldOptions,
  ScaffolderScaffoldResponse,
  ScaffolderStreamLogsOptions,
  ScaffolderTask,
} from './api';
import { DefaultApiClient, TaskStatus, TypedResponse } from './schema/openapi';

/**
 * An API to interact with the scaffolder backend.
 *
 * @public
 */
export class ScaffolderClient implements ScaffolderApi {
  private readonly apiClient: DefaultApiClient;
  private readonly discoveryApi: {
    getBaseUrl(pluginId: string): Promise<string>;
  };
  private readonly scmIntegrationsApi: ScmIntegrationRegistry;
  private readonly fetchApi: { fetch: typeof fetch };
  private readonly identityApi?: {
    getBackstageIdentity(): Promise<{
      type: 'user';
      userEntityRef: string;
      ownershipEntityRefs: string[];
    }>;
  };
  private readonly useLongPollingLogs: boolean;

  constructor(options: {
    discoveryApi: { getBaseUrl(pluginId: string): Promise<string> };
    fetchApi: { fetch: typeof fetch };
    identityApi?: {
      getBackstageIdentity(): Promise<{
        type: 'user';
        userEntityRef: string;
        ownershipEntityRefs: string[];
      }>;
    };
    scmIntegrationsApi: ScmIntegrationRegistry;
    useLongPollingLogs?: boolean;
  }) {
    this.apiClient = new DefaultApiClient(options);
    this.discoveryApi = options.discoveryApi;
    this.fetchApi = options.fetchApi ?? { fetch };
    this.scmIntegrationsApi = options.scmIntegrationsApi;
    this.useLongPollingLogs = options.useLongPollingLogs ?? false;
    this.identityApi = options.identityApi;
  }

  /**
   * {@inheritdoc ScaffolderApi.listTasks}
   */
  async listTasks(
    request: {
      filterByOwnership: 'owned' | 'all';
      limit?: number;
      offset?: number;
    },
    options?: ScaffolderRequestOptions,
  ): Promise<{ tasks: ScaffolderTask[]; totalTasks?: number }> {
    if (!this.identityApi) {
      throw new Error(
        'IdentityApi is not available in the ScaffolderClient, please pass through the IdentityApi to the ScaffolderClient constructor in order to use the listTasks method',
      );
    }

    const { userEntityRef } = await this.identityApi.getBackstageIdentity();

    return await this.requestRequired(
      await this.apiClient.listTasks(
        {
          query: {
            createdBy:
              request.filterByOwnership === 'owned'
                ? [userEntityRef]
                : undefined,
            limit: request.limit,
            offset: request.offset,
          },
        },
        options,
      ),
    );
  }

  async getIntegrationsList(
    options: ScaffolderGetIntegrationsListOptions,
  ): Promise<ScaffolderGetIntegrationsListResponse> {
    const integrations = [
      ...this.scmIntegrationsApi.azure.list(),
      ...this.scmIntegrationsApi.bitbucket
        .list()
        .filter(
          item =>
            !this.scmIntegrationsApi.bitbucketCloud.byHost(item.config.host) &&
            !this.scmIntegrationsApi.bitbucketServer.byHost(item.config.host),
        ),
      ...this.scmIntegrationsApi.bitbucketCloud.list(),
      ...this.scmIntegrationsApi.bitbucketServer.list(),
      ...this.scmIntegrationsApi.gerrit.list(),
      ...this.scmIntegrationsApi.gitea.list(),
      ...this.scmIntegrationsApi.github.list(),
      ...this.scmIntegrationsApi.gitlab.list(),
    ]
      .map(c => ({ type: c.type, title: c.title, host: c.config.host }))
      .filter(c => options.allowedHosts.includes(c.host));

    return {
      integrations,
    };
  }

  /**
   * {@inheritdoc ScaffolderApi.getTemplateParameterSchema}
   */
  async getTemplateParameterSchema(
    templateRef: string,
    options?: ScaffolderRequestOptions,
  ): Promise<TemplateParameterSchema> {
    return await this.requestRequired(
      await this.apiClient.getTemplateParameterSchema(
        {
          path: parseEntityRef(templateRef, {
            defaultKind: 'template',
          }),
        },
        options,
      ),
    );
  }

  /**
   * {@inheritdoc ScaffolderApi.scaffold}
   */
  async scaffold(
    request: ScaffolderScaffoldOptions,
    options?: ScaffolderRequestOptions,
  ): Promise<ScaffolderScaffoldResponse> {
    const response = await this.apiClient.scaffold(
      {
        body: request,
      },
      options,
    );

    if (response.status !== 201) {
      const status = `${response.status} ${response.statusText}`;
      const body = await response.text();
      throw new Error(`Backend request failed, ${status} ${body.trim()}`);
    }

    const { id } = await response.json();
    return { taskId: id };
  }

  /**
   * {@inheritdoc ScaffolderApi.getTask}
   */
  async getTask(
    taskId: string,
    options?: ScaffolderRequestOptions,
  ): Promise<ScaffolderTask> {
    return await this.requestRequired(
      await this.apiClient.getTask(
        {
          path: { taskId },
        },
        options,
      ),
    );
  }

  /**
   * {@inheritdoc ScaffolderApi.streamLogs}
   */
  streamLogs(
    request: ScaffolderStreamLogsOptions,
    options?: ScaffolderRequestOptions,
  ): Observable<LogEvent> {
    if (this.useLongPollingLogs) {
      return this.streamLogsPolling(request, options);
    }

    return this.streamLogsEventStream(request);
  }

  /**
   * {@inheritdoc ScaffolderApi.dryRun}
   */
  async dryRun(
    request: ScaffolderDryRunOptions,
    options?: ScaffolderRequestOptions,
  ): Promise<ScaffolderDryRunResponse> {
    return await this.requestRequired(
      await this.apiClient.dryRun(
        {
          body: {
            template: request.template,
            values: request.values,
            secrets: request.secrets,
            directoryContents: request.directoryContents,
          },
        },
        options,
      ),
    );
  }

  private streamLogsEventStream({
    isTaskRecoverable,
    taskId,
    after,
  }: ScaffolderStreamLogsOptions): Observable<LogEvent> {
    return new ObservableImpl(subscriber => {
      const params = new URLSearchParams();
      if (after !== undefined) {
        params.set('after', String(Number(after)));
      }

      this.discoveryApi.getBaseUrl('scaffolder').then(
        baseUrl => {
          const url = `${baseUrl}/v2/tasks/${encodeURIComponent(
            taskId,
          )}/eventstream`;

          const processEvent = (event: any) => {
            if (event.data) {
              try {
                subscriber.next(JSON.parse(event.data));
              } catch (ex) {
                subscriber.error(ex);
              }
            }
          };

          const ctrl = new AbortController();
          void fetchEventSource(url, {
            fetch: this.fetchApi.fetch,
            signal: ctrl.signal,
            onmessage(e: EventSourceMessage) {
              if (e.event === 'log') {
                processEvent(e);
                return;
              } else if (e.event === 'completion' && !isTaskRecoverable) {
                processEvent(e);
                subscriber.complete();
                ctrl.abort();
                return;
              }
              processEvent(e);
            },
            onerror(err) {
              subscriber.error(err);
            },
          });
        },
        error => {
          subscriber.error(error);
        },
      );
    });
  }

  private streamLogsPolling(
    {
      taskId,
      after: inputAfter,
    }: {
      taskId: string;
      after?: number;
    },
    options?: ScaffolderRequestOptions,
  ): Observable<LogEvent> {
    let after = inputAfter;

    return new ObservableImpl(subscriber => {
      (async () => {
        while (!subscriber.closed) {
          const response = await this.apiClient.streamLogsPolling(
            {
              path: { taskId },
              query: { after },
            },
            options,
          );

          if (!response.ok) {
            // wait for one second to not run into an
            await new Promise(resolve => setTimeout(resolve, 1000));
            continue;
          }

          const logs = (await response.json()) as LogEvent[];

          for (const event of logs) {
            after = Number(event.id);

            subscriber.next(event);

            if (event.type === 'completion') {
              subscriber.complete();
              return;
            }
          }
        }
      })();
    });
  }

  /**
   * {@inheritdoc ScaffolderApi.listActions}
   */
  async listActions(
    options?: ScaffolderRequestOptions,
  ): Promise<ListActionsResponse> {
    return await this.requestRequired(
      await this.apiClient.listActions(null as any, options),
    );
  }

  /**
   * {@inheritdoc ScaffolderApi.listTemplatingExtensions}
   */
  async listTemplatingExtensions(
    options?: ScaffolderRequestOptions,
  ): Promise<ListTemplatingExtensionsResponse> {
    return await this.requestRequired(
      await this.apiClient.listTemplatingExtensions(null as any, options),
    );
  }

  /**
   * {@inheritdoc ScaffolderApi.cancelTask}
   */
  async cancelTask(
    taskId: string,
    options?: ScaffolderRequestOptions,
  ): Promise<{ status?: TaskStatus }> {
    return await this.requestRequired(
      await this.apiClient.cancelTask({ path: { taskId } }, options),
    );
  }

  /**
   * {@inheritdoc ScaffolderApi.retry}
   */
  async retry?(
    taskId: string,
    options?: ScaffolderRequestOptions,
  ): Promise<{ id: string }> {
    return await this.requestRequired(
      await this.apiClient.retry({ body: {}, path: { taskId } }, options),
    );
  }

  /**
   * {@inheritdoc ScaffolderApi.retry}
   */
  async autocomplete({
    token,
    resource,
    provider,
    context,
  }: {
    token: string;
    provider: string;
    resource: string;
    context: Record<string, string>;
  }): Promise<{ results: { title?: string; id: string }[] }> {
    return await this.requestRequired(
      await this.apiClient.autocomplete({
        path: { provider, resource },
        body: { token, context },
      }),
    );
  }

  //
  // Private methods
  //

  private async requestRequired<T>(response: TypedResponse<T>): Promise<T> {
    if (!response.ok) {
      throw await ResponseError.fromResponse(response);
    }

    return response.json();
  }
}
