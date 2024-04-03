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

import { DiscoveryService } from '@backstage/backend-plugin-api';
import { ResponseError } from '@backstage/errors';
import { JsonObject } from '@backstage/types';

export class DefaultPublicKeysClient implements PublicKeysClient {
  constructor(private readonly discovery: DiscoveryService) {}

  // TODO: cache stuff
  async listPublicKeys(pluginId: string) {
    const response = await fetch(
      `${await this.discovery.getBaseUrl(
        pluginId,
      )}/.backstage/auth/v1/jwks.json`,
    );

    if (response.ok) {
      return response.json();
    }
    throw await ResponseError.fromResponse(response);
  }
}

export type PublicKeysClient = {
  listPublicKeys(pluginId: string): Promise<{ keys: JsonObject[] }>;
};
