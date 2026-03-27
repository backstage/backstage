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
import {
  ANNOTATION_LOCATION,
  ANNOTATION_ORIGIN_LOCATION,
} from '@backstage/catalog-model';
import {
  type EntityIteratorResult,
  type IncrementalEntityProvider,
} from '@backstage/plugin-catalog-backend-module-incremental-ingestion';

// This will include your pagination information, let's say your API accepts a
// `page` parameter. In this case, the cursor will include `page`.
interface Cursor {
  page: number;
}

interface Service {
  name: string;
}

interface MyPaginatedResults<T> {
  items: T[];
  totalPages: number;
}

interface MyApiClient {
  getServices(cursor: Cursor): Promise<MyPaginatedResults<Service>>;
}

// This interface describes the type of data that will be passed to your burst
// function.
interface Context {
  apiClient: MyApiClient;
}

class MyApiClientImpl implements MyApiClient {
  constructor(private readonly token: string) {}

  async getServices(_cursor: Cursor): Promise<MyPaginatedResults<Service>> {
    throw new Error(
      `Implement MyApiClient.getServices using your source API and token ${this.token}`,
    );
  }
}

export class MyIncrementalEntityProvider
  implements IncrementalEntityProvider<Cursor, Context>
{
  token: string;
  mySource: string;

  constructor(token: string, mySource = 'my-source') {
    this.token = token;
    this.mySource = mySource;
  }

  getProviderName() {
    return 'MyIncrementalEntityProvider';
  }

  async around(burst: (context: Context) => Promise<void>): Promise<void> {
    const apiClient = new MyApiClientImpl(this.token);

    await burst({ apiClient });
  }

  async next(
    context: Context,
    cursor: Cursor = { page: 1 },
  ): Promise<EntityIteratorResult<Cursor>> {
    const { apiClient } = context;
    const location = `${this.getProviderName()}:${this.mySource}`;

    const data = await apiClient.getServices(cursor);
    const nextPage = cursor.page + 1;
    const done = nextPage > data.totalPages;

    const entities = data.items.map(item => ({
      entity: {
        apiVersion: 'backstage.io/v1beta1',
        kind: 'Component',
        metadata: {
          name: item.name,
          annotations: {
            [ANNOTATION_LOCATION]: location,
            [ANNOTATION_ORIGIN_LOCATION]: location,
          },
        },
        spec: {
          type: 'service',
        },
      },
    }));

    return {
      done,
      entities,
      cursor: {
        page: nextPage,
      },
    };
  }
}
