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

import { JsonValue } from '@backstage/types';
import { TaskApiTasksResponse } from '@backstage/backend-defaults/scheduler';

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

/** @public */
export type ScheduledTasks = {
  scheduledTasks?: TaskApiTasksResponse[];
  error?: string;
};

/** @public */
export type TriggerScheduledTask = {
  error?: string;
};
