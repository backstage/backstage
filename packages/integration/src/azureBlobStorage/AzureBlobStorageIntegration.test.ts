/*
 * Copyright 2023 The Backstage Authors
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
import { AzureBlobStorageIntegration } from './AzureBlobStorageIntegration';

describe('AzureBlobStorageIntegration', () => {
  it('has a working factory', () => {
    const integrations = AzureBlobStorageIntegration.factory({
      config: new ConfigReader({
        integrations: {
          azureBlobStorage: [
            {
              accountName: 'test',
              secretAccessKey: 'secret key',
            },
          ],
        },
      }),
    });
    expect(integrations.list().length).toBe(1); // including default
    expect(integrations.list()[0].config.host).toBe(
      'test.blob.core.windows.net',
    );
  });

  it('returns the basics', () => {
    const integration = new AzureBlobStorageIntegration({
      host: 'test.azure.blob.com',
    } as any);
    expect(integration.type).toBe('azureBlobStorage');
    expect(integration.title).toBe('test.azure.blob.com');
  });

  describe('resolveUrl', () => {
    it('works for valid urls', () => {
      const integration = new AzureBlobStorageIntegration({
        host: 'test.azure.blob.com',
      } as any);

      expect(
        integration.resolveUrl({
          url: 'https://test.azure.blob.com/catalog-info.yaml',
          base: 'https://test.azure.blob.com/catalog-info.yaml',
        }),
      ).toBe('https://test.azure.blob.com/catalog-info.yaml');
    });
  });

  it('resolve edit URL', () => {
    const integration = new AzureBlobStorageIntegration({
      host: 'a.com',
    } as any);

    // TODO: The Azure BlobStorage integration doesn't support resolving an edit URL,
    // instead we keep the input URL.
    expect(
      integration.resolveEditUrl(
        'https://test.azure.blob.com/catalog-info.yaml',
      ),
    ).toBe('https://test.azure.blob.com/catalog-info.yaml');
  });
});
