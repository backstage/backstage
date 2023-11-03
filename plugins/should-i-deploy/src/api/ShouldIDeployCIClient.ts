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
import { FetchApi } from '@backstage/core-plugin-api';
import { ShouldIDeployCIApi } from './ShouldIDeployCIApi';
import { ApiResponse } from '../@types/api/apiResponse';

export class ShouldIDeployCIClient implements ShouldIDeployCIApi {
  fetchApi: FetchApi;

  constructor({ fetchApi }: { fetchApi: FetchApi }) {
    this.fetchApi = fetchApi;
  }

  protected async callApi<T>(timeZone?: string): Promise<T> {
    const url = timeZone
      ? `https://shouldideploy.today/api?tz=${timeZone}`
      : 'https://shouldideploy.today/api';
    const response = await this.fetchApi.fetch(url);

    if (response.ok) {
      return (await response.json()) as T;
    }

    return Promise.reject(response);
  }

  async get(timeZone?: string): Promise<ApiResponse> {
    try {
      const response = await this.callApi<ApiResponse>(timeZone);

      return response;
    } catch (_error) {
      throw new Error('Error to load response.');
    }
  }
}
