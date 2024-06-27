/*
 * Copyright 2024 The Backstage Authors
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
import { HarnessIntegration } from './HarnessIntegration';

describe('HarnessIntegration', () => {
  it('has a working factory', () => {
    const integrations = HarnessIntegration.factory({
      config: new ConfigReader({
        integrations: {
          harness: [
            {
              host: 'app.harness.io',
              token: '1234',
            },
          ],
        },
      }),
    });
    expect(integrations.list().length).toBe(1);
    expect(integrations.list()[0].config.host).toBe('app.harness.io');
  });

  it('returns the basics', () => {
    const integration = new HarnessIntegration({
      host: 'app.harness.io',
    });
    expect(integration.type).toBe('harness');
    expect(integration.title).toBe('app.harness.io');
  });

  describe('resolveUrl', () => {
    it('works for valid urls, ignoring line number', () => {
      const integration = new HarnessIntegration({
        host: 'app.harness.io',
      });

      expect(
        integration.resolveUrl({
          url: 'https://app.harness.io/catalog-info.yaml',
          base: 'https://app.harness.io/catalog-info.yaml',
          lineNumber: 9,
        }),
      ).toBe('https://app.harness.io/catalog-info.yaml');
    });

    it('handles line numbers', () => {
      const integration = new HarnessIntegration({
        host: 'app.harness.io',
      });

      expect(
        integration.resolveUrl({
          url: '',
          base: 'https://app.harness.io/catalog-info.yaml#4',
          lineNumber: 9,
        }),
      ).toBe('https://app.harness.io/catalog-info.yaml#L9');
    });
  });

  describe('resolves with a relative url', () => {
    it('works for valid urls', () => {
      const integration = new HarnessIntegration({
        host: 'app.harness.io',
      });

      expect(
        integration.resolveUrl({
          url: './skeleton',
          base: 'https://app.harness.io/git/plugins/repo/+/refs/heads/master/template.yaml',
        }),
      ).toBe(
        'https://app.harness.io/git/plugins/repo/+/refs/heads/master/skeleton',
      );
    });
  });

  describe('resolves with an absolute url', () => {
    it('works for valid urls', () => {
      const integration = new HarnessIntegration({
        host: 'app.harness.io',
      });

      expect(
        integration.resolveUrl({
          url: '/catalog-info.yaml',
          base: 'https://app.harness.io/git/repo/+/refs/heads/master/',
        }),
      ).toBe(
        'https://app.harness.io/git/repo/+/refs/heads/master/catalog-info.yaml',
      );
    });
  });

  it('resolve edit URL', () => {
    const integration = new HarnessIntegration({
      host: 'app.harness.io',
    });

    expect(
      integration.resolveEditUrl(
        'https://app.harness.io/ng/account/accountId/module/code/orgs/orgName/projects/projName/repos/repoName/edit/refMain/~/all-apis.yaml',
      ),
    ).toBe(
      'https://app.harness.io/ng/account/accountId/module/code/orgs/orgName/projects/projName/repos/repoName/files/refMain/~/all-apis.yaml',
    );
  });
});
