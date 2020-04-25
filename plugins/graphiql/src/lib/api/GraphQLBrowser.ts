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

import { GraphQLBrowseApi, GraphQLEndpoint } from './types';

// Helper for generic http endpoints
export type EndpointConfig = {
  id: string;
  title: string;
  // Endpoint URL
  url: string;
  // only supports POST right now
  method?: 'POST';
  // Defaults to setting Content-Type to application/json
  headers?: { [name in string]: string };
};

export class GraphQLBrowser implements GraphQLBrowseApi {
  static createEndpoint(config: EndpointConfig): GraphQLEndpoint {
    const { id, title, url, method = 'POST' } = config;
    return {
      id,
      title,
      fetcher: async (params: any) => {
        const body = JSON.stringify(params);
        const headers = {
          'Content-Type': 'application/json',
          ...config.headers,
        };
        const res = await fetch(url, {
          method,
          headers,
          body,
        });
        return res.json();
      },
    };
  }

  static fromEndpoints(endpoints: GraphQLEndpoint[]) {
    return new GraphQLBrowser(endpoints);
  }

  private constructor(private readonly endpoints: GraphQLEndpoint[]) {}

  async getEndpoints() {
    return this.endpoints;
  }
}
