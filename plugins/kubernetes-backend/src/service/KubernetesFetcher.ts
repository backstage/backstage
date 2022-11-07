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

import { topPods } from '@kubernetes/client-node';
import lodash, { Dictionary } from 'lodash';
import {
  ClusterDetails,
  FetchResponseWrapper,
  KubernetesFetcher,
  KubernetesObjectTypes,
  KubernetesRejectionHandler,
  ObjectFetchParams,
  ObjectToFetch,
} from '../types/types';
import {
  FetchResponse,
  KubernetesFetchError,
  PodStatusFetchResponse,
} from '@backstage/plugin-kubernetes-common';
import { KubernetesClientProvider } from './KubernetesClientProvider';

export interface KubernetesClientBasedFetcherOptions {
  kubernetesClientProvider: KubernetesClientProvider;
  rejectionHandler: KubernetesRejectionHandler;
}

type FetchResult = FetchResponse | KubernetesFetchError;

const isError = (fr: FetchResult): fr is KubernetesFetchError =>
  fr.hasOwnProperty('errorType');

function fetchResultsToResponseWrapper(
  results: FetchResult[],
): FetchResponseWrapper {
  const groupBy: Dictionary<FetchResult[]> = lodash.groupBy(results, value => {
    return isError(value) ? 'errors' : 'responses';
  });

  return {
    errors: groupBy.errors ?? [],
    responses: groupBy.responses ?? [],
  } as FetchResponseWrapper; // TODO would be nice to get rid of this 'as'
}

export class KubernetesClientBasedFetcher implements KubernetesFetcher {
  private readonly kubernetesClientProvider: KubernetesClientProvider;
  private readonly rejectionHandler: KubernetesRejectionHandler;

  constructor({
    kubernetesClientProvider,
    rejectionHandler,
  }: KubernetesClientBasedFetcherOptions) {
    this.kubernetesClientProvider = kubernetesClientProvider;
    this.rejectionHandler = rejectionHandler;
  }

  fetchObjectsForService(
    params: ObjectFetchParams,
  ): Promise<FetchResponseWrapper> {
    const fetchResults = Array.from(params.objectTypesToFetch)
      .concat(params.customResources)
      .map(toFetch => {
        return this.fetchResource(
          params.clusterDetails,
          toFetch,
          params.labelSelector ||
            `backstage.io/kubernetes-id=${params.serviceId}`,
          toFetch.objectType,
          params.namespace,
        );
      });

    return Promise.all(fetchResults).then(fetchResultsToResponseWrapper);
  }

  fetchPodMetricsByNamespaces(
    clusterDetails: ClusterDetails,
    namespaces: Set<string>,
  ): Promise<FetchResponseWrapper> {
    const metricsClient =
      this.kubernetesClientProvider.getMetricsClient(clusterDetails);
    const coreApi =
      this.kubernetesClientProvider.getCoreClientByClusterDetails(
        clusterDetails,
      );

    const fetchResults = Array.from(namespaces).map(ns =>
      topPods(coreApi, metricsClient, ns)
        .then(r => {
          return {
            type: 'podstatus',
            resources: r,
          } as PodStatusFetchResponse;
        })
        .catch(reason =>
          this.rejectionHandler.onRejected(
            reason,
            // NOTE this is isn't completely honest -- technically topPods makes
            // two calls, one for core/v1 pods and another for this kind --
            // but if there are HTTP errors when fetching pods they'll actually
            // have already occurred when calling fetchObjectsForService.
            `/apis/metrics.k8s.io/v1beta1/namespaces/${ns}/pods`,
          ),
        ),
    );

    return Promise.all(fetchResults).then(fetchResultsToResponseWrapper);
  }

  private fetchResource(
    clusterDetails: ClusterDetails,
    resource: ObjectToFetch,
    labelSelector: string,
    objectType: KubernetesObjectTypes,
    namespace?: string,
  ): Promise<FetchResult> {
    const customObjects =
      this.kubernetesClientProvider.getCustomObjectsClient(clusterDetails);

    const fixCoreResourcePath = (path: string) =>
      path.replace('/apis//v1/', '/api/v1/');

    customObjects.addInterceptor((requestOptions: any) => {
      requestOptions.uri = fixCoreResourcePath(requestOptions.uri);
    });

    const { group, apiVersion, plural } = resource;
    const encode = (s: string) => encodeURIComponent(String(s));
    let resourcePath = `/apis/${encode(group)}/${encode(apiVersion)}`;
    if (namespace) {
      resourcePath += `/namespaces/${encode(namespace)}`;
    }
    resourcePath = fixCoreResourcePath(`${resourcePath}/${encode(plural)}`);

    return (
      namespace
        ? customObjects.listNamespacedCustomObject(
            group,
            apiVersion,
            namespace,
            plural,
            '',
            false,
            '',
            '',
            labelSelector,
          )
        : customObjects.listClusterCustomObject(
            group,
            apiVersion,
            plural,
            '',
            false,
            '',
            '',
            labelSelector,
          )
    )
      .then(r => {
        return {
          type: objectType,
          resources: (r.body as any).items,
        };
      })
      .catch(reason =>
        this.rejectionHandler
          .onRejected(reason, resourcePath)
          .then(kubernetesFetchError => ({
            ...kubernetesFetchError,
            resourcePath,
          })),
      );
  }
}
