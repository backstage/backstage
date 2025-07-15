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

import { RootConfigService } from '@backstage/backend-plugin-api';
import { readDurationFromConfig } from '@backstage/config';
import { durationToMilliseconds } from '@backstage/types';

const DEFAULT_REFRESH_TOKEN_EXPIRATION_S = 30 * 24 * 60 * 60; // 30 days
const MAX_REFRESH_TOKEN_EXPIRATION_S = 90 * 24 * 60 * 60; // 90 days
const DEFAULT_CLEANUP_INTERVAL_S = 60 * 60; // 1 hour

export type RefreshTokenConfig = {
  enabled: boolean;
  defaultExpirationSeconds: number;
  maxExpirationSeconds: number;
  cleanupIntervalSeconds: number;
};

export function readRefreshTokenConfig(config: RootConfigService): RefreshTokenConfig {
  const refreshTokenConfig = config.getOptionalConfig('auth.refreshTokens');

  const enabled = refreshTokenConfig?.getOptionalBoolean('enabled') ?? false;

  let defaultExpirationSeconds = DEFAULT_REFRESH_TOKEN_EXPIRATION_S;
  if (refreshTokenConfig?.has('defaultExpiration')) {
    const duration = readDurationFromConfig(refreshTokenConfig, {
      key: 'defaultExpiration',
    });
    defaultExpirationSeconds = Math.round(durationToMilliseconds(duration) / 1000);
  }

  let maxExpirationSeconds = MAX_REFRESH_TOKEN_EXPIRATION_S;
  if (refreshTokenConfig?.has('maxExpiration')) {
    const duration = readDurationFromConfig(refreshTokenConfig, {
      key: 'maxExpiration',
    });
    maxExpirationSeconds = Math.round(durationToMilliseconds(duration) / 1000);
  }

  let cleanupIntervalSeconds = DEFAULT_CLEANUP_INTERVAL_S;
  if (refreshTokenConfig?.has('cleanupInterval')) {
    const duration = readDurationFromConfig(refreshTokenConfig, {
      key: 'cleanupInterval',
    });
    cleanupIntervalSeconds = Math.round(durationToMilliseconds(duration) / 1000);
  }

  // Ensure max expiration is at least as long as default expiration
  if (maxExpirationSeconds < defaultExpirationSeconds) {
    maxExpirationSeconds = defaultExpirationSeconds;
  }

  return {
    enabled,
    defaultExpirationSeconds,
    maxExpirationSeconds,
    cleanupIntervalSeconds,
  };
}