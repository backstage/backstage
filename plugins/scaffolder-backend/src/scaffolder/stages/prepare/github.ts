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
import { InputError, Git } from '@backstage/backend-common';
import { PreparerBase, PreparerOptions } from './types';
import { Logger } from 'winston';
import parseGitUrl from 'git-url-parse';
import { Config } from '@backstage/config';
import {
  GitHubIntegrationConfig,
  readGitHubIntegrationConfigs,
} from '@backstage/integration';

export class GithubPreparer implements PreparerBase {
  private readonly integrations: GitHubIntegrationConfig[];
  private readonly scaffolderToken: string | undefined;

  static fromConfig(config: Config, { logger }: { logger: Logger }) {
    if (config.getOptionalString('scaffolder.github.token')) {
      logger.warn(
        "DEPRECATION: Using the token format under 'scaffolder.github.token' will not be respected in future releases. Please consider using integrations config instead",
        'Please migrate to using integrations config and specifying tokens under hostnames',
      );
    }

    return new GithubPreparer(config);
  }

  constructor(config: Config) {
    this.integrations = readGitHubIntegrationConfigs(
      config.getOptionalConfigArray('integrations.github') ?? [],
    );
    this.scaffolderToken = config.getOptionalString('scaffolder.github.token');
  }

  async prepare(
    template: TemplateEntityV1alpha1,
    opts: PreparerOptions,
  ): Promise<string> {
    const { protocol, location } = parseLocationAnnotation(template);
    const workingDirectory = opts.workingDirectory ?? os.tmpdir();
    const logger = opts.logger;

    if (!['github', 'url'].includes(protocol)) {
      throw new InputError(
        `Wrong location protocol: ${protocol}, should be 'url'`,
      );
    }
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

    const token = this.getToken(parsedGitLocation.resource);

    const git = token
      ? Git.fromAuth({
          username: token,
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
  private getToken(host: string): string | undefined {
    return (
      this.scaffolderToken ||
      this.integrations.find(c => c.host === host)?.token
    );
  }
}
