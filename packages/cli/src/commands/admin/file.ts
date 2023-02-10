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

import * as path from 'path';
import * as fs from 'fs-extra';
import yaml from 'yaml';
import { findPaths } from '@backstage/cli-common';
import { GithubAuthConfig } from './github';

/* eslint-disable-next-line no-restricted-syntax */
const { targetRoot } = findPaths(__dirname);
const APP_CONFIG_FILE = path.join(targetRoot, 'app-config.local.yaml');
const ENV_CONFIG_FILE = path.join(targetRoot, '.env.development');

const readConfigFile = async (file: string) => {
  return yaml.parse(await fs.readFile(file, 'utf8'));
};

export const updateConfigFile = async (config: GithubAuthConfig) => {
  const content = fs.existsSync(APP_CONFIG_FILE)
    ? { ...(await readConfigFile(APP_CONFIG_FILE)), ...config }
    : config;

  return await fs.writeFile(
    APP_CONFIG_FILE,
    yaml.stringify(content, {
      indent: 2,
    }),
    'utf8',
  );
};

export const updateEnvFile = async (config: GithubAuthConfig) => {
  const content = `
AUTH_GITHUB_CLIENT_ID=${config.auth.providers.github.development.clientId}
AUTH_GITHUB_CLIENT_SECRET=${config.auth.providers.github.development.clientId}`;

  if (fs.existsSync(ENV_CONFIG_FILE)) {
    await fs.appendFile(ENV_CONFIG_FILE, content, 'utf8');
  }

  return await fs.writeFile(ENV_CONFIG_FILE, content, 'utf8');
};
