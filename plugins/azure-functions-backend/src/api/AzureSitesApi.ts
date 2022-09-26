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
import {
  AzureSite,
  AzureSiteListRequest,
  AzureSiteListResponse,
} from '@backstage/plugin-azure-functions-common';
import { AzureFunctionsConfig } from '../config';

/** @public */
export class AzureSitesApi {
  private readonly baseHref = (domain: string) =>
    `https://portal.azure.com/#@${domain}/resource`;
  private readonly client: ResourceGraphClient;

  constructor(private readonly config: AzureFunctionsConfig) {
    const creds =
      config.clientId && config.clientSecret
        ? new ClientSecretCredential(
            config.tenantId,
            config.clientId,
            config.clientSecret,
          )
        : new DefaultAzureCredential({ tenantId: config.tenantId });

    this.client = new ResourceGraphClient(creds);
  }

  static fromConfig(config: Config): AzureSitesApi {
    return new AzureSitesApi(AzureFunctionsConfig.fromConfig(config));
  }

  async list(request: AzureSiteListRequest): Promise<AzureSiteListResponse> {
    const items: AzureSite[] = [];
    try {
      const result = await this.client.resources({
        query: `resources | where type == 'microsoft.web/sites' | where name contains '${request.name}'`,
        subscriptions: this.config.subscriptions,
      });
      for (const v of result.data) {
        items.push({
          href: `${this.baseHref(this.config.domain)}${v.id!}`,
          logstreamHref: `${this.baseHref(
            this.config.domain,
          )}${v.id!}/logStream`,
          name: v.name!,
          kind: v.kind!,
          resourceGroup: v.resourceGroup!,
          location: v.location!,
          lastModifiedDate: v.properties.lastModifiedTimeUtc!,
          usageState: v.properties.usageState!,
          state: v.properties.state!,
          containerSize: v.properties.containerSize!,
          tags: v.properties.tags!,
        });
      }
    } catch (ex: any) {
      throw ex;
    }
    return { items: items };
  }
}
