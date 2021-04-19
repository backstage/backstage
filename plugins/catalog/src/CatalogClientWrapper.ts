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

import {
  AddLocationRequest,
  AddLocationResponse,
  CatalogApi,
  CatalogAttachmentResponse,
  CatalogClient,
  CatalogEntitiesRequest,
  CatalogListResponse,
} from '@backstage/catalog-client';
import { Entity, EntityName, Location } from '@backstage/catalog-model';
import { IdentityApi } from '@backstage/core';

type CatalogRequestOptions = {
  token?: string;
};

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

  async getLocationById(
    id: string,
    options?: CatalogRequestOptions,
  ): Promise<Location | undefined> {
    return await this.client.getLocationById(id, {
      token: options?.token ?? (await this.identityApi.getIdToken()),
    });
  }

  async getEntities(
    request?: CatalogEntitiesRequest,
    options?: CatalogRequestOptions,
  ): Promise<CatalogListResponse<Entity>> {
    return await this.client.getEntities(request, {
      token: options?.token ?? (await this.identityApi.getIdToken()),
    });
  }

  async getEntityByName(
    compoundName: EntityName,
    options?: CatalogRequestOptions,
  ): Promise<Entity | undefined> {
    return await this.client.getEntityByName(compoundName, {
      token: options?.token ?? (await this.identityApi.getIdToken()),
    });
  }

  async getAttachment(
    name: EntityName,
    key: string,
    options?: CatalogRequestOptions,
  ): Promise<CatalogAttachmentResponse> {
    return await this.client.getAttachment(name, key, {
      token: options?.token ?? (await this.identityApi.getIdToken()),
    });
  }

  async getAttachmentUrl(name: EntityName, key: string): Promise<string> {
    const token = await this.identityApi.getIdToken();

    if (token) {
      // In case a token is used, we have to fallback to a workaround, as a
      // simple URL won't work with tokens provided in headers. This is less
      // efficient, but also only used in that case.
      // Instead of returning an URL where the called can request the attachment
      // from, we return the attachmend directly as a base64 URL. Returning blob
      // URLs might be more efficient, but requires to release them afterwars.
      const attachment = await this.getAttachment(name, key);
      const reader = new FileReader();

      return new Promise<string>((resolve, reject) => {
        reader.onload = e => {
          if (e.target && typeof e.target.result === 'string') {
            resolve(e.target.result);
          }
        };
        reader.onerror = reject;
        reader.readAsDataURL(attachment.data);
      });
    }

    return await this.client.getAttachmentUrl(name, key);
  }

  async addLocation(
    request: AddLocationRequest,
    options?: CatalogRequestOptions,
  ): Promise<AddLocationResponse> {
    return await this.client.addLocation(request, {
      token: options?.token ?? (await this.identityApi.getIdToken()),
    });
  }

  async getOriginLocationByEntity(
    entity: Entity,
    options?: CatalogRequestOptions,
  ): Promise<Location | undefined> {
    return await this.client.getOriginLocationByEntity(entity, {
      token: options?.token ?? (await this.identityApi.getIdToken()),
    });
  }

  async getLocationByEntity(
    entity: Entity,
    options?: CatalogRequestOptions,
  ): Promise<Location | undefined> {
    return await this.client.getLocationByEntity(entity, {
      token: options?.token ?? (await this.identityApi.getIdToken()),
    });
  }

  async removeLocationById(
    id: string,
    options?: CatalogRequestOptions,
  ): Promise<void> {
    return await this.client.removeLocationById(id, {
      token: options?.token ?? (await this.identityApi.getIdToken()),
    });
  }

  async removeEntityByUid(
    uid: string,
    options?: CatalogRequestOptions,
  ): Promise<void> {
    return await this.client.removeEntityByUid(uid, {
      token: options?.token ?? (await this.identityApi.getIdToken()),
    });
  }
}
