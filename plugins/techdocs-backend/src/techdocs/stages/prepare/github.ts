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
import { Entity } from '@backstage/catalog-model';
import { InputError } from '@backstage/backend-common';
import { PreparerBase } from './types';
import parseGitUrl from 'git-url-parse';
import { Clone } from 'nodegit';
import { parseReferenceAnnotation } from './helpers';
import { Logger } from 'winston';

export class GithubPreparer implements PreparerBase {
  private readonly logger: Logger;

  constructor(logger: Logger) {
    this.logger = logger;
  }

  async prepare(entity: Entity): Promise<string> {
    const { type, target } = parseReferenceAnnotation(
      'backstage.io/techdocs-ref',
      entity,
    );

    if (type !== 'github') {
      throw new InputError(`Wrong target type: ${type}, should be 'github'`);
    }

    const parsedGitLocation = parseGitUrl(target);
    const repositoryTmpPath = path.join(
      // fs.realpathSync fixes a problem with macOS returning a path that is a symlink
      fs.realpathSync(os.tmpdir()),
      'backstage-repo',
      parsedGitLocation.source,
      parsedGitLocation.owner,
      parsedGitLocation.name,
      parsedGitLocation.ref,
    );

    if (fs.existsSync(repositoryTmpPath)) {
      this.logger.debug(
        `[TechDocs] Found repository already checked out at ${repositoryTmpPath}`,
      );
      return path.join(repositoryTmpPath, parsedGitLocation.filepath);
    }
    const repositoryCheckoutUrl = parsedGitLocation.toString('https');

    this.logger.debug(
      `[TechDocs] Checking out repository ${repositoryCheckoutUrl} to ${repositoryTmpPath}`,
    );

    fs.mkdirSync(repositoryTmpPath, { recursive: true });
    await Clone.clone(repositoryCheckoutUrl, repositoryTmpPath, {});

    return path.join(repositoryTmpPath, parsedGitLocation.filepath);
  }
}
