/*
 * Copyright 2026 The Backstage Authors
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

import type { Cluster } from '@kubernetes/client-node';
import {
  ANNOTATION_KUBERNETES_AUTH_PROVIDER,
  SERVICEACCOUNT_CA_PATH,
  KubernetesErrorTypes,
  KubernetesFetchError,
} from '@backstage/plugin-kubernetes-common';
import fetch, { RequestInit, Response } from 'node-fetch';
import * as https from 'node:https';
import fs from 'fs-extra';
import {
  ClusterDetails,
  KubernetesCredential,
} from '@backstage/plugin-kubernetes-node';
import { LoggerService } from '@backstage/backend-plugin-api';

export const statusCodeToErrorType = (
  statusCode: number,
): KubernetesErrorTypes => {
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

export type ConnectionResult =
  | { ok: true; url: URL; requestInit: RequestInit }
  | { ok: false; reason: 'missing_credentials' };

export class KubernetesConnection {
  private readonly logger: LoggerService;
  private readonly agentCache = new Map<string, https.Agent>();
  private inClusterCache:
    | { url: URL; agent: https.Agent | undefined }
    | undefined;

  constructor({ logger }: { logger: LoggerService }) {
    this.logger = logger;
  }

  buildResourcePath(
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

  async resolveConnection(
    clusterDetails: ClusterDetails,
    credential: KubernetesCredential,
  ): Promise<ConnectionResult> {
    const authProvider =
      clusterDetails.authMetadata[ANNOTATION_KUBERNETES_AUTH_PROVIDER];

    if (this.isServiceAccountAuthentication(authProvider, clusterDetails)) {
      const [url, requestInit] = await this.fetchArgsInCluster(credential);
      return { ok: true, url, requestInit };
    } else if (!this.isCredentialMissing(authProvider, credential)) {
      const [url, requestInit] = await this.fetchArgs(
        clusterDetails,
        credential,
      );
      return { ok: true, url, requestInit };
    }
    return { ok: false, reason: 'missing_credentials' };
  }

  async fetchWithConnection(
    clusterDetails: ClusterDetails,
    credential: KubernetesCredential,
    resourcePath: string,
    labelSelector?: string,
  ): Promise<Response> {
    const result = await this.resolveConnection(clusterDetails, credential);
    if (!result.ok) {
      return Promise.reject(
        new Error(
          `no bearer token or client cert for cluster '${clusterDetails.name}' and not running in Kubernetes`,
        ),
      );
    }

    const { url, requestInit } = result;
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

  async handleUnsuccessfulResponse(
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
}
