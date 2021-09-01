/*
 * Copyright 2021 The Backstage Authors
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

import { OctokitProvider } from './OctokitProvider';
import { ScmIntegrations } from '@backstage/integration';
import { ConfigReader } from '@backstage/config';

describe('getOctokit', () => {
  const config = new ConfigReader({
    integrations: {
      github: [
        { host: 'github.com', token: 'tokenlols' },
        { host: 'ghe.github.com' },
      ],
    },
  });

  const integrations = ScmIntegrations.fromConfig(config);
  const octokitProvider = new OctokitProvider(integrations);

  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('should throw an error when the repoUrl is not well formed', async () => {
    await expect(
      octokitProvider.getOctokit('github.com?repo=bob'),
    ).rejects.toThrow(/missing owner/);

    await expect(
      octokitProvider.getOctokit('github.com?owner=owner'),
    ).rejects.toThrow(/missing repo/);
  });

  it('should throw if there is no integration config provided', async () => {
    await expect(
      octokitProvider.getOctokit('missing.com?repo=bob&owner=owner'),
    ).rejects.toThrow(/No matching integration configuration/);
  });

  it('should throw if there is no token in the integration config that is returned', async () => {
    await expect(
      octokitProvider.getOctokit('ghe.github.com?repo=bob&owner=owner'),
    ).rejects.toThrow(/No token available for host/);
  });

  it('should return proper Octokit', async () => {
    const { client, token, owner, repo } = await octokitProvider.getOctokit(
      'github.com?repo=bob&owner=owner',
    );
    expect(client).toBeDefined();
    expect(token).toBe('tokenlols');
    expect(owner).toBe('owner');
    expect(repo).toBe('bob');
  });
});
