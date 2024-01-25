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

import {
  Config,
  Cluster,
  CoreV1Api,
  KubeConfig,
  Metrics,
  bufferFromFileOrString,
  topPods,
} from '@kubernetes/client-node';
import lodash, { Dictionary } from 'lodash';
import { Logger } from 'winston';
import {
  FetchResponseWrapper,
  KubernetesFetcher,
  ObjectFetchParams,
} from '../types/types';
import {
  ANNOTATION_KUBERNETES_AUTH_PROVIDER,
  FetchResponse,
  KubernetesFetchError,
  KubernetesErrorTypes,
  PodStatusFetchResponse,
} from '@backstage/plugin-kubernetes-common';
import fetch, { RequestInit, Response } from 'node-fetch';
import * as https from 'https';
import fs from 'fs-extra';
import { JsonObject } from '@backstage/types';
import {
  ClusterDetails,
  KubernetesCredential,
} from '@backstage/plugin-kubernetes-node';

export interface KubernetesClientBasedFetcherOptions {
  logger: Logger;
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

const statusCodeToErrorType = (statusCode: number): KubernetesErrorTypes => {
  switch (statusCode) {
    case 400:
      return 'BAD_REQUEST';
    case 401:
      return 'UNAUTHORIZED_ERROR';
    case 404:
      return 'NOT_FOUND';
    case 500:
      return 'SYSTEM_ERROR';
    default:
      return 'UNKNOWN_ERROR';
  }
};

export class KubernetesClientBasedFetcher implements KubernetesFetcher {
  private readonly logger: Logger;

  constructor({ logger }: KubernetesClientBasedFetcherOptions) {
    this.logger = logger;
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
          group,
          apiVersion,
          plural,
          params.namespace,
          params.labelSelector,
        ).then(
          (r: Response): Promise<FetchResult> =>
            r.ok
              ? r.json().then(
                  ({ kind, items }): FetchResponse => ({
                    type: objectType,
                    resources:
                      objectType === 'customresources'
                        ? items.map((item: JsonObject) => ({
                            ...item,
                            kind: kind.replace(/(List)$/, ''),
                          }))
                        : items,
                  }),
                )
              : this.handleUnsuccessfulResponse(params.clusterDetails.name, r),
        ),
      );

    return Promise.all(fetchResults).then(fetchResultsToResponseWrapper);
  }

  fetchPodMetricsByNamespaces(
    clusterDetails: ClusterDetails,
    credential: KubernetesCredential,
    namespaces: Set<string>,
    labelSelector?: string,
  ): Promise<FetchResponseWrapper> {
    const fetchResults = Array.from(namespaces).map(async ns => {
      const [podMetrics, podList] = await Promise.all([
        this.fetchResource(
          clusterDetails,
          credential,
          'metrics.k8s.io',
          'v1beta1',
          'pods',
          ns,
          labelSelector,
        ),
        this.fetchResource(
          clusterDetails,
          credential,
          '',
          'v1',
          'pods',
          ns,
          labelSelector,
        ),
      ]);
      if (podMetrics.ok && podList.ok) {
        return topPods(
          {
            listPodForAllNamespaces: () =>
              podList.json().then(b => ({ body: b })),
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
        return this.handleUnsuccessfulResponse(clusterDetails.name, podList);
      }
      return this.handleUnsuccessfulResponse(clusterDetails.name, podMetrics);
    });

    return Promise.all(fetchResults).then(fetchResultsToResponseWrapper);
  }

  private async handleUnsuccessfulResponse(
    clusterName: string,
    res: Response,
  ): Promise<KubernetesFetchError> {
    const resourcePath = new URL(res.url).pathname;
    this.logger.warn(
      `Received ${
        res.status
      } status when fetching "${resourcePath}" from cluster "${clusterName}"; body=[${await res.text()}]`,
    );
    return {
      errorType: statusCodeToErrorType(res.status),
      statusCode: res.status,
      resourcePath,
    };
  }

  private fetchResource(
    clusterDetails: ClusterDetails,
    credential: KubernetesCredential,
    group: string,
    apiVersion: string,
    plural: string,
    namespace?: string,
    labelSelector?: string,
  ): Promise<Response> {
    const encode = (s: string) => encodeURIComponent(s);
    let resourcePath = group
      ? `/apis/${encode(group)}/${encode(apiVersion)}`
      : `/api/${encode(apiVersion)}`;
    if (namespace) {
      resourcePath += `/namespaces/${encode(namespace)}`;
    }
    resourcePath += `/${encode(plural)}`;

    let url: URL;
    let requestInit: RequestInit;
    const authProvider =
      clusterDetails.authMetadata[ANNOTATION_KUBERNETES_AUTH_PROVIDER];

    if (this.isServiceAccountAuthentication(authProvider, clusterDetails)) {
      [url, requestInit] = this.fetchArgsInCluster(credential);
    } else if (!this.isCredentialMissing(authProvider, credential)) {
      [url, requestInit] = this.fetchArgs(clusterDetails, credential);
    } else {
      return Promise.reject(
        new Error(
          `no bearer token or client cert for cluster '${clusterDetails.name}' and not running in Kubernetes`,
        ),
      );
    }

    if (url.pathname === '/') {
      url.pathname = resourcePath;
    } else {
      url.pathname += resourcePath;
    }

    if (labelSelector) {
      url.search = `labelSelector=${encode(labelSelector)}`;
    }

    return fetch(url, requestInit);
  }

  private isServiceAccountAuthentication(
    authProvider: string,
    clusterDetails: ClusterDetails,
  ) {
    return (
      authProvider === 'serviceAccount' &&
      !clusterDetails.authMetadata.serviceAccountToken &&
      fs.pathExistsSync(Config.SERVICEACCOUNT_CA_PATH)
    );
  }

  private isCredentialMissing(
    authProvider: string,
    credential: KubernetesCredential,
  ) {
    return (
      authProvider !== 'localKubectlProxy' && credential.type === 'anonymous'
    );
  }

  private fetchArgs(
    clusterDetails: ClusterDetails,
    credential: KubernetesCredential,
  ): [URL, RequestInit] {
    const requestInit: RequestInit = {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        ...(credential.type === 'bearer token' && {
          Authorization: `Bearer ${credential.token}`,
        }),
      },
    };

    const url: URL = new URL(clusterDetails.url);
    if (url.protocol === 'https:') {
      requestInit.agent = new https.Agent({
        ca:
          bufferFromFileOrString(
            clusterDetails.caFile,
            clusterDetails.caData,
          ) ?? undefined,
        rejectUnauthorized: !clusterDetails.skipTLSVerify,
        ...(credential.type === 'x509 client certificate' && {
          cert: credential.cert,
          key: credential.key,
        }),
      });
    }
    return [url, requestInit];
  }
  private fetchArgsInCluster(
    credential: KubernetesCredential,
  ): [URL, RequestInit] {
    const requestInit: RequestInit = {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        ...(credential.type === 'bearer token' && {
          Authorization: `Bearer ${credential.token}`,
        }),
      },
    };

    const kc = new KubeConfig();
    kc.loadFromCluster();
    // loadFromCluster is guaranteed to populate the cluster/user/context
    const cluster = kc.getCurrentCluster() as Cluster;

    const url = new URL(cluster.server);
    if (url.protocol === 'https:') {
      requestInit.agent = new https.Agent({
        ca: fs.readFileSync(cluster.caFile as string),
      });
    }
    return [url, requestInit];
  }
}
