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

import type { CoreV1Api, Metrics } from '@kubernetes/client-node';
import {
  FetchResponseWrapper,
  KubernetesFetcher,
  ObjectFetchParams,
  ObjectToFetch,
} from '@backstage/plugin-kubernetes-node';
import {
  FetchResponse,
  KubernetesFetchError,
  PodStatusFetchResponse,
} from '@backstage/plugin-kubernetes-common';
import { Response } from 'node-fetch';
import { JsonObject } from '@backstage/types';
import {
  ClusterDetails,
  KubernetesCredential,
} from '@backstage/plugin-kubernetes-node';
import { LoggerService } from '@backstage/backend-plugin-api';
import { KubernetesConnection } from './KubernetesConnection';

export interface KubernetesClientBasedFetcherOptions {
  logger: LoggerService;
  connection: KubernetesConnection;
}

type FetchResult = FetchResponse | KubernetesFetchError;

const isError = (fr: FetchResult): fr is KubernetesFetchError =>
  fr.hasOwnProperty('errorType');

function fetchResultsToResponseWrapper(
  results: FetchResult[],
): FetchResponseWrapper {
  const errors: KubernetesFetchError[] = [];
  const responses: FetchResponse[] = [];
  for (const result of results) {
    if (isError(result)) {
      errors.push(result);
    } else {
      responses.push(result);
    }
  }
  return { errors, responses };
}

export class KubernetesClientBasedFetcher implements KubernetesFetcher {
  private readonly connection: KubernetesConnection;

  constructor({ connection }: KubernetesClientBasedFetcherOptions) {
    this.connection = connection;
  }

  fetchObjectsForService(
    params: ObjectFetchParams,
  ): Promise<FetchResponseWrapper> {
    const fetchResults = Array.from(params.objectTypesToFetch)
      .concat(params.customResources)
      .map(({ objectType, group, apiVersion, plural }) =>
        this.fetchResource(
          params.clusterDetails,
          params.credential,
          { group, apiVersion, plural },
          params.namespace,
          params.labelSelector,
        ).then(
          (r: Response): Promise<FetchResult> =>
            r.ok
              ? r.json().then(
                  ({ kind, items }): FetchResponse => ({
                    type: objectType,
                    resources: this.transformResources(objectType, kind, items),
                  }),
                )
              : this.connection.handleUnsuccessfulResponse(
                  params.clusterDetails.name,
                  r,
                ),
        ),
      );

    return Promise.all(fetchResults).then(fetchResultsToResponseWrapper);
  }

  async fetchPodMetricsByNamespaces(
    clusterDetails: ClusterDetails,
    credential: KubernetesCredential,
    namespaces: Set<string>,
    labelSelector?: string,
  ): Promise<FetchResponseWrapper> {
    const fetchResults = Array.from(namespaces).map(ns =>
      this.fetchPodMetricsForNamespace(
        clusterDetails,
        credential,
        ns,
        labelSelector,
      ),
    );

    return Promise.all(fetchResults).then(fetchResultsToResponseWrapper);
  }

  private async fetchPodMetricsForNamespace(
    clusterDetails: ClusterDetails,
    credential: KubernetesCredential,
    namespace: string,
    labelSelector?: string,
  ): Promise<FetchResult> {
    const [podMetrics, podList] = await Promise.all([
      this.fetchResource(
        clusterDetails,
        credential,
        { group: 'metrics.k8s.io', apiVersion: 'v1beta1', plural: 'pods' },
        namespace,
        labelSelector,
      ),
      this.fetchResource(
        clusterDetails,
        credential,
        { group: '', apiVersion: 'v1', plural: 'pods' },
        namespace,
        labelSelector,
      ),
    ]);
    if (podMetrics.ok && podList.ok) {
      const { topPods } = await import('@kubernetes/client-node');
      return topPods(
        {
          listPodForAllNamespaces: () => podList.json(),
        } as unknown as CoreV1Api,
        {
          getPodMetrics: () => podMetrics.json(),
        } as unknown as Metrics,
      ).then(
        (resources): PodStatusFetchResponse => ({
          type: 'podstatus',
          resources,
        }),
      );
    } else if (podMetrics.ok) {
      return this.connection.handleUnsuccessfulResponse(
        clusterDetails.name,
        podList,
      );
    }
    return this.connection.handleUnsuccessfulResponse(
      clusterDetails.name,
      podMetrics,
    );
  }

  private async fetchResource(
    clusterDetails: ClusterDetails,
    credential: KubernetesCredential,
    resource: Pick<ObjectToFetch, 'group' | 'apiVersion' | 'plural'>,
    namespace?: string,
    labelSelector?: string,
  ): Promise<Response> {
    const resourcePath = this.connection.buildResourcePath(
      resource.group,
      resource.apiVersion,
      resource.plural,
      namespace,
    );

    return this.connection.fetchWithConnection(
      clusterDetails,
      credential,
      resourcePath,
      labelSelector,
    );
  }

  private transformResources(
    objectType: string,
    kind: string,
    items: JsonObject[],
  ): JsonObject[] {
    if (objectType === 'customresources') {
      return items.map((item: JsonObject) => ({
        ...item,
        kind: kind.replace(/(List)$/, ''),
      }));
    }

    if (objectType === 'secrets') {
      return items.map((item: JsonObject) => {
        if (item.data && typeof item.data === 'object') {
          return {
            ...item,
            data: Object.fromEntries(
              Object.keys(item.data).map(key => [key, '***']),
            ),
          };
        }
        return item;
      });
    }

    return items;
  }
}
