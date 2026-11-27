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

import type { Config } from '@backstage/config';
import { AwsSigv4Signer } from '@opensearch-project/opensearch/aws';
import { RequestSigner } from 'aws4';
import { createOpenSearchAuthTransport } from './engines/OpenSearchAuthTransport';
import type { OpenSearchClientOptions } from './engines/OpenSearchClientOptions';
import type { OpenSearchProvider } from './providers';

function readNode(config: Config): string | string[] {
  const node = config.get('node');
  if (
    typeof node === 'string' ||
    (Array.isArray(node) && node.every(item => typeof item === 'string'))
  ) {
    return node as string | string[];
  }
  throw new Error(
    'Invalid OpenSearch configuration: node must be a URL or a list of URLs',
  );
}

function readSsl(config: Config): OpenSearchClientOptions['ssl'] {
  const sslConfig = config
    .getOptionalConfig('clientOptions')
    ?.getOptionalConfig('ssl');
  if (!sslConfig) {
    return undefined;
  }
  return {
    rejectUnauthorized: sslConfig.getOptionalBoolean('rejectUnauthorized'),
  };
}

/**
 * Provider for self-hosted OpenSearch clusters.
 *
 * Supports basic authentication, API keys and custom authentication headers
 * supplied through the auth extension point.
 *
 * @public
 */
export const defaultOpenSearchProvider: OpenSearchProvider = {
  id: 'default',
  async createClientOptions({ config, authProvider }) {
    const authConfig = authProvider
      ? undefined
      : config.getOptionalConfig('auth');
    const hasApiKey = authConfig?.has('apiKey') ?? false;
    const headers = hasApiKey
      ? {
          Authorization: `ApiKey ${authConfig!.getString('apiKey')}`,
        }
      : undefined;
    const basicAuth =
      authConfig && !hasApiKey
        ? {
            username: authConfig.getString('username'),
            password: authConfig.getString('password'),
          }
        : undefined;

    return {
      node: readNode(config),
      ...(basicAuth ? { auth: basicAuth } : {}),
      ...(headers ? { headers } : {}),
      ...(authProvider
        ? { Transport: createOpenSearchAuthTransport(authProvider) }
        : {}),
      ...(readSsl(config) ? { ssl: readSsl(config) } : {}),
    };
  },
};

/**
 * Provider for Amazon OpenSearch Service and Serverless, using AWS SigV4
 * request signing with the default AWS credentials chain.
 *
 * @public
 */
export const awsOpenSearchProvider: OpenSearchProvider = {
  id: 'aws',
  async createClientOptions({ config, credentialProvider, authProvider }) {
    if (authProvider) {
      throw new Error(
        'Custom auth provider is not supported with the AWS OpenSearch provider. AWS uses SigV4 signing.',
      );
    }
    if (!credentialProvider) {
      throw new Error(
        'No AWS credentials configured for the AWS OpenSearch provider',
      );
    }

    const node = readNode(config);
    if (typeof node !== 'string') {
      throw new Error(
        'Invalid OpenSearch configuration: the AWS provider requires a single node URL',
      );
    }

    const requestSigner = new RequestSigner(node);
    const service =
      config.getOptionalString('service') ?? requestSigner.service;
    if (service !== 'es' && service !== 'aoss') {
      throw new Error(`Unrecognized service type: ${service}`);
    }

    return {
      node,
      ...AwsSigv4Signer({
        region: config.getOptionalString('region') ?? requestSigner.region,
        service,
        getCredentials: async () => credentialProvider.sdkCredentialProvider(),
      }),
      ...(readSsl(config) ? { ssl: readSsl(config) } : {}),
    };
  },
};

/**
 * Built-in providers, keyed by the id used in `search.opensearch.provider`.
 *
 * @public
 */
export const builtInOpenSearchProviders: Record<string, OpenSearchProvider> = {
  [defaultOpenSearchProvider.id]: defaultOpenSearchProvider,
  [awsOpenSearchProvider.id]: awsOpenSearchProvider,
};
