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
import { PublisherBase, PublisherBuilder } from './types';
import {
  GithubPublisher,
  RepoVisibilityOptions as GithubRepoVisibilityOptions,
} from './github';
import {
  GitlabPublisher,
  RepoVisibilityOptions as GitlabRepoVisibilityOptions,
} from './gitlab';
import { AzurePublisher } from './azure';
import {
  BitbucketPublisher,
  RepoVisibilityOptions as BitbucketRepoVisibilityOptions,
} from './bitbucket';
import { Logger } from 'winston';
import { ScmIntegrations } from '@backstage/integration';

export class Publishers implements PublisherBuilder {
  private publisherMap = new Map<string, PublisherBase | undefined>();

  register(host: string, preparer: PublisherBase | undefined) {
    this.publisherMap.set(host, preparer);
  }

  get(url: string): PublisherBase {
    const preparer = this.publisherMap.get(new URL(url).host);
    if (!preparer) {
      throw new Error(
        `Unable to find a publisher for URL: ${url}. Please make sure to register this host under an integration in app-config`,
      );
    }
    return preparer;
  }

  static async fromConfig(
    config: Config,
    { logger }: { logger: Logger },
  ): Promise<PublisherBuilder> {
    const publishers = new Publishers();

    const scm = ScmIntegrations.fromConfig(config);

    const deprecationWarning = (name: string) => {
      logger.warn(
        `'Specifying credentials for ${name} in the Scaffolder configuration is deprecated. This will cause errors in a future release. Please migrate to using integrations config and specifying tokens under hostnames'`,
      );
    };

    for (const integration of scm.azure.list()) {
      const publisher = await AzurePublisher.fromConfig(integration.config);
      if (publisher) {
        publishers.register(integration.config.host, publisher);
      } else {
        deprecationWarning('Azure');

        publishers.register(
          integration.config.host,
          await AzurePublisher.fromConfig({
            token: config.getOptionalString('scaffolder.azure.token'),
            host: integration.config.host,
          }),
        );
      }
    }

    for (const integration of scm.github.list()) {
      const repoVisibility = (config.getOptionalString(
        'scaffolder.github.visibility',
      ) ?? 'public') as GithubRepoVisibilityOptions;

      const publisher = await GithubPublisher.fromConfig(integration.config, {
        repoVisibility,
      });
      if (publisher) {
        publishers.register(integration.config.host, publisher);
      } else {
        deprecationWarning('GitHub');

        publishers.register(
          integration.config.host,
          await GithubPublisher.fromConfig(
            {
              token: config.getOptionalString('scaffolder.github.token') ?? '',
              host: integration.config.host,
            },
            { repoVisibility },
          ),
        );
      }
    }

    for (const integration of scm.gitlab.list()) {
      const repoVisibility = (config.getOptionalString(
        'scaffolder.gitlab.visibility',
      ) ?? 'public') as GitlabRepoVisibilityOptions;

      const publisher = await GitlabPublisher.fromConfig(integration.config, {
        repoVisibility,
      });

      if (publisher) {
        publishers.register(integration.config.host, publisher);
      } else {
        deprecationWarning('Gitlab');

        publishers.register(
          integration.config.host,
          await GitlabPublisher.fromConfig(
            {
              token: config.getOptionalString('scaffolder.gitlab.token') ?? '',
              host: integration.config.host,
            },
            { repoVisibility },
          ),
        );
      }
    }

    for (const integration of scm.bitbucket.list()) {
      const repoVisibility = (config.getOptionalString(
        'scaffolder.bitbucket.visibility',
      ) ?? 'public') as BitbucketRepoVisibilityOptions;

      const publisher = await BitbucketPublisher.fromConfig(
        integration.config,
        {
          repoVisibility,
        },
      );

      if (publisher) {
        publishers.register(integration.config.host, publisher);
      } else {
        deprecationWarning('Bitbucket');

        publishers.register(
          integration.config.host,
          await BitbucketPublisher.fromConfig(
            {
              token:
                config.getOptionalString('scaffolder.bitbucket.token') ?? '',
              username:
                config.getOptionalString('scaffolder.bitbucket.username') ?? '',
              appPassword:
                config.getOptionalString('scaffolder.bitbucket.appPassword') ??
                '',
              host: integration.config.host,
            },
            { repoVisibility },
          ),
        );
      }
    }

    return publishers;
  }
}
