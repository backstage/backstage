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
import { BitbucketServerIntegration } from './BitbucketServerIntegration';

describe('BitbucketServerIntegration', () => {
  it('has a working factory', () => {
    const integrations = BitbucketServerIntegration.factory({
      config: new ConfigReader({
        integrations: {
          bitbucketServer: [
            {
              host: 'h.com',
              apiBaseUrl: 'a',
              token: 't',
            },
          ],
        },
      }),
    });
    expect(integrations.list().length).toBe(1);
    expect(integrations.list()[0].config.host).toBe('h.com');
  });

  it('returns the basics', () => {
    const integration = new BitbucketServerIntegration({
      host: 'h.com',
    } as any);
    expect(integration.type).toBe('bitbucketServer');
    expect(integration.title).toBe('h.com');
  });

  it('resolves url', () => {
    const integration = new BitbucketServerIntegration({
      host: 'h.com',
    } as any);

    expect(
      integration.resolveUrl({
        url: './README.md',
        base: 'https://h.com/projects/my-project/repos/my-repo/browse/?at=master',
      }),
    ).toBe(
      'https://h.com/projects/my-project/repos/my-repo/browse/README.md?at=master',
    );
  });

  it('resolves url with line number', () => {
    const integration = new BitbucketServerIntegration({
      host: 'h.com',
    } as any);

    expect(
      integration.resolveUrl({
        url: './README.md',
        base: 'https://h.com/projects/my-project/repos/my-repo/browse/?at=master',
        lineNumber: 14,
      }),
    ).toBe(
      'https://h.com/projects/my-project/repos/my-repo/browse/README.md?at=master#14',
    );
  });

  it('resolves edit url', () => {
    const integration = new BitbucketServerIntegration({
      host: 'h.com',
    } as any);

    expect(
      integration.resolveEditUrl(
        'https://h.com/projects/my-project/repos/my-repo/browse/README.md',
      ),
    ).toBe('https://h.com/projects/my-project/repos/my-repo/browse/README.md');
  });

  it('resolves edit url with query params', () => {
    const integration = new BitbucketServerIntegration({
      host: 'h.com',
    } as any);

    expect(
      integration.resolveEditUrl(
        'https://h.com/projects/my-project/repos/my-repo/browse/README.md?at=master',
      ),
    ).toBe('https://h.com/projects/my-project/repos/my-repo/browse/README.md');
  });
});
