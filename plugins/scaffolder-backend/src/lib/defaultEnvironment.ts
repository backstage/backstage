/*
 * Copyright 2025 The Backstage Authors
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
import { JsonObject } from '@backstage/types';

export interface DefaultEnvironmentConfig {
  parameters?: Record<string, any>;
  secrets?: Record<string, string>;
}

export interface ResolvedDefaultEnvironment {
  parameters: JsonObject;
  secrets: Record<string, string>;
}

export function resolveDefaultEnvironment(
  config: Config,
): ResolvedDefaultEnvironment {
  const defaultEnvConfig = config.getOptionalConfig(
    'scaffolder.defaultEnvironment',
  );
  if (!defaultEnvConfig) {
    return {
      parameters: {},
      secrets: {},
    };
  }

  const parameters: JsonObject = {};
  const secrets: Record<string, string> = {};

  const parametersConfig = defaultEnvConfig.getOptionalConfig('parameters');
  if (parametersConfig) {
    for (const paramKey of parametersConfig.keys()) {
      const paramValue = parametersConfig.getString(paramKey);
      parameters[paramKey] = paramValue;
    }
  }

  const secretsConfig = defaultEnvConfig.getOptionalConfig('secrets');
  if (secretsConfig) {
    for (const secretKey of secretsConfig.keys()) {
      const secretValue = secretsConfig.getString(secretKey);
      secrets[secretKey] = secretValue;
    }
  }

  return {
    parameters,
    secrets,
  };
}
