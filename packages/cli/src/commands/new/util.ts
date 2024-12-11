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

import { paths } from '../../lib/paths';
import {
  pluginIdPrompt,
  moduleIdIdPrompt,
  npmRegistryPrompt,
  ownerPrompt,
} from '../../lib/new/factories/common/prompts';
import defaultTemplates from '../../../templates';

import { Template, TemplateLocation, ConfigurablePrompt } from './types';

export async function readCliConfig(
  cliConfig:
    | {
        defaults?: boolean;
        templates?: TemplateLocation[];
        globals?: Record<string, string>;
      }
    | undefined,
) {
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

export async function verifyTemplate({
  id,
  target,
}: TemplateLocation): Promise<Template> {
  if (target.startsWith('http')) {
    throw new Error('Remote templates are not supported yet');
  }
  const template = parse(fs.readFileSync(target, 'utf-8'));
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

interface Options extends Record<string, string | boolean> {
  id: string;
  private: boolean;
  baseVersion: string;
  license: string;
  targetDir: string;
  owner: string;
  scope: string;
}

async function calculateBaseVersion(baseVersion: string) {
  if (!baseVersion) {
    const lernaVersion = await fs
      .readJson(paths.resolveTargetRoot('lerna.json'))
      .then(pkg => pkg.version)
      .catch(() => undefined);
    if (lernaVersion) {
      return lernaVersion;
    }
    return '0.1.0';
  }
  return baseVersion;
}

export async function populateOptions(
  prompts: Record<string, string>,
  template: Template,
): Promise<Options> {
  return {
    id: prompts.id,
    private: false,
    baseVersion: await calculateBaseVersion(prompts.baseVersion),
    owner: prompts.owner ?? '',
    license: prompts.license ?? 'Apache-2.0',
    targetDir: paths.resolveTargetRoot(
      prompts.targetPath ?? template.targetPath,
      prompts.id as string,
    ),
    scope: prompts.scope ?? '',
    ...prompts,
  };
}
