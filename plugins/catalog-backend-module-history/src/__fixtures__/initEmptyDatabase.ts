/*
 * Copyright 2025 The Backstage Authors
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

// eslint-disable-next-line @backstage/no-undeclared-imports
import {
  mockServices,
  startTestBackend,
  TestDatabaseId,
  TestDatabases,
} from '@backstage/backend-test-utils';
// eslint-disable-next-line @backstage/no-undeclared-imports
import catalogBackend from '@backstage/plugin-catalog-backend';
import { BackendFeature } from '@backstage/backend-plugin-api';
import { Knex } from 'knex';
import { createMockEntityProvider } from '../__fixtures__/createMockEntityProvider';
import { applyDatabaseMigrations } from '../database/migrations';
import { MockEntityProvider } from './createMockEntityProvider';

/**
 * Helps with creating first the catalog backend and its database, and than the
 * history migrations on top. Also returns a helper entity provider in doing so.
 */
export async function initEmptyDatabase(
  databases: TestDatabases,
  databaseId: TestDatabaseId,
  options?: {
    runMigrations?: boolean;
    extraFeatures?: Array<
      BackendFeature | Promise<{ default: BackendFeature }>
    >;
  },
): Promise<{
  knex: Knex;
  provider: MockEntityProvider;
  shutdown: () => Promise<void>;
}> {
  const runMigrations = options?.runMigrations ?? true;

  const knex = await databases.init(databaseId);
  const provider = createMockEntityProvider();
  const backend = await startTestBackend({
    features: [
      mockServices.database.factory({ knex }),
      mockServices.rootConfig.factory({
        data: { catalog: { processingInterval: '100ms' } },
      }),
      catalogBackend,
      provider,
      ...(options?.extraFeatures ?? []),
    ],
  });

  // The provider is not ready until the catalog backend is started and starts
  // attaching providers. We use this as a canary for ensuring that catalog
  // migrations are complete before we run the history migrations.
  await provider.ready;

  if (runMigrations) {
    await applyDatabaseMigrations(knex);
  }

  return {
    knex,
    provider,
    shutdown: async () => {
      await backend.stop();
      await knex.destroy();
    },
  };
}
