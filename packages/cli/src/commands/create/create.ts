/*
 * Copyright 2020 The Backstage Authors
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

import { Command } from 'commander';
import { FactoryRegistry } from './FactoryRegistry';

function parseOptions(optionStrings: string[]): Record<string, string> {
  const options: Record<string, string> = {};

  for (const str of optionStrings) {
    const [key] = str.split('=', 1);
    const value = str.slice(key.length + 1);
    if (!key || !value) {
      throw new Error(
        `Invalid option '${str}', must be of the format <key>=<value>`,
      );
    }
    options[key] = value;
  }

  return options;
}

export default async (cmd: Command) => {
  const factory = await FactoryRegistry.interactiveSelect(cmd.opts().select);

  const providedOptions = parseOptions(cmd.opts().option);
  const options = await FactoryRegistry.populateOptions(
    factory,
    providedOptions,
  );

  await factory.create(options);
};
