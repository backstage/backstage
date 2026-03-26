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
import { CliAuth, type CliCommandContext } from '@backstage/cli-node';
import { httpJson } from '../lib/http';

export default async ({ args, info }: CliCommandContext) => {
  const {
    flags: { instance: instanceFlag },
  } = cli(
    {
      help: info,
      flags: {
        instance: {
          type: String,
          description: 'Name of the instance to show',
        },
      },
    },
    undefined,
    args,
  );

  const auth = await CliAuth.create({ instanceName: instanceFlag });
  const accessToken = await auth.getAccessToken();

  const authBase = new URL('/api/auth', auth.getBaseUrl())
    .toString()
    .replace(/\/$/, '');

  const userinfo = await httpJson<{ claims: { sub: string; ent: string[] } }>(
    `${authBase}/v1/userinfo`,
    {
      headers: { Authorization: `Bearer ${accessToken}` },
      signal: AbortSignal.timeout(30_000),
    },
  );

  process.stdout.write(`User: ${userinfo.claims.sub}\n`);
  process.stdout.write(`\n`);
  process.stdout.write(`Ownership:\n`);
  for (const ent of userinfo.claims.ent ?? []) {
    process.stdout.write(`  - ${ent}\n`);
  }
};
