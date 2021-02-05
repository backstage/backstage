/*
 * Copyright 2020 Spotify AB
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

import { ScmIntegration, ScmIntegrationsGroup } from './types';

/** Checks whether the given url is a valid host */
export function isValidHost(url: string): boolean {
  const check = new URL('http://example.com');
  check.host = url;
  return check.host === url;
}

export function basicIntegrations<T extends ScmIntegration>(
  integrations: T[],
  getHost: (integration: T) => string,
): ScmIntegrationsGroup<T> {
  return {
    list(): T[] {
      return integrations;
    },
    byUrl(url: string | URL): T | undefined {
      const parsed = typeof url === 'string' ? new URL(url) : url;
      return integrations.find(i => getHost(i) === parsed.hostname);
    },
    byHost(host: string): T | undefined {
      return integrations.find(i => getHost(i) === host);
    },
  };
}
