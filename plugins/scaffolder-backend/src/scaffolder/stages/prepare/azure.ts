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
import { TemplateEntityV1alpha1 } from '@backstage/catalog-model';
import { parseLocationAnnotation } from '../helpers';
import { InputError } from '@backstage/backend-common';
import { PreparerBase } from './types';
import GitUriParser from 'git-url-parse';
import { Clone, Cred } from 'nodegit';
import { Config } from '@backstage/config';

export class AzurePreparer implements PreparerBase {
  private readonly privateToken: string;

  constructor(config: Config) {
    this.privateToken =
      config.getOptionalString('scaffolder.azure.api.token') ?? '';
  }

  async prepare(template: TemplateEntityV1alpha1): Promise<string> {
    const { protocol, location } = parseLocationAnnotation(template);

    if (protocol !== 'azure/api') {
      throw new InputError(
        `Wrong location protocol: ${protocol}, should be 'azure/api'`,
      );
    }
    const templateId = template.metadata.name;

    const url = new URL(location); // Need to extract filepath from search parameter
    const parsedGitLocation = GitUriParser(location);
    const repositoryCheckoutUrl = parsedGitLocation.toString('https');

    const tempDir = await fs.promises.mkdtemp(
      path.join(os.tmpdir(), templateId),
    );

    const templateDirectory = path.join(
      `${path
        .dirname(url.searchParams.get('path') || '')
        .replace(/^\/+/g, '')}`, // Strip leading slash
      template.spec.path ?? '.',
    );

    const options = this.privateToken
      ? {
          fetchOpts: {
            callbacks: {
              credentials: () =>
                // Username can anything but the empty string according to: https://docs.microsoft.com/en-us/azure/devops/organizations/accounts/use-personal-access-tokens-to-authenticate?view=azure-devops&tabs=preview-page#use-a-pat
                Cred.userpassPlaintextNew('notempty', this.privateToken),
            },
          },
        }
      : {};

    await Clone.clone(repositoryCheckoutUrl, tempDir, options);

    return path.resolve(tempDir, templateDirectory);
  }
}
