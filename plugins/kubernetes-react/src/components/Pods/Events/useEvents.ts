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
import { useApi } from '@backstage/core-plugin-api';
import useAsync from 'react-use/esm/useAsync';
import { kubernetesProxyApiRef } from '../../../api/types';

/**
 * Arguments for useEvents
 *
 * @public
 */
export interface EventsOptions {
  involvedObjectName: string;
  namespace: string;
  clusterName: string;
}

/**
 * Retrieves the events for the given object
 *
 * @public
 */
export const useEvents = ({
  involvedObjectName,
  namespace,
  clusterName,
}: EventsOptions) => {
  const kubernetesProxyApi = useApi(kubernetesProxyApiRef);
  return useAsync(async () => {
    return await kubernetesProxyApi.getEventsByInvolvedObjectName({
      involvedObjectName,
      namespace,
      clusterName,
    });
  }, [involvedObjectName, namespace, clusterName]);
};
