/*
 * Copyright 2020 Spotify AB
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
  CatalogEntitiesRequest,
  CatalogListResponse,
  CatalogClient,
} from '@backstage/catalog-client';
import { IdentityApi } from '@backstage/core';

export class CatalogClientWrapper implements CatalogApi {
  private readonly identityApi: IdentityApi;
  private readonly client: CatalogClient;

  constructor(options: { client: CatalogClient; identityApi: IdentityApi }) {
    this.client = options.client;
    this.identityApi = options.identityApi;
  }

  async getLocationById(id: String): Promise<Location | undefined> {
    const token = await this.identityApi.getIdToken();
    return await this.client.getLocationById(token, id);
  }

  async getEntities(
    request?: CatalogEntitiesRequest,
  ): Promise<CatalogListResponse<Entity>> {
    const token = await this.identityApi.getIdToken();
    return await this.client.getEntities(token, request);
  }

  async getEntityByName(compoundName: EntityName): Promise<Entity | undefined> {
    const token = await this.identityApi.getIdToken();
    return await this.client.getEntityByName(token, compoundName);
  }

  async addLocation(request: AddLocationRequest): Promise<AddLocationResponse> {
    const token = await this.identityApi.getIdToken();
    return await this.client.addLocation(token, request);
  }

  async getLocationByEntity(entity: Entity): Promise<Location | undefined> {
    const token = await this.identityApi.getIdToken();
    return await this.client.getLocationByEntity(token, entity);
  }

  async removeEntityByUid(uid: string): Promise<void> {
    const token = await this.identityApi.getIdToken();
    return await this.client.removeEntityByUid(token, uid);
  }
}
