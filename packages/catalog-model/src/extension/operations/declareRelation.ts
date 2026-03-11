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

/**
 * Make a declaration about the properties of a certain relation type between a
 * given pair of kinds.
 */
export interface OpDeclareRelationV1 {
  op: 'declareRelation.v1';

  /**
   * The kind that this relation originates from, e.g. "Component".
   */
  fromKind: string;
  /**
   * The technical type of the relation, e.g. "ownedBy".
   */
  type: string;
  /**
   * The kind that this relation points to, e.g. "Group".
   */
  toKind: string;

  properties: {
    /**
     * The technical type of the reverse relation, e.g. "ownerOf".
     */
    reverseType: string;
    /**
     * The singular human readable form of the relation name, e.g. "owner".
     */
    singular: string;
    /**
     * The plural human readable form of the relation name, e.g. "owners".
     */
    plural: string;
    /**
     * A human-readable comment describing the relation.
     */
    comment: string;
  };
}
