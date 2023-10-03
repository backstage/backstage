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
  GithubCredentialsProvider,
  ScmIntegrations,
  DefaultGithubCredentialsProvider,
} from '@backstage/integration';
import { GitProviderFactory } from './GitProviders';
import { Git, GitProvider } from '@backstage/backend-common';

/**
 * implents a {@link @backstage/backend-common#GitProvider} for github.com
 *
 * @private
 */
export class GithubGitProvider implements GitProvider {
  constructor(private readonly provider: GithubCredentialsProvider) {}

  static factory: GitProviderFactory = ({ config }) => {
    const integrations = ScmIntegrations.fromConfig(config);
    const credentialsProvider =
      DefaultGithubCredentialsProvider.fromIntegrations(integrations);
    return integrations.github.list().map(integration => {
      const predicate = (url: URL) => url.host === integration.config.host;
      const gitProvider = new GithubGitProvider(credentialsProvider);
      return { predicate, gitProvider };
    });
  };

  public async getGit(url: string) {
    const credentials = await this.provider.getCredentials({ url });
    return Git.fromAuth({
      username: 'x-access-token',
      password: credentials.token,
    });
  }
}
