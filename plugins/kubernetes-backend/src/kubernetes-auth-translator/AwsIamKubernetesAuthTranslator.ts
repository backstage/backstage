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
import { AWSClusterDetails } from '../types/types';
import { KubernetesAuthTranslator } from './types';
import {
  fromEnv,
  fromTemporaryCredentials,
} from '@aws-sdk/credential-providers';
import { SignatureV4 } from '@aws-sdk/signature-v4';
import { Sha256 } from '@aws-crypto/sha256-js';

/**
 *
 * @public
 */
export type SigningCreds = {
  accessKeyId: string | undefined;
  secretAccessKey: string | undefined;
  sessionToken: string | undefined;
};

const defaultRegion = 'us-east-1';

/**
 *
 * @public
 */
export class AwsIamKubernetesAuthTranslator
  implements KubernetesAuthTranslator
{
  private async getBearerToken(
    clusterName: string,
    assumeRole?: string,
    externalId?: string,
  ): Promise<string> {
    const region = process.env.AWS_REGION ?? defaultRegion;
    let credentials = fromEnv();
    if (assumeRole) {
      credentials = fromTemporaryCredentials({
        masterCredentials: credentials,
        clientConfig: {
          region,
        },
        params: {
          RoleArn: assumeRole,
          ExternalId: externalId,
        },
      });
    }

    const signer = new SignatureV4({
      credentials,
      region,
      service: 'sts',
      sha256: Sha256,
    });

    const request = await signer.presign(
      {
        headers: {
          host: `sts.${region}.amazonaws.com`,
          'x-k8s-aws-id': clusterName,
        },
        hostname: `sts.${region}.amazonaws.com`,
        method: 'GET',
        path: '/',
        protocol: 'https:',
        query: {
          Action: 'GetCallerIdentity',
          Version: '2011-06-15',
        },
      },
      { expiresIn: 0 },
    );

    const query = Object.keys(request?.query ?? {})
      .map(
        q =>
          `${encodeURIComponent(q)}=${encodeURIComponent(
            request.query?.[q] as string,
          )}`,
      )
      .join('&');

    const url = `https://${request.hostname}${request.path}?${query}`;

    return `k8s-aws-v1.${Buffer.from(url).toString('base64url')}`;
  }

  async decorateClusterDetailsWithAuth(
    clusterDetails: AWSClusterDetails,
  ): Promise<AWSClusterDetails> {
    const clusterDetailsWithAuthToken: AWSClusterDetails = Object.assign(
      {},
      clusterDetails,
    );

    clusterDetailsWithAuthToken.serviceAccountToken = await this.getBearerToken(
      clusterDetails.name,
      clusterDetails.assumeRole,
      clusterDetails.externalId,
    );
    return clusterDetailsWithAuthToken;
  }
}
