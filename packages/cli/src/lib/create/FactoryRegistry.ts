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

import chalk from 'chalk';
import inquirer from 'inquirer';
import { AnyFactory, Prompt } from './types';
import * as factories from './factories';
import partition from 'lodash/partition';

function applyPromptMessageTransforms<T>(
  prompt: Prompt<T>,
  transforms: {
    message: (msg: string) => string;
    error: (msg: string) => string;
  },
): Prompt<T> {
  return {
    ...prompt,
    message:
      prompt.message &&
      (async answers => {
        if (typeof prompt.message === 'function') {
          return transforms.message(await prompt.message(answers));
        }
        return transforms.message(await prompt.message!);
      }),
    validate:
      prompt.validate &&
      (async (...args) => {
        const result = await prompt.validate!(...args);
        if (typeof result === 'string') {
          return transforms.error(result);
        }
        return result;
      }),
  };
}

export class FactoryRegistry {
  private static factoryMap = new Map<string, AnyFactory>(
    Object.values(factories).map(factory => [factory.name, factory]),
  );

  static async interactiveSelect(preselected?: string): Promise<AnyFactory> {
    let selected = preselected;

    if (!selected) {
      const answers = await inquirer.prompt<{ name: string }>([
        {
          type: 'list',
          name: 'name',
          message: 'What do you want to create?',
          choices: Array.from(this.factoryMap.values()).map(factory => ({
            name: `${factory.name} - ${factory.description}`,
            value: factory.name,
          })),
        },
      ]);
      selected = answers.name;
    }

    const factory = this.factoryMap.get(selected);
    if (!factory) {
      throw new Error(`Unknown selection '${selected}'`);
    }
    return factory;
  }

  static async populateOptions(
    factory: AnyFactory,
    provided: Record<string, string>,
  ): Promise<Record<string, string>> {
    let currentOptions = provided;

    if (factory.optionsDiscovery) {
      const discoveredOptions = await factory.optionsDiscovery();
      currentOptions = {
        ...currentOptions,
        ...(discoveredOptions as Record<string, string>),
      };
    }

    if (factory.optionsPrompts) {
      const [hasAnswers, needsAnswers] = partition(
        factory.optionsPrompts,
        option => option.name in currentOptions,
      );

      for (const option of hasAnswers) {
        const value = provided[option.name];

        if (option.validate) {
          const result = option.validate(value);
          if (result !== true) {
            throw new Error(`Invalid option '${option.name}'. ${result}`);
          }
        }
      }

      currentOptions = await inquirer.prompt(
        needsAnswers.map(option =>
          applyPromptMessageTransforms(option, {
            message: chalk.blue,
            error: chalk.red,
          }),
        ),
        currentOptions,
      );
    }

    return currentOptions;
  }
}
