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
import { github } from './github';

enum Integration {
  GITHUB = 'GitHub',
}

const Integrations: Integration[] = [Integration.GITHUB];

export async function integrations(): Promise<void> {
  await inquirer
    .prompt<{
      integration?: Integration;
    }>([
      {
        // TODO(tudi2d): Should be multiple choice
        type: 'list',
        name: 'integration',
        message: 'Please select an integration:',
        choices: Integrations,
      },
    ])
    .then(async ({ integration }) => {
      if (integration) {
        switch (integration) {
          case Integration.GITHUB:
            await github();
            break;
          default:
        }
      }
    });
}
