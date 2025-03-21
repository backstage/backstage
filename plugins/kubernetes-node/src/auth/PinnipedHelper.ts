/*
 * Copyright 2024 The Backstage Authors
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

import { ClusterDetails } from '@backstage/plugin-kubernetes-node';
import * as https from 'https';
import { bufferFromFileOrString } from '@kubernetes/client-node';
import fetch, { RequestInit } from 'node-fetch';
import { Logger } from 'winston';

/**
 *
 * @public
 */
export type PinnipedClientCerts = {
  key: string;
  cert: string;
  expirationTimestamp: string;
};

/**
 *
 * @public
 */
export type PinnipedParameters = {
  clusterScopedIdToken: string;
  authenticator: {
    apiGroup: string;
    kind: string;
    name: string;
  };
  tokenCredentialRequest?: {
    apiGroup?: string;
  };
};

/**
 *
 * @public
 */
export class PinnipedHelper {
  constructor(private readonly logger: Logger) {}

  public async tokenCredentialRequest(
    clusterDetails: ClusterDetails,
    pinnipedParams: PinnipedParameters,
  ): Promise<PinnipedClientCerts> {
    this.logger.debug('Pinniped: Requesting client Certs to Concierge');
    return await this.exchangeClusterTokentoClientCerts(
      clusterDetails,
      pinnipedParams,
    );
  }

  private async exchangeClusterTokentoClientCerts(
    clusterDetails: ClusterDetails,
    pinnipedParams: PinnipedParameters,
  ): Promise<PinnipedClientCerts> {
    const url: URL = new URL(clusterDetails.url);
    const apiGroup =
      pinnipedParams.tokenCredentialRequest?.apiGroup ??
      'login.concierge.pinniped.dev/v1alpha1';

    url.pathname = `/apis/${apiGroup}/tokencredentialrequests`;

    const requestInit: RequestInit = this.buildRequestForPinniped(
      url,
      clusterDetails,
      pinnipedParams,
    );

    this.logger.info(
      'Fetching client certs for mTLS authentication on Pinniped',
    );
    let response;
    try {
      response = await fetch(url, requestInit);
    } catch (error) {
      this.logger.error('Pinniped request error', error);
      throw error;
    }

    const data: any = await response.json();

    if (data.status.credential) {
      const result = {
        key: data.status.credential.clientKeyData,
        cert: data.status.credential.clientCertificateData,
        expirationTimestamp: data.status.credential.expirationTimestamp,
      };
      return Promise.resolve(result);
    }

    this.logger.error('Unable to fetch client certs,', data.status);
    return Promise.reject(data.status.message);
  }

  private buildRequestForPinniped(
    url: URL,
    clusterDetails: ClusterDetails,
    pinnipedParams: PinnipedParameters,
  ): RequestInit {
    const body = {
      apiVersion:
        pinnipedParams.tokenCredentialRequest?.apiGroup ??
        'login.concierge.pinniped.dev/v1alpha1',
      kind: 'TokenCredentialRequest',
      spec: {
        authenticator: pinnipedParams.authenticator,
        token: pinnipedParams.clusterScopedIdToken,
      },
    };
    const requestInit: RequestInit = {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    };

    if (url.protocol === 'https:') {
      requestInit.agent = new https.Agent({
        ca:
          bufferFromFileOrString(
            clusterDetails.caFile,
            clusterDetails.caData,
          ) ?? undefined,
        rejectUnauthorized: !clusterDetails.skipTLSVerify,
      });
    }

    return requestInit;
  }
}
