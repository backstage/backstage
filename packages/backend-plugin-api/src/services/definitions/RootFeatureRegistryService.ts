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

import { BackendFeatureRegistration } from '../../types';

/**
 * The RootFeatureRegistryService is a root-scoped service used to provide a mechanism for backend
 * plugins to discover the list of backend features registered in the application.
 *
 * Implementations of the registry API can be as simple as gathering the list of registered features
 * at application initialization, but could also query a separate service.
 *
 * @public
 */
export interface RootFeatureRegistryService {
  getFeatures(): BackendFeatureRegistration[];
}

/**
 * The RootFeatureRegistryServiceImplementation is an abstract class that a RootFeatureRegistryService
 * would extend, so that it can be fed with the list of registered features during
 * application initialization.
 *
 * @public
 */
export abstract class RootFeatureRegistryServiceImplementation {
  abstract setFeatures(features: BackendFeatureRegistration[]): void;
}
