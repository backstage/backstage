/*
 * Copyright 2024 The Backstage Authors
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
import { BackendFeatureFactory } from '../types';
import {
  InternalBackendFeature,
  InternalBackendModuleRegistration,
  InternalBackendPluginRegistration,
} from './types';

/**
 * An utility function that allows bundling several features (plugin or module) as a single `BackendFeature`.
 * This can be useful in some circumstances, to soften the requirement of distributing a plugin and associated modules
 * as distinct NPM packages, especially especially in dynamic plugin scenarios when they serve a common purpose
 * and are expected to be installed together.
 * @alpha
 */
export function bundleBackendFeatures(
  features: (() => BackendFeature)[],
): () => BackendFeature {
  const factory: BackendFeatureFactory = () => {
    let registrations: (
      | InternalBackendPluginRegistration
      | InternalBackendModuleRegistration
    )[];
    function isInternalBackendFeature(f: any): f is InternalBackendFeature {
      return 'getRegistrations' in f;
    }

    return {
      $$type: '@backstage/BackendFeature',
      version: 'v1',
      getRegistrations() {
        if (registrations) {
          return registrations;
        }
        registrations = features
          .map(f => f())
          .flatMap(f =>
            isInternalBackendFeature(f) ? f.getRegistrations() : [],
          );
        return registrations;
      },
    };
  };
  factory.$$type = '@backstage/BackendFeatureFactory';

  return factory;
}
