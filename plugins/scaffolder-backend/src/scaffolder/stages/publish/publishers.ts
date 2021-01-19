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
        `Failed to detect publisher type. Unable to determine integration type for location "${protocol}". ` +
          "Please add appropriate configuration to the 'integrations' configuration section",
      );
    }

    logger.info(`Selected publisher for protocol ${protocol}`);

    return publisher;
  }

  static async fromConfig(config: Config): Promise<PublisherBuilder> {
    const typeDetector = makeDeprecatedLocationTypeDetector(config);
    const publishers = new Publishers(typeDetector);

    const githubPublisher = GithubPublisher.fromConfig(config);
    publishers.register('file', githubPublisher);
    publishers.register('github', githubPublisher);

    const gitLabPublisher = GitlabPublisher.fromConfig(config);
    publishers.register('gitlab', gitLabPublisher);

    const azurePublisher = AzurePublisher.fromConfig(config);
    publishers.register('azure', azurePublisher);

    const bitbucketPublisher = BitbucketPublisher.fromConfig(config);
    publishers.register('bitbucket', bitbucketPublisher);

    return publishers;
  }
}
