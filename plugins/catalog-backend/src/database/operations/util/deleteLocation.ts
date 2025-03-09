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
import { StitchingStrategy } from '../../../stitching/types';
import { DbRefreshStateRow } from '../../tables';
import { markForStitching } from '../stitcher/markForStitching';

export async function deleteLocation(
  entityId: string,
  options: {
    knex: Knex.Transaction | Knex;
    strategy: StitchingStrategy;
  },
): Promise<void> {
  const { knex, strategy } = options;

  // Delete the location itself
  await knex
    .table<DbRefreshStateRow>('refresh_state')
    .delete()
    .where('entity_id', entityId);

  // Retrieve all targets of the location and mark them for stitching
  const targets = await knex
    .select({
      id: 'targets.entity_id',
    })
    .from('refresh_state')
    .leftOuterJoin(
      'refresh_state_references',
      'refresh_state_references.source_entity_ref',
      'refresh_state.entity_ref',
    )
    .leftOuterJoin(
      'refresh_state AS targets',
      'targets.entity_ref',
      'refresh_state_references.target_entity_ref',
    )
    .where('refresh_state.entity_id', entityId);

  const targetIds = targets.map(r => r.id);

  await markForStitching({
    knex,
    strategy,
    entityIds: targetIds,
  });
}
