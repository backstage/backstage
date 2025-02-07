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
import { getCodeownersFilePath } from '../../codeowners';
import { paths } from '../../paths';
import { NewConfig } from '../types';
import { customPrompt, getPromptsForRole, ownerPrompt } from './prompts';
import { NewTemplate } from '../types';

type CollectTemplateParamsOptions = {
  config: NewConfig;
  template: NewTemplate;
  prefilledParams: Record<string, string | number | boolean>;
};

export async function collectTemplateParams(
  options: CollectTemplateParamsOptions,
): Promise<Record<string, string | number | boolean>> {
  const { config, template, prefilledParams } = options;

  const codeOwnersFilePath = await getCodeownersFilePath(paths.targetRoot);

  const prompts = getPromptsForRole(template.role);

  if (codeOwnersFilePath) {
    prompts.push(ownerPrompt());
  }
  if (template.prompts) {
    prompts.push(...template.prompts.map(customPrompt));
  }

  const needsAnswer = [];
  const prefilledAnswers = {} as Record<string, string | number | boolean>;
  for (const prompt of prompts) {
    if (prompt.name && prefilledParams[prompt.name] !== undefined) {
      prefilledAnswers[prompt.name] = prefilledParams[prompt.name];
    } else {
      needsAnswer.push(prompt);
    }
  }

  const promptAnswers = await inquirer.prompt<
    Record<string, string | number | boolean>
  >(needsAnswer);

  return {
    ...config.globals,
    ...prefilledAnswers,
    ...promptAnswers,
    targetPath: template.targetPath,
  };
}
