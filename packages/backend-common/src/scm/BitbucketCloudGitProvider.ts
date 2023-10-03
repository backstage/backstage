/*
 * Copyright 2023 The Backstage Authors
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
import {
  BitbucketCloudIntegration,
  ScmIntegrations,
} from '@backstage/integration';
import { GitProviderFactory } from './GitProviders';
import { Git, GitProvider } from '@backstage/backend-common';

/**
 * implents a {@link @backstage/backend-common#GitProvider} for bitbucket.org
 *
 * @private
 */
export class BitbucketCloudGitProvider implements GitProvider {
  constructor(private readonly integration: BitbucketCloudIntegration) {
    const { host, username, appPassword } = integration.config;

    if (username && !appPassword) {
      throw new Error(
        `Bitbucket Cloud integration for '${host}' has configured a username but is missing a required appPassword.`,
      );
    }
  }
  static factory: GitProviderFactory = ({ config }) => {
    const integrations = ScmIntegrations.fromConfig(config);
    return integrations.bitbucketCloud.list().map(integration => {
      const predicate = (url: URL) => url.host === integration.config.host;
      const gitProvider = new BitbucketCloudGitProvider(integration);
      return { predicate, gitProvider };
    });
  };

  public async getGit(_url: string): Promise<Git> {
    return Git.fromAuth({
      username: this.integration.config.username,
      password: this.integration.config.appPassword,
    });
  }
}
