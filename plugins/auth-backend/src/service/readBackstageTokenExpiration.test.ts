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

import { ConfigReader } from '@backstage/config';
import { readBackstageTokenExpiration } from './readBackstageTokenExpiration';

describe('Test for default backstage token expiry time', () => {
  it('Will return default backstage session expiration', () => {
    const config = new ConfigReader({
      app: {
        baseUrl: 'http://example.com/extra-path',
      },
    });
    expect(readBackstageTokenExpiration(config)).toBe(3600);
  });

  it('Will return user defined 120 minutes as backstage session expiration', () => {
    const config = new ConfigReader({
      app: {
        baseUrl: 'http://example.com/extra-path',
      },
      auth: {
        backstageTokenExpiration: { minutes: 120 },
      },
    });
    expect(readBackstageTokenExpiration(config)).toBe(7200);
  });

  it('Will return minimum duration of 10 minutes as backstage session expiration', () => {
    const config = new ConfigReader({
      app: {
        baseUrl: 'http://example.com/extra-path',
      },
      auth: {
        backstageTokenExpiration: { minutes: 2 },
      },
    });
    expect(readBackstageTokenExpiration(config)).toBe(600);
  });

  it('Will return user configured value as backstage session expiration', () => {
    const config = new ConfigReader({
      app: {
        baseUrl: 'http://example.com/extra-path',
      },
      auth: {
        backstageTokenExpiration: { minutes: 20 },
      },
    });
    expect(readBackstageTokenExpiration(config)).toBe(1200);
  });

  it('Will return maximum of 24 hour as backstage session expiration if user configured value is more than a day', () => {
    const config = new ConfigReader({
      app: {
        baseUrl: 'http://example.com/extra-path',
      },
      auth: {
        backstageTokenExpiration: { minutes: 1500 },
      },
    });
    expect(readBackstageTokenExpiration(config)).toBe(86400);
  });
});
