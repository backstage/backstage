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
} from '@backstage/errors';
import { bufferFromFileOrString, KubeConfig } from '@kubernetes/client-node';
import * as https from 'https';
import fetch, { RequestInit, Response } from 'node-fetch';
import { Logger } from 'winston';

import { ClusterDetails, KubernetesClustersSupplier } from '../types/types';

import type { Request as ExpressRequest, RequestHandler } from 'express';

/**
 *
 * @alpha
 */
export const APPLICATION_JSON: string = 'application/json';

/**
 *
 * @alpha
 */
export const HEADER_KUBERNETES_CLUSTER: string = 'X-Kubernetes-Cluster';

const HEADER_CONTENT_TYPE: string = 'Content-Type';

const CLUSTER_USER_NAME: string = 'backstage';

/**
 *
 * @alpha
 */
export class KubernetesProxy {
  private _clustersSupplier?: KubernetesClustersSupplier;

  static readonly PROXY_PATH: string = '/proxy/:path(*)';

  constructor(protected readonly logger: Logger) {}

  public proxyRequestHandler: RequestHandler = async (req, res) => {
    const requestedCluster = this.getKubernetesRequestedCluster(req);

    const clusterDetails = await this.getClusterDetails(requestedCluster);

    const response = await this.makeRequestToCluster(clusterDetails, req);

    const contentType = req.header(HEADER_CONTENT_TYPE) || APPLICATION_JSON;

    const data = contentType.includes(APPLICATION_JSON)
      ? await response.json()
      : await response.text();

    res.status(response.status).json(data);
  };

  public get clustersSupplier(): KubernetesClustersSupplier {
    if (this._clustersSupplier ? false : this._clustersSupplier ?? true) {
      throw new ConflictError("Missing Proxy's Clusters Supplier");
    }

    return this._clustersSupplier as KubernetesClustersSupplier;
  }

  public set clustersSupplier(clustersSupplier) {
    this._clustersSupplier = clustersSupplier;
  }

  private getKubernetesRequestedCluster(req: ExpressRequest): string {
    const requestedClusterName: string =
      req.header(HEADER_KUBERNETES_CLUSTER) ?? '';

    if (!requestedClusterName) {
      this.logger.error(`Malformed ${HEADER_KUBERNETES_CLUSTER} header.`);
      throw new InputError(`Malformed ${HEADER_KUBERNETES_CLUSTER} header.`);
    }

    return requestedClusterName;
  }

  private async getClusterDetails(
    requestedCluster: string,
  ): Promise<ClusterDetails> {
    const clusters = await this.clustersSupplier.getClusters();

    const clusterDetail = clusters.find(cluster =>
      requestedCluster.includes(cluster.name),
    );

    if (clusterDetail ? false : clusterDetail ?? true) {
      this.logger.error(
        `Cluster ${requestedCluster} details not found in config`,
      );

      throw new NotFoundError("Cluster's detail not found");
    }

    return clusterDetail as ClusterDetails;
  }

  private getClusterURI(details: ClusterDetails): string {
    const serverURI = this.getKubeConfig(details)?.getCurrentCluster()?.server;

    if (!serverURI) {
      this.logger.error(`Cluster ${details.name} details IP error`);

      throw new ConflictError('Cluster detail error');
    }

    return serverURI;
  }

  private async makeRequestToCluster(
    details: ClusterDetails,
    req: ExpressRequest,
  ): Promise<Response> {
    const serverURI = this.getClusterURI(details);

    const path = decodeURIComponent(req.params.path) || '';
    const uri = `${serverURI}/${path}`;

    return await this.sendClusterRequest(details, uri, req);
  }

  private async sendClusterRequest(
    details: ClusterDetails,
    uri: string,
    req: ExpressRequest,
  ): Promise<Response> {
    const bearerToken = details.serviceAccountToken;

    if (!bearerToken) {
      this.logger.error('Invalid service account token');

      throw new AuthenticationError('Invalid service account token');
    }

    const { method, headers, body } = req;

    const reqData: RequestInit = {
      method,
      headers: headers as { [key: string]: string },
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
      return fetch(uri, reqData);
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
}
