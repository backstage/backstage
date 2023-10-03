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
import { Git } from '@backstage/backend-common';
import { BitbucketCloudGitProvider } from './BitbucketCloudGitProvider';
import { Config, ConfigReader } from '@backstage/config';
import {
  BitbucketCloudIntegration,
  ScmIntegrations,
} from '@backstage/integration';

describe('BitbucketCloudGitProvider', () => {
  let bitbucketCloudGitProvider: BitbucketCloudGitProvider;
  const config: Config = new ConfigReader({
    integrations: {
      bitbucketCloud: [
        {
          host: 'bitbucket.org',
          username: 'test-username',
          appPassword: 'test-app-password',
        },
      ],
    },
  });
  let bitBucketIntegration: BitbucketCloudIntegration;

  beforeEach(() => {
    jest.resetAllMocks();
    jest.spyOn(Git, 'fromAuth');
    bitBucketIntegration =
      ScmIntegrations.fromConfig(config).bitbucketCloud.list()[0];
    bitbucketCloudGitProvider = new BitbucketCloudGitProvider(
      bitBucketIntegration,
    );
  });

  it('should return a Git instance with the correct authentication', async () => {
    const git = await bitbucketCloudGitProvider.getGit(
      'http://does-not-matter.com',
    );
    expect(git).toBeInstanceOf(Git);
    expect(Git.fromAuth).toHaveBeenCalledWith({
      username: 'test-username',
      password: 'test-app-password',
    });
  });

  it('should throw an error if the integration is missing a required appPassword', () => {
    bitBucketIntegration.config.appPassword = undefined;
    expect(() => new BitbucketCloudGitProvider(bitBucketIntegration)).toThrow(
      `Bitbucket Cloud integration for '${bitBucketIntegration.config.host}' has configured a username but is missing a required appPassword.`,
    );
  });
});
