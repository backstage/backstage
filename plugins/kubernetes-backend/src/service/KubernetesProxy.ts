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

import { KubeConfig, bufferFromFileOrString } from '@kubernetes/client-node';
import { Logger } from 'winston';
import fetch from 'node-fetch';
import * as https from 'https';

import type { Request } from 'express';

import {
  ClusterDetails,
  KubernetesProxyServices,
  KubernetesClustersSupplier,
} from '../types/types';

const HEADER_CONTENT_TYPE: string = 'Content-Type';
const APPLICATION_JSON: string = 'application/json';

const HEADER_KUBERNETES_CLUSTERS: string = 'X-Kubernetes-Clusters';

const ERROR_BAD_REQUEST: number = 400;
const ERROR_NOT_FOUND: number = 404;
const ERROR_INTERNAL_SERVER: number = 500;

const CLUSTER_USER_NAME: string = 'backstage';

export interface KubernetesProxyResponse {
  code: number;
  data: any;
  cluster?: string;
}

interface KubernetesProxyClusters {
  [key: string]: string;
}

export class KubernetesProxy {
  constructor(protected readonly logger: Logger) {}

  public async handleProxyRequest(
    services: KubernetesProxyServices,
    req: Request,
  ): Promise<KubernetesProxyResponse> {
    const krc = this.getKubernetesRequestedClusters(req);

    if (Object.keys(krc).length < 1) {
      return {
        code: ERROR_NOT_FOUND,
        data: 'No clusters found!',
      };
    }

    const details = await this.getClusterDetails(services.kcs, krc);

    if (details.length < 1) {
      return {
        code: ERROR_NOT_FOUND,
        data: 'No clusters found!',
      };
    }

    const responses = await Promise.all(
      details.map(async d => {
        const response = await this.makeRequestToCluster(d, req);
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
        `error with encoded cluster header: ${JSON.stringify(e)}`,
      );
    }
    return {};
  }

  private async getClusterDetails(
    clusterSupplier: KubernetesClustersSupplier,
    krc: KubernetesProxyClusters,
  ): Promise<ClusterDetails[]> {
    const clusters = await clusterSupplier.getClusters();

    const clusterNames = Object.keys(krc);

    const clusterDetails = clusters.filter(c => clusterNames.includes(c.name));

    const clusterDetailsAuth = clusterDetails.map(c => {
      const cAuth: ClusterDetails = Object.assign(c, {
        serviceAccountToken: krc[c.name],
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
    const serverIP = this.getClusterURI(details);
    if (!serverIP) {
      return {
        code: ERROR_INTERNAL_SERVER,
        data: null,
      };
    }

    const query = decodeURIComponent(req.params.encodedQuery) || '';
    const uri = `${serverIP}/${query}`;

    const contentType = req.header(HEADER_CONTENT_TYPE) || APPLICATION_JSON;

    const res = await this.sendClusterRequest(
      details,
      uri,
      req.method,
      contentType,
      req.body,
    );

    return res;
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
      return {
        code: ERROR_BAD_REQUEST,
        data: {
          error: 'Invalid service account token',
        },
      };
    }

    const reqData: any = {
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
        this.logger.info('could not find CA certificate!');
        return {
          code: ERROR_INTERNAL_SERVER,
          data: {
            error: 'Invalid CA certificate configured within Backstage',
          },
        };
      }
    }

    if (body && Object.keys(body).length > 0) {
      reqData.body = JSON.stringify(body);
    }

    try {
      const req = await fetch(uri, reqData);

      let res;
      if (contentType.includes(APPLICATION_JSON)) {
        res = await req.json();
      } else {
        res = await req.text();
      }

      const proxyResponse: KubernetesProxyResponse = {
        code: req.status,
        data: res,
        cluster: details.name,
      };

      return proxyResponse;
    } catch (e: any) {
      return {
        code: ERROR_INTERNAL_SERVER,
        data: e,
        cluster: details.name,
      };
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

    const kc = new KubeConfig();
    if (clusterDetails.serviceAccountToken) {
      kc.loadFromOptions({
        clusters: [cluster],
        users: [user],
        contexts: [context],
        currentContext: context.name,
      });
    } else {
      kc.loadFromDefault();
    }

    return kc;
  }

  private getBestResponseCode(codes: number[]): number {
    const sorted = codes.sort();
    return sorted[0] ?? ERROR_INTERNAL_SERVER;
  }
}
