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

import fs from 'fs-extra';
import * as pulumi from '@pulumi/pulumi';

import { OptionValues } from 'commander';
import { AWSProgram } from './programs';
import { paths } from '../../lib/paths';
import { Task } from '../../lib/tasks';
import { basename, resolve } from 'path';

const createFile = async (fileName: string) => {
  const BASE_PATH_OF_DEV_FILES = 'src/commands/deploy/files';
  await Task.forItem('creating', fileName, async () => {
    const content = await fs.readFile(
      paths.resolveOwn(`${BASE_PATH_OF_DEV_FILES}/${fileName}`),
      { encoding: 'utf8' },
    );
    const destination = `${paths.targetRoot}/${basename(fileName)}`;
    await fs.writeFile(destination, content).catch(error => {
      throw new Error(`Failed to create file: ${error.message}`);
    });
  });
};

export default async (opts: OptionValues) => {
  if (!fs.existsSync(resolve('./Pulumi.yaml'))) {
    const pulumiFileName = 'Pulumi.yaml';
    Task.section(`Preparing ${pulumiFileName}`);
    await createFile(pulumiFileName);
  }

  if (!fs.existsSync(opts.dockerfile) && !opts.createDockerfile) {
    throw new Error(
      `Didn't find a Dockerfile at ${opts.dockerfile}. Use --create-dockerfile to create one or use --dockerfile to pass in the path of your Dockerfile.`,
    );
  }

  if (opts.createDockerfile) {
    if (fs.existsSync(opts.dockerfile)) {
      throw new Error(
        `There already is a Dockerfile in the specfied path: ${opts.dockerfile}`,
      );
    }
    Task.section('Preparing docker files');
    const dockerFiles = ['Dockerfile', '.dockerignore'];
    for (const file of dockerFiles) {
      await createFile(file);
    }
  }

  const args = {
    stackName: opts.stack,
    projectName: opts.stack,
    program: AWSProgram(opts),
  };

  const stack = await pulumi.automation.LocalWorkspace.createOrSelectStack(
    args,
  );

  Task.log('Starting Pulumi');
  Task.log('successfully initialized stack');
  Task.log('installing aws plugin...');
  await stack.workspace.installPlugin('aws', 'v4.0.0');
  Task.log('plugins installed');
  Task.log('setting up config');
  await stack.setConfig('aws:region', { value: opts.region });
  Task.log('refreshing stack...');
  await stack.refresh({ onOutput: Task.log });
  Task.log('refresh complete');

  if (opts.destroy) {
    Task.log(`Destroying ${opts.destroy} stack`);
    await stack.destroy({ onOutput: Task.log });
  }

  Task.log(`updating stack...`);
  await stack.up({ onOutput: Task.log });
};
