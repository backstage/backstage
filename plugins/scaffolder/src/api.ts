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

import { EntityName } from '@backstage/catalog-model';
import {
  createApiRef,
  DiscoveryApi,
  IdentityApi,
} from '@backstage/core-plugin-api';
import { ResponseError } from '@backstage/errors';
import { ScmIntegrationRegistry } from '@backstage/integration';
import { JsonObject, JsonValue, Observable } from '@backstage/types';
import { Field, FieldValidation } from '@rjsf/core';
import qs from 'qs';
import ObservableImpl from 'zen-observable';
import { ListActionsResponse, ScaffolderTask, Status } from './types';

export const scaffolderApiRef = createApiRef<ScaffolderApi>({
  id: 'plugin.scaffolder.service',
  description: 'Used to make requests towards the scaffolder backend',
});

type TemplateParameterSchema = {
  title: string;
  steps: Array<{
    title: string;
    schema: JsonObject;
  }>;
};

export type LogEvent = {
  type: 'log' | 'completion';
  body: {
    message: string;
    stepId?: string;
    status?: Status;
  };
  createdAt: string;
  id: string;
  taskId: string;
};

export type CustomField = {
  name: string;
  component: Field;
  validation: (data: JsonValue, field: FieldValidation) => void;
};

export interface ScaffolderApi {
  getTemplateParameterSchema(
    templateName: EntityName,
  ): Promise<TemplateParameterSchema>;

  /**
   * Executes the scaffolding of a component, given a template and its
   * parameter values.
   *
   * @param templateName Name of the Template entity for the scaffolder to use. New project is going to be created out of this template.
   * @param values Parameters for the template, e.g. name, description
   */
  scaffold(templateName: string, values: Record<string, any>): Promise<string>;

  getTask(taskId: string): Promise<ScaffolderTask>;

  getIntegrationsList(options: {
    allowedHosts: string[];
  }): Promise<{ type: string; title: string; host: string }[]>;

  // Returns a list of all installed actions.
  listActions(): Promise<ListActionsResponse>;

  streamLogs({
    taskId,
    after,
  }: {
    taskId: string;
    after?: number;
  }): Observable<LogEvent>;
}

export class ScaffolderClient implements ScaffolderApi {
  private readonly discoveryApi: DiscoveryApi;
  private readonly identityApi: IdentityApi;
  private readonly scmIntegrationsApi: ScmIntegrationRegistry;
  private readonly useLongPollingLogs: boolean;

  constructor(options: {
    discoveryApi: DiscoveryApi;
    identityApi: IdentityApi;
    scmIntegrationsApi: ScmIntegrationRegistry;
    useLongPollingLogs?: boolean;
  }) {
    this.discoveryApi = options.discoveryApi;
    this.identityApi = options.identityApi;
    this.scmIntegrationsApi = options.scmIntegrationsApi;
    this.useLongPollingLogs = options.useLongPollingLogs ?? false;
  }

  async getIntegrationsList(options: { allowedHosts: string[] }) {
    return [
      ...this.scmIntegrationsApi.azure.list(),
      ...this.scmIntegrationsApi.bitbucket.list(),
      ...this.scmIntegrationsApi.github.list(),
      ...this.scmIntegrationsApi.gitlab.list(),
    ]
      .map(c => ({ type: c.type, title: c.title, host: c.config.host }))
      .filter(c => options.allowedHosts.includes(c.host));
  }

  async getTemplateParameterSchema(
    templateName: EntityName,
  ): Promise<TemplateParameterSchema> {
    const { namespace, kind, name } = templateName;

    const token = await this.identityApi.getIdToken();
    const baseUrl = await this.discoveryApi.getBaseUrl('scaffolder');
    const templatePath = [namespace, kind, name]
      .map(s => encodeURIComponent(s))
      .join('/');
    const url = `${baseUrl}/v2/templates/${templatePath}/parameter-schema`;

    const response = await fetch(url, {
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
      },
    });

    if (!response.ok) {
      throw await ResponseError.fromResponse(response);
    }

    const schema: TemplateParameterSchema = await response.json();
    return schema;
  }

  /**
   * Executes the scaffolding of a component, given a template and its
   * parameter values.
   *
   * @param templateName Template name for the scaffolder to use. New project is going to be created out of this template.
   * @param values Parameters for the template, e.g. name, description
   */
  async scaffold(
    templateName: string,
    values: Record<string, any>,
  ): Promise<string> {
    const token = await this.identityApi.getIdToken();
    const url = `${await this.discoveryApi.getBaseUrl('scaffolder')}/v2/tasks`;
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: JSON.stringify({ templateName, values: { ...values } }),
    });

    if (response.status !== 201) {
      const status = `${response.status} ${response.statusText}`;
      const body = await response.text();
      throw new Error(`Backend request failed, ${status} ${body.trim()}`);
    }

    const { id } = (await response.json()) as { id: string };
    return id;
  }

  async getTask(taskId: string) {
    const token = await this.identityApi.getIdToken();
    const baseUrl = await this.discoveryApi.getBaseUrl('scaffolder');
    const url = `${baseUrl}/v2/tasks/${encodeURIComponent(taskId)}`;
    const response = await fetch(url, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });

    if (!response.ok) {
      throw ResponseError.fromResponse(response);
    }

    return await response.json();
  }

  streamLogs(opts: { taskId: string; after?: number }): Observable<LogEvent> {
    if (this.useLongPollingLogs) {
      return this.streamLogsPolling(opts);
    }

    return this.streamLogsEventStream(opts);
  }

  private streamLogsEventStream({
    taskId,
    after,
  }: {
    taskId: string;
    after?: number;
  }): Observable<LogEvent> {
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
          const eventSource = new EventSource(url, { withCredentials: true });
          eventSource.addEventListener('log', (event: any) => {
            if (event.data) {
              try {
                subscriber.next(JSON.parse(event.data));
              } catch (ex) {
                subscriber.error(ex);
              }
            }
          });
          eventSource.addEventListener('completion', (event: any) => {
            if (event.data) {
              try {
                subscriber.next(JSON.parse(event.data));
              } catch (ex) {
                subscriber.error(ex);
              }
            }
            eventSource.close();
            subscriber.complete();
          });
          eventSource.addEventListener('error', event => {
            subscriber.error(event);
          });
        },
        error => {
          subscriber.error(error);
        },
      );
    });
  }

  private streamLogsPolling({
    taskId,
    after: inputAfter,
  }: {
    taskId: string;
    after?: number;
  }): Observable<LogEvent> {
    let after = inputAfter;

    return new ObservableImpl(subscriber => {
      this.discoveryApi.getBaseUrl('scaffolder').then(async baseUrl => {
        while (!subscriber.closed) {
          const url = `${baseUrl}/v2/tasks/${encodeURIComponent(
            taskId,
          )}/logs?${qs.stringify({ after })}`;
          const response = await fetch(url);

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
      });
    });
  }

  /**
   * @returns ListActionsResponse containing all registered actions.
   */
  async listActions(): Promise<ListActionsResponse> {
    const baseUrl = await this.discoveryApi.getBaseUrl('scaffolder');
    const token = await this.identityApi.getIdToken();
    const response = await fetch(`${baseUrl}/v2/actions`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });

    if (!response.ok) {
      throw ResponseError.fromResponse(response);
    }

    return await response.json();
  }
}
