/*
 * Copyright 2020 Spotify AB
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
import { stringify as stringifyYaml } from 'yaml';
import { ConfigReader } from '@backstage/config';
import { loadCliConfig } from '../../lib/config';
import cloneDeepWith from 'lodash/cloneDeepWith';

export default async (cmd: Command) => {
  const { schema, appConfigs } = await loadCliConfig(cmd.config);
  let data;

  if (cmd.frontend) {
    const frontendConfigs = schema.process(appConfigs, {
      visibilities: ['frontend'],
    });
    data = ConfigReader.fromConfigs(frontendConfigs).get();
  } else if (cmd.withSecrets) {
    data = ConfigReader.fromConfigs(appConfigs).get();
  } else {
    let secretConfigs = schema.process(appConfigs, {
      visibilities: ['secret'],
    });
    secretConfigs = secretConfigs.map(entry => ({
      context: entry.context,
      data: cloneDeepWith(entry.data, value => {
        if (typeof value !== 'object') {
          return '<secret>';
        }
        return undefined;
      }),
    }));

    data = ConfigReader.fromConfigs(appConfigs.concat(secretConfigs)).get();
  }

  if (cmd.format === 'json') {
    process.stdout.write(`${JSON.stringify(data, null, 2)}\n`);
  } else {
    process.stdout.write(`${stringifyYaml(data)}\n`);
  }
};
