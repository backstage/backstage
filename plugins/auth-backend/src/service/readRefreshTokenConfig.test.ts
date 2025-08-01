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

import { ConfigReader } from '@backstage/config';
import { readRefreshTokenConfig } from './readRefreshTokenConfig';

describe('readRefreshTokenConfig', () => {
  it('should return default values when no config is provided', () => {
    const config = new ConfigReader({});
    const result = readRefreshTokenConfig(config);

    expect(result).toEqual({
      enabled: false,
      defaultExpirationSeconds: 30 * 24 * 60 * 60, // 30 days
      maxExpirationSeconds: 90 * 24 * 60 * 60, // 90 days
      cleanupIntervalSeconds: 60 * 60, // 1 hour
    });
  });

  it('should read enabled flag correctly', () => {
    const config = new ConfigReader({
      auth: {
        refreshTokens: {
          enabled: true,
        },
      },
    });
    const result = readRefreshTokenConfig(config);

    expect(result.enabled).toBe(true);
  });

  it('should read custom durations correctly', () => {
    const config = new ConfigReader({
      auth: {
        refreshTokens: {
          enabled: true,
          defaultExpiration: '7 days',
          maxExpiration: '30 days',
          cleanupInterval: '30 minutes',
        },
      },
    });
    const result = readRefreshTokenConfig(config);

    expect(result.defaultExpirationSeconds).toBe(7 * 24 * 60 * 60); // 7 days
    expect(result.maxExpirationSeconds).toBe(30 * 24 * 60 * 60); // 30 days
    expect(result.cleanupIntervalSeconds).toBe(30 * 60); // 30 minutes
  });

  it('should read durations in different formats', () => {
    const config = new ConfigReader({
      auth: {
        refreshTokens: {
          defaultExpiration: { hours: 12 },
          maxExpiration: { days: 1 },
          cleanupInterval: { minutes: 15 },
        },
      },
    });
    const result = readRefreshTokenConfig(config);

    expect(result.defaultExpirationSeconds).toBe(12 * 60 * 60); // 12 hours
    expect(result.maxExpirationSeconds).toBe(24 * 60 * 60); // 1 day
    expect(result.cleanupIntervalSeconds).toBe(15 * 60); // 15 minutes
  });

  it('should ensure max expiration is at least as long as default expiration', () => {
    const config = new ConfigReader({
      auth: {
        refreshTokens: {
          defaultExpiration: '10 days',
          maxExpiration: '5 days', // Less than default
        },
      },
    });
    const result = readRefreshTokenConfig(config);

    // Max should be adjusted to match default
    expect(result.defaultExpirationSeconds).toBe(10 * 24 * 60 * 60);
    expect(result.maxExpirationSeconds).toBe(10 * 24 * 60 * 60);
  });

  it('should handle ISO duration strings', () => {
    const config = new ConfigReader({
      auth: {
        refreshTokens: {
          defaultExpiration: 'PT1H', // 1 hour in ISO format
          maxExpiration: 'P1D', // 1 day in ISO format
          cleanupInterval: 'PT30M', // 30 minutes in ISO format
        },
      },
    });
    const result = readRefreshTokenConfig(config);

    expect(result.defaultExpirationSeconds).toBe(60 * 60); // 1 hour
    expect(result.maxExpirationSeconds).toBe(24 * 60 * 60); // 1 day
    expect(result.cleanupIntervalSeconds).toBe(30 * 60); // 30 minutes
  });
});