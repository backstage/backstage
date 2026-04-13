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

import { BackendFeature, ServiceRef } from '@backstage/backend-plugin-api';
import { OpaqueType } from '@internal/opaque';

const OpaqueBackendFeature = OpaqueType.create<{
  public: BackendFeature;
  versions: {
    version: 'v1';
    featureType: 'service' | 'registrations' | 'loader';
  };
}>({
  type: '@backstage/BackendFeature',
  versions: ['v1'],
});

type InternalBackendFeature = typeof OpaqueBackendFeature.TInternal;

type InternalServiceFactory = InternalBackendFeature & {
  featureType: 'service';
  service: ServiceRef<unknown>;
};

type InternalBackendRegistrations = InternalBackendFeature & {
  featureType: 'registrations';
  getRegistrations(): Array<any>;
};

type InternalBackendFeatureLoader = InternalBackendFeature & {
  featureType: 'loader';
  description: string;
  deps: Record<string, ServiceRef<unknown>>;
  loader(deps: Record<string, unknown>): Promise<BackendFeature[]>;
};

export function isServiceFactory(
  feature: BackendFeature,
): feature is InternalServiceFactory {
  const internal = OpaqueBackendFeature.toInternal(feature);
  if (internal.featureType === 'service') {
    return true;
  }
  // Backwards compatibility for v1 registrations that use duck typing
  return 'service' in internal;
}

export function isBackendRegistrations(
  feature: BackendFeature,
): feature is InternalBackendRegistrations {
  const internal = OpaqueBackendFeature.toInternal(feature);
  if (internal.featureType === 'registrations') {
    return true;
  }
  // Backwards compatibility for v1 registrations that use duck typing
  return 'getRegistrations' in internal;
}

export function isBackendFeatureLoader(
  feature: BackendFeature,
): feature is InternalBackendFeatureLoader {
  return OpaqueBackendFeature.toInternal(feature).featureType === 'loader';
}
