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
  AzureFunctionsAllowedSubscriptionsConfig,
  FunctionsListResponse,
} from '@backstage/plugin-azure-functions-common';

/** @public */
export class AzureFunctionsConfig {
  constructor(
    public readonly domain: string,
    public readonly allowedSubscriptions: AzureFunctionsAllowedSubscriptionsConfig[],
    public readonly tenantId: string,
    public readonly clientId?: string,
    public readonly clientSecret?: string,
  ) {}

  static fromConfig(config: Config): AzureFunctionsConfig {
    const azfConfig = config.getConfig('azureFunctions');

    return new AzureFunctionsConfig(
      azfConfig.getString('domain'),
      azfConfig
        .getConfigArray('allowedSubscriptions')
        .map<AzureFunctionsAllowedSubscriptionsConfig>(as => ({
          id: as.getString('id'),
          name: as.getString('name'),
        })),
      azfConfig.getString('tenantId'),
      azfConfig.getOptionalString('clientId'),
      azfConfig.getOptionalString('clientSecret'),
    );
  }
}

/** @public */
export class AzureWebManagementApi {
  private readonly baseHref = (domain: string) =>
    `https://portal.azure.com/#@${domain}/resource`;
  private readonly resourceGraphClient: ResourceGraphClient;

  constructor(private readonly config: AzureFunctionsConfig) {
    const creds =
      config.clientId && config.clientSecret
        ? new ClientSecretCredential(
            config.tenantId,
            config.clientId,
            config.clientSecret,
          )
        : new DefaultAzureCredential({ tenantId: config.tenantId });

    this.resourceGraphClient = new ResourceGraphClient(creds);
  }

  static fromConfig(config: Config): AzureWebManagementApi {
    return new AzureWebManagementApi(AzureFunctionsConfig.fromConfig(config));
  }

  async list({
    functionName,
  }: {
    functionName: string;
  }): Promise<FunctionsListResponse> {
    const items = [];
    try {
      const result = await this.resourceGraphClient.resources({
        query: `resources | where type == 'microsoft.web/sites' | where name contains '${functionName}'`,
        subscriptions: this.config.allowedSubscriptions.map(s => s.id),
      });
      for (const v of result.data) {
        items.push({
          href: `${this.baseHref(this.config.domain)}${v.id!}`,
          logstreamHref: `${this.baseHref(
            this.config.domain,
          )}${v.id!}/logStream`,
          functionName: v.name!,
          location: v.location!,
          lastModifiedDate: v.properties.lastModifiedTimeUtc!,
          usageState: v.properties.usageState!,
          state: v.properties.state!,
          containerSize: v.properties.containerSize!,
        });
      }
    } catch (ex) {
      console.log(ex);
    }
    return { items: items };
  }
}
