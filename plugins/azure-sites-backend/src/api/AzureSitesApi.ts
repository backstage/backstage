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

import { Config } from '@backstage/config';
import {
  DefaultAzureCredential,
  ClientSecretCredential,
} from '@azure/identity';
import { ResourceGraphClient } from '@azure/arm-resourcegraph';
import { WebSiteManagementClient } from '@azure/arm-appservice';
import {
  AzureSite,
  AzureSiteListRequest,
  AzureSiteListResponse,
  AzureSiteStartStopRequest,
} from '@backstage/plugin-azure-sites-common';
import { AzureSitesConfig } from '../config';

/** @public */
export class AzureSitesApi {
  private readonly baseHref = (domain: string) =>
    `https://portal.azure.com/#@${domain}/resource`;
  private readonly client: ResourceGraphClient;

  constructor(private readonly config: AzureSitesConfig) {
    const creds = this.getCredentials(config);

    this.client = new ResourceGraphClient(creds);
  }

  private getCredentials(config: AzureSitesConfig) {
    return config.clientId && config.clientSecret
      ? new ClientSecretCredential(
          config.tenantId,
          config.clientId,
          config.clientSecret,
        )
      : new DefaultAzureCredential({ tenantId: config.tenantId });
  }

  static fromConfig(config: Config): AzureSitesApi {
    return new AzureSitesApi(AzureSitesConfig.fromConfig(config));
  }

  async start(request: AzureSiteStartStopRequest): Promise<void> {
    const client = new WebSiteManagementClient(
      this.getCredentials(this.config),
      request.subscription,
    );
    await client.webApps.start(request.resourceGroup, request.name);
  }

  async stop(request: AzureSiteStartStopRequest): Promise<void> {
    const client = new WebSiteManagementClient(
      this.getCredentials(this.config),
      request.subscription,
    );
    await client.webApps.stop(request.resourceGroup, request.name);
  }

  async list(request: AzureSiteListRequest): Promise<AzureSiteListResponse> {
    const items: AzureSite[] = [];
    const result = await this.client.resources({
      query: `resources | where type == 'microsoft.web/sites' | where name contains '${request.name}'`,
      subscriptions: this.config.subscriptions,
    });
    for (const v of result.data) {
      items.push({
        href: `${this.baseHref(this.config.domain)}${v.id!}`,
        logstreamHref: `${this.baseHref(this.config.domain)}${v.id!}/logStream`,
        name: v.name!,
        kind: v.kind!,
        resourceGroup: v.resourceGroup!,
        subscription: v.id!.match(/\w{8}\-\w{4}\-\w{4}\-\w{4}\-\w{12}/)[0],
        location: v.location!,
        lastModifiedDate: v.properties.lastModifiedTimeUtc!,
        usageState: v.properties.usageState!,
        state: v.properties.state!,
        containerSize: v.properties.containerSize!,
        tags: v.properties.tags!,
      });
    }
    return { items: items };
  }

  async validateSite(annotationName: string, siteName: string) {
    const azureSites = await this.list({
      name: annotationName,
    });
    for (const site of azureSites.items) {
      if (site.name === siteName) return true;
    }

    return false;
  }
}
