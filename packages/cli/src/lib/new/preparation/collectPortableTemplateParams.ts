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

import inquirer, { DistinctQuestion } from 'inquirer';
import { getCodeownersFilePath, parseOwnerIds } from '../../codeowners';
import { paths } from '../../paths';
import {
  PortableTemplateConfig,
  PortableTemplatePrompt,
  PortableTemplateRole,
} from '../types';
import { PortableTemplate } from '../types';

type CollectTemplateParamsOptions = {
  config: PortableTemplateConfig;
  template: PortableTemplate;
  prefilledParams: Record<string, string | number | boolean>;
};

export async function collectPortableTemplateParams(
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

export function namePrompt(): DistinctQuestion {
  return {
    type: 'input',
    name: 'name',
    message: 'Enter the name of the package, without scope [required]',
    validate: (value: string) => {
      if (!value) {
        return 'Please enter the name of the package';
      } else if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(value)) {
        return 'Package names must be lowercase and contain only letters, digits, and dashes.';
      }
      return true;
    },
  };
}

export function pluginIdPrompt(): DistinctQuestion {
  return {
    type: 'input',
    name: 'pluginId',
    message: 'Enter the ID of the plugin [required]',
    validate: (value: string) => {
      if (!value) {
        return 'Please enter the ID of the plugin';
      } else if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(value)) {
        return 'Plugin IDs must be lowercase and contain only letters, digits, and dashes.';
      }
      return true;
    },
  };
}

export function moduleIdIdPrompt(): DistinctQuestion {
  return {
    type: 'input',
    name: 'moduleId',
    message: 'Enter the ID of the module [required]',
    validate: (value: string) => {
      if (!value) {
        return 'Please enter the ID of the module';
      } else if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(value)) {
        return 'Module IDs must be lowercase and contain only letters, digits, and dashes.';
      }
      return true;
    },
  };
}

export function getPromptsForRole(
  role: PortableTemplateRole,
): Array<DistinctQuestion> {
  switch (role) {
    case 'web-library':
    case 'node-library':
    case 'common-library':
      return [namePrompt()];
    case 'plugin-web-library':
    case 'plugin-node-library':
    case 'plugin-common-library':
    case 'frontend-plugin':
    case 'backend-plugin':
      return [pluginIdPrompt()];
    case 'frontend-plugin-module':
    case 'backend-plugin-module':
      return [pluginIdPrompt(), moduleIdIdPrompt()];
    default:
      return [];
  }
}

export function ownerPrompt(): DistinctQuestion {
  return {
    type: 'input',
    name: 'owner',
    message: 'Enter an owner to add to CODEOWNERS [optional]',
    validate: (value: string) => {
      if (!value) {
        return true;
      }

      const ownerIds = parseOwnerIds(value);
      if (!ownerIds) {
        return 'The owner must be a space separated list of team names (e.g. @org/team-name), usernames (e.g. @username), or the email addresses (e.g. user@example.com).';
      }

      return true;
    },
  };
}

export function customPrompt(prompt: PortableTemplatePrompt): DistinctQuestion {
  return {
    type: 'input',
    name: prompt.id,
    message: prompt.prompt,
    validate: (value: string) => {
      if (!value) {
        return `Please provide a value for ${prompt.id}`;
      } else if (prompt.validate) {
        let valid: boolean;
        let message: string;
        switch (prompt.validate) {
          case 'backstage-id':
            valid = /^[a-z0-9]+(-[a-z0-9]+)*$/.test(value);
            message =
              'Value must be lowercase and contain only letters, digits, and dashes.';
            break;
          default:
            throw new Error(
              `There is no built-in validator with the following id: ${prompt.validate}`,
            );
        }
        return valid || message;
      }
      return true;
    },
  };
}
