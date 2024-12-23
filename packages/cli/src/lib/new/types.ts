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

import { Answers, DistinctQuestion } from 'inquirer';

export type CliConfig =
  | {
      /** Setting this to false will omit default backstage-cli new templates */
      defaults?: boolean;
      /** Where you can explicitly declare templates */
      templates?: TemplateLocation[];
      /** For configuring global values that applies to all new plugins/packages */
      globals?: Record<string, string>;
    }
  | undefined;

export interface CreateContext {
  /** Whether we are creating something in a monorepo or not */
  isMonoRepo: boolean;

  /** Creates a temporary directory. This will always be deleted after creation is done. */
  createTemporaryDirectory(name: string): Promise<string>;

  /** Signal that the creation process got to a point where permanent modifications were made */
  markAsModified(): void;
}

export type Prompt<TOptions extends Answers> = DistinctQuestion<TOptions> & {
  name: string;
};

export type ConfigurablePrompt =
  | {
      id: string;
      prompt: string;
      validate?: string;
      default?: string | boolean;
    }
  | string;

export interface Template {
  id: string;
  description?: string;
  template: string;
  templatePath: string;
  targetPath: string;
  plugin?: boolean;
  backendModulePrefix?: boolean;
  suffix?: string;
  prompts?: ConfigurablePrompt[];
  additionalActions?: string[];
}

export interface TemplateLocation {
  id: string;
  target: string;
}
