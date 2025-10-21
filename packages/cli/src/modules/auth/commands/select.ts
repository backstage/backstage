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

import yargs from 'yargs';
import inquirer from 'inquirer';
import {
  setSelectedInstance,
  getInstanceByName,
  getAllInstances,
  StoredInstance,
} from '../lib/storage';

export default async function main(argv: string[]) {
  const parsed = await yargs(argv)
    .option('name', {
      type: 'string',
      desc: 'Name of the instance to select',
    })
    .parse();

  const instance = await pickInstance(parsed.name);

  await setSelectedInstance(instance.name);
  process.stderr.write(`Selected instance '${instance.name}'\n`);
}

export async function pickInstance(name?: string): Promise<StoredInstance> {
  if (name) {
    const instance = await getInstanceByName(name);
    if (!instance) {
      throw new Error(`Instance '${name}' not found`);
    }
    return instance;
  }

  const { instances, selected } = await getAllInstances();
  if (instances.length === 0) {
    throw new Error(
      'No instances found. Run "auth login" to authenticate first.',
    );
  }
  return await promptForInstance(instances, selected);
}

async function promptForInstance(
  instances: StoredInstance[],
  selected: StoredInstance | undefined,
): Promise<StoredInstance> {
  const choices = instances.map(i => ({
    name: `${i.name === selected?.name ? '* ' : '  '}${i.name} (${i.baseUrl})`,
    value: i.name,
  }));

  const { choice } = await inquirer.prompt<{ choice: string }>([
    {
      type: 'list',
      name: 'choice',
      message: 'Select instance:',
      choices,
      default: selected?.name,
    },
  ]);

  const instance = instances.find(i => i.name === choice);
  if (!instance) {
    throw new Error(`Instance '${choice}' not found`);
  }
  return instance;
}
