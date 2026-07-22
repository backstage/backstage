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
import type { EntityMeta, UserEntity } from '@backstage/catalog-model';
import {
  ScaffolderTaskOutput,
  ScaffolderTaskStatus,
} from '@backstage/plugin-scaffolder-common';

import type { JsonArray, JsonObject, JsonValue } from '@backstage/types';

/**
 * Information about a golden path that is stored on a task specification.
 * Includes a stringified entityRef, and the baseUrl which is usually the relative path of the golden path definition
 *
 * @public
 */
export type GoldenPathInfo = {
  /**
   * The entityRef of the golden path
   */
  entityRef: string;
  /**
   * Where the golden path is stored, so we can resolve relative paths.
   */
  baseUrl?: string;

  /**
   * the GoldenPath entity
   */
  entity?: {
    /**
     * The metadata of the GoldenPath
     */
    metadata: EntityMeta;
  };
};

/**
 * An individual step of a golden paths task, as stored in the database.
 *
 * @public
 */
export interface TaskStep {
  /**
   * A unique identifier for this step.
   */
  id: string;
  /**
   * A display name to show the user.
   */
  name: JsonValue | undefined;
  /**
   * The underlying template ID that will be called as part of running this step.
   */
  template: string;
  /**
   * Additional data that will be passed to the template.
   */
  input?: JsonObject;
  /**
   * When this is false, or if the templated value string evaluates to something that is falsy the step will be skipped.
   */
  if?: string | boolean;
  /**
   * Run step repeatedly
   */
  each?: string | JsonArray;
}

/**
 * A golden paths task as stored in the database, generated from a v1beta1
 * apiVersion GoldenPath.
 *
 * @public
 */
export interface TaskSpecV1beta1 {
  /**
   * The apiVersion string of the TaskSpec.
   */
  apiVersion: 'backstage.io/v1beta1';
  /**
   * This is a JSONSchema which is used to render a form in the frontend
   * to collect user input and validate it against that schema. This can then be used in the `steps` part below to golden paths
   * variables passed from the user into each template in the golden paths.
   */
  parameters: JsonObject;
  /**
   * A list of steps to be executed in sequence which are defined by the golden path.
   */
  steps: TaskStep[];
  /**
   * Some information about the golden path that is stored on the task spec.
   */
  goldenPathInfo?: GoldenPathInfo;
  /**
   * Some decoration of the author of the task that should be available in the context
   */
  user?: {
    /**
     * The decorated entity from the Catalog
     */
    entity?: UserEntity;
    /**
     * An entity ref for the author of the task
     */
    ref?: string;
  };
}

/**
 * A golden paths task as stored in the database, generated from a GoldenPath.
 *
 * @public
 */
export type TaskSpec = TaskSpecV1beta1;

/**
 * The status of the Task
 *
 * @public
 */
export type TaskStatus = 'cancelled' | 'completed' | 'processing';

/**
 * @public
 */
export type TaskEventType = 'completion' | 'log' | 'cancelled' | 'recovered';

/**
 * @public
 */
export type SerializedTaskEvent = {
  id: number;
  isTaskRecoverable?: boolean;
  taskId: string;
  body: {
    message: string;
    stepId?: string;
    status?: ScaffolderTaskStatus;
    error?: Error;
    recoverStrategy?: string;
    output?: ScaffolderTaskOutput;
  };
  type: TaskEventType;
  createdAt: string;
};

/**
 * @public
 */
export type SerializedTaskStatus = {
  taskId: string;
  templateId: string;
  status: string;
};
