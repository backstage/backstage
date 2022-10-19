/*
 * Copyright 2020 The Backstage Authors
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

import { PluginTaskScheduler, TaskRunner } from '@backstage/backend-tasks';
import { Config } from '@backstage/config';
import {
  EntityProvider,
  EntityProviderConnection,
} from '@backstage/plugin-catalog-backend';
import { Logger } from 'winston';
import { GithubEntityProvider } from './providers/GithubEntityProvider';
import {
  GithubOrgEntityProvider,
  GithubOrgEntityProviderOptions,
} from './providers/GithubOrgEntityProvider';

/**
 * @public
 * @deprecated Use {@link GithubOrgEntityProvider} instead.
 */
export class GitHubOrgEntityProvider extends GithubOrgEntityProvider {
  static fromConfig(config: Config, options: GitHubOrgEntityProviderOptions) {
    options.logger.warn(
      '[Deprecated] Use GithubOrgEntityProvider instead of GitHubOrgEntityProvider.',
    );
    return GithubOrgEntityProvider.fromConfig(
      config,
      options as GithubOrgEntityProviderOptions,
    ) as GitHubOrgEntityProvider;
  }
}

/**
 * @public
 * @deprecated Use {@link GithubOrgEntityProviderOptions} instead.
 */
export type GitHubOrgEntityProviderOptions = GithubOrgEntityProviderOptions;

/**
 * @public
 * @deprecated Use {@link GithubEntityProvider} instead.
 */
export class GitHubEntityProvider implements EntityProvider {
  static fromConfig(
    config: Config,
    options: {
      logger: Logger;
      schedule?: TaskRunner;
      scheduler?: PluginTaskScheduler;
    },
  ): GitHubEntityProvider[] {
    options.logger.warn(
      '[Deprecated] Please use GithubEntityProvider instead of GitHubEntityProvider.',
    );
    return GithubEntityProvider.fromConfig(config, options).map(
      delegate => new GitHubEntityProvider(delegate),
    );
  }

  private constructor(private readonly delegate: GithubEntityProvider) {}

  connect(connection: EntityProviderConnection): Promise<void> {
    return this.delegate.connect(connection);
  }

  getProviderName(): string {
    return this.delegate.getProviderName();
  }

  refresh(logger: Logger): Promise<void> {
    return this.delegate.refresh(logger);
  }
}
