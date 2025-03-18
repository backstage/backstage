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
  PortableTemplateInput,
  PortableTemplateInputRoleParams,
  PortableTemplateParams,
  PortableTemplateRole,
} from '../types';
import { PortableTemplate } from '../types';
import { resolvePackageParams } from './resolvePackageParams';

type CollectTemplateParamsOptions = {
  config: PortableTemplateConfig;
  template: PortableTemplate;
  prefilledParams: PortableTemplateParams;
};

export async function collectPortableTemplateInput(
  options: CollectTemplateParamsOptions,
): Promise<PortableTemplateInput> {
  const { config, template, prefilledParams } = options;

  const codeOwnersFilePath = await getCodeownersFilePath(paths.targetRoot);

  const prompts = getPromptsForRole(template.role);

  if (codeOwnersFilePath) {
    prompts.push(ownerPrompt());
  }

  const deprecatedParams: PortableTemplateParams = {};
  if (config.isUsingDefaultTemplates && prefilledParams.id) {
    console.warn(
      `DEPRECATION WARNING: The 'id' parameter is deprecated, use 'pluginId' instead`,
    );
    deprecatedParams.pluginId = prefilledParams.id;
  }

  const parameters = {
    ...template.values,
    ...prefilledParams,
    ...deprecatedParams,
  };

  const needsAnswer = [];
  const prefilledAnswers = {} as PortableTemplateParams;
  for (const prompt of prompts) {
    if (prompt.name && parameters[prompt.name] !== undefined) {
      prefilledAnswers[prompt.name] = parameters[prompt.name];
    } else {
      needsAnswer.push(prompt);
    }
  }

  const promptAnswers = await inquirer.prompt<PortableTemplateParams>(
    needsAnswer,
  );

  const answers = {
    ...prefilledAnswers,
    ...promptAnswers,
  };

  const roleParams = {
    role: template.role,
    name: answers.name,
    pluginId: answers.pluginId,
    moduleId: answers.moduleId,
  } as PortableTemplateInputRoleParams;

  const packageParams = resolvePackageParams({
    roleParams,
    packagePrefix: config.packageNamePrefix,
    pluginInfix: config.packageNamePluginInfix,
  });

  return {
    roleParams,
    owner: answers.owner as string | undefined,
    license: config.license,
    version: config.version,
    private: config.private,
    publishRegistry: config.publishRegistry,
    packageName: packageParams.packageName,
    packagePath: packageParams.packagePath,
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
