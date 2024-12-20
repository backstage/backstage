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

import inquirer from 'inquirer';
import { Prompt, ConfigurablePrompt } from './types';
import { parseOwnerIds } from '../codeowners';

export function pluginIdPrompt(): Prompt<{ id: string }> {
  return {
    type: 'input',
    name: 'id',
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

export function npmRegistryPrompt(): Prompt<{ npmRegistry: string }> {
  return {
    type: 'input',
    name: 'npmRegistry',
    message: 'Please specify your NPM registry [optional]',
    validate: (value: string) => {
      if (!value) {
        return 'Please enter the URL of your NPM registry';
      } else if (!/^http*$/.test(value)) {
        return 'Invalid URL.';
      }
      return true;
    },
  };
}

export function ownerPrompt(
  codeOwnersPath: string | undefined,
): Prompt<{ owner?: string }> {
  return {
    type: 'input',
    name: 'owner',
    message: 'Enter an owner to add to CODEOWNERS [optional]',
    when: Boolean(codeOwnersPath),
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

export async function promptOptions({
  prompts,
  globals,
  codeOwnersFilePath,
}: {
  prompts: ConfigurablePrompt[];
  globals: Record<string, string>;
  codeOwnersFilePath: string | undefined;
}): Promise<Record<string, string>> {
  const answers = await inquirer.prompt(
    prompts.map((prompt: ConfigurablePrompt) => {
      if (typeof prompt === 'string') {
        switch (prompt) {
          case 'id':
            return pluginIdPrompt();
          case 'moduleid':
            return moduleIdIdPrompt();
          case 'npmregistry':
            return npmRegistryPrompt();
          case 'owner':
            return ownerPrompt(codeOwnersFilePath);
          default:
            throw new Error(
              `There is no built-in prompt with the following id: ${prompt}`,
            );
        }
      }
      return {
        type: 'input',
        name: prompt.id,
        message: prompt.prompt,
        default:
          globals[prompt.id] !== undefined
            ? globals[prompt.id]
            : prompt.default,
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
    }),
  );
  return { ...globals, ...answers };
}
