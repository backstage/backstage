/*
 * Copyright 2020 The Backstage Authors
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

import { HorizontalPodAutoscaler } from 'kubernetes-models/autoscaling/v1';
import { DetectedError, ErrorMapper } from './types';
import { detectErrorsInObjects } from './common';

const hpaErrorMappers: ErrorMapper<HorizontalPodAutoscaler>[] = [
  {
    detectErrors: hpa => {
      if ((hpa.spec?.maxReplicas ?? -1) === hpa.status?.currentReplicas) {
        return [
          {
            type: 'hpa-max-current-replicas',
            message: `Current number of replicas (${
              hpa.status?.currentReplicas
            }) is equal to the configured max number of replicas (${
              hpa.spec?.maxReplicas ?? -1
            })`,
            severity: 8,
            sourceRef: {
              name: hpa.metadata?.name ?? 'unknown hpa',
              namespace: hpa.metadata?.namespace ?? 'unknown namespace',
              kind: 'HorizontalPodAutoscaler',
              apiGroup: 'autoscaling/v1',
            },
            occuranceCount: 1,
          },
        ];
      }
      return [];
    },
  },
];

export const detectErrorsInHpa = (
  hpas: HorizontalPodAutoscaler[],
): DetectedError[] => detectErrorsInObjects(hpas, hpaErrorMappers);
