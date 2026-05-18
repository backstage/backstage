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

import type { Cluster, CoreV1Api, Metrics } from '@kubernetes/client-node';
import {
  FetchResponseWrapper,
  KubernetesFetcher,
  ObjectFetchParams,
  ObjectToFetch,
} from '@backstage/plugin-kubernetes-node';
// @ts-ignore - split2 doesn't have types
import split2 from 'split2';
import {
  ANNOTATION_KUBERNETES_AUTH_PROVIDER,
  SERVICEACCOUNT_CA_PATH,
  FetchResponse,
  KubernetesErrorTypes,
  KubernetesFetchError,
  PodStatusFetchResponse,
  KubernetesWatchEvent,
  KubernetesWatchOptions,
} from '@backstage/plugin-kubernetes-common';
import fetch, { RequestInit, Response } from 'node-fetch';
import * as https from 'node:https';
import fs from 'fs-extra';
import { JsonObject } from '@backstage/types';
import {
  ClusterDetails,
  KubernetesCredential,
} from '@backstage/plugin-kubernetes-node';
import { LoggerService } from '@backstage/backend-plugin-api';

export interface KubernetesClientBasedFetcherOptions {
  logger: LoggerService;
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
  private readonly logger: LoggerService;
  private readonly agentCache = new Map<string, https.Agent>();
  private inClusterCache:
    | { url: URL; agent: https.Agent | undefined }
    | undefined;

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
              : this.handleUnsuccessfulResponse(params.clusterDetails.name, r),
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
      return this.handleUnsuccessfulResponse(clusterDetails.name, podList);
    }
    return this.handleUnsuccessfulResponse(clusterDetails.name, podMetrics);
  }

  /**
   * {@inheritDoc @backstage/plugin-kubernetes-node#KubernetesFetcher.watchResource}
   *
   * Note: `async *` declares an async generator — a function that can both
   * `await` promises and `yield` values incrementally. This is what enables
   * `for await (const event of fetcher.watchResource(...))` consumption.
   */
  async *watchResource(
    clusterDetails: ClusterDetails,
    credential: KubernetesCredential,
    group: string,
    apiVersion: string,
    plural: string,
    options?: KubernetesWatchOptions,
  ): AsyncGenerator<KubernetesWatchEvent, void, undefined> {
    const {
      namespace,
      labelSelector,
      resourceVersion,
      timeoutSeconds,
      allowWatchBookmarks,
      sendInitialEvents,
      resourceVersionMatch,
    } = options || {};

    // Build resource path
    const encode = (s: string) => encodeURIComponent(s);
    let resourcePath = group
      ? `/apis/${encode(group)}/${encode(apiVersion)}`
      : `/api/${encode(apiVersion)}`;
    if (namespace) {
      resourcePath += `/namespaces/${encode(namespace)}`;
    }
    resourcePath += `/${encode(plural)}`;

    // Get auth setup
    let url: URL;
    let requestInit: RequestInit;
    const authProvider =
      clusterDetails.authMetadata[ANNOTATION_KUBERNETES_AUTH_PROVIDER];

    if (this.isServiceAccountAuthentication(authProvider, clusterDetails)) {
      [url, requestInit] = await this.fetchArgsInCluster(credential);
    } else if (!this.isCredentialMissing(authProvider, credential)) {
      [url, requestInit] = await this.fetchArgs(clusterDetails, credential);
    } else {
      yield {
        type: 'ERROR',
        error: {
          errorType: 'UNAUTHORIZED_ERROR',
          statusCode: 401,
          resourcePath,
        },
      };
      return;
    }

    // Set path and query params
    if (url.pathname === '/') {
      url.pathname = resourcePath;
    } else {
      url.pathname += resourcePath;
    }

    const queryParams: Record<string, string> = { watch: 'true' };
    if (labelSelector) queryParams.labelSelector = labelSelector;
    if (resourceVersion) queryParams.resourceVersion = resourceVersion;
    if (timeoutSeconds) queryParams.timeoutSeconds = timeoutSeconds.toString();
    if (allowWatchBookmarks) queryParams.allowWatchBookmarks = 'true';
    if (sendInitialEvents) queryParams.sendInitialEvents = 'true';
    if (resourceVersionMatch)
      queryParams.resourceVersionMatch = resourceVersionMatch;

    url.search = new URLSearchParams(queryParams).toString();

    // Make request
    let response;
    try {
      response = await fetch(url, requestInit);
    } catch (err) {
      this.logger.warn(
        `Network error watching "${resourcePath}" from cluster "${clusterDetails.name}": ${err}`,
      );
      yield {
        type: 'ERROR',
        error: {
          errorType: 'SYSTEM_ERROR',
          statusCode: 0,
          resourcePath,
        },
      };
      return;
    }

    if (!response.ok) {
      yield {
        type: 'ERROR',
        error: await this.handleUnsuccessfulResponse(
          clusterDetails.name,
          response,
        ),
      };
      return;
    }

    // Stream events
    if (!response.body) {
      yield {
        type: 'ERROR',
        error: {
          errorType: 'SYSTEM_ERROR',
          statusCode: response.status,
          resourcePath,
        },
      };
      return;
    }
    const stream = response.body.pipe(split2());

    try {
      for await (const line of stream) {
        if (!line) continue;

        let data;
        try {
          data = JSON.parse(line);
        } catch (err) {
          this.logger.warn(`Failed to parse watch event: ${err}`);
          continue;
        }

        yield this.transformWatchEvent(data, resourcePath);
      }
    } finally {
      if (response.body && 'destroy' in response.body) {
        (response.body as any).destroy();
      }
    }
  }

  private transformWatchEvent(
    data: any,
    resourcePath: string,
  ): KubernetesWatchEvent {
    if (data.type === 'ERROR') {
      return {
        type: 'ERROR',
        error: {
          errorType: statusCodeToErrorType(data.object?.code || 500),
          statusCode: data.object?.code || 500,
          resourcePath,
        },
      };
    }

    return {
      type: data.type,
      object: data.object,
      resourceVersion: data.object?.metadata?.resourceVersion,
    };
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

  private buildResourcePath(
    group: string,
    apiVersion: string,
    plural: string,
    namespace?: string,
  ): string {
    const encode = (s: string) => encodeURIComponent(s);
    let path = group
      ? `/apis/${encode(group)}/${encode(apiVersion)}`
      : `/api/${encode(apiVersion)}`;
    if (namespace) {
      path += `/namespaces/${encode(namespace)}`;
    }
    path += `/${encode(plural)}`;
    return path;
  }

  private async fetchResource(
    clusterDetails: ClusterDetails,
    credential: KubernetesCredential,
    resource: Pick<ObjectToFetch, 'group' | 'apiVersion' | 'plural'>,
    namespace?: string,
    labelSelector?: string,
  ): Promise<Response> {
    const resourcePath = this.buildResourcePath(
      resource.group,
      resource.apiVersion,
      resource.plural,
      namespace,
    );

    let url: URL;
    let requestInit: RequestInit;
    const authProvider =
      clusterDetails.authMetadata[ANNOTATION_KUBERNETES_AUTH_PROVIDER];

    if (this.isServiceAccountAuthentication(authProvider, clusterDetails)) {
      [url, requestInit] = await this.fetchArgsInCluster(credential);
    } else if (!this.isCredentialMissing(authProvider, credential)) {
      [url, requestInit] = await this.fetchArgs(clusterDetails, credential);
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
      url.search = `labelSelector=${encodeURIComponent(labelSelector)}`;
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
      fs.pathExistsSync(SERVICEACCOUNT_CA_PATH)
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

  private buildRequestHeaders(
    credential: KubernetesCredential,
  ): Record<string, string> {
    return {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      ...(credential.type === 'bearer token' && {
        Authorization: `Bearer ${credential.token}`,
      }),
    };
  }

  private async fetchArgs(
    clusterDetails: ClusterDetails,
    credential: KubernetesCredential,
  ): Promise<[URL, fetch.RequestInit]> {
    const { bufferFromFileOrString } = await import('@kubernetes/client-node');
    const requestInit: RequestInit = {
      method: 'GET',
      headers: this.buildRequestHeaders(credential),
    };

    const url: URL = new URL(clusterDetails.url);
    if (url.protocol === 'https:') {
      const ca =
        bufferFromFileOrString(clusterDetails.caFile, clusterDetails.caData) ??
        undefined;
      requestInit.agent = this.getOrCreateAgent(clusterDetails, credential, ca);
    }
    return [url, requestInit];
  }

  private async fetchArgsInCluster(
    credential: KubernetesCredential,
  ): Promise<[URL, fetch.RequestInit]> {
    if (!this.inClusterCache) {
      const { KubeConfig } = await import('@kubernetes/client-node');
      const kc = new KubeConfig();
      kc.loadFromCluster();
      const cluster = kc.getCurrentCluster() as Cluster;
      const url = new URL(cluster.server);
      const agent =
        url.protocol === 'https:'
          ? new https.Agent({
              ca: fs.readFileSync(cluster.caFile as string),
              keepAlive: true,
            })
          : undefined;
      this.inClusterCache = { url, agent };
    }

    const { url, agent } = this.inClusterCache;
    const requestInit: RequestInit = {
      method: 'GET',
      headers: this.buildRequestHeaders(credential),
      ...(agent && { agent }),
    };
    return [new URL(url.toString()), requestInit];
  }

  private buildAgentCacheKey(
    clusterDetails: ClusterDetails,
    credential: KubernetesCredential,
  ): string {
    const certPart =
      credential.type === 'x509 client certificate'
        ? `${credential.cert}|${credential.key}`
        : '';
    return `${clusterDetails.url}|${clusterDetails.skipTLSVerify ?? false}|${
      clusterDetails.caData ?? ''
    }|${clusterDetails.caFile ?? ''}|${certPart}`;
  }

  private getOrCreateAgent(
    clusterDetails: ClusterDetails,
    credential: KubernetesCredential,
    ca: Buffer | string | undefined,
  ): https.Agent {
    const key = this.buildAgentCacheKey(clusterDetails, credential);

    let agent = this.agentCache.get(key);
    if (!agent) {
      agent = new https.Agent({
        ca,
        rejectUnauthorized: !clusterDetails.skipTLSVerify,
        keepAlive: true,
        ...(credential.type === 'x509 client certificate' && {
          cert: credential.cert,
          key: credential.key,
        }),
      });
      this.agentCache.set(key, agent);
    }
    return agent;
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
