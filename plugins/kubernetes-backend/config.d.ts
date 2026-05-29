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
      | 'resourcequotas'
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
      type: 'multiTenant' | 'singleTenant' | 'catalogRelation';
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
            /** @visibility frontend */
            title?: string;
            /** @visibility secret  */
            serviceAccountToken?: string;
            /** @visibility frontend */
            authProvider?: string;
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
            customResources?: Array<{
              group: string;
              apiVersion: string;
              plural: string;
            }>;
          }>;
        }
      | {
          /** @visibility frontend */
          type: 'catalog';
          /**
           * Allowlist of trusted cluster API server origins (scheme + host +
           * optional port). The `kubernetes.io/api-server` annotation of a
           * catalog `kubernetes-cluster` Resource must match one of these
           * origins for the entity to be returned by the locator.
           *
           * This protects against an SSRF / credential exfiltration attack in
           * which an actor with catalog write access registers a malicious
           * cluster entity that causes the backend to send server-side
           * credentials (AWS / Azure / GCP / OIDC tokens) to an arbitrary URL.
           *
           * If this option is omitted, the catalog locator returns no clusters
           * (default-deny). Set `allowUnsafeClusterUrls: true` to temporarily
           * restore the previous, unsafe behaviour.
           *
           * @visibility frontend
           */
          allowedClusterUrls?: string[];
          /**
           * Restores the pre-fix behaviour of trusting any URL supplied via
           * catalog annotations. Enabling this re-introduces the SSRF that
           * `allowedClusterUrls` is designed to prevent and should only be
           * used as a short term migration aid.
           *
           * @visibility frontend
           */
          allowUnsafeClusterUrls?: boolean;
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
          /**
           * The type of endpoint to use for connecting to the cluster.
           * 'public' uses the public IP endpoint (default).
           * 'dns' uses the DNS-based control plane endpoint.
           * @visibility frontend
           */
          endpointType?: 'public' | 'dns';
        }
    >;
    customResources?: Array<{
      group: string;
      apiVersion: string;
      plural: string;
    }>;

    /**
     * (Optional) Google Service Account credentials for authentication
     * JSON string containing the service account key
     * @visibility secret
     */
    googleServiceAccountCredentials?: string;

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
      resourcequotas?: string;
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
