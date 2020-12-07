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

import { Config } from '@backstage/config';

export type MicrosoftGraphProviderConfig = {
  target: string;
  authority: string;
  tenantId: string;
  clientId: string;
  clientSecret: string;
  userFilter?: string;
  groupFilter?: string;
};

export function readMicrosoftGraphConfig(
  config: Config,
): MicrosoftGraphProviderConfig[] {
  const providers: MicrosoftGraphProviderConfig[] = [];
  const providerConfigs = config.getOptionalConfigArray('providers') ?? [];

  for (const providerConfig of providerConfigs) {
    const target = providerConfig.getString('target').replace(/\/+$/, '');
    const authority =
      providerConfig.getOptionalString('authority')?.replace(/\/+$/, '') ||
      'https://login.microsoftonline.com';
    const tenantId = providerConfig.getString('tenantId');
    const clientId = providerConfig.getString('clientId');
    const clientSecret = providerConfig.getString('clientSecret');
    const userFilter = providerConfig.getOptionalString('userFilter');
    const groupFilter = providerConfig.getOptionalString('groupFilter');

    providers.push({
      target,
      authority,
      tenantId,
      clientId,
      clientSecret,
      userFilter,
      groupFilter,
    });
  }

  return providers;
}
