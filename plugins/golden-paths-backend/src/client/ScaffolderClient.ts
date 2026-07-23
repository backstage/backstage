/*
 * Copyright 2026 The Backstage Authors
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
import { ScaffolderApi } from './ScaffolderApi';
import {
  ScaffolderClientCancelTaskOptions,
  ScaffolderClientListEventsOptions,
} from './types';
import axios from 'axios';
import { default as queryString } from 'qs';
import { TaskRecoverStrategy } from '@backstage/plugin-scaffolder-common';
import { JsonObject } from '@backstage/types';
import { IncomingHttpHeaders } from 'node:http';
import {
  SerializedTaskEvent,
  TaskEventType,
} from '@backstage/plugin-golden-paths-common';
import { toString } from 'lodash';
import {
  ScaffolderTaskOutput,
  ScaffolderTaskStatus,
} from '@backstage/plugin-scaffolder-common';
import { DiscoveryService } from '@backstage/backend-plugin-api';

/**
 * An API to interact with the scaffolder backend.
 *
 * @public
 */
export class ScaffolderClient implements ScaffolderApi {
  private readonly discoveryApi: DiscoveryService;

  constructor(options: { discoveryApi: DiscoveryService }) {
    this.discoveryApi = options.discoveryApi;
  }

  async createTaskExecution(
    body: JsonObject,
    headers: IncomingHttpHeaders,
  ): Promise<string> {
    const url = `${await this.discoveryApi.getBaseUrl('scaffolder')}/v2/tasks`;
    const token = headers.authorization;
    const result = await axios.post(url, body, {
      headers: { Authorization: token },
    });

    return result.data.id;
  }

  async listEvents(
    options: ScaffolderClientListEventsOptions,
  ): Promise<{ events: SerializedTaskEvent[] }> {
    const { taskId, after, headers } = options;
    const baseUrl = await this.discoveryApi.getBaseUrl('scaffolder');

    const query = queryString.stringify({ after: after });

    const url = `${baseUrl}/v2/tasks/${taskId}/events?${query}`;

    const response = await axios({
      url,
      method: 'GET',
      headers: headers,
    });

    if (response.status >= 400) {
      throw new Error(
        `Status code: ${response.status}, failed with message: ${response.statusText}`,
      );
    }

    const events = this.parseEventsData(response.data);
    return this.trimEventsTillLastRecovery(events);
  }

  private parseEventsData(
    events: {
      id: number;
      isTaskRecoverable?: boolean;
      taskId: string;
      body: JsonObject;
      type: TaskEventType;
      createdAt: string;
    }[],
  ): SerializedTaskEvent[] {
    return events.map(
      ({ id, isTaskRecoverable, taskId, body, type, createdAt }) => ({
        id,
        isTaskRecoverable,
        taskId,
        body: {
          message: toString(body.message),
          stepId: body.stepId ? toString(body.stepId) : undefined,
          status: body.status
            ? (toString(body.status) as ScaffolderTaskStatus)
            : undefined,
          error: body.error ? new Error(toString(body.error)) : undefined,
          recoverStrategy: body.recoverStrategy
            ? toString(body.recoverStrategy)
            : undefined,
          output: body.output
            ? (body.output as ScaffolderTaskOutput)
            : undefined,
        },
        type,
        createdAt: new Date(createdAt).toISOString(),
      }),
    );
  }

  private trimEventsTillLastRecovery(events: SerializedTaskEvent[]): {
    events: SerializedTaskEvent[];
  } {
    const recoveredEventInd = events

      .slice()
      .reverse()
      .findIndex(event => event.type === 'recovered');

    if (recoveredEventInd >= 0) {
      const ind = events.length - recoveredEventInd - 1;
      const { recoverStrategy } = events[ind].body as {
        recoverStrategy: TaskRecoverStrategy;
      };
      if (recoverStrategy === 'startOver') {
        return {
          events: recoveredEventInd === 0 ? [] : events.slice(ind),
        };
      }
    }

    return { events };
  }

  async cancelTask(options: ScaffolderClientCancelTaskOptions): Promise<void> {
    const { taskId, headers } = options;
    const baseUrl = await this.discoveryApi.getBaseUrl('scaffolder');

    const url = `${baseUrl}/v2/tasks/${taskId}/cancel`;

    const response = await axios({
      url,
      method: 'POST',
      headers: headers,
    });

    if (response.status >= 400) {
      throw new Error(
        `Status code: ${response.status}, failed with message: ${response.statusText}`,
      );
    }
  }
}
