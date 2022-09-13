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
import { ClientSecretCredential } from '@azure/identity';
import { WebSiteManagementClient } from '@azure/arm-appservice';
import {
  AzureFunctionsAllowedSubscriptionsConfig,
  FunctionsData,
} from '@backstage/plugin-azure-functions-common';

/** @public */
export class AzureFunctionsConfig {
  constructor(
    public readonly tenantId: string,
    public readonly clientId: string,
    public readonly clientSecret: string,
    public readonly domain: string,
    public readonly allowedSubscriptions: AzureFunctionsAllowedSubscriptionsConfig[],
  ) {}

  static fromConfig(config: Config): AzureFunctionsConfig {
    const azfConfig = config.getConfig('azureFunctions');

    return new AzureFunctionsConfig(
      azfConfig.getString('tenantId'),
      azfConfig.getString('clientId'),
      azfConfig.getString('clientSecret'),
      azfConfig.getString('domain'),
      azfConfig
        .getConfigArray('allowedSubscriptions')
        .map<AzureFunctionsAllowedSubscriptionsConfig>(as => ({
          id: as.getString('id'),
          name: as.getString('name'),
        })),
    );
  }
}

/** @public */
export class AzureWebManagementApi {
  private readonly baseHref = (domain: string) =>
    `https://portal.azure.com/#@${domain}/resource`;
  private readonly clients: WebSiteManagementClient[] = [];

  constructor(private readonly config: AzureFunctionsConfig) {
    const creds = new ClientSecretCredential(
      config.tenantId,
      config.clientId,
      config.clientSecret,
    );
    for (const subscription of config.allowedSubscriptions) {
      if (!this.clients.some(c => c.subscriptionId === subscription.id)) {
        this.clients.push(new WebSiteManagementClient(creds, subscription.id));
      }
    }
  }

  static fromConfig(config: Config): AzureWebManagementApi {
    return new AzureWebManagementApi(AzureFunctionsConfig.fromConfig(config));
  }

  async list({
    functionName,
  }: {
    functionName: string;
  }): Promise<FunctionsData[]> {
    const results = [];
    for (const client of this.clients) {
      try {
        for await (const webApp of client.webApps.list()) {
          if (!webApp.name!.startsWith(functionName)) {
            continue;
          }
          const v = webApp!;
          results.push({
            href: `${this.baseHref(this.config.domain)}${v.id!}`,
            logstreamHref: `${this.baseHref(
              this.config.domain,
            )}${v.id!}/logStream`,
            functionName: v.name!,
            location: v.location!,
            lastModifiedDate: v.lastModifiedTimeUtc!,
            usageState: v.usageState!,
            state: v.state!,
            containerSize: v.containerSize!,
          });
        }
      } catch (ex) {
        console.log(ex);
      }
    }
    return results;
  }
}
