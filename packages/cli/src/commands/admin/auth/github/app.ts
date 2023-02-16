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

import inquirer from 'inquirer';
import { adminCli } from '../../../create-github-app';
import { updateConfigFile, updateEnvFile } from '../config';
import { APP_CONFIG_FILE, ENV_CONFIG_FILE } from '../files';

// TODO(tudi2d): Wrapper for admin CLI around `create-github-app` - potentially to be removed
export const app = async (useEnvForSecrets: boolean) => {
  // TODO(tudi2d): Make the GitHub Org optional
  const input = await inquirer.prompt<{ org: string }>([
    {
      type: 'input',
      name: 'org',
      message: 'Enter a GitHub Org [required]',
    },
  ]);

  const { auth } = await adminCli(input.org);

  // TODO(tudi2d): Also change integrations
  await updateConfigFile(APP_CONFIG_FILE, { auth });
  if (useEnvForSecrets) {
    await updateEnvFile(
      ENV_CONFIG_FILE,
      auth.providers.github.development.clientId,
      auth.providers.github.development.clientSecret,
    );
  }
};
