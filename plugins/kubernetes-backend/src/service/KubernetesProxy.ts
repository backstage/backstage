/*
 * Copyright 2022 The Backstage Authors
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
  AuthenticationError,
  ConflictError,
  ForwardedError,
  InputError,
  NotFoundError,
  stringifyError,
} from '@backstage/errors';
import { bufferFromFileOrString, KubeConfig } from '@kubernetes/client-node';
import * as https from 'https';
import fetch, { RequestInit } from 'node-fetch';
import { Logger } from 'winston';

import { ClusterDetails, KubernetesClustersSupplier } from '../types/types';

import type { Request } from 'express';

const HEADER_CONTENT_TYPE: string = 'Content-Type';
const APPLICATION_JSON: string = 'application/json';

const HEADER_KUBERNETES_CLUSTERS: string = 'X-Kubernetes-Clusters';

const ERROR_INTERNAL_SERVER: number = 500;

const CLUSTER_USER_NAME: string = 'backstage';

/**
 *
 * @alpha
 */
export interface KubernetesProxyResponse {
  code: number;
  data: any;
  cluster?: string;
}

/**
 *
 * @alpha
 */
interface KubernetesProxyClusters {
  [key: string]: string;
}

/**
 *
 * @alpha
 */
export class KubernetesProxy {
  constructor(protected readonly logger: Logger) {}

  public async handleProxyRequest(
    req: Request,
    clusterSupplier: KubernetesClustersSupplier,
  ): Promise<KubernetesProxyResponse> {
    const requestedClusters = this.getKubernetesRequestedClusters(req);

    if (Object.keys(requestedClusters).length < 1) {
      this.logger.error(`No clusters found`);
      throw new NotFoundError('No clusters found!');
    }

    const clusterDetails = await this.getClusterDetails(
      clusterSupplier,
      requestedClusters,
    );

    if (clusterDetails.length < 1) {
      this.logger.error(`No clusters found`);
      throw new NotFoundError('No clusters found!');
    }

    const responses = await Promise.all(
      clusterDetails.map(async clusterDetail => {
        const response = await this.makeRequestToCluster(clusterDetail, req);
        return response;
      }),
    );

    const data: { [key: string]: any } = {};
    const codes: number[] = [];

    responses.forEach(kpr => {
      if (kpr.cluster) {
        data[kpr.cluster] = kpr.data;
        codes.push(kpr.code);
      }
    });

    const code = this.getBestResponseCode(codes);

    const res: KubernetesProxyResponse = {
      code,
      data,
    };

    return res;
  }

  private getKubernetesRequestedClusters(
    req: Request,
  ): KubernetesProxyClusters {
    const encodedClusters: string =
      req.header(HEADER_KUBERNETES_CLUSTERS) ?? '';

    if (!encodedClusters) {
      return {};
    }

    try {
      const decodedClusters = Buffer.from(encodedClusters, 'base64').toString();
      const clusters: KubernetesProxyClusters = JSON.parse(decodedClusters);
      return clusters;
    } catch (e: any) {
      this.logger.debug(
        `error with encoded cluster header: ${stringifyError(e)}`,
      );
    }
    return {};
  }

  private async getClusterDetails(
    clusterSupplier: KubernetesClustersSupplier,
    requestedClusters: KubernetesProxyClusters,
  ): Promise<ClusterDetails[]> {
    const clusters = await clusterSupplier.getClusters();

    const clusterNames = Object.keys(requestedClusters);

    const clusterDetails = clusters.filter(c => clusterNames.includes(c.name));

    const clusterDetailsAuth = clusterDetails.map(c => {
      const cAuth: ClusterDetails = Object.assign(c, {
        serviceAccountToken: requestedClusters[c.name],
      });
      return cAuth;
    });

    return clusterDetailsAuth;
  }

  private getClusterURI(details: ClusterDetails): string {
    const client = this.getKubeConfig(details);
    return client.getCurrentCluster()?.server || '';
  }

  private async makeRequestToCluster(
    details: ClusterDetails,
    req: Request,
  ): Promise<KubernetesProxyResponse> {
    const serverURI = this.getClusterURI(details);

    if (!serverURI) {
      this.logger.error(`Cluster ${details.name} details IP error`);

      throw new ConflictError('Cluster detail error');
    }

    const query = decodeURIComponent(req.params.encodedQuery) || '';
    const uri = `${serverURI}/${query}`;

    const contentType = req.header(HEADER_CONTENT_TYPE) || APPLICATION_JSON;

    return await this.sendClusterRequest(
      details,
      uri,
      req.method,
      contentType,
      req.body,
    );
  }

  private async sendClusterRequest(
    details: ClusterDetails,
    uri: string,
    method: string,
    contentType: string,
    body?: any,
  ): Promise<KubernetesProxyResponse> {
    const bearerToken = details.serviceAccountToken;

    if (!bearerToken) {
      this.logger.error('Invalid service account token');

      throw new AuthenticationError('Invalid service account token');
    }

    const reqData: RequestInit = {
      method,
      headers: {
        'Content-Type': contentType,
        Authorization: `Bearer ${bearerToken}`,
      },
    };

    if (!details.skipTLSVerify) {
      if (details.caData) {
        const ca = bufferFromFileOrString('', details.caData)?.toString() || '';
        reqData.agent = new https.Agent({ ca });
      } else {
        this.logger.error('could not find CA certificate!');
        throw new InputError(
          'Invalid CA certificate configured within Backstage',
        );
      }
    }

    if (body && Object.keys(body).length > 0) {
      reqData.body = JSON.stringify(body);
    }

    try {
      const res = await fetch(uri, reqData);

      let data: string | any;

      if (contentType.includes(APPLICATION_JSON)) {
        data = await res.json();
      } else {
        data = await res.text();
      }

      const proxyResponse: KubernetesProxyResponse = {
        code: res.status,
        data,
        cluster: details.name,
      };

      return proxyResponse;
    } catch (e: any) {
      throw new ForwardedError(`Cluster ${details.name} request error`, e);
    }
  }

  private getKubeConfig(clusterDetails: ClusterDetails): KubeConfig {
    const cluster = {
      name: clusterDetails.name,
      server: clusterDetails.url,
      skipTLSVerify: clusterDetails.skipTLSVerify,
      caData: clusterDetails.caData,
    };

    const user = {
      name: CLUSTER_USER_NAME,
      token: clusterDetails.serviceAccountToken,
    };

    const context = {
      name: clusterDetails.name,
      user: user.name,
      cluster: cluster.name,
    };

    const kubeConfig = new KubeConfig();

    if (clusterDetails.serviceAccountToken) {
      kubeConfig.loadFromOptions({
        clusters: [cluster],
        users: [user],
        contexts: [context],
        currentContext: context.name,
      });
    } else {
      kubeConfig.loadFromDefault();
    }

    return kubeConfig;
  }

  private getBestResponseCode(codes: number[]): number {
    const sorted = codes.sort();
    return sorted[0] ?? ERROR_INTERNAL_SERVER;
  }
}
