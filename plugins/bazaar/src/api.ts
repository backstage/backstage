/*
 * Copyright 2021 The Backstage Authors
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

export const bazaarApiRef = createApiRef<BazaarApi>({
  id: 'bazaar',
});

export interface BazaarApi {
  updateProject(bazaarProject: any): Promise<any>;

  addProject(bazaarProject: any): Promise<any>;

  getProjectById(id: number): Promise<any>;

  getProjectByRef(entityRef: string): Promise<any>;

  getMembers(id: number): Promise<any>;

  deleteMember(id: number, userId: string): Promise<void>;

  addMember(id: number, userId: string): Promise<void>;

  getProjects(): Promise<any>;

  deleteProject(id: number): Promise<void>;
}

export class BazaarClient implements BazaarApi {
  private readonly identityApi: IdentityApi;
  private readonly discoveryApi: DiscoveryApi;
  private readonly fetchApi: FetchApi;

  constructor(options: {
    identityApi: IdentityApi;
    discoveryApi: DiscoveryApi;
    fetchApi: FetchApi;
  }) {
    this.identityApi = options.identityApi;
    this.discoveryApi = options.discoveryApi;
    this.fetchApi = options.fetchApi;
  }

  async updateProject(bazaarProject: any): Promise<any> {
    const baseUrl = await this.discoveryApi.getBaseUrl('bazaar');

    return await this.fetchApi
      .fetch(`${baseUrl}/projects`, {
        method: 'PUT',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bazaarProject),
      })
      .then(resp => resp.json());
  }

  async addProject(bazaarProject: any): Promise<any> {
    const baseUrl = await this.discoveryApi.getBaseUrl('bazaar');

    return await this.fetchApi
      .fetch(`${baseUrl}/projects`, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bazaarProject),
      })
      .then(resp => resp.json());
  }

  async getProjectById(id: number): Promise<any> {
    const baseUrl = await this.discoveryApi.getBaseUrl('bazaar');

    const response = await this.fetchApi.fetch(
      `${baseUrl}/projects/${encodeURIComponent(id)}`,
    );

    return response.ok ? response : null;
  }

  async getProjectByRef(entityRef: string): Promise<any> {
    const baseUrl = await this.discoveryApi.getBaseUrl('bazaar');

    const response = await this.fetchApi.fetch(
      `${baseUrl}/projects/${encodeURIComponent(entityRef)}`,
    );

    return response.ok ? response : null;
  }

  async getMembers(id: number): Promise<any> {
    const baseUrl = await this.discoveryApi.getBaseUrl('bazaar');

    return await this.fetchApi
      .fetch(`${baseUrl}/projects/${encodeURIComponent(id)}/members`)
      .then(resp => resp.json());
  }

  async addMember(id: number, userId: string): Promise<void> {
    const baseUrl = await this.discoveryApi.getBaseUrl('bazaar');
    const { picture } = await this.identityApi.getProfileInfo();

    await this.fetchApi.fetch(
      `${baseUrl}/projects/${encodeURIComponent(
        id,
      )}/member/${encodeURIComponent(userId)}`,
      {
        method: 'PUT',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ picture }),
      },
    );
  }

  async deleteMember(id: number, userId: string): Promise<void> {
    const baseUrl = await this.discoveryApi.getBaseUrl('bazaar');

    await this.fetchApi.fetch(
      `${baseUrl}/projects/${encodeURIComponent(
        id,
      )}/member/${encodeURIComponent(userId)}`,
      { method: 'DELETE' },
    );
  }

  async getProjects(): Promise<any> {
    const baseUrl = await this.discoveryApi.getBaseUrl('bazaar');

    return await this.fetchApi
      .fetch(`${baseUrl}/projects`)
      .then(resp => resp.json());
  }

  async deleteProject(id: number): Promise<void> {
    const baseUrl = await this.discoveryApi.getBaseUrl('bazaar');

    await this.fetchApi.fetch(`${baseUrl}/projects/${encodeURIComponent(id)}`, {
      method: 'DELETE',
    });
  }
}
