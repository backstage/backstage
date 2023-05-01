/*
 * Copyright 2023 The Backstage Authors
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
  ConfigApi,
  createApiRef,
  DiscoveryApi,
} from '@backstage/core-plugin-api';

import { Organization, Project } from './types';

export interface ProxyAzureDevOpsPluginApi {
  allowedOrganizations(): Promise<Organization[]>;
  allowedProjects(organization: string): Promise<Project[]>;
}

export class ProxyAzureDevOpsPluginApiClient
  implements ProxyAzureDevOpsPluginApi
{
  private readonly discoveryApi: DiscoveryApi;
  private readonly configApi: ConfigApi;

  constructor(options: { discoveryApi: DiscoveryApi; configApi: ConfigApi }) {
    this.discoveryApi = options.discoveryApi;
    this.configApi = options.configApi;
  }

  private async baseUrl() {
    const proxy = await this.discoveryApi.getBaseUrl('proxy');
    return `${proxy}/azure-devops-apiref`;
  }
  async allowedOrganizations(): Promise<Organization[]> {
    const url = await this.baseUrl();
    const org = (await this.configApi.get<any>('app'))?.azureDevOpsApiRef
      ?.defaultOrganization;
    if (!org) return [];

    const resultRes = await fetch(
      `${url}/${org}/_apis/Contribution/HierarchyQuery`,
      {
        method: 'POST',
        body: JSON.stringify({
          contributionIds: ['ms.vss-features.my-organizations-data-provider'],
        }),
        headers: {
          Accept:
            'application/json;api-version=5.0-preview.1;excludeUrls=true;enumsAsNumbers=true;msDateFormat=true;noArrayWrap=true',
          'content-type': 'application/json',
        },
      },
    );

    const json = await resultRes.json();
    return json?.dataProviders['ms.vss-features.my-organizations-data-provider']
      .organizations;
  }
  async allowedProjects(organization?: string): Promise<Project[]> {
    const url = await this.baseUrl();
    const org =
      organization ||
      (await this.configApi.get<any>('app'))?.azureDevOpsApiRef
        ?.defaultOrganization;

    if (!org) return [];

    const resultRes = await fetch(
      `${url}/${org}/_apis/Contribution/HierarchyQuery`,
      {
        method: 'POST',
        body: JSON.stringify({
          contributionIds: [
            'ms.vss-tfs-web.project-plus-product-data-provider',
          ],
        }),
        headers: {
          Accept:
            'application/json;api-version=5.0-preview.1;excludeUrls=true;enumsAsNumbers=true;msDateFormat=true;noArrayWrap=true',
          'content-type': 'application/json',
        },
      },
    );
    const json = await resultRes.json();
    return json?.dataProviders?.[
      'ms.vss-tfs-web.project-plus-product-data-provider'
    ].projects;
  }
}

export const proxyAzurePluginApiRef = createApiRef<ProxyAzureDevOpsPluginApi>({
  id: 'plugin.proxy.azure.api',
});
