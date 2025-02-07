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

import { z } from 'zod';
import fs from 'fs-extra';
import inquirer from 'inquirer';
import { dirname } from 'node:path';
import { parse as parseYaml } from 'yaml';
import { paths } from '../../paths';
import { NewConfig, NewTemplatePointer } from '../config/types';
import { Template } from '../types';
import { ForwardedError } from '@backstage/errors';
import { fromZodError } from 'zod-validation-error';

const templateDefinitionSchema = z
  .object({
    description: z.string().optional(),
    template: z.string(),
    targetPath: z.string(),
    plugin: z.boolean().optional(),
    backendModulePrefix: z.boolean().optional(),
    suffix: z.string().optional(),
    prompts: z
      .array(
        z.union([
          z.string(),
          z.object({
            id: z.string(),
            prompt: z.string(),
            validate: z.string().optional(),
            default: z.union([z.string(), z.boolean(), z.number()]).optional(),
          }),
        ]),
      )
      .optional(),
    additionalActions: z.array(z.string()).optional(),
  })
  .strict();

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

  static async loadTemplate({
    id,
    target,
  }: NewTemplatePointer): Promise<Template> {
    if (target.match(/https?:\/\//)) {
      throw new Error('Remote templates are not supported yet');
    }
    if (!fs.existsSync(paths.resolveTargetRoot(target))) {
      throw new Error(`Your CLI template does not exist: ${target}`);
    }
    const rawTemplate = parseYaml(
      fs.readFileSync(paths.resolveTargetRoot(target), 'utf-8'),
    );

    const parsed = templateDefinitionSchema.safeParse(rawTemplate);
    if (!parsed.success) {
      throw new ForwardedError(
        `Invalid template definition at '${target}'`,
        fromZodError(parsed.error),
      );
    }

    const template = parsed.data;

    const templatePath = paths.resolveTargetRoot(
      dirname(target),
      template.template,
    );
    if (!fs.existsSync(templatePath)) {
      throw new Error(
        `Your CLI template skeleton does not exist: ${templatePath}`,
      );
    }
    return { id, templatePath, ...template };
  }
}
