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

import { ConfigReader } from '@backstage/config';
import { ScmIntegrations } from '@backstage/integration';
import { assertScmUserCredentials } from './assertScmUserCredentials';

describe('assertScmUserCredentials', () => {
  const integrations = ScmIntegrations.fromConfig(
    new ConfigReader({
      integrations: {
        github: [{ host: 'github.example.com' }],
        gitlab: [
          {
            host: 'gitlab.example.com',
            apiBaseUrl: 'https://gitlab.example.com/api/v4',
          },
        ],
        bitbucketServer: [{ host: 'bitbucket.example.com' }],
      },
    }),
  );

  it('requires tokens only for supported SCM reads when configured', () => {
    expect(() =>
      assertScmUserCredentials({
        integrations,
        requireScmUserCredentials: true,
        url: 'https://github.example.com/backstage/backstage',
      }),
    ).toThrow(
      'No user credentials provided for host github.example.com, but scaffolder.requireScmUserCredentials is enabled',
    );

    expect(() =>
      assertScmUserCredentials({
        integrations,
        requireScmUserCredentials: true,
        url: './skeleton',
        baseUrl:
          'https://gitlab.example.com/backstage/templates/-/blob/main/template.yaml',
      }),
    ).toThrow(
      'No user credentials provided for host gitlab.example.com, but scaffolder.requireScmUserCredentials is enabled',
    );

    expect(() =>
      assertScmUserCredentials({
        integrations,
        requireScmUserCredentials: true,
        url: 'https://github.example.com/backstage/backstage',
        token: 'user-token',
      }),
    ).not.toThrow();
    expect(() =>
      assertScmUserCredentials({
        integrations,
        url: 'https://github.example.com/backstage/backstage',
      }),
    ).not.toThrow();
    expect(() =>
      assertScmUserCredentials({
        integrations,
        requireScmUserCredentials: true,
        url: 'https://bitbucket.example.com/projects/BS/repos/backstage',
      }),
    ).not.toThrow();
    expect(() =>
      assertScmUserCredentials({
        integrations,
        requireScmUserCredentials: true,
        url: 'https://example.com/skeleton',
      }),
    ).not.toThrow();
  });
});
