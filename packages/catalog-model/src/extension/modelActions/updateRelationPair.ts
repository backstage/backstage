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

import { CatalogModelOp } from '../operations';

/**
 * The definition of a catalog model relation.
 *
 * @alpha
 */
export interface CatalogModelUpdateRelationPairDefinition {
  /**
   * The kind(s) that this relation originates from, e.g. "Component" or
   * ["Component", "Resource"].
   */
  fromKind: string | string[];

  /**
   * The kind(s) that this relation points to, e.g. "Group" or
   * ["Group", "User"].
   */
  toKind: string | string[];

  /**
   * A human-readable comment describing the relation. Specify this if you want
   * to override the default value.
   */
  comment?: string;

  /**
   * The names for the forward direction (from the current entity toward the one
   * being referenced).
   */
  forward: {
    /**
     * The technical type of the relation, e.g. "ownedBy"
     */
    type: string;
    /**
     * The singular human readable form of the relation name, e.g. "owner".
     * Specify this if you want to override the default value.
     *
     * @remarks
     *
     * This represents the count of the other end of the relation - essentially
     * based on how many relations of this type that are present.
     */
    singular?: string;
    /**
     * The plural human readable form of the relation name, e.g. "owners".
     * Specify this if you want to override the default value.
     *
     * @remarks
     *
     * This represents the count of the other end of the relation - essentially
     * based on how many relations of this type that are present.
     */
    plural?: string;
  };

  /**
   * The names for the reverse direction (from the one being referenced toward
   * the current entity).
   */
  reverse: {
    /**
     * The technical type of the relation, e.g. "ownerOf". Specify this if you
     * want to override the default value.
     */
    type?: string;
    /**
     * The singular human readable form of the relation name, e.g. "owns".
     * Specify this if you want to override the default value.
     *
     * @remarks
     *
     * This represents the count of the other end of the relation - essentially
     * based on how many relations of this type that are present.
     */
    singular?: string;
    /**
     * The plural human readable form of the relation name, e.g. "owns". Specify
     * this if you want to override the default value.
     *
     * @remarks
     *
     * This represents the count of the other end of the relation -
     * essentially based on how many relations of this type that are
     * present.
     */
    plural?: string;
  };
}

export function opsFromCatalogModelUpdateRelationPair(
  relationPair: CatalogModelUpdateRelationPairDefinition,
): CatalogModelOp[] {
  const ops: CatalogModelOp[] = [];

  // Duplicate across kinds, and both directions
  for (const firstKind of [relationPair.fromKind].flat()) {
    for (const secondKind of [relationPair.toKind].flat()) {
      ops.push({
        op: 'updateRelation.v1',
        fromKind: firstKind,
        type: relationPair.forward.type,
        toKind: secondKind,
        properties: {
          reverseType: relationPair.reverse.type,
          singular: relationPair.forward.singular,
          plural: relationPair.forward.plural,
          comment: relationPair.comment,
        },
      });
      // TODO(freben): This actually doesn't make much sense; the ability to
      // only partially update the pair becomes weird since we don't know what
      // the original type was. Well, the compile step will know, but still.
      if (relationPair.reverse.type) {
        ops.push({
          op: 'updateRelation.v1',
          fromKind: secondKind,
          type: relationPair.reverse.type,
          toKind: firstKind,
          properties: {
            reverseType: relationPair.forward.type,
            singular: relationPair.forward.singular,
            plural: relationPair.forward.plural,
            comment: relationPair.comment,
          },
        });
      }
    }
  }

  return ops;
}
