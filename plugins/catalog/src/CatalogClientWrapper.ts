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

import { Entity, EntityName, Location } from '@backstage/catalog-model';
import {
  AddLocationRequest,
  AddLocationResponse,
  CatalogApi,
  CatalogClient,
  CatalogEntitiesRequest,
  CatalogListResponse,
  CatalogRequestOptions,
  CatalogEntityAncestorsRequest,
  CatalogEntityAncestorsResponse,
} from '@backstage/catalog-client';
import { IdentityApi } from '@backstage/core-plugin-api';

/**
 * CatalogClient wrapper that injects identity token for all requests
 *
 * @deprecated The default catalog client now uses the `fetchApiRef`
 * implementation, which in turn by default issues tokens just the same as this
 * class used to assist in doing. If you use a custom `fetchApiRef`
 * implementation that does NOT issue tokens, or use a custom `catalogApiRef`
 * implementation which does not use the default `fetchApiRef`, you can wrap
 * your catalog API in this class to get back the old behavior.
 */
export class CatalogClientWrapper implements CatalogApi {
  private readonly identityApi: IdentityApi;
  private readonly client: CatalogClient;

  constructor(options: { client: CatalogClient; identityApi: IdentityApi }) {
    this.client = options.client;
    this.identityApi = options.identityApi;
  }

  async getLocationById(
    id: string,
    options?: CatalogRequestOptions,
  ): Promise<Location | undefined> {
    return await this.client.getLocationById(
      id,
      await this.getCredentials(options),
    );
  }

  async getEntities(
    request?: CatalogEntitiesRequest,
    options?: CatalogRequestOptions,
  ): Promise<CatalogListResponse<Entity>> {
    return await this.client.getEntities(
      request,
      await this.getCredentials(options),
    );
  }

  async getEntityByName(
    compoundName: EntityName,
    options?: CatalogRequestOptions,
  ): Promise<Entity | undefined> {
    return await this.client.getEntityByName(
      compoundName,
      await this.getCredentials(options),
    );
  }

  async addLocation(
    request: AddLocationRequest,
    options?: CatalogRequestOptions,
  ): Promise<AddLocationResponse> {
    return await this.client.addLocation(
      request,
      await this.getCredentials(options),
    );
  }

  async getOriginLocationByEntity(
    entity: Entity,
    options?: CatalogRequestOptions,
  ): Promise<Location | undefined> {
    return await this.client.getOriginLocationByEntity(
      entity,
      await this.getCredentials(options),
    );
  }

  async getLocationByEntity(
    entity: Entity,
    options?: CatalogRequestOptions,
  ): Promise<Location | undefined> {
    return await this.client.getLocationByEntity(
      entity,
      await this.getCredentials(options),
    );
  }

  async removeLocationById(
    id: string,
    options?: CatalogRequestOptions,
  ): Promise<void> {
    return await this.client.removeLocationById(
      id,
      await this.getCredentials(options),
    );
  }

  async removeEntityByUid(
    uid: string,
    options?: CatalogRequestOptions,
  ): Promise<void> {
    return await this.client.removeEntityByUid(
      uid,
      await this.getCredentials(options),
    );
  }

  async refreshEntity(
    entityRef: string,
    options?: CatalogRequestOptions,
  ): Promise<void> {
    return await this.client.refreshEntity(
      entityRef,
      await this.getCredentials(options),
    );
  }

  async getEntityAncestors(
    request: CatalogEntityAncestorsRequest,
    options?: CatalogRequestOptions,
  ): Promise<CatalogEntityAncestorsResponse> {
    return await this.client.getEntityAncestors(
      request,
      await this.getCredentials(options),
    );
  }

  private async getCredentials(
    options?: CatalogRequestOptions,
  ): Promise<{ token?: string }> {
    if (options?.token) {
      return { token: options?.token };
    }
    return this.identityApi.getCredentials();
  }
}
