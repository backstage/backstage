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

import { Config } from '@backstage/config';

/**
 * Provides the client type which should be used for a given plugin.
 *
 * The client type is determined by plugin specific config if present.
 * Otherwise the base client is used as the fallback.
 *
 * @param config - The database config root
 * @param pluginId - Plugin to get the client type for
 * @returns Object with client type returned as `client` and boolean
 *          representing whether or not the client was overridden as
 *          `overridden`
 */
export function getClientType(
  config: Config,
  pluginId: string,
): {
  client: string;
  overridden: boolean;
} {
  const pluginClient = config.getOptionalString(`plugin.${pluginId}.client`);
  const baseClient = config.getString('client');
  const client = pluginClient ?? baseClient;
  return {
    client,
    overridden: client !== baseClient,
  };
}
