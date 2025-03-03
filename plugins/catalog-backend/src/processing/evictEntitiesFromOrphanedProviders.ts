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

import { EntityProvider } from '@backstage/plugin-catalog-node';
import { LoggerService } from '@backstage/backend-plugin-api';
import { ProviderDatabase } from '../database/types';

async function getOrphanedEntityProviderNames({
  db,
  providers,
}: {
  db: ProviderDatabase;
  providers: EntityProvider[];
}): Promise<string[]> {
  const dbProviderNames = await db.transaction(async tx =>
    db.listReferenceSourceKeys(tx),
  );

  const providerNames = providers.map(p => p.getProviderName());

  return dbProviderNames.filter(
    dbProviderName => !providerNames.includes(dbProviderName),
  );
}

async function removeEntitiesForProvider({
  db,
  providerName,
  logger,
}: {
  db: ProviderDatabase;
  providerName: string;
  logger: LoggerService;
}) {
  try {
    await db.transaction(async tx => {
      await db.replaceUnprocessedEntities(tx, {
        sourceKey: providerName,
        type: 'full',
        items: [],
      });
    });
    logger.info(`Removed entities for orphaned provider ${providerName}`);
  } catch (e) {
    logger.error(
      `Failed to remove entities for orphaned provider ${providerName}`,
      e,
    );
  }
}

export async function evictEntitiesFromOrphanedProviders(options: {
  db: ProviderDatabase;
  providers: EntityProvider[];
  logger: LoggerService;
}) {
  for (const providerName of await getOrphanedEntityProviderNames(options)) {
    await removeEntitiesForProvider({
      db: options.db,
      providerName,
      logger: options.logger,
    });
  }
}
