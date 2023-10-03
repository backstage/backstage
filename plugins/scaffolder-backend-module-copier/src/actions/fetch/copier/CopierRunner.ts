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

import { JsonObject } from '@backstage/types';
import { executeShellCommand } from '@backstage/plugin-scaffolder-node';
import { Writable } from 'stream';
import { resolve as resolvePath } from 'path';
import fs from 'fs-extra';
import commandExists from 'command-exists';
import YAML from 'yaml';
import { InputError } from '@backstage/errors';
import { Config } from '@backstage/config';

import { LoggerService } from '@backstage/backend-plugin-api';
import {
  ContainerRunner,
  GitProvider,
  GitProviders,
} from '@backstage/backend-common';
import { CopierCliFlags, prepareArguments } from './copyCommandParser';

export type CopierRunArgs = {
  answerFileDirectory: string;
  args: CopierCliFlags;
  values: JsonObject;
  imageName?: string;
};

export class CopierRunner {
  private constructor(
    private readonly deps: {
      gitProvider: GitProvider;
      logger: LoggerService;
      logStream: Writable;
      workspacePath: string;
      templatePath: string;
      containerRunner?: ContainerRunner;
    },
  ) {}

  static fromConfig(
    config: Config,
    options: {
      logger: LoggerService;
      logStream: Writable;
      templatePath: string;
      workspacePath: string;
      containerRunner?: ContainerRunner;
    },
  ): CopierRunner {
    const gitProvider = GitProviders.default({ config });
    return new CopierRunner({
      gitProvider,
      logger: options.logger,
      logStream: options.logStream,
      templatePath: options.templatePath,
      workspacePath: options.workspacePath,
      containerRunner: options.containerRunner,
    });
  }

  public async run({
    args,
    values,
    answerFileDirectory,
    imageName,
  }: CopierRunArgs) {
    const copierInstalled = await commandExists('copier').catch(() => false);
    if (!(copierInstalled || imageName)) {
      throw new InputError(
        'Copier is not installed. Please install copier or provide a docker image name',
      );
    }

    const absoluteAnswerFileDirectory = resolvePath(
      this.deps.workspacePath,
      answerFileDirectory,
    );
    const existingAnswerFiles = await Promise.all([
      fs.pathExists(resolvePath(this.deps.workspacePath, args.answerFile)),
      fs.pathExists(resolvePath(absoluteAnswerFileDirectory, args.answerFile)),
    ]);

    if (existingAnswerFiles.some(exist => exist)) {
      // if our workflows use multiple copier templates, it's possible to have answerfile collisions
      throw new InputError(
        `answerfile ${args.answerFile} already exists in workspace.  Please ensure each answerfile has a unique name.`,
      );
    }

    await this.fetchTemplate(args.url);

    if (copierInstalled) {
      await this.generateProject(args, values);
    } else {
      await this.generateProjectWithDocker(args, values, imageName!);
    }
    await this.postProcessOutput(args, absoluteAnswerFileDirectory);
  }

  private async fetchTemplate(url: string): Promise<void> {
    const git = await this.deps.gitProvider.getGit(url);
    this.deps.logger.info(`Cloning template from ${url}`);
    await git.clone({
      url: url,
      dir: this.deps.templatePath,
      depth: 100,
    });

    await git.fetch({ dir: this.deps.templatePath, tags: true });
  }

  private async generateProjectWithDocker(
    args: CopierCliFlags,
    values: JsonObject,
    imageName: string,
  ): Promise<void> {
    if (!this.deps.containerRunner) {
      throw new InputError(
        'No container runner configured.  Please check your `scaffolder.ts` configuration',
      );
    }

    const { args: copyCommand } = this.prepareCommand(args, values);
    await this.deps.containerRunner.runContainer({
      imageName,
      command: 'copier',
      args: copyCommand,
      mountDirs: {
        [this.deps.templatePath]: '/input',
        [this.deps.workspacePath]: '/output',
      },
      logStream: this.deps.logStream,
    });
  }

  private async generateProject(
    args: CopierCliFlags,
    values: JsonObject,
  ): Promise<void> {
    const copierOutput: string[] = [];
    this.deps.logStream.on('data', chunk =>
      copierOutput.push(chunk.toString()),
    );

    const { args: copyCommand } = this.prepareCommand(args, values);
    this.deps.logger.info(
      `Running copier with command: copier ${copyCommand.join(' ')}`,
    );

    await executeShellCommand({
      command: 'copier',
      args: copyCommand,
      logStream: this.deps.logStream,
    }).catch(e => {
      if (e instanceof Error) {
        const lastPythonMessage = copierOutput.slice(-1)[0];
        e.message = `${e.message}: ${lastPythonMessage}`;
      }
      throw e;
    });
  }

  private prepareCommand(args: CopierCliFlags, values: JsonObject) {
    const copyCommand = [
      'copy',
      ...prepareArguments(args, values),
      this.deps.templatePath,
      this.deps.workspacePath,
    ];
    return { args: copyCommand };
  }

  private async postProcessOutput(
    args: CopierCliFlags,
    answerFileDirectory: string,
  ) {
    // we need to have the final answers file point to the VCS url, not the temporary filesystem path
    await this.patchCopierSrcPath(this.deps.workspacePath, args);
    await fs.ensureDir(answerFileDirectory);
    const oldFile = resolvePath(this.deps.workspacePath, args.answerFile);
    const newFile = resolvePath(answerFileDirectory, args.answerFile);
    await fs.rename(oldFile, newFile);
  }

  private async patchCopierSrcPath(
    workspacePath: string,
    args: CopierCliFlags,
  ) {
    const answerFile = resolvePath(workspacePath, args.answerFile);
    const answerFileContents = YAML.parse(fs.readFileSync(answerFile, 'utf8'));
    answerFileContents._src_path = args.url;
    await fs.writeFile(answerFile, YAML.stringify(answerFileContents));
  }
}
