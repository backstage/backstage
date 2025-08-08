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
import { JsonObject, JsonValue, Observable } from '@backstage/types';
import { JSONSchema7 } from 'json-schema';
import { TaskSpec, TaskStep } from './TaskSpec';
import type {
  TemplateEntityV1beta3,
  TemplateParameterSchema,
} from './TemplateEntityV1beta3';
import type {
  TaskEventType,
  TaskStatus as ScaffolderTaskStatus,
} from './schema/openapi';

export type { ScaffolderTaskStatus, TaskEventType };

/**
 * Options you can pass into a Scaffolder request for additional information.
 *
 * @public
 */
export interface ScaffolderRequestOptions {
  token?: string;
}

/**
 * The shape of each task returned from the `scaffolder-backend`
 *
 * @public
 */
export type ScaffolderTask = {
  id: string;
  spec: TaskSpec;
  status: ScaffolderTaskStatus;
  lastHeartbeatAt?: string;
  createdAt: string;
};

/**
 * A single scaffolder usage example
 *
 * @public
 */
export type ScaffolderUsageExample = {
  description?: string;
  example: string;
  notes?: string;
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
  examples?: ScaffolderUsageExample[];
};

/**
 * The response shape for the `listActions` call to the `scaffolder-backend`
 *
 * @public
 */
export type ListActionsResponse = Array<Action>;

/**
 * The response shape for a single filter in the `listTemplatingExtensions` call to the `scaffolder-backend`
 *
 * @public
 */
export type TemplateFilter = {
  description?: string;
  schema?: {
    input?: JSONSchema7;
    arguments?: JSONSchema7[];
    output?: JSONSchema7;
  };
  examples?: ScaffolderUsageExample[];
};

/**
 * The response shape for a single global function in the `listTemplatingExtensions` call to the `scaffolder-backend`
 *
 * @public
 */
export type TemplateGlobalFunction = {
  description?: string;
  schema?: {
    arguments?: JSONSchema7[];
    output?: JSONSchema7;
  };
  examples?: ScaffolderUsageExample[];
};

/**
 * The response shape for a single global value in the `listTemplatingExtensions` call to the `scaffolder-backend`
 *
 * @public
 */
export type TemplateGlobalValue = {
  description?: string;
  value: JsonValue;
};

/**
 * The response shape for the `listTemplatingExtensions` call to the `scaffolder-backend`
 *
 * @public
 */
export type ListTemplatingExtensionsResponse = {
  filters: Record<string, TemplateFilter>;
  globals: {
    functions: Record<string, TemplateGlobalFunction>;
    values: Record<string, TemplateGlobalValue>;
  };
};

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
  type: TaskEventType;
  body: {
    message: string;
    stepId?: string;
    status?: ScaffolderTaskStatus;
  };
  createdAt: string;
  id: number;
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
  isTaskRecoverable?: boolean;
  taskId: string;
  after?: number;
}

/** @public */
export interface ScaffolderDryRunOptions {
  template: TemplateEntityV1beta3;
  values: JsonObject;
  secrets?: Record<string, string>;
  directoryContents: { path: string; base64Content: string }[];
}

/** @public */
export interface ScaffolderDryRunResponse {
  directoryContents: Array<{
    path: string;
    base64Content: string;
    executable?: boolean;
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
    options?: ScaffolderRequestOptions,
  ): Promise<TemplateParameterSchema>;

  /**
   * Executes the scaffolding of a component, given a template and its
   * parameter values.
   *
   * @param options - The {@link ScaffolderScaffoldOptions} the scaffolding.
   */
  scaffold(
    request: ScaffolderScaffoldOptions,
    options?: ScaffolderRequestOptions,
  ): Promise<ScaffolderScaffoldResponse>;

  getTask(
    taskId: string,
    options?: ScaffolderRequestOptions,
  ): Promise<ScaffolderTask>;

  /**
   * Sends a signal to a task broker to cancel the running task by taskId.
   *
   * @param taskId - the id of the task
   */
  cancelTask(
    taskId: string,
    options?: ScaffolderRequestOptions,
  ): Promise<{ status?: ScaffolderTaskStatus }>;

  /**
   * Starts the task again from the point where it failed.
   *
   * @param taskId - the id of the task
   */
  retry?(
    taskId: string,
    options?: ScaffolderRequestOptions,
  ): Promise<{ id: string }>;

  listTasks?(
    request: {
      filterByOwnership: 'owned' | 'all';
      limit?: number;
      offset?: number;
    },
    options?: ScaffolderRequestOptions,
  ): Promise<{ tasks: ScaffolderTask[]; totalTasks?: number }>;

  getIntegrationsList(
    options: ScaffolderGetIntegrationsListOptions,
  ): Promise<ScaffolderGetIntegrationsListResponse>;

  /**
   * Returns a list of all installed actions.
   */
  listActions(options?: ScaffolderRequestOptions): Promise<ListActionsResponse>;

  /**
   * Returns a structure describing the available templating extensions.
   */
  listTemplatingExtensions?(
    options?: ScaffolderRequestOptions,
  ): Promise<ListTemplatingExtensionsResponse>;

  streamLogs(
    request: ScaffolderStreamLogsOptions,
    options?: ScaffolderRequestOptions,
  ): Observable<LogEvent>;

  dryRun?(
    request: ScaffolderDryRunOptions,
    options?: ScaffolderRequestOptions,
  ): Promise<ScaffolderDryRunResponse>;

  autocomplete?(
    request: {
      token: string;
      provider: string;
      resource: string;
      context: Record<string, string>;
    },
    options?: ScaffolderRequestOptions,
  ): Promise<{ results: { title?: string; id: string }[] }>;
}
