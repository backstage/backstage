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

import {
  BackendFeature,
  createServiceRef,
} from '@backstage/backend-plugin-api';

/** @alpha */
export interface FeatureDiscoveryService {
  getBackendFeatures(): Promise<{ features: Array<BackendFeature> }>;
}

/**
 * An optional service that can be used to dynamically load in additional BackendFeatures at runtime.
 * @alpha
 * @deprecated The `featureDiscoveryServiceRef` is deprecated in favor of using {@link @backstage/backend-defaults#discoveryFeatureLoader} instead.
 */
export const featureDiscoveryServiceRef =
  createServiceRef<FeatureDiscoveryService>({
    id: 'core.featureDiscovery',
    scope: 'root',
  });

/**
 * EXPERIMENTAL: Instance metadata service.
 *
 * @alpha
 */
export const instanceMetadataServiceRef = createServiceRef<
  import('./services/definitions/InstanceMetadataService').InstanceMetadataService
>({
  id: 'core.instanceMetadata',
});

export type {
  BackendFeatureMeta,
  InstanceMetadataService,
} from './services/definitions/InstanceMetadataService';
