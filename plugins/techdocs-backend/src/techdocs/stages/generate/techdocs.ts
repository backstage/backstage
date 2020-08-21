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

import fs from 'fs-extra';
import path from 'path';
import os from 'os';
import { Logger } from 'winston';

import {
  GeneratorBase,
  GeneratorRunOptions,
  GeneratorRunResult,
} from './types';
import { runDockerContainer } from './helpers';

export class TechdocsGenerator implements GeneratorBase {
  private readonly logger: Logger;

  constructor(logger: Logger) {
    this.logger = logger;
  }

  public async run({
    directory,
    logStream,
    dockerClient,
  }: GeneratorRunOptions): Promise<GeneratorRunResult> {
    const tmpdirPath = os.tmpdir();
    // Fixes a problem with macOS returning a path that is a symlink
    const tmpdirResolvedPath = fs.realpathSync(tmpdirPath);
    const resultDir = fs.mkdtempSync(
      path.join(tmpdirResolvedPath, 'techdocs-tmp-'),
    );

    try {
      await runDockerContainer({
        imageName: 'spotify/techdocs',
        args: ['build', '-d', '/result'],
        logStream,
        docsDir: directory,
        resultDir,
        dockerClient,
      });
      this.logger.info(
        `[TechDocs]: Successfully generated docs from ${directory} into ${resultDir}`,
      );
    } catch (error) {
      this.logger.debug(
        `[TechDocs]: Failed to generate docs from ${directory} into ${resultDir}`,
      );
      throw new Error(
        `Failed to generate docs from ${directory} into ${resultDir} with error ${error.message}`,
      );
    }

    return { resultDir };
  }
}
