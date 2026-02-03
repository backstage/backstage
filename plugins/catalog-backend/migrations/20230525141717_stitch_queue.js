/*
 * Copyright 2022 The Backstage Authors
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

// @ts-check

/**
 * @param { import("knex").Knex } knex
 */
exports.up = async function up(knex) {
  await knex.schema.alterTable('refresh_state', table => {
    table
      .dateTime('next_stitch_at')
      .nullable()
      .comment('Timestamp of when entity should be stitched');
    table
      .string('next_stitch_ticket')
      .nullable()
      .comment('Random value distinguishing stitch requests');
    table.index('next_stitch_at', 'refresh_state_next_stitch_at_idx', {
      predicate: knex.whereNotNull('next_stitch_at'),
    });
  });

  // Look for things that are due for stitching, and move them over to the new
  // system. An explanation on the length based ones: Before adding the new
  // system, stitching was triggered by setting hashes to various hard coded
  // strings - and we leverage the fact that those strings were always shorter
  // than a real hash would be. There's also the case where we have not yet
  // created the final_entities row corresponding to the refresh_state one. This
  // is split into two statements because MySQL doesn't allow you to write to
  // tables you're reading from.
  const candidates = await knex
    .select({ entityId: 'refresh_state.entity_id' })
    .from('refresh_state')
    .leftOuterJoin(
      'final_entities',
      'final_entities.entity_id',
      'refresh_state.entity_id',
    )
    // no final entities at all
    .orWhereNull('final_entities.entity_id')
    // the final entity hash was forcibly set to something short
    .orWhere(knex.raw('LENGTH(??) < 15', ['final_entities.hash']))
    // there used to be an ongoing stitch (possibly unfinished and aborted)
    .orWhere(knex.raw('LENGTH(??) > 0', ['final_entities.stitch_ticket']))
    // the processing output entity hash was forcibly set to something short
    .orWhere(knex.raw('LENGTH(??) < 15', ['refresh_state.result_hash']));
  if (candidates.length) {
    for (let i = 0; i < candidates.length; i += 1000) {
      await knex('refresh_state')
        .update({
          next_stitch_at: knex.fn.now(),
          next_stitch_ticket: 'initial',
        })
        .whereIn(
          'entity_id',
          candidates.slice(i, i + 1000).map(c => c.entityId),
        );
    }
  }
};

/**
 * @param { import("knex").Knex } knex
 */
exports.down = async function down(knex) {
  await knex.schema.alterTable('refresh_state', table => {
    table.dropIndex([], 'refresh_state_next_stitch_at_idx');
    table.dropColumn('next_stitch_at');
    table.dropColumn('next_stitch_ticket');
  });
};
