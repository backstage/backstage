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

/** @public */
export class AzureSitesConfig {
  constructor(
    public readonly domain: string,
    public readonly tenantId: string,
    public readonly subscriptions?: string[],
    public readonly clientId?: string,
    public readonly clientSecret?: string,
  ) {}

  static fromConfig(config: Config): AzureSitesConfig {
    const azConfig = config.getConfig('azureSites');

    return new AzureSitesConfig(
      azConfig.getString('domain'),
      azConfig.getString('tenantId'),
      azConfig
        .getOptionalConfigArray('subscriptions')
        ?.map<string>(as => as.getString('id')),
      azConfig.getOptionalString('clientId'),
      azConfig.getOptionalString('clientSecret'),
    );
  }
}
