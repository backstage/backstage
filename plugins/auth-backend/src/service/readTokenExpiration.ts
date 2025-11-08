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

import { RootConfigService } from '@backstage/backend-plugin-api';
import { readDurationFromConfig } from '@backstage/config';
import { durationToMilliseconds } from '@backstage/types';

const TOKEN_EXP_DEFAULT_S = 3600;
const TOKEN_EXP_MIN_S = 600;
const TOKEN_EXP_MAX_S = 86400;

export function readBackstageTokenExpiration(config: RootConfigService) {
  return readTokenExpiration(config, {
    configKey: 'auth.backstageTokenExpiration',
  });
}

export function readDcrTokenExpiration(config: RootConfigService) {
  return readTokenExpiration(config, {
    configKey: 'auth.experimentalDynamicClientRegistration.tokenExpiration',
  });
}

export function readTokenExpiration(
  config: RootConfigService,
  options: {
    configKey: string;
    maxExpiration?: number;
    minExpiration?: number;
    defaultExpiration?: number;
  },
): number {
  const {
    configKey,
    maxExpiration = TOKEN_EXP_MAX_S,
    minExpiration = TOKEN_EXP_MIN_S,
    defaultExpiration = TOKEN_EXP_DEFAULT_S,
  } = options ?? {};
  if (!config.has(configKey)) {
    return defaultExpiration;
  }

  const duration = readDurationFromConfig(config, {
    key: configKey,
  });

  const durationS = Math.round(durationToMilliseconds(duration) / 1000);

  if (durationS < minExpiration) {
    return minExpiration;
  } else if (durationS > maxExpiration) {
    return maxExpiration;
  }
  return durationS;
}
