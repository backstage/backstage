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

/**
 * A CLI that helps you create your own Backstage app
 *
 * @packageDocumentation
 */

import program from 'commander';
import { version } from '../package.json';
import createApp from './createApp';
import { exitWithError } from './lib/errors';

const main = (argv: string[]) => {
  program
    .name('backstage-create-app')
    .version(version)
    .description('Creates a new app in a new directory or specified path')
    .option(
      '--path [directory]',
      'Location to store the app defaulting to a new folder with the app name',
    )
    .option(
      '--skip-install',
      'Skip the install and builds steps after creating the app',
    )
    .action(createApp);

  program.parse(argv);
};

process.on('unhandledRejection', rejection => {
  if (rejection instanceof Error) {
    exitWithError(rejection);
  } else {
    exitWithError(new Error(`Unknown rejection: '${rejection}'`));
  }
});

main(process.argv);
