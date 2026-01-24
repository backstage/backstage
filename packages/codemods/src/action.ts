/*
 * Copyright 2020 The Backstage Authors
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

import { relative as relativePath } from 'path';
import { OptionValues } from 'commander';
import { findPaths, run } from '@backstage/cli-common';
import { platform } from 'os';

// eslint-disable-next-line no-restricted-syntax
const paths = findPaths(__dirname);

export function createCodemodAction(name: string) {
  return async (dirs: string[], opts: OptionValues) => {
    const transformPath = relativePath(
      process.cwd(),
      paths.resolveOwn('transforms', `${name}.js`),
    );

    const args = [
      '--parser=tsx',
      '--extensions=tsx,js,ts,tsx',
      '--transform',
      transformPath,
      '--ignore-pattern=**/node_modules/**',
    ];

    if (opts.dry) {
      args.push('--dry');
    }

    if (dirs.length) {
      args.push(...dirs);
    } else {
      args.push('.');
    }

    console.log(`Running jscodeshift with these arguments: ${args.join(' ')}`);

    let commandArgs: string[];
    if (platform() === 'win32') {
      commandArgs = ['jscodeshift', ...args];
    } else {
      // jscodeshift ships a slightly broken bin script with windows
      // line endings so we need to execute it using node rather than
      // letting the `#!/usr/bin/env node` take care of it
      commandArgs = [
        process.argv0,
        require.resolve('.bin/jscodeshift'),
        ...args,
      ];
    }

    await run(commandArgs, {
      env: {
        ...process.env,
        FORCE_COLOR: 'true',
      },
    }).waitForExit();
  };
}
