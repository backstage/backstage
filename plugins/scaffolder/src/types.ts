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
import { TaskSpec } from '@backstage/plugin-scaffolder-common';
import { JsonObject, Observable } from '@backstage/types';
import { JSONSchema7 } from 'json-schema';

export type ScaffolderTaskStatus =
  | 'open'
  | 'processing'
  | 'failed'
  | 'completed'
  | 'skipped';

export type JobStatus = 'PENDING' | 'STARTED' | 'COMPLETED' | 'FAILED';

export type ScaffolderTask = {
  id: string;
  spec: TaskSpec;
  status: 'failed' | 'completed' | 'processing' | 'open' | 'cancelled';
  lastHeartbeatAt: string;
  createdAt: string;
};

export type ListActionsResponse = Array<{
  id: string;
  description?: string;
  schema?: {
    input?: JSONSchema7;
    output?: JSONSchema7;
  };
}>;

type ScaffolderOutputLink = {
  title?: string;
  icon?: string;
  url?: string;
  entityRef?: string;
};

export type ScaffolderTaskOutput = {
  /** @deprecated use the `links` property to link out to relevant resources */
  entityRef?: string;
  /** @deprecated use the `links` property to link out to relevant resources */
  remoteUrl?: string;
  links?: ScaffolderOutputLink[];
} & {
  [key: string]: unknown;
};

export type TemplateParameterSchema = {
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
    status?: ScaffolderTaskStatus;
  };
  createdAt: string;
  id: string;
  taskId: string;
};

export interface ScaffolderScaffoldOptions {
  templateRef: string;
  values: Record<string, any>;
  secrets?: Record<string, string>;
}

export interface ScaffolderScaffoldResponse {
  taskId: string;
}

export interface ScaffolderGetIntegrationsListOptions {
  allowedHosts: string[];
}

export interface ScaffolderGetIntegrationsListResponse {
  integrations: { type: string; title: string; host: string }[];
}

export interface ScaffolderStreamLogsOptions {
  taskId: string;
  after?: number;
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

  getIntegrationsList(
    options: ScaffolderGetIntegrationsListOptions,
  ): Promise<ScaffolderGetIntegrationsListResponse>;

  /**
   * Returns a list of all installed actions.
   */
  listActions(): Promise<ListActionsResponse>;

  streamLogs(options: ScaffolderStreamLogsOptions): Observable<LogEvent>;
}
