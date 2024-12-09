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

import { ReactNode } from 'react';
import { V2HorizontalPodAutoscaler } from '@kubernetes/client-node';
import { KubernetesStructuredMetadataTableDrawer } from '../KubernetesDrawer';

/** @public */
export const HorizontalPodAutoscalerDrawer = (props: {
  hpa: V2HorizontalPodAutoscaler;
  expanded?: boolean;
  children?: ReactNode;
}) => {
  const { hpa, expanded, children } = props;

  const specCpuUtil = hpa?.spec?.metrics?.find(
    metric => metric.type === 'Resource' && metric.resource?.name === 'cpu',
  )?.resource?.target.averageUtilization;

  const cpuUtil = hpa?.status?.currentMetrics?.find(
    metric => metric.type === 'Resource' && metric.resource?.name === 'cpu',
  )?.resource?.current.averageUtilization;

  return (
    <KubernetesStructuredMetadataTableDrawer
      kind="HorizontalPodAutoscaler"
      object={hpa}
      expanded={expanded}
      renderObject={(hpaObject: V2HorizontalPodAutoscaler) => {
        return {
          targetCPUUtilizationPercentage: specCpuUtil,
          currentCPUUtilizationPercentage: cpuUtil,
          minReplicas: hpaObject.spec?.minReplicas,
          maxReplicas: hpaObject.spec?.maxReplicas,
          currentReplicas: hpaObject.status?.currentReplicas,
          desiredReplicas: hpaObject.status?.desiredReplicas,
          lastScaleTime: hpa?.status?.lastScaleTime,
        };
      }}
    >
      {children}
    </KubernetesStructuredMetadataTableDrawer>
  );
};
