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
import { createUpdateRelationOp } from '../operations/updateRelation';

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
   * A human-readable description of the relation. Specify this if you want
   * to override the default value.
   */
  description?: string;

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
     * A human-readable title for the relation type, e.g. "owned by".
     * Specify this if you want to override the default value.
     */
    title?: string;
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
     * A human-readable title for the relation type, e.g. "owner of".
     * Specify this if you want to override the default value.
     */
    title?: string;
  };
}

export function opsFromCatalogModelUpdateRelationPair(
  relationPair: CatalogModelUpdateRelationPairDefinition,
): CatalogModelOp[] {
  const ops: CatalogModelOp[] = [];

  // Duplicate across kinds, and both directions
  for (const firstKind of [relationPair.fromKind].flat()) {
    for (const secondKind of [relationPair.toKind].flat()) {
      ops.push(
        createUpdateRelationOp({
          fromKind: firstKind,
          type: relationPair.forward.type,
          toKind: secondKind,
          properties: {
            reverseType: relationPair.reverse.type,
            title: relationPair.forward.title,
            description: relationPair.description,
          },
        }),
      );
      if (relationPair.reverse.type) {
        ops.push(
          createUpdateRelationOp({
            fromKind: secondKind,
            type: relationPair.reverse.type,
            toKind: firstKind,
            properties: {
              reverseType: relationPair.forward.type,
              title: relationPair.reverse.title,
              description: relationPair.description,
            },
          }),
        );
      }
    }
  }

  return ops;
}
