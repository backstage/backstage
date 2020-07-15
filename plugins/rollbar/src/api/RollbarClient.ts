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

import { RollbarApi } from './RollbarApi';
import {
  RollbarItemsResponse,
  RollbarProject,
  RollbarTopActiveItem,
} from './types';

export class RollbarClient implements RollbarApi {
  private apiOrigin: string;
  private basePath: string;

  constructor({
    apiOrigin,
    basePath,
  }: {
    apiOrigin: string;
    basePath: string;
  }) {
    this.apiOrigin = apiOrigin;
    this.basePath = basePath;
  }

  async getAllProjects(): Promise<RollbarProject[]> {
    const path = `/projects`;

    return await this.get(path);
  }

  async getTopActiveItems(
    project: string,
    hours = 24,
    environment = 'production',
  ): Promise<RollbarTopActiveItem[]> {
    const path = `/projects/${project}/top_active_items?environment=${environment}&hours=${hours}`;

    return await this.get(path);
  }

  async getProjectItems(project: string): Promise<RollbarItemsResponse> {
    const path = `/projects/${project}/items`;

    return await this.get(path);
  }

  private async get(path: string): Promise<any> {
    const url = `${this.apiOrigin}${this.basePath}${path}`;
    const response = await fetch(url);

    if (!response.ok) {
      const payload = await response.text();
      const message = `Request failed with ${response.status} ${response.statusText}, ${payload}`;
      throw new Error(message);
    }

    return await response.json();
  }
}
