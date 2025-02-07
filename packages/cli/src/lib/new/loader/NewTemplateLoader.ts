/*
 * Copyright 2025 The Backstage Authors
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

import inquirer from 'inquirer';
import { NewConfig, NewTemplatePointer } from '../config/types';

export class NewTemplateLoader {
  static async selectTemplateInteractively(
    config: NewConfig,
    preselectedTemplateId?: string,
  ): Promise<NewTemplatePointer> {
    let selectedId = preselectedTemplateId;

    if (config.isUsingDefaultTemplates && selectedId === 'plugin') {
      console.warn(
        `DEPRECATION WARNING: The 'plugin' template is deprecated, use 'frontend-plugin' instead`,
      );
      selectedId = 'frontend-plugin';
    }

    if (!selectedId) {
      const answers = await inquirer.prompt<{ id: string }>([
        {
          type: 'list',
          name: 'id',
          message: 'What do you want to create?',
          choices: config.templatePointers.map(t => t.id),
        },
      ]);
      selectedId = answers.id;
    }

    const template = config.templatePointers.find(t => t.id === selectedId);
    if (!template) {
      throw new Error(`Template '${selectedId}' not found`);
    }
    return template;
  }
}
