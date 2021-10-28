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

import { Config } from '@backstage/config';
import { flyteidl, google } from '@flyteorg/flyteidl/gen/pb-js/flyteidl';
import { FlyteApi } from './FlyteApi';
import {
  FlyteProject,
  FlyteDomain,
  PartialIdentifier,
  FlyteExecution,
} from './types';
import axios, { AxiosRequestConfig } from 'axios';

export class FlyteClient implements FlyteApi {
  public configApi: Config;

  constructor({ configApi }: { configApi: Config }) {
    this.configApi = configApi;
  }

  getFlyteHttpBaseUrl(): string {
    return this.configApi.getString('flyte.httpUrl');
  }

  getFlyteConsoleUrl(): string {
    return this.configApi.getString('flyte.consoleUrl');
  }

  listProjects(): Promise<FlyteProject[]> {
    const flyteBaseUrl = this.getFlyteHttpBaseUrl();
    const options: AxiosRequestConfig = {
      method: 'get',
      responseType: 'arraybuffer',
      headers: { Accept: 'application/octet-stream' },
      url: `${flyteBaseUrl}/api/v1/projects`,
    };

    return axios
      .request(options)
      .then(response => new Uint8Array(response.data))
      .then(data => flyteidl.admin.Projects.decode(data))
      .then(proto =>
        proto.projects.map(project => {
          const domains: FlyteDomain[] = [];
          domains.push.apply(
            domains,
            project.domains!.map(domain => {
              return {
                id: domain!.id!,
                name: domain!.name!,
              };
            }),
          );
          return {
            id: project.id!,
            name: project.name!,
            description: project.description!,
            domains: domains!,
          };
        }),
      );
  }

  listWorkflowIds(
    project: string,
    domain: string,
  ): Promise<PartialIdentifier[]> {
    const flyteBaseUrl = this.getFlyteHttpBaseUrl();
    const options: AxiosRequestConfig = {
      method: 'get',
      responseType: 'arraybuffer',
      headers: { Accept: 'application/octet-stream' },
      url: `${flyteBaseUrl}/api/v1/workflow_ids/${project}/${domain}?limit=5`,
    };
    return axios
      .request(options)
      .then(response => new Uint8Array(response.data))
      .then(data => flyteidl.admin.NamedEntityIdentifierList.decode(data))
      .then(proto =>
        proto.entities.map(entity => {
          return {
            project: entity.project!,
            domain: entity.domain!,
            name: entity.name!,
          };
        }),
      );
  }

  listExecutions(
    project: string,
    domain: string,
    name: string,
    limit: number,
  ): Promise<FlyteExecution[]> {
    const flyteBaseUrl = this.getFlyteHttpBaseUrl();
    const options: AxiosRequestConfig = {
      method: 'get',
      responseType: 'arraybuffer',
      headers: { Accept: 'application/octet-stream' },
      url: `${flyteBaseUrl}/api/v1/executions/${project}/${domain}?filters=eq(workflow.name,${name})&limit=${limit}&sort_by.direction=DESCENDING&sort_by.key=created_at`,
    };

    return axios
      .request(options)
      .then(response => new Uint8Array(response.data))
      .then(data => flyteidl.admin.ExecutionList.decode(data))
      .then(proto =>
        proto.executions.map(execution => {
          const phase: string = getEnumString(execution.closure?.phase || 0);
          const startedAt = timestampToString(
            execution.closure?.startedAt || null,
          );
          const updatedAt = timestampToString(
            execution.closure?.updatedAt || null,
          );
          return {
            workflowExecutionId: {
              project: execution.id!.project!,
              domain: execution.id!.domain!,
              name: execution.id!.name!,
            },
            phase: phase,
            startedAt: startedAt,
            updatedAt: updatedAt,
            executionConsoleUrl: `${this.getFlyteConsoleUrl()}/console/projects/${execution.id!
              .project!}/domains/${execution.id!
              .domain!}/executions/${execution.id!.name!}`,
          };
        }),
      );
  }
}

function getEnumString(value: Number): string {
  switch (value) {
    case 0:
      return 'UNDEFINED';
    case 1:
      return 'QUEUED';
    case 2:
      return 'RUNNING';
    case 3:
      return 'SUCCEEDING';
    case 4:
      return 'SUCCEEDED';
    case 5:
      return 'FAILING';
    case 6:
      return 'FAILED';
    case 7:
      return 'ABORTED';
    case 8:
      return 'TIMED_OUT';
    default:
      return 'UNKNOWN';
  }
}
function timestampToString(
  timestamp: google.protobuf.ITimestamp | null,
): string {
  if (timestamp === null) {
    return '';
  }
  const nanos = timestamp.nanos || 0;
  const seconds = Number(timestamp.seconds) || 0;
  const milliseconds = seconds * 1000 + nanos / 1e6;
  return new Date(milliseconds).toISOString();
}
