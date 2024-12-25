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

  /**
   *
   * Token generated from atlassian cannot be used here directly.
   * You need to put it in this format: <your-mail>:<your-api-token>
   * and base64 encode it.
   * Please provide the encoded token here.
   *
   */
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
  const apiToken = `Basic ${config.getString('apiToken')}`;

  const atlassianHostRegex = /^[a-zA-Z0-9-]+(?<!-)\.atlassian\.net$/; // should match <your-company>.atlassian.net
  if (!isValidHost(host) || !host.match(atlassianHostRegex)) {
    throw new Error(
      `Invalid Confluence integration config, '${host}' is not a valid host`,
    );
  }

  return {
    host,
    apiToken,
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
