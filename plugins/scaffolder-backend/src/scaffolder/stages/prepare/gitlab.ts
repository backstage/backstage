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
import { InputError } from '@backstage/backend-common';
import { PreparerBase } from './types';
import GitUriParser from 'git-url-parse';
import { Clone, Cred } from 'nodegit';
import { Config } from '@backstage/config';

export class GitlabPreparer implements PreparerBase {
  private readonly privateToken: string;

  constructor(config: Config) {
    this.privateToken =
      config.getOptionalString('catalog.processors.gitlabApi.privateToken') ??
      '';
  }

  async prepare(
    template: TemplateEntityV1alpha1,
    opts?: { workingDirectory?: string },
  ): Promise<string> {
    const { protocol, location } = parseLocationAnnotation(template);
    const workingDirectory = opts?.workingDirectory ?? os.tmpdir();

    if (!['gitlab', 'gitlab/api', 'url'].includes(protocol)) {
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

    const options = this.privateToken
      ? {
          fetchOpts: {
            callbacks: {
              credentials: () =>
                Cred.userpassPlaintextNew('oauth2', this.privateToken),
            },
          },
        }
      : {};

    await Clone.clone(repositoryCheckoutUrl, tempDir, options);

    return path.resolve(tempDir, templateDirectory);
  }
}
