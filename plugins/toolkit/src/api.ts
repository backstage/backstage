/*
 * Copyright 2023 The Backstage Authors
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
import {
  createApiRef,
  DiscoveryApi,
  FetchApi,
  IdentityApi,
} from '@backstage/core-plugin-api';

export const toolkitApiRef = createApiRef<ToolkitApi>({
  id: 'toolkit',
});

export interface ToolkitApi {
  createToolkit(body: any): Promise<any>;
  updateToolkit(body: any, id: number): Promise<any>;
  deleteOwnToolkit(id: number): Promise<any>;
  getToolkitById(id: number): Promise<any>;
  getMyToolkits(): Promise<any>;
  getYourToolkits(): Promise<any>;
  getToolkits(): Promise<any>;
  addToolkits(body: any): Promise<any>;
  removeToolkit(toolkit: number): Promise<any>;
}

export class ToolkitClient implements ToolkitApi {
  private readonly discoveryApi: DiscoveryApi;
  private readonly fetchApi: FetchApi;

  constructor(options: {
    identityApi: IdentityApi;
    discoveryApi: DiscoveryApi;
    fetchApi: FetchApi;
  }) {
    this.discoveryApi = options.discoveryApi;
    this.fetchApi = options.fetchApi;
  }

  async getYourToolkits(): Promise<any> {
    const baseUrl = await this.discoveryApi.getBaseUrl('toolkit');
    return await this.fetchApi.fetch(`${baseUrl}/yourToolkits`);
  }

  async getMyToolkits(): Promise<any> {
    const baseUrl = await this.discoveryApi.getBaseUrl('toolkit');
    return await this.fetchApi.fetch(`${baseUrl}/myToolkits`);
  }

  async getToolkits(): Promise<any> {
    const baseUrl = await this.discoveryApi.getBaseUrl('toolkit');
    return await this.fetchApi.fetch(`${baseUrl}/getToolkits`);
  }

  async createToolkit(body: any): Promise<any> {
    const baseUrl = await this.discoveryApi.getBaseUrl('toolkit');
    return await this.fetchApi.fetch(`${baseUrl}/create`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });
  }
  async deleteOwnToolkit(id: number): Promise<any> {
    const baseUrl = await this.discoveryApi.getBaseUrl('toolkit');
    return await this.fetchApi.fetch(`${baseUrl}/delete/${id}`, {
      method: 'DELETE',
    });
  }
  async addToolkits(body: number[]): Promise<any> {
    const baseUrl = await this.discoveryApi.getBaseUrl('toolkit');
    return await this.fetchApi.fetch(`${baseUrl}/add`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });
  }
  async getToolkitById(id: number): Promise<any> {
    const baseUrl = await this.discoveryApi.getBaseUrl('toolkit');
    return await this.fetchApi.fetch(`${baseUrl}/${id}`);
  }
  async removeToolkit(toolkit: number): Promise<any> {
    const baseUrl = await this.discoveryApi.getBaseUrl('toolkit');
    return await this.fetchApi.fetch(`${baseUrl}/remove/${toolkit}`, {
      method: 'DELETE',
    });
  }
  async updateToolkit(body: any, id: number): Promise<any> {
    const baseUrl = await this.discoveryApi.getBaseUrl('toolkit');
    return await this.fetchApi.fetch(`${baseUrl}/update/${id}`, {
      method: 'PUT',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });
  }
}
