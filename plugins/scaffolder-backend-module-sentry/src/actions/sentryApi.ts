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

import { Config } from '@backstage/config';
import { InputError } from '@backstage/errors';

const DEFAULT_SENTRY_API_BASE_URL = 'https://sentry.io/api/0';

function normalizeSentryApiBaseUrl(urlString: string, field: string): string {
  let url: URL;
  try {
    url = new URL(urlString);
  } catch {
    throw new InputError(`${field} must be a valid HTTP(S) URL`);
  }

  if (
    !['http:', 'https:'].includes(url.protocol) ||
    url.username ||
    url.password ||
    url.search ||
    url.hash
  ) {
    throw new InputError(
      `${field} must be an HTTP(S) URL without credentials, query parameters, or fragments`,
    );
  }

  return `${url.origin}${url.pathname.replace(/\/+$/, '')}`;
}

export function resolveSentryApiBaseUrl(options: {
  config: Config;
  inputApiBaseUrl?: string;
}): string {
  const configuredApiBaseUrl = options.config.getOptionalString(
    'scaffolder.sentry.apiBaseUrl',
  );
  const effectiveApiBaseUrl = normalizeSentryApiBaseUrl(
    configuredApiBaseUrl ?? DEFAULT_SENTRY_API_BASE_URL,
    configuredApiBaseUrl
      ? 'scaffolder.sentry.apiBaseUrl'
      : 'default Sentry API base URL',
  );

  if (options.inputApiBaseUrl !== undefined) {
    const inputApiBaseUrl = normalizeSentryApiBaseUrl(
      options.inputApiBaseUrl,
      'apiBaseUrl',
    );
    if (inputApiBaseUrl !== effectiveApiBaseUrl) {
      throw new InputError(
        'apiBaseUrl must match the effective Sentry API base URL',
      );
    }
  }

  return effectiveApiBaseUrl;
}

export async function requestSentryApi<T>(options: {
  url: string;
  init: RequestInit;
  expectedStatus: number;
}): Promise<{ body: T; status: number }> {
  let response: Response;
  try {
    response = await fetch(options.url, {
      ...options.init,
      redirect: 'error',
    });
  } catch {
    throw new InputError('Failed to request Sentry API');
  }

  if (response.status !== options.expectedStatus) {
    throw new InputError(
      `Sentry API request failed with status ${response.status}`,
    );
  }

  if (
    !response.headers
      .get('content-type')
      ?.toLowerCase()
      .includes('application/json')
  ) {
    throw new InputError('Unexpected Sentry response content type');
  }

  try {
    return {
      body: (await response.json()) as T,
      status: response.status,
    };
  } catch {
    throw new InputError('Invalid JSON response from Sentry');
  }
}
