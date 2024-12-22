/*
 * Copyright 2020 The Backstage Authors
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

import { DiscoveryApi } from '@backstage/core-plugin-api';

const ERROR_PREFIX = 'Invalid discovery URL pattern,';

/**
 * UrlPatternDiscovery is a lightweight DiscoveryApi implementation.
 * It uses a single template string to construct URLs for each plugin.
 *
 * @public
 */
export class UrlPatternDiscovery implements DiscoveryApi {
  /**
   * Creates a new UrlPatternDiscovery given a template. The only
   * interpolation done for the template is to replace instances of `{{pluginId}}`
   * with the ID of the plugin being requested.
   *
   * Example pattern: `http://localhost:7007/api/{{ pluginId }}`
   */
  static compile(pattern: string): UrlPatternDiscovery {
    const parts = pattern.split(/\{\{\s*pluginId\s*\}\}/);
    const urlStr = parts.join('pluginId');

    let url;
    try {
      url = new URL(urlStr);
    } catch {
      throw new Error(`${ERROR_PREFIX} URL '${urlStr}' is invalid`);
    }
    if (url.hash) {
      throw new Error(`${ERROR_PREFIX} URL must not have a hash`);
    }
    if (url.search) {
      throw new Error(`${ERROR_PREFIX} URL must not have a query`);
    }
    if (urlStr.endsWith('/')) {
      throw new Error(`${ERROR_PREFIX} URL must not end with a slash`);
    }

    return new UrlPatternDiscovery(parts);
  }

  private constructor(private readonly parts: string[]) {}

  async getBaseUrl(pluginId: string): Promise<string> {
    return this.parts.join(encodeURIComponent(pluginId));
  }
}
