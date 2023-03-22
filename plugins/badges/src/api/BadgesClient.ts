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

import { generatePath } from 'react-router-dom';
import { ResponseError } from '@backstage/errors';
import { Entity, DEFAULT_NAMESPACE } from '@backstage/catalog-model';
import { BadgesApi, BadgeSpec } from './types';
import {
  ConfigApi,
  DiscoveryApi,
  IdentityApi,
} from '@backstage/core-plugin-api';

export class BadgesClient implements BadgesApi {
  private readonly discoveryApi: DiscoveryApi;
  private readonly identityApi: IdentityApi;
  private readonly configApi: ConfigApi;

  constructor(options: {
    discoveryApi: DiscoveryApi;
    identityApi: IdentityApi;
    configApi: ConfigApi;
  }) {
    this.discoveryApi = options.discoveryApi;
    this.identityApi = options.identityApi;
    this.configApi = options.configApi;
  }

  static fromConfig(options: {
    discoveryApi: DiscoveryApi;
    identityApi: IdentityApi;
    configApi: ConfigApi;
  }) {
    return new BadgesClient(options);
  }

  public async getEntityBadgeSpecs(entity: Entity): Promise<BadgeSpec[]> {
    // Check if obfuscation is enabled in the configuration
    const obfuscate =
      this.configApi.getOptionalBoolean('app.badges.obfuscate') ?? false;
    const { token } = await this.identityApi.getCredentials();

    // If obfuscation is enabled, get the hash of the entity and use that to get the badge specs
    if (obfuscate) {
      const entityHashUrl = await this.getEntityHashUrl(entity);
      const entityHash = await this.getEntityHash(entityHashUrl).then(data => {
        return data.hash;
      });
      const entityHashedBadgeSpecsUrl = await this.getEntityHashedBadgeSpecsUrl(
        entityHash,
      );

      const response = await fetch(entityHashedBadgeSpecsUrl, {
        headers: token
          ? {
              Authorization: `Bearer ${token}`,
            }
          : undefined,
      });
      if (!response.ok) {
        throw await ResponseError.fromResponse(response);
      }

      return await response.json();
    }

    // If obfuscation is disabled, get the badge specs directly as the previous implementation
    const entityBadgeSpecsUrl = await this.getEntityBadgeSpecsUrl(entity);
    const response = await fetch(entityBadgeSpecsUrl, {
      headers: token
        ? {
            Authorization: `Bearer ${token}`,
          }
        : undefined,
    });
    if (!response.ok) {
      throw await ResponseError.fromResponse(response);
    }

    return await response.json();
  }

  // This function is used to generate the URL to get the badge specs for an entity when obfuscation is enabled. Using the hash
  private async getEntityHashUrl(entity: Entity): Promise<string> {
    const routeParams = this.getEntityRouteParams(entity);
    const path = generatePath(`:namespace/:kind/:name`, routeParams);
    const baseUrl = await this.discoveryApi.getBaseUrl('badges');
    const obfuscatedEntityUrl = `${baseUrl}/entity/${path}/obfuscated`;

    return obfuscatedEntityUrl;
  }

  // This function is used to get the hash of an entity when obfuscation is enabled. It's calling the badges backend to get the hash
  private async getEntityHash(entityHashUrl: string): Promise<any> {
    const { token: idToken } = await this.identityApi.getCredentials();

    const responseEntityHash = await fetch(entityHashUrl, {
      headers: idToken
        ? {
            Authorization: `Bearer ${idToken}`,
          }
        : undefined,
    });

    if (!responseEntityHash.ok) {
      throw await ResponseError.fromResponse(responseEntityHash);
    }
    return await responseEntityHash.json();
  }

  // This function is used to generate the URLs to use in the frontend when obfuscation is enabled. It's using the hash of the entity to get the badge specs
  private async getEntityHashedBadgeSpecsUrl(entityHash: {
    hash: string;
  }): Promise<string> {
    const baseUrl = await this.discoveryApi.getBaseUrl('badges');
    return `${baseUrl}/entity/${entityHash}/badge-specs`;
  }

  // This function is used to generate the URLs to use in the frontend when obfuscation is disabled. It's using the entity name to get the badge specs
  private async getEntityBadgeSpecsUrl(entity: Entity): Promise<string> {
    const routeParams = this.getEntityRouteParams(entity);
    const path = generatePath(`:namespace/:kind/:name`, routeParams);
    const baseUrl = await this.discoveryApi.getBaseUrl('badges');
    return `${baseUrl}/entity/${path}/badge-specs`;
  }

  // This function is used to generate the route parameters using the entity kind, namespace and name
  private getEntityRouteParams(entity: Entity) {
    return {
      kind: entity.kind.toLocaleLowerCase('en-US'),
      namespace:
        entity.metadata.namespace?.toLocaleLowerCase('en-US') ??
        DEFAULT_NAMESPACE,
      name: entity.metadata.name,
    };
  }
}
