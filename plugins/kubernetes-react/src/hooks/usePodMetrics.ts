/*
 * Copyright 2023 The Backstage Authors
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
import React, { useContext } from 'react';
import { IObjectMeta } from '@kubernetes-models/apimachinery/apis/meta/v1/ObjectMeta';
import { ClientPodStatus } from '@backstage/plugin-kubernetes-common';

/**
 * Context for Pod Metrics
 *
 * @public
 */
export const PodMetricsContext = React.createContext<
  Map<string, ClientPodStatus[]>
>(new Map());

/**
 * @public
 */
export type PodMetricsMatcher = {
  metadata?: IObjectMeta;
};

/**
 * Find metrics matching the provided pod
 *
 * @public
 */
export const usePodMetrics = (
  clusterName: string,
  matcher: PodMetricsMatcher,
): ClientPodStatus | undefined => {
  const targetRef = {
    name: matcher.metadata?.name ?? '',
    namespace: matcher.metadata?.namespace ?? '',
  };

  const metricsMap = useContext(PodMetricsContext);

  const metrics = metricsMap.get(clusterName);

  return metrics?.find(m => {
    const pod = m.pod;
    return (
      targetRef.name === (pod.metadata?.name ?? '') &&
      targetRef.namespace === (pod.metadata?.namespace ?? '')
    );
  });
};
