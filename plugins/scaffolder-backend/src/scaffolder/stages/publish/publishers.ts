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
import { Octokit } from '@octokit/rest';
import { Gitlab } from '@gitbeaker/node';
import { getPersonalAccessTokenHandler, WebApi } from 'azure-devops-node-api';
import { Config } from '@backstage/config';
import { TemplateEntityV1alpha1 } from '@backstage/catalog-model';
import {
  DeprecatedLocationTypeDetector,
  makeDeprecatedLocationTypeDetector,
  parseLocationAnnotation,
} from '../helpers';
import { PublisherBase, PublisherBuilder } from './types';
import { RemoteProtocol } from '../types';
import { GithubPublisher, RepoVisibilityOptions } from './github';
import { GitlabPublisher } from './gitlab';
import { AzurePublisher } from './azure';
import { BitbucketPublisher } from './bitbucket';

export class Publishers implements PublisherBuilder {
  private publisherMap = new Map<RemoteProtocol, PublisherBase>();

  constructor(private readonly typeDetector?: DeprecatedLocationTypeDetector) {}

  register(protocol: RemoteProtocol, publisher: PublisherBase) {
    this.publisherMap.set(protocol, publisher);
  }

  get(template: TemplateEntityV1alpha1): PublisherBase {
    const { protocol, location } = parseLocationAnnotation(template);
    const publisher = this.publisherMap.get(protocol);

    if (!publisher) {
      if ((protocol as string) === 'url') {
        const type = this.typeDetector?.(location);
        const detected = type && this.publisherMap.get(type as RemoteProtocol);
        if (detected) {
          return detected;
        }
        if (type) {
          throw new Error(
            `No publisher configuration available for type '${type}' with url "${location}". ` +
              "Make sure you've added appropriate configuration in the 'scaffolder' configuration section",
          );
        } else {
          throw new Error(
            `Failed to detect publisher type. Unable to determine integration type for location "${location}". ` +
              "Please add appropriate configuration to the 'integrations' configuration section",
          );
        }
      }
      throw new Error(`No publisher registered for type: "${protocol}"`);
    }

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
        const repoVisibility = githubConfig.getString(
          'visibility',
        ) as RepoVisibilityOptions;

        const githubToken = githubConfig.getString('token');
        const githubHost =
          githubConfig.getOptionalString('host') ?? 'https://api.github.com';
        const githubClient = new Octokit({
          auth: githubToken,
          baseUrl: githubHost,
        });
        const githubPublisher = new GithubPublisher({
          client: githubClient,
          token: githubToken,
          repoVisibility,
        });

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
        const gitLabToken = gitLabConfig.getConfig('api').getString('token');
        const gitLabClient = new Gitlab({
          host: gitLabConfig.getConfig('api').getOptionalString('baseUrl'),
          token: gitLabToken,
        });
        const gitLabPublisher = new GitlabPublisher(gitLabClient, gitLabToken);
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
        const baseUrl = azureConfig.getString('baseUrl');
        const azureToken = azureConfig.getConfig('api').getString('token');

        const authHandler = getPersonalAccessTokenHandler(azureToken);
        const webApi = new WebApi(baseUrl, authHandler);
        const azureClient = await webApi.getGitApi();

        const azurePublisher = new AzurePublisher(azureClient, azureToken);
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
        const baseUrl = bitbucketConfig.getString('host');
        const bitbucketUsername = bitbucketConfig.getString('username');
        const bitbucketToken = bitbucketConfig.getString('token');

        const bitbucketPublisher = new BitbucketPublisher(
          baseUrl,
          bitbucketUsername,
          bitbucketToken,
        );
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
