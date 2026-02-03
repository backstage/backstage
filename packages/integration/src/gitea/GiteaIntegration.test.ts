/*
 * Copyright 2022 The Backstage Authors
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
import { GiteaIntegration } from './GiteaIntegration';

describe('GiteaIntegration', () => {
  it('has a working factory', () => {
    const integrations = GiteaIntegration.factory({
      config: new ConfigReader({
        integrations: {
          gitea: [
            {
              host: 'gitea.example.com',
              username: 'git',
              baseUrl: 'https://gitea.example.com/route',
              password: '1234',
            },
          ],
        },
      }),
    });
    expect(integrations.list().length).toBe(1);
    expect(integrations.list()[0].config.host).toBe('gitea.example.com');
    expect(integrations.list()[0].config.baseUrl).toBe(
      'https://gitea.example.com/route',
    );
  });

  it('returns the basics', () => {
    const integration = new GiteaIntegration({
      host: 'gitea.example.com',
    });
    expect(integration.type).toBe('gitea');
    expect(integration.title).toBe('gitea.example.com');
  });

  describe('resolveUrl', () => {
    it('works for valid urls, ignoring line number', () => {
      const integration = new GiteaIntegration({
        host: 'gitea.example.com',
      });

      expect(
        integration.resolveUrl({
          url: 'https://gitea.example.com/catalog-info.yaml',
          base: 'https://gitea.example.com/catalog-info.yaml',
          lineNumber: 9,
        }),
      ).toBe('https://gitea.example.com/catalog-info.yaml');
    });

    it('handles line numbers', () => {
      const integration = new GiteaIntegration({
        host: 'gitea.example.com',
      });

      expect(
        integration.resolveUrl({
          url: '',
          base: 'https://gitea.example.com/catalog-info.yaml#4',
          lineNumber: 9,
        }),
      ).toBe('https://gitea.example.com/catalog-info.yaml#L9');
    });
  });

  describe('resolves with a relative url', () => {
    it('works for valid urls', () => {
      const integration = new GiteaIntegration({
        host: 'gitea.example.com',
      });

      expect(
        integration.resolveUrl({
          url: './skeleton',
          base: 'https://gitea.example.com/git/plugins/repo/+/refs/heads/master/template.yaml',
        }),
      ).toBe(
        'https://gitea.example.com/git/plugins/repo/+/refs/heads/master/skeleton',
      );
    });
  });

  describe('resolves with an absolute url', () => {
    it('works for valid urls', () => {
      const integration = new GiteaIntegration({
        host: 'gitea.example.com',
      });

      expect(
        integration.resolveUrl({
          url: '/catalog-info.yaml',
          base: 'https://gitea.example.com/git/repo/+/refs/heads/master/',
        }),
      ).toBe(
        'https://gitea.example.com/git/repo/+/refs/heads/master/catalog-info.yaml',
      );
    });
  });

  it('resolve edit URL', () => {
    const integration = new GiteaIntegration({
      host: 'gitea.example.com',
    });

    expect(
      integration.resolveEditUrl(
        'https://gitea.example.com/owner/repo/src/branch/branch_name/path/to/c.yaml',
      ),
    ).toBe(
      'https://gitea.example.com/owner/repo/_edit/branch_name/path/to/c.yaml',
    );
  });
});
