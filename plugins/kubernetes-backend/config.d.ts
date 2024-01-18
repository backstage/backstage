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

export interface Config {
  kubernetes?: {
    objectTypes?: Array<
      | 'pods'
      | 'services'
      | 'configmaps'
      | 'deployments'
      | 'limitranges'
      | 'replicasets'
      | 'horizontalpodautoscalers'
      | 'jobs'
      | 'cronjobs'
      | 'ingresses'
      | 'customresources'
      | 'statefulsets'
      | 'daemonsets'
    >;
    serviceLocatorMethod: {
      type: 'multiTenant';
    };
    clusterLocatorMethods: Array<
      | {
          /** @visibility frontend */
          type: 'config';
          clusters: Array<{
            /** @visibility frontend */
            url: string;
            /** @visibility frontend */
            name: string;
            /** @visibility secret  */
            serviceAccountToken?: string;
            /** @visibility frontend */
            authProvider?:
              | 'aks'
              | 'aws'
              | 'azure'
              | 'google'
              | 'googleServiceAccount'
              | 'oidc'
              | 'serviceAccount';
            /** @visibility secret  */
            authMetadata?: object;
            /** @visibility frontend */
            oidcTokenProvider?: string;
            /** @visibility frontend */
            skipTLSVerify?: boolean;
            /** @visibility frontend */
            skipMetricsLookup?: boolean;
            /** @visibility secret  */
            caData?: string;
            /** @visibility secret  */
            caFile?: string;
          }>;
        }
      | {
          /** @visibility frontend */
          type: 'catalog';
        }
      | {
          /** @visibility frontend */
          type: 'localKubectlProxy';
        }
      | {
          /** @visibility frontend */
          type: 'gke';
          /** @visibility frontend */
          projectId: string;
          /** @visibility frontend */
          region?: string;
          /** @visibility frontend */
          authProvider?: string;
          /** @visibility frontend */
          skipTLSVerify?: boolean;
          /** @visibility frontend */
          skipMetricsLookup?: boolean;
        }
    >;
    customResources?: Array<{
      group: string;
      apiVersion: string;
      plural: string;
    }>;

    /**
     * (Optional) API Version Overrides
     * If set, the specified api version will be used to make requests for the corresponding object.
     * If running a legacy Kubernetes version, you may use this to override the default api versions
     * that are not supported in your cluster.
     */
    apiVersionOverrides?: {
      pods?: string;
      services?: string;
      configmaps?: string;
      deployments?: string;
      limitranges?: string;
      replicasets?: string;
      horizontalpodautoscalers?: string;
      jobs?: string;
      cronjobs?: string;
      ingresses?: string;
      customresources?: string;
      statefulsets?: string;
      daemonsets?: string;
    } & { [pluralKind: string]: string };
  };
}
