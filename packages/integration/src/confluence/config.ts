/*
 * Copyright 2024 The Backstage Authors
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
import { isValidHost } from '../helpers';

/**
 *
 * The Confluence integration configuration.
 *
 * @public
 */
export type ConfluenceIntegrationConfig = {
  host: string;

  email: string;

  apiToken: string;
};

/**
 *
 *
 * Given a configuration this function parses it
 * and returns the host api and API token.
 *
 * @param config - The Backstage configuration object.
 * @public
 */
export function readConfluenceIntegrationConfig(
  config: Config,
): ConfluenceIntegrationConfig {
  const host = config.getString('host');
  const email = config.getString('email');
  const apiToken = config.getString('apiToken');

  const token = btoa(`${email}:${apiToken}`);
  const basicToken = `Basic ${token}`;

  const atlassianHostRegex = /^[a-zA-Z0-9-]+(?<!-)\.atlassian\.net$/; // match <your-company>.atlassian.net
  const onpermHostRegex = /^confluence\.[a-zA-Z0-9-]+(?<!-)\.com$/; // match confluence.<your-company>.com
  if (
    !isValidHost(host) ||
    !(host.match(atlassianHostRegex) || host.match(onpermHostRegex))
  ) {
    throw new Error(
      `Invalid Confluence integration config, '${host}' is not a valid host`,
    );
  }

  return {
    host,
    email,
    apiToken: basicToken,
  };
}

/**
 *
 * Parses the Confluence integration configurations from the provided Backstage configuration.
 * and returns the list of host apis and their corresponding API tokens.
 *
 * @param config - The Backstage configuration object.
 * @public
 */
export function readConfluenceIntegrationConfigs(
  config: Config,
): ConfluenceIntegrationConfig[] {
  const confluenceConfig =
    config.getOptionalConfigArray('integrations.confluence') ?? [];
  // Read all the explicit integrations
  // No default integration will be added
  return confluenceConfig.map(readConfluenceIntegrationConfig);
}
