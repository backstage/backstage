/*
 * Copyright 2021 The Backstage Authors
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

export type DbPageInfo =
  | {
      hasNextPage: false;
    }
  | {
      hasNextPage: true;
      endCursor: string;
    };

export type DbLocationsRow = {
  id: string;
  type: string;
  target: string;
};

/**
 * Represents the refresh_state table.
 *
 * @remarks
 *
 * Every unique entity ref emitted by a provider or a parent entity becomes a
 * row in this table, even before processing has started on it. The actual final
 * data, after processing and stitching completes, is instead in the
 * final_entities table.
 *
 * Datetime columns are both string and Date, because different database engines
 * return them in different forms on the client side.
 */
export type DbRefreshStateRow = {
  /**
   * The unique ID of the entity. This is different to the entity ref, in that
   * it gets regenerated randomly each time a row is added to the table, no
   * matter what the original entity data was.
   */
  entity_id: string;
  /**
   * The entity string ref (on lowercase kind:namespace/name form)
   */
  entity_ref: string;
  /**
   * The JSON of the raw entity, as it was received from the entity provider.
   */
  unprocessed_entity: string;
  /**
   * A stable hash of the unprocessed entity, used to detect changed/unchanged
   * data for a given entity over time.
   */
  unprocessed_hash?: string;
  /**
   * The JSON of the processed entity (if processing has run yet on it).
   */
  processed_entity?: string;
  /**
   * A stable hash of the processed entity AND all other emitted things during
   * processing, such as relations.
   */
  result_hash?: string;
  /**
   * Per-entity cached data on JSON form. This is read and written by processors
   * who wish to leverage this feature.
   */
  cache?: string;
  /**
   * The next point in time that this entity is due for processing. This
   * continuously gets moved forward as items are picked up for processing.
   */
  next_update_at: string | Date;
  /**
   * If a stitch has been requested, this is the point in time that that last
   * happened.
   *
   * @remarks
   *
   * Each time that a request is made, this timestamp is updated to the current
   * time, overwriting the previous value if applicable.
   *
   * When the stitch loop runs and picks up an entity, this timestamp is not
   * immediately reset. It's instead moved forward in time by a certain amount,
   * which means that if the stitcher for some reason fails (eg if the process
   * crashes or gets shut down), the entity will be picked up again in the
   * future.
   *
   * Only when a stitch run is completed successfully, AND it's found that the
   * stitch ticket has not changed since the start (which means that no new
   * request has been made behind our backs), does the timestamp (and the
   * ticket) get reset.
   */
  next_stitch_at?: string | Date | null;
  /**
   * If a stitch has been requested, this is the unique ticket that was chosen
   * to mark the last request.
   *
   * @remarks
   *
   * Each time that a request is made, a new random ticket is chosen,
   * overwriting the previous value if applicable.
   *
   * When the stitch loop runs and picks up an entity, this column is left
   * unchanged. This means that if the stitcher for some reason fails (eg if the
   * process crashes or gets shut down), the entity will be picked up again in
   * the future.
   *
   * Only when a stitch run is completed successfully, AND it's found that the
   * stitch ticket has not changed since the start (which means that no new
   * request has been made behind our backs), does the ticket (and the
   * timestamp) get reset.
   */
  next_stitch_ticket?: string | null;
  /**
   * The last time that this entity was emitted by somebody (the entity provider
   * or a parent entity).
   *
   * @remarks
   *
   * Don't rely on this column more than at most as being loosely informative.
   * Its semantics aren't fully settled yet.
   */
  last_discovery_at: string | Date;
  /**
   * A JSON serialized array of errors (if any) encountered during processing.
   */
  errors?: string;
  /**
   * A conflict detection/resolution key for the entity.
   *
   * @remarks
   *
   * The exact value semantics differs, but may for example be a URL pointing to
   * where the entity was sourced from. If a "competing" provider or parent
   * entity tries to emit an entity that has the same entity ref but a different
   * location key, a conflict is detected (you aren't allowed to "trample" over
   * a previously existing entity).
   *
   * Some providers may choose to emit entities with no location key set at all.
   * This is a signal that it's only loosely claimed, and that any other
   * competing provider/parent is allowed to overwrite and claim it as theirs
   * instead.
   */
  location_key?: string;
};

export type DbRefreshKeysRow = {
  entity_id: string;
  key: string;
};

export type DbRefreshStateReferencesRow = {
  source_key?: string;
  source_entity_ref?: string;
  target_entity_ref: string;
};

export type DbRelationsRow = {
  originating_entity_id: string;
  source_entity_ref: string;
  target_entity_ref: string;
  type: string;
};

export type DbFinalEntitiesRow = {
  entity_id: string;
  hash: string;
  stitch_ticket: string;
  final_entity?: string;
  last_updated_at?: string | Date;
  entity_ref: string;
};

export type DbSearchRow = {
  entity_id: string;
  key: string;
  original_value: string | null;
  value: string | null;
};
