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
import { AnyFactory } from './types';
import * as factories from './factories';
import partition from 'lodash/partition';

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
    const [hasAnswers, needsAnswers] = partition(
      factory.options,
      option => option.name in provided,
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

    const answers = await inquirer.prompt(needsAnswers);

    return { ...provided, ...answers };
  }
}
