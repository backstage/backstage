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

/* eslint-disable @typescript-eslint/no-unused-vars */

import { RollbarApi } from './RollbarApi';
import {
  RollbarItemsResponse,
  RollbarProject,
  RollbarTopActiveItem,
} from './types';

export class RollbarMockClient implements RollbarApi {
  async getAllProjects(): Promise<RollbarProject[]> {
    return Promise.resolve([
      { id: 123, name: 'project-a', accountId: 1, status: 'enabled' },
      { id: 356, name: 'project-b', accountId: 1, status: 'enabled' },
      { id: 789, name: 'project-c', accountId: 1, status: 'enabled' },
    ]);
  }

  async getTopActiveItems(
    _project: string,
    _hours = 24,
    _environment = 'production',
  ): Promise<RollbarTopActiveItem[]> {
    const createItem = (id: number): RollbarTopActiveItem => ({
      item: {
        id,
        counter: id,
        environment: 'production',
        framework: 2,
        lastOccurrenceTimestamp: new Date().getTime() / 1000,
        level: 50,
        occurrences: 100,
        projectId: 12345,
        title: `Some error occurred in service - ${id}`,
        uniqueOccurrences: 10,
      },
      counts: Array.from({ length: 168 }, () =>
        Math.floor(Math.random() * 100),
      ),
    });

    const items = Array.from({ length: 10 }, (_, i) => createItem(i));

    return Promise.resolve(items);
  }

  async getProjectItems(_project: string): Promise<RollbarItemsResponse> {
    return Promise.resolve({
      items: [],
      page: 0,
      totalCount: 0,
    });
  }
}
