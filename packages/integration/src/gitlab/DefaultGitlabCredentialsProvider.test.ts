/*
 * Copyright 2026 The Backstage Authors
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

import type { ConnectionsService } from '@backstage/connections';
import { DefaultGitlabCredentialsProvider } from './DefaultGitlabCredentialsProvider';

describe('DefaultGitlabCredentialsProvider', () => {
  it('resolves token and anonymous credentials from connections', async () => {
    const find = jest
      .fn()
      .mockResolvedValueOnce({
        type: 'gitlab',
        title: 'GitLab',
        host: 'gitlab.com',
        auth: { method: 'token', token: 'connection-token' },
      })
      .mockResolvedValueOnce({
        type: 'gitlab',
        title: 'GitLab',
        host: 'gitlab.com',
        auth: { method: 'none' },
      });
    const provider = DefaultGitlabCredentialsProvider.fromConnections({
      find: find as ConnectionsService['find'],
    });

    await expect(
      provider.getCredentials({ url: 'https://gitlab.com/group/project' }),
    ).resolves.toEqual({
      headers: { Authorization: 'Bearer connection-token' },
      token: 'connection-token',
    });
    await expect(
      provider.getCredentials({ url: 'https://gitlab.com/public/project' }),
    ).resolves.toEqual({});
    expect(find).toHaveBeenNthCalledWith(1, {
      type: 'gitlab',
      url: 'https://gitlab.com/group/project',
      authMethods: ['token', 'none'],
    });
  });
});
