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
import { createCliPlugin } from '../../wiring/factory';
import * as commands from './commands';
import { setSelectedInstance } from './lib/storage';

export default createCliPlugin({
  pluginId: 'auth',
  init: async reg => {
    reg.addCommand({
      path: ['auth', 'login'],
      description: 'Log in the CLI using OIDC dynamic client registration',
      execute: async ({ args }) => {
        yargs().parse(args);
        await commands.login(args);
      },
    });
    reg.addCommand({
      path: ['auth', 'logout'],
      description: 'Log out the CLI and revoke refresh token',
      execute: async ({ args }) => {
        yargs().parse(args);
        await commands.logout(args);
      },
    });
    reg.addCommand({
      path: ['auth', 'status'],
      description: 'Show CLI authentication status',
      execute: async ({ args }) => {
        yargs().parse(args);
        await commands.status(args);
      },
    });
    reg.addCommand({
      path: ['auth', 'print-token'],
      description: 'Print an access token to stdout (auto-refresh if needed)',
      execute: async ({ args }) => {
        yargs().parse(args);
        await commands.printToken(args);
      },
    });
    reg.addCommand({
      path: ['auth', 'select'],
      description: 'Select the default instance by name',
      execute: async ({ args }) => {
        const parsed = (yargs(args) as yargs.Argv<{ name?: string }>)
          .option('name', {
            type: 'string',
            demandOption: true,
            desc: 'Name of the instance to select',
          })
          .parseSync();
        await setSelectedInstance(parsed.name!);
        process.stderr.write(`Selected instance '${parsed.name}'\n`);
      },
    });
  },
});
