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

import { Logger } from 'winston';
import { Writable } from 'stream';
import { JsonValue, JsonObject } from '@backstage/types';
import { Schema } from 'jsonschema';
import { TaskSecrets } from '../tasks/types';
import { TemplateInfo } from '@backstage/plugin-scaffolder-common';

/**
 * ActionContext is passed into scaffolder actions.
 * @public
 */
export type ActionContext<Input extends JsonObject> = {
  logger: Logger;
  logStream: Writable;
  secrets?: TaskSecrets;
  workspacePath: string;
  input: Input;
  output(name: string, value: JsonValue): void;

  /**
   * Creates a temporary directory for use by the action, which is then cleaned up automatically.
   */
  createTemporaryDirectory(): Promise<string>;

  templateInfo?: TemplateInfo;

  /**
   * Whether this action invocation is a dry-run or not.
   * This will only ever be true if the actions as marked as supporting dry-runs.
   */
  isDryRun?: boolean;
};

/** @public */
export type TemplateAction<Input extends JsonObject> = {
  id: string;
  description?: string;
  supportsDryRun?: boolean;
  schema?: {
    input?: Schema;
    output?: Schema;
  };
  handler: (ctx: ActionContext<Input>) => Promise<void>;
};
