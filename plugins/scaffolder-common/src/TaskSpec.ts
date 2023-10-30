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

import type { EntityMeta, UserEntity } from '@backstage/catalog-model';
import type { JsonArray, JsonObject, JsonValue } from '@backstage/types';

/**
 * Information about a template that is stored on a task specification.
 * Includes a stringified entityRef, and the baseUrl which is usually the relative path of the template definition
 *
 * @public
 */
export type TemplateInfo = {
  /**
   * The entityRef of the template
   */
  entityRef: string;
  /**
   * Where the template is stored, so we can resolve relative paths for things like `fetch:template` paths.
   */
  baseUrl?: string;

  /**
   * the Template entity
   */
  entity?: {
    /**
     * The metadata of the Template
     */
    metadata: EntityMeta;
  };
};

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
 * The status of the step being processed
 *
 * @public
 */
export type ScaffolderStep = {
  id: string;
  status: ScaffolderTaskStatus;
  endedAt?: string;
  startedAt?: string;
};

/**
 * The status of each step of the Task
 *
 * @public
 */
export type TaskStatus =
  | 'cancelled'
  | 'completed'
  | 'failed'
  | 'open'
  | 'processing';

/**
 *
 * none - not recover, let the task be marked as failed
 * idempotent - do recover, treat a task as idempotent and rerun the task from the step which has failed.
 * restart - do recover, start the execution of the task from the first step.
 *
 * @public
 */
export type TaskRecoverStrategy = 'none' | 'idempotent' | 'restart';

/**
 * When task didn't have a chance to complete due to system restart you can define the strategy what to do with such tasks,
 * by defining a strategy.
 *
 * By default, it is none, what means to not recover but updating the status from 'processing' to 'failed'.
 *
 * @public
 */
export interface TaskRecovery {
  /**
   * Depends on how you designed your task you might tailor the behaviour for each of them.
   */
  strategy?: TaskRecoverStrategy;
}

/**
 * You can define the recover strategy on the step level.
 * It takes effect only if you specified task recover strategy as idempotent.
 * In some cases you can't or don't want to make your step idempotent, but rather instruct the task engine, that
 * in case of this step failure start the execution from the another step, as it depends on its outcome.
 *
 * One of the examples, when first step is "action: fetch:template" and the second step is "publish:github".
 * If task crashed and execution stopped on the second step, you can't just re-run the second step as you have to
 * fetch the content again to a working directory to push it to a remote repository.
 *
 * @public
 */
export interface TaskStepRecovery {
  /**
   * The name of the step from which the task has to be re-run.
   */
  dependsOn?: string;
}

/**
 * An individual step of a scaffolder task, as stored in the database.
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
  name: string;
  /**
   * The underlying action ID that will be called as part of running this step.
   */
  action: string;
  /**
   * Additional data that will be passed to the action.
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
  /**
   *
   */
  recovery?: TaskStepRecovery;
}

/**
 * TaskEventType
 *
 * @public
 */
export type TaskEventType = 'completion' | 'log' | 'cancelled' | 'recovered';

/**
 * SerializedTaskEvent
 *
 * @public
 */
export type SerializedTaskEvent = {
  id: number;
  taskId: string;
  body: JsonObject;
  type: TaskEventType;
  createdAt: string;
};

/**
 * A scaffolder task as stored in the database, generated from a v1beta3
 * apiVersion Template.
 *
 * @public
 */
export interface TaskSpecV1beta3 {
  /**
   * The apiVersion string of the TaskSpec.
   */
  apiVersion: 'scaffolder.backstage.io/v1beta3';
  /**
   * This is a JSONSchema which is used to render a form in the frontend
   * to collect user input and validate it against that schema. This can then be used in the `steps` part below to template
   * variables passed from the user into each action in the template.
   */
  parameters: JsonObject;
  /**
   * A list of steps to be executed in sequence which are defined by the template. These steps are a list of the underlying
   * javascript action and some optional input parameters that may or may not have been collected from the end user.
   */
  steps: TaskStep[];
  /**
   * The output is an object where template authors can pull out information from template actions and return them in a known standard way.
   */
  output: { [name: string]: JsonValue };
  /**
   * Some information about the template that is stored on the task spec.
   */
  templateInfo?: TemplateInfo;
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
  /**
   * How to recover the task after system restart or system crash.
   */
  recovery?: TaskRecovery;
}

/**
 * A scaffolder task as stored in the database, generated from a Template.
 *
 * @public
 */
export type TaskSpec = TaskSpecV1beta3;
