/*
 * Copyright 2020 Spotify AB
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
  AppsV1Api,
  CoreV1Api,
  V1ConfigMap,
  V1Deployment,
  V1Pod,
  V1ReplicaSet,
  V1Secret,
} from '@kubernetes/client-node';

export interface Clients {
  core: CoreV1Api;
  apps: AppsV1Api;
}

// cluster name to k8s objects
export interface ObjectsByServiceIdResponse {
  [key: string]: {
    configMaps: Array<V1ConfigMap>;
    deployments: Array<V1Deployment>;
    pods: Array<V1Pod>;
    replicaSets: Array<V1ReplicaSet>;
    secrets: Array<V1Secret>;
  };
}
