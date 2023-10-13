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
import { createExtensionPoint } from '@backstage/backend-plugin-api';
import { KubernetesObjectsProvider } from '@backstage/plugin-kubernetes-node';

/**
 * The interface for {@link kubernetesObjectsProviderExtensionPoint}.
 *
 * @public
 */
export interface KubernetesObjectsProviderExtensionPoint {
  addObjectsProvider(provider: KubernetesObjectsProvider): void;
}

/**
 * An extension point the exposes the ability to configure a objects provider.
 *
 * @public
 */
export const kubernetesObjectsProviderExtensionPoint =
  createExtensionPoint<KubernetesObjectsProviderExtensionPoint>({
    id: 'kubernetes.objects-provider',
  });
