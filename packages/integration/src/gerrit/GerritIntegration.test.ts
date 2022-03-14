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
import { GerritIntegration } from './GerritIntegration';

describe('GerritIntegration', () => {
  it('has a working factory', () => {
    const integrations = GerritIntegration.factory({
      config: new ConfigReader({
        integrations: {
          gerrit: [
            {
              host: 'gerrit-review.example.com',
              username: 'gerrituser',
              baseUrl: 'https://gerrit-review.example.com/gerrit',
              password: '1234',
            },
          ],
        },
      }),
    });
    expect(integrations.list().length).toBe(1);
    expect(integrations.list()[0].config.host).toBe(
      'gerrit-review.example.com',
    );
    expect(integrations.list()[0].config.baseUrl).toBe(
      'https://gerrit-review.example.com/gerrit',
    );
  });

  it('returns the basics', () => {
    const integration = new GerritIntegration({
      host: 'gerrit-review.example.com',
    } as any);
    expect(integration.type).toBe('gerrit');
    expect(integration.title).toBe('gerrit-review.example.com');
  });

  describe('resolveUrl', () => {
    it('works for valid urls', () => {
      const integration = new GerritIntegration({
        host: 'gerrit-review.example.com',
      } as any);

      expect(
        integration.resolveUrl({
          url: 'https://gerrit-review.example.com/catalog-info.yaml',
          base: 'https://gerrit-review.example.com/catalog-info.yaml',
          lineNumber: 9,
        }),
      ).toBe('https://gerrit-review.example.com/catalog-info.yaml#9');
    });

    it('handles line numbers', () => {
      const integration = new GerritIntegration({
        host: 'gerrit-review.example.com',
      } as any);

      expect(
        integration.resolveUrl({
          url: '',
          base: 'https://gerrit-review.example.com/catalog-info.yaml#4',
          lineNumber: 9,
        }),
      ).toBe('https://gerrit-review.example.com/catalog-info.yaml#9');
    });
  });

  describe('resolves with a relative url', () => {
    it('works for valid urls', () => {
      const integration = new GerritIntegration({
        host: 'gerrit-review.example.com',
      } as any);

      expect(
        integration.resolveUrl({
          url: './skeleton',
          base: 'https://gerrit-review.example.com/gerrit/plugins/repo/+/refs/heads/master/template.yaml',
        }),
      ).toBe(
        'https://gerrit-review.example.com/gerrit/plugins/repo/+/refs/heads/master/skeleton',
      );
    });
  });

  it('resolve edit URL', () => {
    const integration = new GerritIntegration({
      host: 'gerrit-review.example.com',
    } as any);

    // Resolve edit URLs is not applicable for gerrit. Return the input
    // url as is.
    expect(
      integration.resolveEditUrl(
        'https://gerrit-review.example.com/catalog-info.yaml',
      ),
    ).toBe('https://gerrit-review.example.com/catalog-info.yaml');
  });
});
