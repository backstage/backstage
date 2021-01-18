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

import { Logger } from 'winston';
import { Config } from '@backstage/config';
import {
  DeprecatedLocationTypeDetector,
  makeDeprecatedLocationTypeDetector,
} from '../helpers';
import { PublisherBase, PublisherBuilder } from './types';
import { RemoteProtocol } from '../types';
import { GithubPublisher } from './github';
import { GitlabPublisher } from './gitlab';
import { AzurePublisher } from './azure';
import { BitbucketPublisher } from './bitbucket';

export class Publishers implements PublisherBuilder {
  private publisherMap = new Map<RemoteProtocol, PublisherBase>();

  constructor(private readonly typeDetector?: DeprecatedLocationTypeDetector) {}

  register(protocol: RemoteProtocol, publisher: PublisherBase) {
    this.publisherMap.set(protocol, publisher);
  }

  get(storePath: string, { logger }: { logger: Logger }): PublisherBase {
    const protocol = this.typeDetector?.(storePath);

    if (!protocol) {
      throw new Error(
        `No matching publisher detected for "${storePath}". Please make sure this host is registered in the integration config`,
      );
    }

    logger.info(
      `Selected publisher ${protocol} for publishing to URL ${storePath}`,
    );

    const publisher = this.publisherMap.get(protocol as RemoteProtocol);
    if (!publisher) {
      throw new Error(
        `Failed to detect publisher type. Unable to determine integration type for location "${location}". ` +
          "Please add appropriate configuration to the 'integrations' configuration section",
      );
    }

    logger.info(`Selected publisher for protocol ${protocol}`);

    return publisher;
  }

  static async fromConfig(
    config: Config,
    { logger }: { logger: Logger },
  ): Promise<PublisherBuilder> {
    const typeDetector = makeDeprecatedLocationTypeDetector(config);
    const publishers = new Publishers(typeDetector);

    const githubConfig = config.getOptionalConfig('scaffolder.github');
    if (githubConfig) {
      try {
        const githubPublisher = new GithubPublisher(config, { logger });
        publishers.register('file', githubPublisher);
        publishers.register('github', githubPublisher);
      } catch (e) {
        const providerName = 'github';
        if (process.env.NODE_ENV !== 'development') {
          throw new Error(
            `Failed to initialize ${providerName} scaffolding provider, ${e.message}`,
          );
        }

        logger.warn(
          `Skipping ${providerName} scaffolding provider, ${e.message}`,
        );
      }
    }

    const gitLabConfig = config.getOptionalConfig('scaffolder.gitlab');
    if (gitLabConfig) {
      try {
        const gitLabPublisher = new GitlabPublisher(config, { logger });
        publishers.register('gitlab', gitLabPublisher);
        publishers.register('gitlab/api', gitLabPublisher);
      } catch (e) {
        const providerName = 'gitlab';
        if (process.env.NODE_ENV !== 'development') {
          throw new Error(
            `Failed to initialize ${providerName} scaffolding provider, ${e.message}`,
          );
        }

        logger.warn(
          `Skipping ${providerName} scaffolding provider, ${e.message}`,
        );
      }
    }

    const azureConfig = config.getOptionalConfig('scaffolder.azure');
    if (azureConfig) {
      try {
        const azurePublisher = new AzurePublisher(config, { logger });
        publishers.register('azure/api', azurePublisher);
      } catch (e) {
        const providerName = 'azure';
        if (process.env.NODE_ENV !== 'development') {
          throw new Error(
            `Failed to initialize ${providerName} scaffolding provider, ${e.message}`,
          );
        }

        logger.warn(
          `Skipping ${providerName} scaffolding provider, ${e.message}`,
        );
      }
    }

    const bitbucketConfig = config.getOptionalConfig(
      'scaffolder.bitbucket.api',
    );
    if (bitbucketConfig) {
      try {
        const bitbucketPublisher = new BitbucketPublisher(config, { logger });
        publishers.register('bitbucket', bitbucketPublisher);
      } catch (e) {
        const providerName = 'bitbucket';
        if (process.env.NODE_ENV !== 'development') {
          throw new Error(
            `Failed to initialize ${providerName} scaffolding provider, ${e.message}`,
          );
        }

        logger.warn(
          `Skipping ${providerName} scaffolding provider, ${e.message}`,
        );
      }
    }
    return publishers;
  }
}
