/*
 * Copyright 2020 Spotify AB
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

import program, { Command } from 'commander';
import chalk from 'chalk';
import { version } from '../package.json';

const codemods = [
  {
    name: 'core-imports',
    description:
      'Updates @backstage/core imports to use @backstage/core-* imports instead.',
  },
];

function createCodemodAction(name: string) {
  return (cmd: Command) => {
    console.log(`Fake codemod ${cmd} ${name}`);
  };
}

async function main(argv: string[]) {
  program.name('backstage-codemods').version(version);

  for (const codemod of codemods) {
    program
      .command(codemod.name)
      .description(codemod.description)
      .option('-d, --dry', 'Dry run, no changes written to files')
      .action(createCodemodAction(codemod.name));
  }

  program.on('command:*', () => {
    console.log();
    console.log(chalk.red(`Invalid command: ${program.args.join(' ')}`));
    console.log();
    program.outputHelp();
    process.exit(1);
  });

  program.parse(argv);
}

function exitWithError(err: Error & { code?: unknown }) {
  process.stdout.write(`${err.name}: ${err.stack || err.message}\n`);

  if (typeof err.code === 'number') {
    process.exit(err.code);
  } else {
    process.exit(1);
  }
}

process.on('unhandledRejection', (rejection: unknown) => {
  if (rejection instanceof Error) {
    exitWithError(rejection);
  } else {
    exitWithError(new Error(`Unknown rejection: '${rejection}'`));
  }
});

main(process.argv).catch(exitWithError);
