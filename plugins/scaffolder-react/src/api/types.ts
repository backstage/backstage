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
import { TaskSpec, TaskStep } from '@backstage/plugin-scaffolder-common';
import { JsonObject, JsonValue, Observable } from '@backstage/types';
import { JSONSchema7 } from 'json-schema';
import { TemplateParameterSchema } from '../types';

/**
 * The status of each task in a Scaffolder Job
 *
 * @public
 */
export type ScaffolderTaskStatus =
  | 'cancelled'
  | 'completed'
  | 'failed'
  | 'open'
  | 'processing'
  | 'skipped';

/**
 * The shape of each task returned from the `scaffolder-backend`
 *
 * @public
 */
export type ScaffolderTask = {
  id: string;
  spec: TaskSpec;
  status: 'failed' | 'completed' | 'processing' | 'open' | 'cancelled';
  lastHeartbeatAt: string;
  createdAt: string;
};

/**
 * A single action example
 *
 * @public
 */
export type ActionExample = {
  description: string;
  example: string;
};

/**
 * The response shape for a single action in the `listActions` call to the `scaffolder-backend`
 *
 * @public
 */
export type Action = {
  id: string;
  description?: string;
  schema?: {
    input?: JSONSchema7;
    output?: JSONSchema7;
  };
  examples?: ActionExample[];
};

/**
 * The response shape for the `listActions` call to the `scaffolder-backend`
 *
 * @public
 */
export type ListActionsResponse = Array<Action>;

/** @public */
export type ScaffolderOutputLink = {
  title?: string;
  icon?: string;
  url?: string;
  entityRef?: string;
};

/** @public */
export type ScaffolderOutputText = {
  title?: string;
  icon?: string;
  content?: string;
  default?: boolean;
};

/** @public */
export type ScaffolderTaskOutput = {
  links?: ScaffolderOutputLink[];
  text?: ScaffolderOutputText[];
} & {
  [key: string]: unknown;
};

/**
 * The shape of a `LogEvent` message from the `scaffolder-backend`
 *
 * @public
 */
export type LogEvent = {
  type: 'log' | 'completion' | 'cancelled' | 'recovered';
  body: {
    message: string;
    stepId?: string;
    status?: ScaffolderTaskStatus;
  };
  createdAt: string;
  id: string;
  taskId: string;
};

/**
 * The input options to the `scaffold` method of the `ScaffolderClient`.
 *
 * @public
 */
export interface ScaffolderScaffoldOptions {
  templateRef: string;
  values: Record<string, JsonValue>;
  secrets?: Record<string, string>;
}

/**
 * The response shape of the `scaffold` method of the `ScaffolderClient`.
 *
 * @public
 */
export interface ScaffolderScaffoldResponse {
  taskId: string;
}

/**
 * The arguments for `getIntegrationsList`.
 *
 * @public
 */
export interface ScaffolderGetIntegrationsListOptions {
  allowedHosts: string[];
}

/**
 * The response shape for `getIntegrationsList`.
 *
 * @public
 */
export interface ScaffolderGetIntegrationsListResponse {
  integrations: { type: string; title: string; host: string }[];
}

/**
 * The input options to the `streamLogs` method of the `ScaffolderClient`.
 *
 * @public
 */
export interface ScaffolderStreamLogsOptions {
  taskId: string;
  after?: number;
}

/** @public */
export interface ScaffolderDryRunOptions {
  template: JsonValue;
  values: JsonObject;
  secrets?: Record<string, string>;
  directoryContents: { path: string; base64Content: string }[];
}

/** @public */
export interface ScaffolderDryRunResponse {
  directoryContents: Array<{
    path: string;
    base64Content: string;
    executable: boolean;
  }>;
  log: Array<Pick<LogEvent, 'body'>>;
  steps: TaskStep[];
  output: ScaffolderTaskOutput;
}
/**
 * An API to interact with the scaffolder backend.
 *
 * @public
 */
export interface ScaffolderApi {
  getTemplateParameterSchema(
    templateRef: string,
  ): Promise<TemplateParameterSchema>;

  /**
   * Executes the scaffolding of a component, given a template and its
   * parameter values.
   *
   * @param options - The {@link ScaffolderScaffoldOptions} the scaffolding.
   */
  scaffold(
    options: ScaffolderScaffoldOptions,
  ): Promise<ScaffolderScaffoldResponse>;

  getTask(taskId: string): Promise<ScaffolderTask>;

  /**
   * Sends a signal to a task broker to cancel the running task by taskId.
   *
   * @param taskId - the id of the task
   */
  cancelTask(taskId: string): Promise<void>;

  listTasks?(options: {
    filterByOwnership: 'owned' | 'all';
  }): Promise<{ tasks: ScaffolderTask[] }>;

  getIntegrationsList(
    options: ScaffolderGetIntegrationsListOptions,
  ): Promise<ScaffolderGetIntegrationsListResponse>;

  /**
   * Returns a list of all installed actions.
   */
  listActions(): Promise<ListActionsResponse>;

  streamLogs(options: ScaffolderStreamLogsOptions): Observable<LogEvent>;

  dryRun?(options: ScaffolderDryRunOptions): Promise<ScaffolderDryRunResponse>;

  autocomplete?(options: {
    token: string;
    provider: string;
    resource: string;
    context?: Record<string, string>;
  }): Promise<{ results: { title: string }[] }>;
}
