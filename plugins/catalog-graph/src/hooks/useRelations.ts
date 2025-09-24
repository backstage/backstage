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

import { useCallback, useMemo } from 'react';

import { useApi } from '@backstage/core-plugin-api';

import { catalogGraphApiRef } from '../api';
import { RelationPairs } from '../lib/types';

export interface UseRelationsOptions {
  relations?: string[];
  relationPairs?: RelationPairs;
}

export interface UseRelationsResult {
  relations: string[];
  relationPairs: RelationPairs;
  defaultRelations: string[];
  relationsToInclude: string[];
  includeRelation: (type: string) => boolean;
}

/**
 * Given an optional list of specific relations and/or relation pairs,
 * this hook returns the relations, relation pairs and default relations (to
 * show/select), falling back to the configured setting.
 * It also returns a function `includeRelation` to filter whether a relation
 * should be included or not.
 */
export function useRelations(
  opts: UseRelationsOptions = {},
): UseRelationsResult {
  const { knownRelations, knownRelationPairs, defaultRelations } =
    useApi(catalogGraphApiRef);

  const relations = opts.relations ?? knownRelations;
  const relationPairs = opts.relationPairs ?? knownRelationPairs;
  const relationsToInclude = opts.relations ?? defaultRelations;

  const includeRelation = useCallback(
    (type: string) => {
      return relationsToInclude.includes(type);
    },
    [relationsToInclude],
  );

  return useMemo(
    () => ({
      relations,
      relationPairs,
      defaultRelations,
      relationsToInclude,
      includeRelation,
    }),
    [
      relations,
      relationPairs,
      defaultRelations,
      relationsToInclude,
      includeRelation,
    ],
  );
}
