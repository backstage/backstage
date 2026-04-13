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

import { BackendFeature } from '@backstage/backend-plugin-api';
import type {
  InternalBackendFeature,
  InternalBackendRegistrations,
  InternalBackendFeatureLoader,
  InternalServiceFactory,
} from './types';

function toInternal(feature: BackendFeature): InternalBackendFeature {
  return feature as InternalBackendFeature;
}

export function isServiceFactory(
  feature: BackendFeature,
): feature is InternalServiceFactory {
  const internal = toInternal(feature);
  if (internal.featureType === 'service') {
    return true;
  }
  // Backwards compatibility for v1 registrations that use duck typing
  return 'service' in internal;
}

export function isBackendRegistrations(
  feature: BackendFeature,
): feature is InternalBackendRegistrations {
  const internal = toInternal(feature);
  if (internal.featureType === 'registrations') {
    return true;
  }
  // Backwards compatibility for v1 registrations that use duck typing
  return 'getRegistrations' in internal;
}

export function isBackendFeatureLoader(
  feature: BackendFeature,
): feature is InternalBackendFeatureLoader {
  return toInternal(feature).featureType === 'loader';
}
