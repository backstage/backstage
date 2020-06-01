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

import {
  createRouter,
  DatabaseEntitiesCatalog,
  DatabaseLocationsCatalog,
  DatabaseManager,
  DescriptorParsers,
  LocationReaders,
  IngestionModels,
  runPeriodically,
} from '@backstage/plugin-catalog-backend';
import { PluginEnvironment } from '../types';
import { EntityPolicies } from '@backstage/catalog-model';

export default async function createPlugin({
  logger,
  database,
}: PluginEnvironment) {
  const policy = new EntityPolicies();
  const ingestion = new IngestionModels(
    new LocationReaders(),
    new DescriptorParsers(),
    new EntityPolicies(),
  );

  const db = await DatabaseManager.createDatabase(database, logger);
  runPeriodically(
    () => DatabaseManager.refreshLocations(db, ingestion, policy, logger),
    10000,
  );

  const entitiesCatalog = new DatabaseEntitiesCatalog(db, policy);
  const locationsCatalog = new DatabaseLocationsCatalog(db, ingestion);

  return await createRouter({ entitiesCatalog, locationsCatalog, logger });
}
