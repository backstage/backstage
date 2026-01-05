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
import { GoogleGcsIntegration } from './GoogleGcsIntegration';

describe('GoogleGcsIntegration', () => {
  it('has a working factory', () => {
    const integrations = GoogleGcsIntegration.factory({
      config: new ConfigReader({
        integrations: {
          googleGcs: {
            clientEmail: 'someone@example.com',
            privateKey: 'fake-key',
          },
        },
      }),
    });
    expect(integrations.list().length).toBe(1);
    expect(integrations.list()[0].config.host).toBe('storage.cloud.google.com');
  });

  it('returns default integration when no config', () => {
    const integrations = GoogleGcsIntegration.factory({
      config: new ConfigReader({
        integrations: {},
      }),
    });
    expect(integrations.list().length).toBe(1);
    expect(integrations.list()[0].config.host).toBe('storage.cloud.google.com');
  });

  it('returns the basics', () => {
    const integration = new GoogleGcsIntegration({
      host: 'storage.cloud.google.com',
    });
    expect(integration.type).toBe('googleGcs');
    expect(integration.title).toBe('storage.cloud.google.com');
  });

  describe('resolveUrl', () => {
    it('works for valid urls', () => {
      const integration = new GoogleGcsIntegration({
        host: 'storage.cloud.google.com',
      });

      expect(
        integration.resolveUrl({
          url: 'https://storage.cloud.google.com/bucket/catalog-info.yaml',
          base: 'https://storage.cloud.google.com/bucket/catalog-info.yaml',
        }),
      ).toBe('https://storage.cloud.google.com/bucket/catalog-info.yaml');
    });
  });

  it('resolve edit URL', () => {
    const integration = new GoogleGcsIntegration({
      host: 'storage.cloud.google.com',
    });

    expect(
      integration.resolveEditUrl(
        'https://storage.cloud.google.com/bucket/catalog-info.yaml',
      ),
    ).toBe('https://storage.cloud.google.com/bucket/catalog-info.yaml');
  });
});
