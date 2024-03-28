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
import { fromTemporaryCredentials } from '@aws-sdk/credential-providers';
import { SignatureV4 } from '@aws-sdk/signature-v4';
import { Sha256 } from '@aws-crypto/sha256-js';
import {
  AwsCredentialsManager,
  DefaultAwsCredentialsManager,
} from '@backstage/integration-aws-node';
import { Config } from '@backstage/config';
import {
  ANNOTATION_KUBERNETES_AWS_ASSUME_ROLE,
  ANNOTATION_KUBERNETES_AWS_CLUSTER_ID,
  ANNOTATION_KUBERNETES_AWS_EXTERNAL_ID,
} from '@backstage/plugin-kubernetes-common';
import {
  AuthMetadata,
  AuthenticationStrategy,
  ClusterDetails,
  KubernetesCredential,
} from '@backstage/plugin-kubernetes-node';

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
export class AwsIamStrategy implements AuthenticationStrategy {
  private readonly credsManager: AwsCredentialsManager;

  constructor(opts: { config: Config }) {
    this.credsManager = DefaultAwsCredentialsManager.fromConfig(opts.config);
  }

  public async getCredential(
    clusterDetails: ClusterDetails,
  ): Promise<KubernetesCredential> {
    return {
      type: 'bearer token',
      token: await this.getBearerToken(
        clusterDetails.authMetadata[ANNOTATION_KUBERNETES_AWS_CLUSTER_ID] ??
          clusterDetails.name,
        clusterDetails.authMetadata[ANNOTATION_KUBERNETES_AWS_ASSUME_ROLE],
        clusterDetails.authMetadata[ANNOTATION_KUBERNETES_AWS_EXTERNAL_ID],
      ),
    };
  }

  public validateCluster(): Error[] {
    return [];
  }

  private async getBearerToken(
    clusterId: string,
    assumeRole?: string,
    externalId?: string,
  ): Promise<string> {
    const region = process.env.AWS_REGION ?? defaultRegion;

    let credentials = (await this.credsManager.getCredentialProvider())
      .sdkCredentialProvider;
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
          'x-k8s-aws-id': clusterId,
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

  public presentAuthMetadata(_authMetadata: AuthMetadata): AuthMetadata {
    return {};
  }
}
