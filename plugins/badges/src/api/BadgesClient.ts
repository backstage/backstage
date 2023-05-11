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
import { ConfigApi, DiscoveryApi, FetchApi } from '@backstage/core-plugin-api';

export class BadgesClient implements BadgesApi {
  private readonly discoveryApi: DiscoveryApi;
  private readonly fetchApi: FetchApi;
  private readonly configApi: ConfigApi;

  constructor(options: {
    discoveryApi: DiscoveryApi;
    fetchApi: FetchApi;
    configApi: ConfigApi;
  }) {
    this.discoveryApi = options.discoveryApi;
    this.fetchApi = options.fetchApi;
    this.configApi = options.configApi;
  }

  static fromConfig(options: {
    fetchApi: FetchApi;
    discoveryApi: DiscoveryApi;
    configApi: ConfigApi;
  }) {
    return new BadgesClient(options);
  }

  public async getEntityBadgeSpecs(entity: Entity): Promise<BadgeSpec[]> {
    // Check if obfuscation is enabled in the configuration
    const obfuscate = this.configApi.getOptionalBoolean('app.badges.obfuscate');

    if (obfuscate) {
      const entityUuidUrl = await this.getEntityUuidUrl(entity);
      const entityUuid = await this.getEntityUuid(entityUuidUrl).then(data => {
        return data.uuid;
      });
      const entityUuidBadgeSpecsUrl = await this.getEntityUuidBadgeSpecsUrl(
        entityUuid,
      );

      const response = await this.fetchApi.fetch(entityUuidBadgeSpecsUrl);
      if (!response.ok) {
        throw await ResponseError.fromResponse(response);
      }

      return await response.json();
    }

    // If obfuscation is disabled, get the badge specs directly as the previous implementation
    const entityBadgeSpecsUrl = await this.getEntityBadgeSpecsUrl(entity);
    const response = await this.fetchApi.fetch(entityBadgeSpecsUrl);
    if (!response.ok) {
      throw await ResponseError.fromResponse(response);
    }

    return await response.json();
  }

  private async getEntityUuidUrl(entity: Entity): Promise<string> {
    const routeParams = this.getEntityRouteParams(entity);
    const path = generatePath(`:namespace/:kind/:name`, routeParams);
    const baseUrl = await this.discoveryApi.getBaseUrl('badges');
    const obfuscatedEntityUrl = `${baseUrl}/entity/${path}/obfuscated`;

    return obfuscatedEntityUrl;
  }

  private async getEntityUuid(entityUuidUrl: string): Promise<any> {
    const responseEntityUuid = await this.fetchApi.fetch(entityUuidUrl);

    if (!responseEntityUuid.ok) {
      throw await ResponseError.fromResponse(responseEntityUuid);
    }
    return await responseEntityUuid.json();
  }

  private async getEntityUuidBadgeSpecsUrl(entityUuid: {
    uuid: string;
  }): Promise<string> {
    const baseUrl = await this.discoveryApi.getBaseUrl('badges');
    return `${baseUrl}/entity/${entityUuid}/badge-specs`;
  }

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
