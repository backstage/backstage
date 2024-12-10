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
import { AzureBlobStorageIntergation } from './AzureBlobStorageIntegration';

describe('AzureBlobStorageIntegration', () => {
  it('has a working factory', () => {
    const integrations = AzureBlobStorageIntergation.factory({
      config: new ConfigReader({
        integrations: {
          azureBlobStorage: [
            {
              endpoint: 'https://myaccount.blob.core.windows.net',
              accountName: 'myaccount',
              accountKey: 'someAccountKey',
            },
          ],
        },
      }),
    });
    expect(integrations.list().length).toBe(2); // including default
    expect(integrations.list()[0].config.host).toBe(
      'myaccount.blob.core.windows.net',
    );
    expect(integrations.list()[1].config.host).toBe('blob.core.windows.net'); // default integration
  });

  it('returns the basics', () => {
    const integration = new AzureBlobStorageIntergation({
      host: 'myaccount.blob.core.windows.net',
    } as any);
    expect(integration.type).toBe('azureBlobStorage');
    expect(integration.title).toBe('myaccount.blob.core.windows.net');
  });

  describe('resolveUrl', () => {
    it('works for valid URLs', () => {
      const integration = new AzureBlobStorageIntergation({
        host: 'blob.core.windows.net',
      } as any);

      expect(
        integration.resolveUrl({
          url: 'https://myaccount.blob.core.windows.net/container/file.yaml',
          base: 'https://myaccount.blob.core.windows.net/container/file.yaml',
        }),
      ).toBe('https://myaccount.blob.core.windows.net/container/file.yaml');
    });
  });

  it('resolve edit URL', () => {
    const integration = new AzureBlobStorageIntergation({
      host: 'myaccount.blob.core.windows.net',
    } as any);

    // TODO: The Azure Blob Storage integration doesn't support resolving an edit URL,
    // instead we keep the input URL.
    expect(
      integration.resolveEditUrl(
        'https://myaccount.blob.core.windows.net/container/file.yaml',
      ),
    ).toBe('https://myaccount.blob.core.windows.net/container/file.yaml');
  });
});
