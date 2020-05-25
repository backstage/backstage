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
  runPeriodically,
} from '@backstage/plugin-catalog-backend';
import { PluginEnvironment } from '../types';

export default async function ({ logger, database }: PluginEnvironment) {
  const reader = LocationReaders.create();
  const parser = DescriptorParsers.create();

  const db = await DatabaseManager.createDatabase(database, logger);
  runPeriodically(
    () => DatabaseManager.refreshLocations(db, reader, parser, logger),
    10000,
  );

  const entitiesCatalog = new DatabaseEntitiesCatalog(db);
  const locationsCatalog = new DatabaseLocationsCatalog(db);

  return await createRouter({ entitiesCatalog, locationsCatalog, logger });
}
