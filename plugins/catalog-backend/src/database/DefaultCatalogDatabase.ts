/*
 * Copyright 2020 The Backstage Authors
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

import { NotFoundError } from '@backstage/errors';
import { Knex } from 'knex';
import {
  CatalogDatabase,
  ListAncestorsOptions,
  ListAncestorsResult,
  RefreshOptions,
  Transaction,
} from './types';
import { DbRefreshStateReferencesRow, DbRefreshStateRow } from './tables';
import { rethrowError } from './conversion';
import { LoggerService } from '@backstage/backend-plugin-api';

const MAX_ANCESTOR_DEPTH = 32;

export class DefaultCatalogDatabase implements CatalogDatabase {
  constructor(
    private readonly options: {
      database: Knex;
      logger: LoggerService;
    },
  ) {}

  async transaction<T>(fn: (tx: Transaction) => Promise<T>): Promise<T> {
    try {
      let result: T | undefined = undefined;

      await this.options.database.transaction(
        async tx => {
          // We can't return here, as knex swallows the return type in case the transaction is rolled back:
          // https://github.com/knex/knex/blob/e37aeaa31c8ef9c1b07d2e4d3ec6607e557d800d/lib/transaction.js#L136
          result = await fn(tx);
        },
        {
          // If we explicitly trigger a rollback, don't fail.
          doNotRejectOnRollback: true,
        },
      );

      return result!;
    } catch (e) {
      this.options.logger.debug(`Error during transaction, ${e}`);
      throw rethrowError(e);
    }
  }

  async listAncestors(
    txOpaque: Transaction,
    options: ListAncestorsOptions,
  ): Promise<ListAncestorsResult> {
    const tx = txOpaque as Knex.Transaction;
    const { entityRef } = options;
    const entityRefs = new Array<string>();

    let currentRef = entityRef.toLocaleLowerCase('en-US');
    for (let depth = 1; depth <= MAX_ANCESTOR_DEPTH; depth += 1) {
      // First try to find the entity in refresh_state using inline source columns
      const row = await tx<DbRefreshStateRow>('refresh_state')
        .where({ entity_ref: currentRef })
        .select('source_type', 'source_key')
        .first();

      if (!row) {
        // Fall back to refresh_state_references for backwards compatibility during migration
        const refRows = await tx<DbRefreshStateReferencesRow>(
          'refresh_state_references',
        )
          .where({ target_entity_ref: currentRef })
          .select();

        if (refRows.length === 0) {
          if (depth === 1) {
            throw new NotFoundError(`Entity ${currentRef} not found`);
          }
          throw new NotFoundError(
            `Entity ${entityRef} has a broken parent reference chain at ${currentRef}`,
          );
        }

        const parentRef = refRows.find(
          r => r.source_entity_ref,
        )?.source_entity_ref;
        if (!parentRef) {
          return { entityRefs };
        }
        entityRefs.push(parentRef);
        currentRef = parentRef;
        continue;
      }

      // Use inline source columns
      if (row.source_type === 'provider') {
        // We've reached the top of the tree which is the entityProvider.
        // In this case we refresh the entity itself.
        return { entityRefs };
      }

      if (row.source_type === 'entity' && row.source_key) {
        // The source_key is the parent entity_ref
        entityRefs.push(row.source_key);
        currentRef = row.source_key;
        continue;
      }

      // No source info - entity may be orphaned or in an inconsistent state
      return { entityRefs };
    }
    throw new Error(
      `Unable receive ancestors for ${entityRef}, reached maximum depth of ${MAX_ANCESTOR_DEPTH}`,
    );
  }

  async refresh(txOpaque: Transaction, options: RefreshOptions): Promise<void> {
    const tx = txOpaque as Knex.Transaction;
    const { entityRef } = options;

    const updateResult = await tx<DbRefreshStateRow>('refresh_state')
      .where({ entity_ref: entityRef.toLocaleLowerCase('en-US') })
      .update({ next_update_at: tx.fn.now() });
    if (updateResult === 0) {
      throw new NotFoundError(`Failed to schedule ${entityRef} for refresh`);
    }
  }
}
