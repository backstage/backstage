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
import { PortableTemplateConfig, PortableTemplatePointer } from '../types';

export async function selectTemplateInteractively(
  config: PortableTemplateConfig,
  preselectedTemplateName?: string,
): Promise<PortableTemplatePointer> {
  let selectedName = preselectedTemplateName;

  if (config.isUsingDefaultTemplates && selectedName === 'plugin') {
    console.warn(
      `DEPRECATION WARNING: The 'plugin' template is deprecated, use 'frontend-plugin' instead`,
    );
    selectedName = 'frontend-plugin';
  }

  if (!selectedName) {
    const answers = await inquirer.prompt<{ name: string }>([
      {
        type: 'list',
        name: 'name',
        message: 'What do you want to create?',
        choices: config.templatePointers.map(t =>
          t.description
            ? { name: `${t.name} - ${t.description}`, value: t.name }
            : t.name,
        ),
      },
    ]);
    selectedName = answers.name;
  }

  const template = config.templatePointers.find(t => t.name === selectedName);
  if (!template) {
    throw new Error(`Template '${selectedName}' not found`);
  }
  return template;
}
