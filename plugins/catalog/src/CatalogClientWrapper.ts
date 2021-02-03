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
  ApiContext,
  CatalogApi,
  CatalogEntitiesRequest,
  CatalogListResponse,
  CatalogClient,
} from '@backstage/catalog-client';
import { IdentityApi } from '@backstage/core';

/**
 * CatalogClient wrapper that injects identity token for all requests
 */
export class CatalogClientWrapper implements CatalogApi {
  private readonly identityApi: IdentityApi;
  private readonly client: CatalogClient;

  constructor(options: { client: CatalogClient; identityApi: IdentityApi }) {
    this.client = options.client;
    this.identityApi = options.identityApi;
  }

  private async injectToken(context?: ApiContext) {
    const result: ApiContext = context ?? {};
    // Inject identity token if not provided
    if (!result.token) {
      result.token = await this.identityApi.getIdToken();
    }
    return result;
  }

  async getLocationById(
    id: String,
    context?: ApiContext,
  ): Promise<Location | undefined> {
    return await this.client.getLocationById(
      id,
      await this.injectToken(context),
    );
  }

  async getEntities(
    request?: CatalogEntitiesRequest,
    context?: ApiContext,
  ): Promise<CatalogListResponse<Entity>> {
    return await this.client.getEntities(
      request,
      await this.injectToken(context),
    );
  }

  async getEntityByName(
    compoundName: EntityName,
    context?: ApiContext,
  ): Promise<Entity | undefined> {
    return await this.client.getEntityByName(
      compoundName,
      await this.injectToken(context),
    );
  }

  async addLocation(
    request: AddLocationRequest,
    context?: ApiContext,
  ): Promise<AddLocationResponse> {
    return await this.client.addLocation(
      request,
      await this.injectToken(context),
    );
  }

  async getLocationByEntity(
    entity: Entity,
    context?: ApiContext,
  ): Promise<Location | undefined> {
    return await this.client.getLocationByEntity(
      entity,
      await this.injectToken(context),
    );
  }

  async removeEntityByUid(uid: string, context?: ApiContext): Promise<void> {
    return await this.client.removeEntityByUid(
      uid,
      await this.injectToken(context),
    );
  }
}
