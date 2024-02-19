/*
 * Copyright 2023 The Backstage Authors
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
import { type Cluster } from '@aws-sdk/client-eks';
import {
  ANNOTATION_KUBERNETES_API_SERVER,
  ANNOTATION_KUBERNETES_API_SERVER_CA,
  ANNOTATION_KUBERNETES_AUTH_PROVIDER,
  ANNOTATION_KUBERNETES_AWS_CLUSTER_ID,
} from '@backstage/plugin-kubernetes-common';
import type { EksClusterEntityTransformer } from '../processors/types';
import { ANNOTATION_AWS_ACCOUNT_ID, ANNOTATION_AWS_ARN } from '../constants';

/**
 * Default transformer for EKS Cluster to Resource Entity
 * @public
 */
export const defaultEksClusterEntityTransformer: EksClusterEntityTransformer =
  async (cluster: Cluster, accountId: string) => {
    const { arn, endpoint, certificateAuthority, name } = cluster;
    const normalizedName = normalizeName(name as string);
    return {
      apiVersion: 'backstage.io/v1alpha1',
      kind: 'Resource',
      metadata: {
        annotations: {
          [ANNOTATION_AWS_ACCOUNT_ID]: accountId,
          [ANNOTATION_AWS_ARN]: arn || '',
          [ANNOTATION_KUBERNETES_API_SERVER]: endpoint || '',
          [ANNOTATION_KUBERNETES_API_SERVER_CA]:
            certificateAuthority?.data || '',
          [ANNOTATION_KUBERNETES_AUTH_PROVIDER]: 'aws',
          [ANNOTATION_KUBERNETES_AWS_CLUSTER_ID]: normalizedName,
        },
        name: normalizedName,
        namespace: 'default',
      },
      spec: {
        type: 'kubernetes-cluster',
        owner: 'unknown',
      },
    };
  };

function normalizeName(name: string): string {
  return name
    .trim()
    .toLocaleLowerCase('en-US')
    .replace(/[^a-zA-Z0-9\-]/g, '-');
}
