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
import {
  RELATION_API_CONSUMED_BY,
  RELATION_API_PROVIDED_BY,
  RELATION_CHILD_OF,
  RELATION_CONSUMES_API,
  RELATION_DEPENDENCY_OF,
  RELATION_DEPENDS_ON,
  RELATION_HAS_MEMBER,
  RELATION_HAS_PART,
  RELATION_MEMBER_OF,
  RELATION_OWNED_BY,
  RELATION_OWNER_OF,
  RELATION_PARENT_OF,
  RELATION_PART_OF,
  RELATION_PROVIDES_API,
} from '@backstage/catalog-model';

/**
 * A pair of two relations that describe the opposite of each other. The first
 * relation is considered as the primary relation.
 *
 * @public
 */
export type RelationPairs = [string, string][];

// TODO: This file only contains the pairs for the build-in relations.
//  How to implement this when custom relations are used? Right now you can pass
//  the relations everywhere.
//  Another option is to move this into @backstage/catalog-model

/**
 * A list of pairs of entity relations, used to define which relations are
 * merged together and which the primary relation is.
 *
 * @public
 */
export const ALL_RELATION_PAIRS: RelationPairs = [
  [RELATION_OWNER_OF, RELATION_OWNED_BY],
  [RELATION_CONSUMES_API, RELATION_API_CONSUMED_BY],
  [RELATION_API_PROVIDED_BY, RELATION_PROVIDES_API],
  [RELATION_HAS_PART, RELATION_PART_OF],
  [RELATION_PARENT_OF, RELATION_CHILD_OF],
  [RELATION_HAS_MEMBER, RELATION_MEMBER_OF],
  [RELATION_DEPENDS_ON, RELATION_DEPENDENCY_OF],
];
