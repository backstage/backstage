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

import chalk from 'chalk';
import * as pulumi from '@pulumi/pulumi';

import { OptionValues } from 'commander';
import { AWSProgram } from './programs';

const chalkOutput = (message?: any) => {
  return process.stderr.write(chalk.blueBright(message));
};

export default async (opts: OptionValues) => {
  const args = {
    stackName: opts.stack,
    projectName: opts.stack,
    program: AWSProgram(opts),
  };

  const stack = await pulumi.automation.LocalWorkspace.createOrSelectStack(
    args,
  );

  process.stderr.write(chalk.greenBright('successfully initialized stack\n'));
  process.stderr.write(chalk.greenBright('installing aws plugin...\n'));
  await stack.workspace.installPlugin('aws', 'v4.0.0');
  process.stderr.write(chalk.greenBright('plugins installed\n'));
  process.stderr.write(chalk.greenBright('setting up config\n'));
  await stack.setConfig('aws:region', { value: opts.region });
  process.stderr.write(chalk.greenBright('refreshing stack...\n'));
  await stack.refresh({ onOutput: chalkOutput });
  process.stderr.write(chalk.greenBright('refresh complete\n'));

  if (opts.destroy) {
    process.stderr.write(chalk.redBright(`destroying stack ${opts.destroy}\n`));
    await stack.destroy({ onOutput: chalk.blueBright });
  }

  process.stderr.write(chalk.greenBright('updating stack...\n'));
  await stack.up({ onOutput: chalkOutput });
};
