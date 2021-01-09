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

import { Config } from '@backstage/config';
import { Logger } from 'winston';
import { PreparerBase, PreparerBuilder } from './types';
import { TemplateEntityV1alpha1 } from '@backstage/catalog-model';
import {
  DeprecatedLocationTypeDetector,
  makeDeprecatedLocationTypeDetector,
  parseLocationAnnotation,
} from '../helpers';
import { RemoteProtocol } from '../types';
import { FilePreparer } from './file';
import { GitlabPreparer } from './gitlab';
import { AzurePreparer } from './azure';
import { GithubPreparer } from './github';
import { BitbucketPreparer } from './bitbucket';

export class Preparers implements PreparerBuilder {
  private preparerMap = new Map<RemoteProtocol, PreparerBase>();

  constructor(private readonly typeDetector?: DeprecatedLocationTypeDetector) {}

  register(protocol: RemoteProtocol, preparer: PreparerBase) {
    this.preparerMap.set(protocol, preparer);
  }

  get(template: TemplateEntityV1alpha1): PreparerBase {
    const { protocol, location } = parseLocationAnnotation(template);

    const preparer = this.preparerMap.get(protocol);

    if (!preparer) {
      if ((protocol as string) === 'url') {
        const type = this.typeDetector?.(location);
        const detected = type && this.preparerMap.get(type as RemoteProtocol);
        if (detected) {
          return detected;
        }
        if (type) {
          throw new Error(
            `No preparer configuration available for type '${type}' with url "${location}". ` +
              "Make sure you've added appropriate configuration in the 'scaffolder' configuration section",
          );
        } else {
          throw new Error(
            `Failed to detect preparer type. Unable to determine integration type for location "${location}". ` +
              "Please add appropriate configuration to the 'integrations' configuration section",
          );
        }
      }
      throw new Error(`No preparer registered for type: "${protocol}"`);
    }

    return preparer;
  }

  static async fromConfig(
    config: Config,
    { logger }: { logger: Logger },
  ): Promise<PreparerBuilder> {
    const typeDetector = makeDeprecatedLocationTypeDetector(config);

    const preparers = new Preparers(typeDetector);

    const filePreparer = new FilePreparer();
    const gitlabPreparer = new GitlabPreparer(config);
    const azurePreparer = new AzurePreparer(config);
    const bitbucketPreparer = new BitbucketPreparer(config);

    preparers.register('file', filePreparer);
    preparers.register('gitlab', gitlabPreparer);
    preparers.register('gitlab/api', gitlabPreparer);
    preparers.register('azure/api', azurePreparer);
    preparers.register('bitbucket', bitbucketPreparer);

    const githubConfig = config.getOptionalConfig('scaffolder.github');
    if (githubConfig) {
      try {
        const githubToken = githubConfig.getString('token');
        const githubPreparer = new GithubPreparer({ token: githubToken });

        preparers.register('github', githubPreparer);
      } catch (e) {
        if (process.env.NODE_ENV !== 'development') {
          throw new Error(
            `Failed to initialize github scaffolding provider, ${e.message}`,
          );
        }

        logger.warn(`Skipping github scaffolding provider, ${e.message}`);
      }
    }

    return preparers;
  }
}
