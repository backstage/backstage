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

/**
 * The configuration needed for the airbrake-backend plugin
 *
 * @public
 */
export interface AirbrakeConfig {
  /**
   * The API Key to authenticate requests. More details on how to get this here: https://airbrake.io/docs/api/#authentication
   */
  apiKey: string;
}

/**
 * Extract the Airbrake config from a config object
 *
 * @public
 *
 * @param config - The config object to extract from
 */
export function extractAirbrakeConfig(config: Config): AirbrakeConfig {
  return {
    apiKey: config.getString('airbrake.apiKey'),
  };
}
