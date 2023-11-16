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

import { parseRepoUrl } from './util';
import { ScmIntegrations } from '@backstage/integration';
import { ConfigReader } from '@backstage/config';

describe('parseRepoUrl', () => {
  const config = new ConfigReader({
    integrations: {
      github: [
        {
          host: 'www.github.com',
          token: 'token',
          apiBaseUrl: 'https://api.github.com',
        },
      ],
    },
  });
  const integrations = ScmIntegrations.fromConfig(config);
  it('should throw an exception if no parameters are passed', () => {
    expect(() => parseRepoUrl('www.github.com', integrations)).toThrow(
      'Invalid repo URL passed to publisher: https://www.github.com/, missing repo',
    );
  });
  it('should throw an exception if the repo parameter is missing, but owner parameter is set', () => {
    expect(() =>
      parseRepoUrl('www.github.com?owner=owner', integrations),
    ).toThrow(
      'Invalid repo URL passed to publisher: https://www.github.com/?owner=owner, missing repo',
    );
  });
  it('should throw an exception if the owner parameter is missing, but repo parameter is set', () => {
    expect(() =>
      parseRepoUrl('www.github.com?repo=repo', integrations),
    ).toThrow(
      'Invalid repo URL passed to publisher: https://www.github.com/?repo=repo, missing owner',
    );
  });
});
