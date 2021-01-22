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
import os from 'os';
import fs from 'fs-extra';
import path from 'path';
import { TemplateEntityV1alpha1 } from '@backstage/catalog-model';
import { parseLocationAnnotation } from '../helpers';
import { Git } from '@backstage/backend-common';
import { PreparerBase, PreparerOptions } from './types';
import parseGitUrl from 'git-url-parse';
import { GitHubIntegrationConfig } from '@backstage/integration';

export class GithubPreparer implements PreparerBase {
  static fromConfig(config: GitHubIntegrationConfig) {
    return new GithubPreparer({ token: config.token });
  }

  constructor(private readonly config: { token?: string }) {}

  async prepare(
    template: TemplateEntityV1alpha1,
    opts: PreparerOptions,
  ): Promise<string> {
    const { location } = parseLocationAnnotation(template);
    const workingDirectory = opts.workingDirectory ?? os.tmpdir();
    const logger = opts.logger;

    const templateId = template.metadata.name;

    const parsedGitLocation = parseGitUrl(location);
    const repositoryCheckoutUrl = parsedGitLocation.toString('https');
    const tempDir = await fs.promises.mkdtemp(
      path.join(workingDirectory, templateId),
    );

    const templateDirectory = path.join(
      `${path.dirname(parsedGitLocation.filepath)}`,
      template.spec.path ?? '.',
    );

    const checkoutLocation = path.resolve(tempDir, templateDirectory);

    const git = this.config.token
      ? Git.fromAuth({
          username: this.config.token,
          password: 'x-oauth-basic',
          logger,
        })
      : Git.fromAuth({ logger });

    await git.clone({
      url: repositoryCheckoutUrl,
      dir: tempDir,
    });

    return checkoutLocation;
  }
}
