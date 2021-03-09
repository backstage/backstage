/*
 * Copyright 2021 Spotify AB
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

import { serializeEntityRef } from '@backstage/catalog-model';
import { DiscoveryApi, IdentityApi } from '@backstage/core';
import { TodoApi, TodoListOptions, TodoListResult } from './types';

interface Options {
  discoveryApi: DiscoveryApi;
  identityApi: IdentityApi;
}

export class TodoClient implements TodoApi {
  private readonly discoveryApi: DiscoveryApi;
  private readonly identityApi: IdentityApi;

  constructor(options: Options) {
    this.discoveryApi = options.discoveryApi;
    this.identityApi = options.identityApi;
  }

  async listTodos({
    entity,
    cursor,
  }: TodoListOptions): Promise<TodoListResult> {
    const baseUrl = await this.discoveryApi.getBaseUrl('todo');
    const token = await this.identityApi.getIdToken();

    const query = new URLSearchParams();
    if (entity) {
      query.set('entity', serializeEntityRef(entity) as string);
    }
    if (cursor) {
      query.set('cursor', cursor);
    }

    const res = await fetch(`${baseUrl}/v1/todos?${query}`, {
      headers: token
        ? {
            Authorization: `Bearer ${token}`,
          }
        : undefined,
    });

    if (!res.ok) {
      const error = await this.readResponseError(res, 'list todos');
      throw error;
    }

    const data: TodoListResult = await res.json();
    return data;
  }

  private async readResponseError(res: Response, action: string) {
    const error = new Error() as Error & { status: number };
    error.status = res.status;

    try {
      const json = await res.json();
      if (typeof json?.error?.message !== 'string') {
        throw new Error('invalid error');
      }
      error.message = json.error.message;
      if (json.error.name) {
        error.name = json.error.name;
      }
    } catch {
      try {
        const text = await res.text();
        error.message = `Failed to ${action}, ${text}`;
      } catch {
        error.message = `Failed to ${action}, status ${res.status}`;
      }
    }

    throw error;
  }
}
