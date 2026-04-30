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

import { Config } from '@backstage/config';
import { mockServices } from '@backstage/backend-test-utils';
import searchModulePostgresEngineLoader from './module';

type Registration = { pluginId: string; moduleId: string };

type Loader = {
  featureType: 'loader';
  loader(deps: { config: Config }): Promise<
    Array<{
      $$type: '@backstage/BackendFeature';
      featureType: string;
      getRegistrations?: () => Registration[];
    }>
  >;
};

describe('searchModulePostgresEngineLoader', () => {
  const loader = searchModulePostgresEngineLoader as unknown as Loader;

  it('yields the postgres-engine module when client is pg, skips otherwise, and skips when backend.database is unset', async () => {
    expect(loader.featureType).toBe('loader');

    const pgFeatures = await loader.loader({
      config: mockServices.rootConfig({
        data: { backend: { database: { client: 'pg' } } },
      }),
    });
    expect(pgFeatures).toHaveLength(1);
    expect(pgFeatures[0].$$type).toBe('@backstage/BackendFeature');
    expect(pgFeatures[0].featureType).toBe('registrations');
    const registrations = pgFeatures[0].getRegistrations!();
    expect(registrations).toHaveLength(1);
    expect(registrations[0].pluginId).toBe('search');
    expect(registrations[0].moduleId).toBe('postgres-engine');

    const sqliteFeatures = await loader.loader({
      config: mockServices.rootConfig({
        data: { backend: { database: { client: 'better-sqlite3' } } },
      }),
    });
    expect(sqliteFeatures).toHaveLength(0);

    const noBackendFeatures = await loader.loader({
      config: mockServices.rootConfig({ data: {} }),
    });
    expect(noBackendFeatures).toHaveLength(0);
  });
});
