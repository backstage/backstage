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

import { CompoundEntityRef } from '@backstage/catalog-model';
import { Config } from '@backstage/config';
import {
  DiscoveryApi,
  FetchApi,
  IdentityApi,
} from '@backstage/core-plugin-api';
import { NotFoundError, ResponseError } from '@backstage/errors';
import {
  SyncResult,
  TechDocsApi,
  TechDocsEntityMetadata,
  TechDocsMetadata,
  TechDocsStorageApi,
} from '@backstage/plugin-techdocs-react';
import { EventSourcePolyfill } from 'event-source-polyfill';

/**
 * API to talk to `techdocs-backend`.
 *
 * @public
 */
export class TechDocsClient implements TechDocsApi {
  public configApi: Config;
  public discoveryApi: DiscoveryApi;
  private fetchApi: FetchApi;
  private cookieRefreshTimeoutId: NodeJS.Timeout | undefined;

  constructor(options: {
    configApi: Config;
    discoveryApi: DiscoveryApi;
    fetchApi: FetchApi;
  }) {
    this.configApi = options.configApi;
    this.discoveryApi = options.discoveryApi;
    this.fetchApi = options.fetchApi;
  }

  private async getCookie(): Promise<{ expiresAt: string }> {
    const apiOrigin = await this.getApiOrigin();
    const requestUrl = `${apiOrigin}/cookie`;
    const response = await this.fetchApi.fetch(`${requestUrl}`, {
      credentials: 'include',
    });
    if (!response.ok) {
      throw await ResponseError.fromResponse(response);
    }
    return await response.json();
  }

  public async issueUserCookie(): Promise<{ expiresAt: string }> {
    const expiresAtStorageKey = 'backstage-auth-cookie-last-refresh-expires-at';
    const formatedExpiresAt = localStorage.getItem(expiresAtStorageKey);
    const expiresAt = formatedExpiresAt ? new Date(formatedExpiresAt) : null;

    // get a new cookie if it doesn't exist or has expired
    if (
      // first time issuing a cookie or user deleted the stored expiration date
      !expiresAt ||
      // the application was reloaded and the cookie was not refreshed
      expiresAt.getTime() < Date.now()
    ) {
      return this.getCookie().then(response => {
        const newExpiresAt = new Date(response.expiresAt);
        // refresh the cookie 5 minutes before it expires
        newExpiresAt.setMinutes(newExpiresAt.getMinutes() - 5);
        // store the expiration date to keep it even if the application is reloaded
        localStorage.setItem(expiresAtStorageKey, newExpiresAt.toISOString());
        // maintain the timeout id per tab instance so we know that there is a timeout running
        this.cookieRefreshTimeoutId = setTimeout(
          this.issueUserCookie,
          newExpiresAt.getTime(),
        );
        return { expiresAt: newExpiresAt.toISOString() };
      });
    }

    // restart timeout when the cookie is still valid but the application was reloaded
    if (!this.cookieRefreshTimeoutId) {
      this.cookieRefreshTimeoutId = setTimeout(
        this.issueUserCookie,
        expiresAt.getTime(),
      );
    }

    return { expiresAt: expiresAt.toISOString() };
  }

  async getApiOrigin(): Promise<string> {
    return await this.discoveryApi.getBaseUrl('techdocs');
  }

  /**
   * Retrieve TechDocs metadata.
   *
   * When docs are built, we generate a techdocs_metadata.json and store it along with the generated
   * static files. It includes necessary data about the docs site. This method requests techdocs-backend
   * which retrieves the TechDocs metadata.
   *
   * @param entityId - Object containing entity data like name, namespace, etc.
   */
  async getTechDocsMetadata(
    entityId: CompoundEntityRef,
  ): Promise<TechDocsMetadata> {
    const { kind, namespace, name } = entityId;

    const apiOrigin = await this.getApiOrigin();
    const requestUrl = `${apiOrigin}/metadata/techdocs/${namespace}/${kind}/${name}`;
    const request = await this.fetchApi.fetch(`${requestUrl}`);
    if (!request.ok) {
      throw await ResponseError.fromResponse(request);
    }

    return await request.json();
  }

  /**
   * Retrieve metadata about an entity.
   *
   * This method requests techdocs-backend which uses the catalog APIs to respond with filtered
   * information required here.
   *
   * @param entityId - Object containing entity data like name, namespace, etc.
   */
  async getEntityMetadata(
    entityId: CompoundEntityRef,
  ): Promise<TechDocsEntityMetadata> {
    const { kind, namespace, name } = entityId;

    const apiOrigin = await this.getApiOrigin();
    const requestUrl = `${apiOrigin}/metadata/entity/${namespace}/${kind}/${name}`;

    const request = await this.fetchApi.fetch(`${requestUrl}`);
    if (!request.ok) {
      throw await ResponseError.fromResponse(request);
    }

    return await request.json();
  }
}

/**
 * API which talks to TechDocs storage to fetch files to render.
 *
 * @public
 */
export class TechDocsStorageClient implements TechDocsStorageApi {
  public configApi: Config;
  public discoveryApi: DiscoveryApi;
  public identityApi: IdentityApi;
  private fetchApi: FetchApi;

  constructor(options: {
    configApi: Config;
    discoveryApi: DiscoveryApi;
    identityApi: IdentityApi;
    fetchApi: FetchApi;
  }) {
    this.configApi = options.configApi;
    this.discoveryApi = options.discoveryApi;
    this.identityApi = options.identityApi;
    this.fetchApi = options.fetchApi;
  }

  async getApiOrigin(): Promise<string> {
    return await this.discoveryApi.getBaseUrl('techdocs');
  }

  async getStorageUrl(): Promise<string> {
    return (
      this.configApi.getOptionalString('techdocs.storageUrl') ??
      `${await this.discoveryApi.getBaseUrl('techdocs')}/static/docs`
    );
  }

  async getBuilder(): Promise<string> {
    return this.configApi.getString('techdocs.builder');
  }

  /**
   * Fetch HTML content as text for an individual docs page in an entity's docs site.
   *
   * @param entityId - Object containing entity data like name, namespace, etc.
   * @param path - The unique path to an individual docs page e.g. overview/what-is-new
   * @returns HTML content of the docs page as string
   * @throws Throws error when the page is not found.
   */
  async getEntityDocs(
    entityId: CompoundEntityRef,
    path: string,
  ): Promise<string> {
    const { kind, namespace, name } = entityId;

    const storageUrl = await this.getStorageUrl();
    const url = `${storageUrl}/${namespace}/${kind}/${name}/${path}`;

    const request = await this.fetchApi.fetch(
      `${url.endsWith('/') ? url : `${url}/`}index.html`,
    );

    let errorMessage = '';
    switch (request.status) {
      case 404:
        errorMessage = 'Page not found. ';
        // path is empty for the home page of an entity's docs site
        if (!path) {
          errorMessage +=
            'This could be because there is no index.md file in the root of the docs directory of this repository.';
        }
        throw new NotFoundError(errorMessage);
      case 500:
        errorMessage =
          'Could not generate documentation or an error in the TechDocs backend. ';
        throw new Error(errorMessage);
      default:
        // Do nothing
        break;
    }

    return request.text();
  }

  /**
   * Check if docs are on the latest version and trigger rebuild if not
   *
   * @param entityId - Object containing entity data like name, namespace, etc.
   * @param logHandler - Callback to receive log messages from the build process
   * @returns Whether documents are currently synchronized to newest version
   * @throws Throws error on error from sync endpoint in TechDocs Backend
   */
  async syncEntityDocs(
    entityId: CompoundEntityRef,
    logHandler: (line: string) => void = () => {},
  ): Promise<SyncResult> {
    const { kind, namespace, name } = entityId;

    const apiOrigin = await this.getApiOrigin();
    const url = `${apiOrigin}/sync/${namespace}/${kind}/${name}`;
    const { token } = await this.identityApi.getCredentials();

    return new Promise((resolve, reject) => {
      // Polyfill is used to add support for custom headers and auth
      const source = new EventSourcePolyfill(url, {
        withCredentials: true,
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });

      source.addEventListener('log', (e: any) => {
        if (e.data) {
          logHandler(JSON.parse(e.data));
        }
      });

      source.addEventListener('finish', (e: any) => {
        let updated: boolean = false;

        if (e.data) {
          ({ updated } = JSON.parse(e.data));
        }

        resolve(updated ? 'updated' : 'cached');
      });

      source.onerror = (e: any) => {
        source.close();

        switch (e.status) {
          // the endpoint returned a 404 status
          case 404:
            reject(new NotFoundError(e.message));
            return;

          // also handles the event-stream close. the reject is ignored if the Promise was already
          // resolved by a finish event.
          default:
            reject(new Error(e.data));
            return;
        }
      };
    });
  }

  async getBaseUrl(
    oldBaseUrl: string,
    entityId: CompoundEntityRef,
    path: string,
  ): Promise<string> {
    const { kind, namespace, name } = entityId;

    const apiOrigin = await this.getApiOrigin();
    const newBaseUrl = `${apiOrigin}/static/docs/${namespace}/${kind}/${name}/${path}`;

    return new URL(
      oldBaseUrl,
      newBaseUrl.endsWith('/') ? newBaseUrl : `${newBaseUrl}/`,
    ).toString();
  }
}
