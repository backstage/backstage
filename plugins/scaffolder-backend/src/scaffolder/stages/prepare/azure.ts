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
import GitUriParser from 'git-url-parse';
import { Config } from '@backstage/config';
import { Logger } from 'winston';
import {
  readAzureIntegrationConfigs,
  AzureIntegrationConfig,
} from '@backstage/integration';

export class AzurePreparer implements PreparerBase {
  private readonly integrations: AzureIntegrationConfig[];
  private readonly scaffolderToken: string | undefined;

  constructor(config: Config, { logger }: { logger: Logger }) {
    this.integrations = readAzureIntegrationConfigs(
      config.getOptionalConfigArray('integrations.azure') ?? [],
    );

    if (!this.integrations.length) {
      logger.warn(
        'Integrations for Azure in Scaffolder are not set. This will cause errors in a future release. Please migrate to using integrations config and specifying tokens under hostnames',
      );
    }

    this.scaffolderToken = config.getOptionalString(
      'scaffolder.azure.api.token',
    );

    if (this.scaffolderToken) {
      logger.warn(
        "DEPRECATION: Using the token format under 'scaffolder.azure.api.token' will not be respected in future releases. Please consider using integrations config instead",
      );
    }
  }

  async prepare(
    template: TemplateEntityV1alpha1,
    opts: PreparerOptions,
  ): Promise<string> {
    const { protocol, location } = parseLocationAnnotation(template);
    const workingDirectory = opts.workingDirectory ?? os.tmpdir();
    const logger = opts.logger;

    if (!['azure/api', 'url'].includes(protocol)) {
      throw new InputError(
        `Wrong location protocol: ${protocol}, should be 'url'`,
      );
    }
    const templateId = template.metadata.name;

    const parsedGitLocation = GitUriParser(location);
    const repositoryCheckoutUrl = parsedGitLocation.toString('https');
    const tempDir = await fs.promises.mkdtemp(
      path.join(workingDirectory, templateId),
    );

    const templateDirectory = path.join(
      `${path.dirname(parsedGitLocation.filepath)}`,
      template.spec.path ?? '.',
    );

    const token = this.getToken(parsedGitLocation.resource);

    // Username can be anything but the empty string according to:
    // https://docs.microsoft.com/en-us/azure/devops/organizations/accounts/use-personal-access-tokens-to-authenticate?view=azure-devops&tabs=preview-page#use-a-pat
    const git = token
      ? Git.fromAuth({
          password: token,
          username: 'notempty',
          logger,
        })
      : Git.fromAuth({ logger });

    await git.clone({
      url: repositoryCheckoutUrl,
      dir: tempDir,
    });

    return path.resolve(tempDir, templateDirectory);
  }

  private getToken(host: string): string | undefined {
    return (
      this.scaffolderToken ||
      this.integrations.find(c => c.host === host)?.token
    );
  }
}
