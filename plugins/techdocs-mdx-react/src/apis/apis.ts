/*
 * Copyright 2022 The Backstage Authors
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

import { EventSourcePolyfill } from 'event-source-polyfill';

import {
  DiscoveryApi,
  FetchApi,
  IdentityApi,
} from '@backstage/core-plugin-api';
import { Config } from '@backstage/config';
import { CompoundEntityRef } from '@backstage/catalog-model';
import { NotFoundError } from '@backstage/errors';

import {
  SyncResult,
  TechDocsStorageApi,
} from '@backstage/plugin-techdocs-react';

const absolute = (baseUrl: string, path: string) => {
  const newBaseUrl = baseUrl.split('/');
  const pathParts = path.split('/');
  // remove current file name (or empty string)
  newBaseUrl.pop();
  // (omit if "base" is the current folder without trailing slash)
  for (const part of pathParts) {
    if (part === '.') continue;
    if (part === '..') newBaseUrl.pop();
    else newBaseUrl.push(part);
  }
  return newBaseUrl.join('/');
};

/**
 * API which talks to TechDocs storage to fetch files to render.
 *
 * @public
 */
export class TechDocsStorageApiImpl implements TechDocsStorageApi {
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
    return (
      this.configApi.getOptionalString('techdocs.requestUrl') ??
      (await this.discoveryApi.getBaseUrl('techdocs'))
    );
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
    const url = `${storageUrl}/${namespace}/${kind}/${name}/${
      !path ? 'index.md' : `${path}.md`
    }`;

    const request = await this.fetchApi.fetch(url);

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
   * @throws Throws error on error from sync endpoint in Techdocs Backend
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

    if (oldBaseUrl.startsWith('./') || oldBaseUrl.startsWith('../')) {
      return absolute(newBaseUrl, oldBaseUrl);
    }

    return new URL(
      oldBaseUrl,
      newBaseUrl.endsWith('/') ? newBaseUrl : `${newBaseUrl}/`,
    ).toString();
  }
}
