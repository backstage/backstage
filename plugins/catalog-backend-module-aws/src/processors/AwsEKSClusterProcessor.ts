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
  LocationSpec,
} from '@backstage/plugin-catalog-backend';
import {
  ANNOTATION_KUBERNETES_API_SERVER,
  ANNOTATION_KUBERNETES_API_SERVER_CA,
  ANNOTATION_KUBERNETES_AUTH_PROVIDER,
} from '@backstage/catalog-model';
import { Credentials, EKS } from 'aws-sdk';
import { AWSCredentialFactory } from '../types';

const ACCOUNTID_ANNOTATION: string = 'amazonaws.com/account-id';
const ARN_ANNOTATION: string = 'amazonaws.com/arn';

/**
 * A processor for automatic discovery of resources from EKS clusters. Handles the
 * `aws-eks` location type, and target accounts/regions of the form
 * `<accountId>/<region>`.
 *
 * @public
 */
export class AwsEKSClusterProcessor implements CatalogProcessor {
  private credentialsFactory?: AWSCredentialFactory;

  constructor(options: { credentialsFactory?: AWSCredentialFactory }) {
    this.credentialsFactory = options.credentialsFactory;
  }

  getProcessorName(): string {
    return 'aws-eks';
  }

  normalizeName(name: string): string {
    return name
      .trim()
      .toLocaleLowerCase('en-US')
      .replace(/[^a-zA-Z0-9\-]/g, '-');
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

    let credentials: Credentials | undefined;

    if (this.credentialsFactory) {
      credentials = await this.credentialsFactory(accountId);
    }

    const eksClient = new EKS({ credentials, region });
    const clusters = await eksClient.listClusters({}).promise();
    if (clusters.clusters === undefined) {
      return true;
    }

    const results = clusters.clusters
      .map(cluster => eksClient.describeCluster({ name: cluster }).promise())
      .map(async describedClusterPromise => {
        const describedCluster = await describedClusterPromise;
        if (describedCluster.cluster) {
          const entity = {
            apiVersion: 'backstage.io/v1alpha1',
            kind: 'Resource',
            metadata: {
              annotations: {
                [ACCOUNTID_ANNOTATION]: accountId,
                [ARN_ANNOTATION]: describedCluster.cluster.arn || '',
                [ANNOTATION_KUBERNETES_API_SERVER]:
                  describedCluster.cluster.endpoint || '',
                [ANNOTATION_KUBERNETES_API_SERVER_CA]:
                  describedCluster.cluster.certificateAuthority?.data || '',
                [ANNOTATION_KUBERNETES_AUTH_PROVIDER]: 'aws',
              },
              name: this.normalizeName(describedCluster.cluster.name as string),
              namespace: 'default',
            },
            spec: {
              type: 'kubernetes-cluster',
              owner: 'unknown',
            },
          };
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
