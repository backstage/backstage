/*
 * Copyright 2023 The Backstage Authors
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

import * as fs from 'fs-extra';
import yaml from 'yaml';

const readYaml = async (file: string) => {
  return yaml.parse(await fs.readFile(file, 'utf8'));
};

export const updateConfigFile = async <T>(file: string, config: T) => {
  const staticContent =
    '# Backstage override configuration for your local development environment \n';

  const content = fs.existsSync(file)
    ? yaml.stringify(
        { ...(await readYaml(file)), ...config },
        {
          indent: 2,
        },
      )
    : staticContent.concat(
        yaml.stringify(
          { ...config },
          {
            indent: 2,
          },
        ),
      );

  return await fs.writeFile(file, content, 'utf8');
};
