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

import { EntityName } from '@backstage/catalog-model';
import { Config } from '@backstage/config';
import {
  scmIntegrationsApiRef,
  ScmIntegrationsApi,
} from '@backstage/integration-react';
import {
  AnyApiFactory,
  configApiRef,
  createApiFactory,
  DiscoveryApi,
  discoveryApiRef,
  IdentityApi,
  identityApiRef,
} from '@backstage/core-plugin-api';
import {
  SyncResult,
  TechDocsApi,
  techdocsApiRef,
  TechDocsStorageApi,
  techdocsStorageApiRef,
} from '@backstage/plugin-techdocs';

// TODO: Export type from plugin-techdocs and import this here
// import { ParsedEntityId } from '@backstage/plugin-techdocs'

/**
 * Note: Override TechDocs API to use local mkdocs server instead of techdocs-backend.
 */

class TechDocsDevStorageApi implements TechDocsStorageApi {
  public configApi: Config;
  public discoveryApi: DiscoveryApi;
  public identityApi: IdentityApi;

  constructor({
    configApi,
    discoveryApi,
    identityApi,
  }: {
    configApi: Config;
    discoveryApi: DiscoveryApi;
    identityApi: IdentityApi;
  }) {
    this.configApi = configApi;
    this.discoveryApi = discoveryApi;
    this.identityApi = identityApi;
  }

  async getApiOrigin() {
    return (
      this.configApi.getOptionalString('techdocs.requestUrl') ??
      (await this.discoveryApi.getBaseUrl('techdocs'))
    );
  }

  async getStorageUrl() {
    return (
      this.configApi.getOptionalString('techdocs.storageUrl') ??
      `${await this.discoveryApi.getBaseUrl('techdocs')}/static/docs`
    );
  }

  async getBuilder() {
    return this.configApi.getString('techdocs.builder');
  }

  async getEntityDocs(_entityId: EntityName, path: string) {
    const apiOrigin = await this.getApiOrigin();
    // Irrespective of the entity, use mkdocs server to find the file for the path.
    const url = `${apiOrigin}/${path}`;

    const request = await fetch(
      `${url.endsWith('/') ? url : `${url}/`}index.html`,
    );

    if (request.status === 404) {
      throw new Error('Page not found');
    }

    return request.text();
  }

  async syncEntityDocs(_: EntityName): Promise<SyncResult> {
    // this is just stub of this function as we don't need to check if docs are up to date,
    // we always want to retrigger a new build
    return 'cached';
  }

  // Used by transformer to modify the request to assets (CSS, Image) from inside the HTML.
  async getBaseUrl(
    oldBaseUrl: string,
    _entityId: EntityName,
    path: string,
  ): Promise<string> {
    const apiOrigin = await this.getApiOrigin();
    return new URL(oldBaseUrl, `${apiOrigin}/${path}`).toString();
  }
}

class TechDocsDevApi implements TechDocsApi {
  public configApi: Config;
  public discoveryApi: DiscoveryApi;
  public identityApi: IdentityApi;

  constructor({
    configApi,
    discoveryApi,
    identityApi,
  }: {
    configApi: Config;
    discoveryApi: DiscoveryApi;
    identityApi: IdentityApi;
  }) {
    this.configApi = configApi;
    this.discoveryApi = discoveryApi;
    this.identityApi = identityApi;
  }

  async getApiOrigin() {
    return (
      this.configApi.getOptionalString('techdocs.requestUrl') ??
      (await this.discoveryApi.getBaseUrl('techdocs'))
    );
  }

  async getEntityMetadata(_entityId: any) {
    return {
      apiVersion: 'backstage.io/v1alpha1',
      kind: 'Component',
      metadata: {
        name: 'local',
      },
      spec: {
        owner: 'test',
        lifecycle: 'experimental',
      },
    };
  }

  async getTechDocsMetadata(_entityId: EntityName) {
    return {
      site_name: 'Live preview environment',
      site_description: '',
    };
  }
}

export const apis: AnyApiFactory[] = [
  createApiFactory({
    api: techdocsStorageApiRef,
    deps: {
      configApi: configApiRef,
      discoveryApi: discoveryApiRef,
      identityApi: identityApiRef,
    },
    factory: ({ configApi, discoveryApi, identityApi }) =>
      new TechDocsDevStorageApi({
        configApi,
        discoveryApi,
        identityApi,
      }),
  }),
  createApiFactory({
    api: techdocsApiRef,
    deps: {
      configApi: configApiRef,
      discoveryApi: discoveryApiRef,
      identityApi: identityApiRef,
    },
    factory: ({ configApi, discoveryApi, identityApi }) =>
      new TechDocsDevApi({
        configApi,
        discoveryApi,
        identityApi,
      }),
  }),
  createApiFactory({
    api: scmIntegrationsApiRef,
    deps: { configApi: configApiRef },
    factory: ({ configApi }) => ScmIntegrationsApi.fromConfig(configApi),
  }),
];
