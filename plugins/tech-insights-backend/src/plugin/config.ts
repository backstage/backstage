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

import { Config, readDurationFromConfig } from '@backstage/config';
import {
  FactLifecycle,
  FactRetriever,
  FactRetrieverRegistration,
} from '@backstage/plugin-tech-insights-node';
import {
  createFactRetrieverRegistration,
  FactRetrieverRegistrationOptions,
} from '../service';

type FactRetrieverConfig = Omit<
  FactRetrieverRegistrationOptions,
  'factRetriever'
>;

function readLifecycleConfig(
  config: Config | undefined,
): FactLifecycle | undefined {
  if (!config) {
    return undefined;
  }

  if (config.has('maxItems')) {
    return {
      maxItems: config.getNumber('maxItems'),
    };
  }

  return {
    timeToLive: readDurationFromConfig(config.getConfig('timeToLive')),
  };
}

function readFactRetrieverConfig(
  config: Config,
  name: string,
): FactRetrieverConfig | undefined {
  const factRetrieverConfig = config.getOptionalConfig(
    `techInsights.factRetrievers.${name}`,
  );
  if (!factRetrieverConfig) {
    return undefined;
  }

  const cadence = factRetrieverConfig.getString('cadence');
  const initialDelay = factRetrieverConfig.has('initialDelay')
    ? readDurationFromConfig(factRetrieverConfig.getConfig('initialDelay'))
    : undefined;
  const lifecycle = readLifecycleConfig(
    factRetrieverConfig.getOptionalConfig('lifecycle'),
  );
  const timeout = factRetrieverConfig.has('timeout')
    ? readDurationFromConfig(factRetrieverConfig.getConfig('timeout'))
    : undefined;

  return {
    cadence,
    initialDelay,
    lifecycle,
    timeout,
  };
}

export function createFactRetrieverRegistrationFromConfig(
  config: Config,
  name: string,
  factRetriever: FactRetriever,
): FactRetrieverRegistration | undefined {
  const factRetrieverConfig = readFactRetrieverConfig(config, name);

  return factRetrieverConfig
    ? createFactRetrieverRegistration({
        ...factRetrieverConfig,
        factRetriever,
      })
    : undefined;
}
