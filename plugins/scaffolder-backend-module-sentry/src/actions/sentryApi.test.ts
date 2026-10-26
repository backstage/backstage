/*
 * Copyright 2026 The Backstage Authors
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
import { InputError } from '@backstage/errors';
import { resolveSentryApiBaseUrl } from './sentryApi';

describe('resolveSentryApiBaseUrl', () => {
  const createConfig = (apiBaseUrl?: string) =>
    new ConfigReader({
      scaffolder: {
        sentry: apiBaseUrl === undefined ? {} : { apiBaseUrl },
      },
    });

  it('should compare canonical URLs and return the trusted configured value.', () => {
    expect(
      resolveSentryApiBaseUrl({
        config: createConfig('HTTPS://SENTRY.IO:443/api/0/'),
        inputApiBaseUrl: 'https://sentry.io/api/0',
      }),
    ).toBe('https://sentry.io/api/0');
  });

  it.each([
    ['not a URL', 'not a URL', 'apiBaseUrl must be a valid HTTP(S) URL'],
    [
      'a non-HTTP scheme',
      'ftp://sentry.io/api/0',
      'apiBaseUrl must be an HTTP(S) URL without credentials, query parameters, or fragments',
    ],
    [
      'credentials',
      'https://user:password@sentry.io/api/0',
      'apiBaseUrl must be an HTTP(S) URL without credentials, query parameters, or fragments',
    ],
    [
      'query parameters',
      'https://sentry.io/api/0?target=other',
      'apiBaseUrl must be an HTTP(S) URL without credentials, query parameters, or fragments',
    ],
    [
      'a fragment',
      'https://sentry.io/api/0#other',
      'apiBaseUrl must be an HTTP(S) URL without credentials, query parameters, or fragments',
    ],
  ])('should reject %s in an action URL.', (_, inputApiBaseUrl, message) => {
    expect(() =>
      resolveSentryApiBaseUrl({
        config: createConfig(),
        inputApiBaseUrl,
      }),
    ).toThrow(new InputError(message));
  });

  it('should identify an invalid configured URL.', () => {
    expect(() =>
      resolveSentryApiBaseUrl({
        config: createConfig('not a URL'),
      }),
    ).toThrow(
      new InputError(
        'scaffolder.sentry.apiBaseUrl must be a valid HTTP(S) URL',
      ),
    );
  });
});
