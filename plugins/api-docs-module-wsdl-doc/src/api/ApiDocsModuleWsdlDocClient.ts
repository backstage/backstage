/*
 * Copyright 2021 The Backstage Authors
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

import { ResponseError } from '@backstage/errors';
import { ApiDocsModuleWsdlDocApi } from './types';
import { DiscoveryApi, IdentityApi } from '@backstage/core-plugin-api';

/**
 * Options for creating a client.
 *
 * @public
 */
export interface ClientOptions {
  discoveryApi: DiscoveryApi;
  identityApi: IdentityApi;
}

/**
 * An implementation of the ApiDocsModuleWsdlDocClientApi that talks to the plugin backend.
 *
 * @public
 */
export class ApiDocsModuleWsdlDocClient implements ApiDocsModuleWsdlDocApi {
  private readonly discoveryApi: DiscoveryApi;
  private readonly identityApi: IdentityApi;

  constructor(options: ClientOptions) {
    this.discoveryApi = options.discoveryApi;
    this.identityApi = options.identityApi;
  }

  async convert(xml: string): Promise<string> {
    const baseUrl = await this.discoveryApi.getBaseUrl(
      'api-docs-module-wsdl-doc',
    );
    const { token } = await this.identityApi.getCredentials();

    const res = await fetch(`${baseUrl}/v1/convert`, {
      method: 'POST',
      headers: token
        ? {
            Authorization: `Bearer ${token}`,
          }
        : undefined,
      body: xml,
    });

    if (!res.ok) {
      throw await ResponseError.fromResponse(res);
    }

    return res.text();
  }
}
