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

import { ConfigReader } from '@backstage/config';
import { BitbucketCloudIntegration } from './BitbucketCloudIntegration';

describe('BitbucketCloudIntegration', () => {
  it('has a working factory', () => {
    const integrations = BitbucketCloudIntegration.factory({
      config: new ConfigReader({
        integrations: {
          bitbucketCloud: [
            {
              username: 'u',
              appPassword: 'p',
            },
          ],
        },
      }),
    });
    expect(integrations.list().length).toBe(1);
    expect(integrations.list()[0].config.username).toBe('u');
    expect(integrations.list()[0].config.appPassword).toBe('p');
  });

  it('returns the basics', () => {
    const integration = new BitbucketCloudIntegration({
      host: 'bitbucket.org',
    } as any);
    expect(integration.type).toBe('bitbucketCloud');
    expect(integration.title).toBe('bitbucket.org');
  });

  it('resolves url line number correctly', () => {
    const integration = new BitbucketCloudIntegration({} as any);

    expect(
      integration.resolveUrl({
        url: './a.yaml',
        base: 'https://bitbucket.org/my-owner/my-project/src/master/README.md',
        lineNumber: 14,
      }),
    ).toBe(
      'https://bitbucket.org/my-owner/my-project/src/master/a.yaml#lines-14',
    );
  });

  it('resolve edit URL', () => {
    const integration = new BitbucketCloudIntegration({} as any);

    expect(
      integration.resolveEditUrl(
        'https://bitbucket.org/my-owner/my-project/src/master/README.md',
      ),
    ).toBe(
      'https://bitbucket.org/my-owner/my-project/src/master/README.md?mode=edit&at=master',
    );
  });
});
