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
import { httpJson } from '../lib/http';
import { getSelectedInstance } from '../lib/storage';
import { accessTokenNeedsRefresh, refreshAccessToken } from '../lib/auth';

export default async function main(argv: string[]) {
  const parsed = await yargs(argv)
    .option('instance', {
      type: 'string',
      desc: 'Name of the instance to show',
    })
    .parse();

  let instance = await getSelectedInstance(parsed.instance);

  if (accessTokenNeedsRefresh(instance)) {
    instance = await refreshAccessToken(instance.name);
  }
  const authBase = new URL('/api/auth', instance.baseUrl)
    .toString()
    .replace(/\/$/, '');

  const accessToken = instance.accessToken;

  const userinfo = await httpJson<{ claims: { sub: string; ent: string[] } }>(
    `${authBase}/v1/userinfo`,
    {
      headers: { Authorization: `Bearer ${accessToken}` },
    },
  );

  process.stdout.write(`User: ${userinfo.claims.sub}\n`);
  process.stdout.write(`\n`);
  process.stdout.write(`Ownership:\n`);
  for (const ent of userinfo.claims.ent ?? []) {
    process.stdout.write(`  - ${ent}\n`);
  }
}
