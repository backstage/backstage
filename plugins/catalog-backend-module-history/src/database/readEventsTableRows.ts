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

import { Knex } from 'knex';
import { SubscriptionEvent } from '../consumers';
import { EventsTableRow } from './tables';

export interface ReadEventsTableRowsOptions {
  afterEventId?: string;
  entityRef?: string;
  entityId?: string;
  order: 'asc' | 'desc';
  limit: number;
}

export async function readEventsTableRows(
  knex: Knex,
  options: ReadEventsTableRowsOptions,
): Promise<SubscriptionEvent[]> {
  let query = knex<EventsTableRow>('module_history__events');

  if (options.afterEventId) {
    query = query.where(
      'id',
      options.order === 'asc' ? '>' : '<',
      options.afterEventId,
    );
  }
  if (options.entityRef) {
    query = query.where('entity_ref', '=', options.entityRef);
  }
  if (options.entityId) {
    query = query.where('entity_id', '=', options.entityId);
  }

  query = query.orderBy('id', options.order).limit(options.limit);

  return await query.then(rows =>
    rows.map(row => ({
      id: String(row.id),
      eventAt:
        typeof row.event_at === 'string'
          ? new Date(row.event_at)
          : row.event_at,
      eventType: row.event_type,
      entityRef: row.entity_ref ?? undefined,
      entityId: row.entity_id ?? undefined,
      entityJson: row.entity_json ?? undefined,
    })),
  );
}
