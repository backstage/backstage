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
import { Grid } from '@material-ui/core';
import { V1HorizontalPodAutoscaler } from '@kubernetes/client-node';
import { InfoCard, StructuredMetadataTable } from '@backstage/core';
import { orUnknown } from '../../utils';

type HorizontalPodAutoscalersProps = {
  hpas: V1HorizontalPodAutoscaler[];
  children?: React.ReactNode;
};

export const HorizontalPodAutoscalers = ({
  hpas,
}: HorizontalPodAutoscalersProps) => {
  return (
    <Grid container>
      {hpas.map((hpa, i) => {
        return (
          <Grid item key={i}>
            <InfoCard
              title={hpa.metadata?.name ?? 'un-named service'}
              subheader="Horizontal Pod Autoscaler"
            >
              <div>
                <StructuredMetadataTable
                  metadata={{
                    scalingTarget: orUnknown(hpa.spec?.scaleTargetRef),
                    minReplicas: orUnknown(hpa.spec?.minReplicas),
                    maxReplicas: orUnknown(hpa.spec?.maxReplicas),
                    currentReplicas: orUnknown(hpa.status?.currentReplicas),
                    desiredReplicas: orUnknown(hpa.status?.desiredReplicas),
                    targetCPUUtilizationPercentage: orUnknown(
                      hpa.spec?.targetCPUUtilizationPercentage,
                    ),
                    currentCPUUtilizationPercentage: orUnknown(
                      hpa.status?.currentCPUUtilizationPercentage,
                    ),
                    lastScaleTime: orUnknown(hpa.status?.lastScaleTime),
                  }}
                />
              </div>
            </InfoCard>
          </Grid>
        );
      })}
    </Grid>
  );
};
