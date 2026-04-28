/*
 * Copyright 2022 The Backstage Authors
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
/* We want to maintain the same information as an enum, so we disable the redeclaration warning */
/* eslint-disable @typescript-eslint/no-redeclare */

import { JsonObject, JsonValue } from '@backstage/types';

/** @public */
export type Endpoint = {
  name: string;
  type: string;
  target: string;
};

/** @public */
export type ExternalDependency = {
  name: string;
  type: string;
  target: string;
  status: string;
  error?: string;
};

/** @public */
export type DevToolsInfo = {
  operatingSystem: string;
  resourceUtilization: string;
  nodeJsVersion: string;
  backstageVersion: string;
  dependencies: PackageDependency[];
};

/** @public */
export type PackageDependency = {
  name: string;
  versions: string;
};

/** @public */
export const ExternalDependencyStatus = {
  healthy: 'Healthy',
  unhealthy: 'Unhealthy',
} as const;

/**
 * @public
 */
export type ExternalDependencyStatus =
  (typeof ExternalDependencyStatus)[keyof typeof ExternalDependencyStatus];

/**
 * @public
 */
export namespace ExternalDependencyStatus {
  export type healthy = typeof ExternalDependencyStatus.healthy;
  export type unhealthy = typeof ExternalDependencyStatus.unhealthy;
}

/** @public */
export type ConfigInfo = {
  config?: JsonValue;
  error?: ConfigError;
};

/** @public */
export type ConfigError = {
  name: string;
  message: string;
  messages?: string[];
  stack?: string;
};

/**
 * The shape of a task definition as returned by the service's REST API.
 * This is a duplication of the below:
 * @see https://github.com/backstage/backstage/blob/master/packages/backend-defaults/src/entrypoints/scheduler/lib/types.ts
 *
 * @alpha
 */
export interface TaskApiTasksResponse {
  taskId: string;
  pluginId: string;
  scope: 'global' | 'local';
  settings: { version: number } & JsonObject;
  taskState:
    | {
        status: 'running';
        startedAt: string;
        timesOutAt?: string;
        lastRunError?: string;
        lastRunEndedAt?: string;
      }
    | {
        status: 'idle';
        startsAt?: string;
        lastRunError?: string;
        lastRunEndedAt?: string;
      }
    | null;
  workerState:
    | {
        status: 'initial-wait';
      }
    | {
        status: 'idle';
      }
    | {
        status: 'running';
      }
    | null;
}

/** @alpha */
export type ScheduledTasks = {
  scheduledTasks?: TaskApiTasksResponse[];
  error?: string;
};

/** @alpha */
export type TriggerScheduledTask = {
  error?: string;
};
