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
import {
  readBitbucketIntegrationConfigs,
  BitbucketIntegrationConfig,
} from '@backstage/integration';
import GitUriParser from 'git-url-parse';
import { Config } from '@backstage/config';
import { Logger } from 'winston';

export class BitbucketPreparer implements PreparerBase {
  private readonly privateToken: string;
  private readonly username: string;
  private readonly logger: Logger;
  private readonly integrations: BitbucketIntegrationConfig[];
  constructor(config: Config, { logger }: { logger: Logger }) {
    this.logger = logger;
    this.integrations = readBitbucketIntegrationConfigs(
      config.getOptionalConfigArray('integrations.bitbucket') ?? [],
    );

    if (!this.integrations.length) {
      this.logger.warn(
        'Integrations for BitBucket in Scaffolder are not set. This will cause errors in a future release. Please migrate to using integrations config and specifying tokens under hostnames',
      );
    }

    this.username =
      config.getOptionalString('scaffolder.bitbucket.api.username') ?? '';
    this.privateToken =
      config.getOptionalString('scaffolder.bitbucket.api.token') ?? '';

    if (this.username || this.privateToken) {
      this.logger.warn(
        "DEPRECATION: Using the token format under 'scaffolder.github.token' will not be respected in future releases. Please consider using integrations config instead",
      );
    }
  }

  async prepare(
    template: TemplateEntityV1alpha1,
    opts: PreparerOptions,
  ): Promise<string> {
    const { protocol, location } = parseLocationAnnotation(template);
    const workingDirectory = opts?.workingDirectory ?? os.tmpdir();

    if (!['bitbucket', 'url'].includes(protocol)) {
      throw new InputError(
        `Wrong location protocol: ${protocol}, should be 'url'`,
      );
    }
    const templateId = template.metadata.name;

    const repo = GitUriParser(location);
    const repositoryCheckoutUrl = repo.toString('https');

    const tempDir = await fs.promises.mkdtemp(
      path.join(workingDirectory, templateId),
    );

    const templateDirectory = path.join(
      `${path.dirname(repo.filepath)}`,
      template.spec.path ?? '.',
    );

    const checkoutLocation = path.resolve(tempDir, templateDirectory);

    const auth = this.getAuth(repo.resource);

    const git = auth
      ? Git.fromAuth({
          ...auth,
          logger: this.logger,
        })
      : Git.fromAuth({ logger: this.logger });

    await git.clone({
      url: repositoryCheckoutUrl,
      dir: tempDir,
    });

    return checkoutLocation;
  }

  private getAuth(
    host: string,
  ): { username: string; password: string } | undefined {
    if (this.username && this.privateToken) {
      return { username: this.username, password: this.privateToken };
    }

    const bitbucketIntegrationConfig = this.integrations.find(
      c => c.host === host,
    );

    // TODO(blam): Not sure how appPassword fits in here. Just doing the most simple of
    // implementations with the intergations config for now but can maybe fallback to
    // appPassword instead maybe at a later stage.
    if (
      !bitbucketIntegrationConfig ||
      !bitbucketIntegrationConfig.username ||
      !bitbucketIntegrationConfig.token
    ) {
      return undefined;
    }

    return {
      username: bitbucketIntegrationConfig.username,
      password: bitbucketIntegrationConfig.token,
    };
  }
}
