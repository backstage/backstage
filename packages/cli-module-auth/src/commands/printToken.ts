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

import { cli } from 'cleye';
import type { CliCommandContext } from '@backstage/cli-node';
import { accessTokenNeedsRefresh, refreshAccessToken } from '../lib/auth';
import { getSelectedInstance } from '../lib/storage';
import { getSecretStore } from '../lib/secretStore';

export default async ({ args, info }: CliCommandContext) => {
  const {
    flags: { instance: instanceFlag },
  } = cli(
    {
      help: info,
      flags: {
        instance: {
          type: String,
          description: 'Name of the instance to use',
        },
      },
    },
    undefined,
    args,
  );

  let instance = await getSelectedInstance(instanceFlag);

  if (accessTokenNeedsRefresh(instance)) {
    instance = await refreshAccessToken(instance.name);
  }

  const secretStore = await getSecretStore();
  const service = `backstage-cli:auth-instance:${instance.name}`;
  const accessToken = await secretStore.get(service, 'accessToken');
  if (!accessToken) {
    throw new Error('No access token found. Run "auth login" to authenticate.');
  }

  process.stdout.write(`${accessToken}\n`);
};
