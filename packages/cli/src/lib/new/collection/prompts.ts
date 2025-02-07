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
import { NewTemplatePrompt, TemplateRole } from '../types';
import { parseOwnerIds } from '../../codeowners';

export type Prompt<TOptions extends Answers> = DistinctQuestion<TOptions>;
export function namePrompt(): Prompt<{ name: string }> {
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

export function pluginIdPrompt(): Prompt<{ pluginId: string }> {
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

export function moduleIdIdPrompt(): Prompt<{ moduleId: string }> {
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

export function getPromptsForRole(role: TemplateRole) {
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

export function ownerPrompt(): Prompt<{ owner?: string }> {
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

export function buildCustomPrompt(
  prompt: NewTemplatePrompt,
): Prompt<{ [key: string]: string }> {
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
