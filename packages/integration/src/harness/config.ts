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
 * The configuration for a single Harness integration.
 *
 * @public
 */
export type HarnessIntegrationConfig = {
  /**
   * The host of the target that this matches on, e.g. "app.harness.io"
   */
  host: string;
  /**
   * The password or http token to use for authentication.
   */
  token?: string;
  /**
   * The API key to use for authentication.
   */
  apiKey?: string;
};

/**
 * Parses a location config block for use in HarnessIntegration
 *
 * @public
 */
export function readHarnessConfig(config: Config): HarnessIntegrationConfig {
  const host = config.getString('host');
  const token = config.getOptionalString('token');
  const apiKey = config.getOptionalString('apiKey');

  if (!isValidHost(host)) {
    throw new Error(
      `Invalid Harness Code integration config, '${host}' is not a valid host`,
    );
  }

  return {
    host,
    apiKey,
    token,
  };
}
