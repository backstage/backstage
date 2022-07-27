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

import { KubeConfig } from '@kubernetes/client-node';
import { Logger } from 'winston';
import fetch from 'node-fetch';
import https from 'https';

import type { Request } from 'express';

import type { KubernetesRequestAuth } from '@backstage/plugin-kubernetes-common';

import { ClusterDetails, KubernetesClustersSupplier } from '../types/types';
import { KubernetesAuthTranslatorGenerator } from '../kubernetes-auth-translator/KubernetesAuthTranslatorGenerator';

const HEADER_KUBERNETES_CLUSTERS: string = 'X-Kubernetes-Clusters';

const ERROR_BAD_REQUEST: number = 400;
const ERROR_INTERNAL_SERVER: number = 500;

const TRANSLATOR_TYPE_TOKEN: string = 'token';
const TRANSLATOR_TYPE_NOOP: string = 'serviceAccount';

export interface KubernetesProxyServices {
  kcs: KubernetesClustersSupplier;
}

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
  ): Promise<any> {
    const krc = this.getKubernetesRequestedClusters(req);
    const details = await this.getClusterDetails(services.kcs, krc);

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

  protected getKubernetesRequestedClusters(
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
      this.logger.error(
        `error with encoded cluster header: ${JSON.stringify(e)}`,
      );
    }
    return {};
  }

  protected async getClusterDetails(
    clusterSupplier: KubernetesClustersSupplier,
    krc: KubernetesProxyClusters,
  ): Promise<ClusterDetails[]> {
    const clusters = await clusterSupplier.getClusters();

    const clusterNames = Object.keys(krc);

    const clusterDetails = clusters.filter(c => clusterNames.includes(c.name));

    const clusterDetailsAuth = await Promise.all(
      clusterDetails.map(async c => {
        const authMetadata: KubernetesRequestAuth = {
          token: krc[c.name],
        };
        const cAuth = await this.configureAuth(c, authMetadata);
        return cAuth;
      }),
    );

    return clusterDetailsAuth;
  }

  protected getClusterIP(details: ClusterDetails): string {
    const client = this.getKubeConfig(details);
    return client.getCurrentCluster()?.server || '';
  }

  protected async makeRequestToCluster(
    details: ClusterDetails,
    req: Request,
  ): Promise<KubernetesProxyResponse> {
    const serverIP = this.getClusterIP(details);
    if (!serverIP) {
      this.logger.error(
        `could not find server IP for cluster with name ${details.name}`,
      );
      return {
        code: ERROR_INTERNAL_SERVER,
        data: null,
      };
    }

    const query = decodeURIComponent(req.params.encodedQuery) || '';
    const uri = `${serverIP}/${query}`;

    const res = await this.sendClusterRequest(
      details,
      uri,
      req.method,
      req.body,
    );

    return res;
  }

  protected async sendClusterRequest(
    details: ClusterDetails,
    uri: string,
    method: string,
    body?: any,
  ): Promise<KubernetesProxyResponse> {
    const bearerToken = details.serviceAccountToken;
    if (!bearerToken) {
      this.logger.error('could not find bearer token!');
      return {
        code: ERROR_BAD_REQUEST,
        data: {
          error: 'Invalid service account token',
        },
      };
    }

    const ca = details.caData;
    if (!ca) {
      this.logger.error('could not find certificate!');
      return {
        code: ERROR_INTERNAL_SERVER,
        data: {
          error: 'Invalid CA certificate configured within Backstage',
        },
      };
    }

    const agent = new https.Agent({ ca });

    const reqData: any = {
      method,
      agent,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${bearerToken}`,
      },
    };

    if (body && Object.keys(body).length > 0) {
      reqData.body = JSON.stringify(body);
    }

    try {
      const req = await fetch(uri, reqData);

      const res = await req.json();

      const proxyResponse: KubernetesProxyResponse = {
        code: req.status,
        data: res,
        cluster: details.name,
      };

      return proxyResponse;
    } catch (e: any) {
      this.logger.error(`error with request: ${JSON.stringify(e)}`);
      return {
        code: ERROR_INTERNAL_SERVER,
        data: e,
        cluster: details.name,
      };
    }
  }

  protected getKubeConfig(clusterDetails: ClusterDetails): KubeConfig {
    const cluster = {
      name: clusterDetails.name,
      server: clusterDetails.url,
      skipTLSVerify: clusterDetails.skipTLSVerify,
      caData: clusterDetails.caData,
    };

    const user = {
      name: 'backstage',
      token: clusterDetails.serviceAccountToken,
    };

    const context = {
      name: `${clusterDetails.name}`,
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

  protected async configureAuth(
    details: ClusterDetails,
    authMetadata: KubernetesRequestAuth,
  ): Promise<ClusterDetails> {
    const options = {
      logger: this.logger,
    };

    const translatorType = authMetadata.token
      ? TRANSLATOR_TYPE_TOKEN
      : TRANSLATOR_TYPE_NOOP;

    const authTranslator =
      KubernetesAuthTranslatorGenerator.getKubernetesAuthTranslatorInstance(
        translatorType,
        options,
      );
    return authTranslator.decorateClusterDetailsWithAuth(details, authMetadata);
  }

  protected getBestResponseCode(codes: number[]): number {
    const sorted = codes.sort();
    return sorted[0] ?? ERROR_INTERNAL_SERVER;
  }
}
