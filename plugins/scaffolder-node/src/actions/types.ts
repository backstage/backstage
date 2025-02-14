/*
 * Copyright 2023 The Backstage Authors
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

import type {
  BackstageCredentials,
  LoggerService,
} from '@backstage/backend-plugin-api';
import type { UserEntity } from '@backstage/catalog-model';
import type { TemplateInfo } from '@backstage/plugin-scaffolder-common';
import type { JsonObject, JsonValue, Expand } from '@backstage/types';
import type { Schema } from 'jsonschema';
import type { Writable } from 'stream';
import type { Logger } from 'winston';
import { z } from 'zod';
import type { TaskSecrets } from '../tasks';

/**
 * @public
 */
export type TemplateExample = {
  description: string;
  example: string;
};

/** @public */
export type InferActionType<
  T extends Record<PropertyKey, (zod: typeof z) => z.ZodType>,
> = Expand<{
  [K in keyof T]: T[K] extends (
    zod: typeof z,
  ) => z.ZodType<any, any, infer IReturn>
  ? Extract<IReturn, JsonValue | undefined>
  : never;
}>;

/**
 * ActionContextV1 is passed into scaffolder actions.
 * @deprecated migrate to {@link ActionContextV2}
 * @public
 */
export type ActionContextV1<
  TActionInput extends JsonObject = JsonObject,
  TActionOutput extends JsonObject = JsonObject,
> = {
  // TODO(blam): move this to LoggerService
  logger: Logger;
  /** @deprecated - use `ctx.logger` instead */
  logStream: Writable;
  secrets?: TaskSecrets;
  workspacePath: string;
  input: TActionInput;
  checkpoint<T extends JsonValue | void>(opts: {
    key: string;
    fn: () => Promise<T> | T;
  }): Promise<T>;
  output(
    ...params: {
      /* This maps the key to the value for type checking */
      [K in keyof TActionOutput]: [name: K, value: TActionOutput[K]];
    }[keyof TActionOutput]
  ): void;

  /**
   * Creates a temporary directory for use by the action, which is then cleaned up automatically.
   */
  createTemporaryDirectory(): Promise<string>;

  /**
   * Get the credentials for the current request
   */
  getInitiatorCredentials(): Promise<BackstageCredentials>;

  /**
   * Task information
   */
  task: {
    id: string;
  };

  templateInfo?: TemplateInfo;

  /**
   * Whether this action invocation is a dry-run or not.
   * This will only ever be true if the actions as marked as supporting dry-runs.
   */
  isDryRun?: boolean;

  /**
   * The user which triggered the action.
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
   * Implement the signal to make your custom step abortable https://developer.mozilla.org/en-US/docs/Web/API/AbortController/signal
   */
  signal?: AbortSignal;

  /**
   * Optional value of each invocation
   */
  each?: JsonObject;
};

/**
 * ActionContextV2 is passed into scaffolder actions.
 * @public
 */
export type ActionContextV2<
  TActionInput extends JsonObject = JsonObject,
  TActionOutput extends JsonObject = JsonObject,
> = {
  logger: LoggerService;
  secrets?: TaskSecrets;
  workspacePath: string;
  input: TActionInput;
  checkpoint<U extends JsonValue>(
    key: string,
    fn: () => Promise<U>,
  ): Promise<U>;
  output(
    ...params: {
      /* This maps the key to the value for type checking */
      [K in keyof TActionOutput]: [name: K, value: TActionOutput[K]];
    }[keyof TActionOutput]
  ): void;

  /**
   * Creates a temporary directory for use by the action, which is then cleaned up automatically.
   */
  createTemporaryDirectory(): Promise<string>;

  /**
   * Get the credentials for the current request
   */
  getInitiatorCredentials(): Promise<BackstageCredentials>;

  templateInfo?: TemplateInfo;

  /**
   * Whether this action invocation is a dry-run or not.
   * This will only ever be true if the actions as marked as supporting dry-runs.
   */
  isDryRun?: boolean;

  /**
   * The user which triggered the action.
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
   * Implement the signal to make your custom step abortable https://developer.mozilla.org/en-US/docs/Web/API/AbortController/signal
   */
  signal?: AbortSignal;

  /**
   * Optional value of each invocation
   */
  each?: JsonObject;
};

/**
 * @deprecated migrate to {@link ActionContextV2}
 * @public
 */
export type ActionContext<
  TActionInput extends JsonObject = JsonObject,
  TActionOutput extends JsonObject = JsonObject,
> = ActionContextV2<TActionInput, TActionOutput>;

/**
 * @deprecated migrate to {@link TemplateActionV2}
 * @public
 */
export type TemplateActionV1<
  TActionInput extends JsonObject = JsonObject,
  TActionOutput extends JsonObject = JsonObject,
> = {
  id: string;
  description?: string;
  examples?: TemplateExample[];
  supportsDryRun?: boolean;
  schema?: {
    input?: Schema;
    output?: Schema;
  };
  handler: (ctx: ActionContextV1<TActionInput, TActionOutput>) => Promise<void>;
};

/**
 * @public
 */
export type TemplateActionV2<
  TActionInput extends JsonObject = JsonObject,
  TActionOutput extends JsonObject = JsonObject,
> = {
  id: string;
  description?: string;
  examples?: TemplateExample[];
  supportsDryRun?: boolean;
  schema: {
    input: Schema;
    output: Schema;
  };
  handler: (ctx: ActionContextV2<TActionInput, TActionOutput>) => Promise<void>;
};

/**
 * @deprecated migrate to {@link ActionContextV2}
 * @public
 */
export type TemplateAction<
  TActionInput extends JsonObject = JsonObject,
  TActionOutput extends JsonObject = JsonObject,
> = TemplateActionV1<TActionInput, TActionOutput>;
