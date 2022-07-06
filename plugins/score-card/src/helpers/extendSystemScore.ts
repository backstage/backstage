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
import {
  Entity,
  getCompoundEntityRef,
  parseEntityRef,
  RELATION_OWNED_BY,
} from '@backstage/catalog-model';
import { SystemScore } from '../types/SystemScore';
import { SystemScoreExtended } from '../types/SystemScoreExtended';

export const extendSystemScore = (
  score: SystemScore,
  systems: Entity[] | undefined,
): SystemScoreExtended => {
  if (score === null) {
    throw new Error(`can not extend null system score.`);
  }
  if (typeof score === 'undefined') {
    throw new Error(`can not extend undefined system score.`);
  }
  const catalogEntity = systems
    ? systems.find(system => system.metadata.name === score.systemEntityName)
    : undefined;
  const owner = catalogEntity?.relations?.find(
    r => r.type === RELATION_OWNED_BY,
  )?.targetRef;
  const reviewer = score.scoringReviewer
    ? { name: score.scoringReviewer, kind: 'User', namespace: 'default' }
    : undefined;
  const reviewDate = score.scoringReviewDate
    ? new Date(score.scoringReviewDate)
    : undefined;
  return {
    catalogEntity: catalogEntity,
    catalogEntityName: catalogEntity
      ? getCompoundEntityRef(catalogEntity)
      : undefined,
    owner: owner ? parseEntityRef(owner) : undefined,
    reviewer: reviewer,
    reviewDate: reviewDate,
    ...score,
  };
};
