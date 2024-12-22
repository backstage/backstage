/*
 * Copyright 2024 The Backstage Authors
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
import { dirname } from 'path';
import { parse } from 'yaml';
import fs from 'fs-extra';

import { paths } from '../paths';
import { Template, TemplateLocation, CliConfig } from './types';

import defaultTemplates from '../../../templates/all-default-templates';

export function readCliConfig(cliConfig: CliConfig) {
  let templates: TemplateLocation[] = [];

  if (!cliConfig || cliConfig?.defaults) {
    templates = defaultTemplates;
  }

  const cliTemplates = cliConfig?.templates;
  if (cliTemplates?.length) {
    cliTemplates.forEach((template: TemplateLocation) => {
      templates.push({
        id: template.id,
        target: template.target,
      });
    });
  }
  return {
    templates,
    globals: { ...cliConfig?.globals },
  };
}

export async function templateSelector(
  templates: TemplateLocation[],
): Promise<TemplateLocation> {
  const answer = await inquirer.prompt<{ name: TemplateLocation }>([
    {
      type: 'list',
      name: 'name',
      message: 'What do you want to create?',
      choices: templates.map(template => {
        return {
          name: template.id,
          value: template,
        };
      }),
    },
  ]);
  return answer.name;
}

export function verifyTemplate({ id, target }: TemplateLocation): Template {
  if (target.startsWith('http')) {
    throw new Error('Remote templates are not supported yet');
  }
  if (!fs.existsSync(paths.resolveTargetRoot(target))) {
    throw new Error(`Your CLI template does not exist: ${target}`);
  }
  const template = parse(
    fs.readFileSync(paths.resolveTargetRoot(target), 'utf-8'),
  );
  const templatePath = paths.resolveTargetRoot(
    dirname(target),
    template.template,
  );
  if (!fs.existsSync(templatePath)) {
    throw new Error(
      `Your CLI template skeleton does not exist: ${templatePath}`,
    );
  }
  if (!template.targetPath) {
    throw new Error(`Your template, ${id}, is missing a targetPath`);
  }
  return { id, templatePath, ...template };
}
