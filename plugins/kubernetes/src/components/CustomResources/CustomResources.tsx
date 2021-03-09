/*
 * Copyright 2020 Spotify AB
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

import React from 'react';
import { GroupedResponses } from '../../types/types';
import lodash, { Dictionary } from 'lodash';
import { RolloutAccordions } from './ArgoRollouts/Rollout';

interface CustomResourcesProps {
  groupedResponses: GroupedResponses;
  clusterPodNamesWithErrors: Set<string>;
  children?: React.ReactNode;
}

const kindToResource = (customResources: any[]): Dictionary<any[]> => {
  return lodash.groupBy(customResources, value => {
    return value.kind;
  });
};

export const CustomResources = ({
  groupedResponses,
  clusterPodNamesWithErrors,
}: CustomResourcesProps) => {
  const kindToResourceMap = kindToResource(groupedResponses.customResources);

  return (
    <>
      {Object.entries(kindToResourceMap).map(([kind, resources], i) => {
        switch (kind) {
          case 'Rollout':
            return (
              <RolloutAccordions
                key={i}
                clusterPodNamesWithErrors={clusterPodNamesWithErrors}
                groupedResponses={groupedResponses}
                rollouts={resources}
              />
            );
          default:
            // TODO default implementation
            return null;
        }
      })}
    </>
  );
};
