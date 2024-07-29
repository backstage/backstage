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
  CatalogProcessor,
  CatalogProcessorEmit,
} from '@backstage/plugin-catalog-node';
import { LocationSpec } from '@backstage/plugin-catalog-common';
import { EKS } from '@aws-sdk/client-eks';
import { AWSCredentialFactory } from '../types';
import { AwsCredentialIdentity, Provider } from '@aws-sdk/types';
import {
  AwsCredentialsManager,
  DefaultAwsCredentialsManager,
} from '@backstage/integration-aws-node';
import { Config } from '@backstage/config';

import type { EksClusterEntityTransformer } from './types';
import { defaultEksClusterEntityTransformer } from '../lib';

/**
 * A processor for automatic discovery of resources from EKS clusters. Handles the
 * `aws-eks` location type, and target accounts/regions of the form
 * `<accountId>/<region>`.
 *
 * @public
 */
export class AwsEKSClusterProcessor implements CatalogProcessor {
  private credentialsFactory?: AWSCredentialFactory;
  private credentialsManager?: AwsCredentialsManager;
  private readonly clusterEntityTransformer: EksClusterEntityTransformer;

  static fromConfig(
    configRoot: Config,
    options?: {
      clusterEntityTransformer?: EksClusterEntityTransformer;
    },
  ): AwsEKSClusterProcessor {
    const awsCredentaislManager =
      DefaultAwsCredentialsManager.fromConfig(configRoot);
    return new AwsEKSClusterProcessor({
      credentialsManager: awsCredentaislManager,
      ...options,
    });
  }

  constructor(options: {
    credentialsFactory?: AWSCredentialFactory;
    credentialsManager?: AwsCredentialsManager;
    clusterEntityTransformer?: EksClusterEntityTransformer;
  }) {
    this.credentialsFactory = options.credentialsFactory;
    this.credentialsManager = options.credentialsManager;

    // If the callback function is not passed in, then default to the one upstream is using
    this.clusterEntityTransformer =
      options.clusterEntityTransformer || defaultEksClusterEntityTransformer;
  }

  getProcessorName(): string {
    return 'aws-eks';
  }

  async readLocation(
    location: LocationSpec,
    _optional: boolean,
    emit: CatalogProcessorEmit,
  ): Promise<boolean> {
    if (location.type !== 'aws-eks') {
      return false;
    }

    // location target is of format "account-id/region"
    const [accountId, region] = location.target.split('/');

    if (!accountId || !region) {
      throw new Error(
        'AWS EKS location specified without account or region information',
      );
    }

    let credentials: AwsCredentialIdentity | undefined;

    if (this.credentialsFactory) {
      credentials = await this.credentialsFactory(accountId);
    }

    let providerFunction: (() => Provider<AwsCredentialIdentity>) | undefined;
    if (this.credentialsManager) {
      const credentialsProvider =
        await this.credentialsManager.getCredentialProvider({ accountId });
      providerFunction = () => credentialsProvider.sdkCredentialProvider;
    }

    const eksClient = new EKS({
      customUserAgent: 'backstage-aws-catalog-eks-cluster-processor',
      credentials,
      credentialDefaultProvider: providerFunction,
      region,
    });
    const clusters = await eksClient.listClusters({});
    if (clusters.clusters === undefined) {
      return true;
    }

    const results = clusters.clusters
      .map(cluster => eksClient.describeCluster({ name: cluster }))
      .map(async describedClusterPromise => {
        const describedCluster = await describedClusterPromise;
        if (describedCluster.cluster) {
          const entity = await this.clusterEntityTransformer(
            describedCluster.cluster,
            accountId,
          );

          emit({
            type: 'entity',
            entity,
            location,
          });
        }
      });
    await Promise.all(results);
    return true;
  }
}
