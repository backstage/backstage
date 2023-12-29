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

import * as k8sAuthTypes from '@backstage/plugin-kubernetes-node';

// TODO remove this re-export as a breaking change after a couple of releases
/**
 * @public @deprecated Import it from \@backstage/plugin-kubernetes-node instead
 */
export type AuthenticationStrategy = k8sAuthTypes.AuthenticationStrategy;

/**
 * @public @deprecated Import it from \@backstage/plugin-kubernetes-node instead
 */
export type KubernetesCredential = k8sAuthTypes.KubernetesCredential;
