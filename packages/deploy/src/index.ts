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

/**
 * CLI for Backstage deploy tooling
 *
 * @packageDocumentation
 */

import { program } from 'commander';
import { exitWithError } from './lib/errors';
import { version } from '../package.json';
import { resolve } from 'path';
import deploy from './deploy';

const main = (argv: string[]) => {
  const command = program
    .command('deploy [command]')
    .version(version)
    .description(
      'Deploy your Backstage instance on a specified cloud provider [EXPERIMENTAL]',
    );

  command
    .command('aws')
    .description('Deploys Backstage on AWS Lightsail')
    .option(
      '--dockerfile <path>',
      'path of dockerfile',
      resolve('./Dockerfile'),
    )
    .option(
      '--create-dockerfile',
      'creates a Dockerfile in the root of the project',
      false,
    )
    .option('--stack <name>', 'name of the stack', 'backstage')
    .option('--destroy', 'name of the stack to destroy', false)
    .option('--region <region>', 'region of your aws console', 'us-east-1')
    .option(
      '--env <name>=<value>',
      'Pass in environment variables to use at run time',
      (env, arr: string[]) => [...arr, env],
      [],
    )
    .action(cmd => deploy(cmd));

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
