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
import { CompoundEntityRef, Entity } from '@backstage/catalog-model';

export interface SystemScore {
  systemEntityName: string;
  generatedDateTimeUtc: Date | string;
  scorePercent: number;
  scoreSuccess: ScoreSuccessEnum;
  scoringReviewer: string | undefined | null;
  scoringReviewDate: Date | string | undefined | null;
  areaScores: SystemScoreArea[];
}

export interface SystemScoreArea {
  id: number;
  title: string;
  scorePercent: number;
  scoreSuccess: ScoreSuccessEnum;
  scoreEntries: SystemScoreEntry[];
}

export interface SystemScoreEntry {
  id: number;
  title: string;
  isOptional: boolean;
  scorePercent: number;
  scoreSuccess: ScoreSuccessEnum;
  scoreHints: string | string[];
  details: string;
}

export enum ScoreSuccessEnum {
  Success = 'success',
  AlmostSuccess = 'almost-success',
  Partial = 'partial',
  AlmostFailure = 'almost-failure',
  Failure = 'failure',
}

// TODO: decide what with this interface. It makes the API to be tight coupled with catalog API (the component is coupled anyway). Shall this be internal implementation?
export interface SystemScoreExtended extends SystemScore {
  catalogEntity: Entity | undefined;
  catalogEntityName: CompoundEntityRef | undefined;
  owner: CompoundEntityRef | undefined;
  reviewer: CompoundEntityRef | undefined;
  reviewDate: Date | undefined;
}
