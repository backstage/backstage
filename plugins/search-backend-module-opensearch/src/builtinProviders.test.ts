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
import { AwsSigv4Signer } from '@opensearch-project/opensearch/aws';
import { mockServices } from '@backstage/backend-test-utils';
import {
  awsOpenSearchProvider,
  defaultOpenSearchProvider,
} from './builtinProviders';

jest.mock('@opensearch-project/opensearch/aws', () => ({
  AwsSigv4Signer: jest.fn(({ region, service, getCredentials }) => ({
    'X-Amz-Date': 'signed',
    signerDetails: { region, service, getCredentials },
  })),
}));

const logger = mockServices.logger.mock();

describe('built-in OpenSearch providers', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('default provider', () => {
    it('creates client options from a node URL', async () => {
      const config = new ConfigReader({ node: 'http://localhost:9200' });

      await expect(
        defaultOpenSearchProvider.createClientOptions({ config, logger }),
      ).resolves.toEqual({ node: 'http://localhost:9200' });
    });

    it('accepts a list of node URLs', async () => {
      const config = new ConfigReader({
        node: ['http://node-a:9200', 'http://node-b:9200'],
      });

      await expect(
        defaultOpenSearchProvider.createClientOptions({ config, logger }),
      ).resolves.toEqual({
        node: ['http://node-a:9200', 'http://node-b:9200'],
      });
    });

    it('maps username and password to basic auth', async () => {
      const config = new ConfigReader({
        node: 'http://localhost:9200',
        auth: { username: 'admin', password: 'changeme' },
      });

      await expect(
        defaultOpenSearchProvider.createClientOptions({ config, logger }),
      ).resolves.toEqual({
        node: 'http://localhost:9200',
        auth: { username: 'admin', password: 'changeme' },
      });
    });

    it('sends API keys as an ApiKey authorization header', async () => {
      const config = new ConfigReader({
        node: 'http://localhost:9200',
        auth: { apiKey: 'encoded-key' },
      });

      const options = await defaultOpenSearchProvider.createClientOptions({
        config,
        logger,
      });

      expect(options.headers).toEqual({
        Authorization: 'ApiKey encoded-key',
      });
      expect(options.auth).toBeUndefined();
    });

    it('honors TLS settings and lets the custom auth provider take precedence over static auth', async () => {
      const config = new ConfigReader({
        node: 'http://localhost:9200',
        auth: { username: 'admin', password: 'changeme' },
        clientOptions: { ssl: { rejectUnauthorized: false } },
      });
      const authProvider = {
        getAuthHeaders: jest
          .fn()
          .mockResolvedValue({ Authorization: 'Bearer rotated-token' }),
      };

      const options = await defaultOpenSearchProvider.createClientOptions({
        config,
        logger,
        authProvider,
      });

      expect(options.auth).toBeUndefined();
      expect(options.ssl).toEqual({ rejectUnauthorized: false });
      expect(options.Transport).toBeDefined();
      expect(options.Transport).toHaveProperty('sniffReasons');
    });

    it('rejects a missing or invalid node', async () => {
      await expect(
        defaultOpenSearchProvider.createClientOptions({
          config: new ConfigReader({}),
          logger,
        }),
      ).rejects.toThrow(/node/);

      await expect(
        defaultOpenSearchProvider.createClientOptions({
          config: new ConfigReader({ node: 42 }),
          logger,
        }),
      ).rejects.toThrow(/node must be a URL/);
    });
  });

  describe('AWS provider', () => {
    const node = 'https://search-backstage-abc123.eu-west-1.es.amazonaws.com';
    const credentialProvider = {
      sdkCredentialProvider: jest.fn().mockResolvedValue({
        accessKeyId: 'key',
        secretAccessKey: 'secret',
      }),
    };

    it('signs requests with SigV4 using credentials from the AWS integration', async () => {
      const config = new ConfigReader({ node });

      const options = (await awsOpenSearchProvider.createClientOptions({
        config,
        logger,
        credentialProvider,
      })) as any;

      expect(AwsSigv4Signer).toHaveBeenCalledWith(
        expect.objectContaining({
          region: 'eu-west-1',
          service: 'es',
          getCredentials: expect.any(Function),
        }),
      );
      expect(options.node).toBe(node);
      expect(options['X-Amz-Date']).toBe('signed');
      await expect(options.signerDetails.getCredentials()).resolves.toEqual({
        accessKeyId: 'key',
        secretAccessKey: 'secret',
      });
    });

    it('supports OpenSearch Serverless with the aoss service', async () => {
      const config = new ConfigReader({
        node: 'https://backstage.eu-west-1.aoss.amazonaws.com',
        service: 'aoss',
      });

      const options = (await awsOpenSearchProvider.createClientOptions({
        config,
        logger,
        credentialProvider,
      })) as any;

      expect(options.signerDetails.service).toBe('aoss');
    });

    it('rejects custom auth providers because AWS uses SigV4', async () => {
      const config = new ConfigReader({ node });

      await expect(
        awsOpenSearchProvider.createClientOptions({
          config,
          logger,
          credentialProvider,
          authProvider: {
            getAuthHeaders: jest.fn().mockResolvedValue({}),
          },
        }),
      ).rejects.toThrow(
        'Custom auth provider is not supported with the AWS OpenSearch provider',
      );
    });

    it('requires AWS credentials and a single node URL', async () => {
      const config = new ConfigReader({ node });

      await expect(
        awsOpenSearchProvider.createClientOptions({ config, logger }),
      ).rejects.toThrow(/No AWS credentials/);

      await expect(
        awsOpenSearchProvider.createClientOptions({
          config: new ConfigReader({ node: [node, node] }),
          logger,
          credentialProvider,
        }),
      ).rejects.toThrow(/requires a single node URL/);
    });

    it('rejects an unsupported signing service', async () => {
      const config = new ConfigReader({ node, service: 'unknown' });

      await expect(
        awsOpenSearchProvider.createClientOptions({
          config,
          logger,
          credentialProvider,
        }),
      ).rejects.toThrow('Unrecognized service type: unknown');
    });
  });
});
