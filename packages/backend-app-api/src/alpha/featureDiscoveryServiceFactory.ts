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
  coreServices,
  createServiceFactory,
} from '@backstage/backend-plugin-api';
import { featureDiscoveryServiceRef } from '@backstage/backend-plugin-api/alpha';
// eslint-disable-next-line @backstage/no-relative-monorepo-imports
import { PackageDiscoveryService } from '../../../backend-defaults/src/PackageDiscoveryService';

/**
 * @alpha
 * @deprecated The `featureDiscoveryServiceFactory` is deprecated in favor of using {@link @backstage/backend-defaults#discoveryFeatureLoader} instead.
 */
export const featureDiscoveryServiceFactory = createServiceFactory({
  service: featureDiscoveryServiceRef,
  deps: {
    config: coreServices.rootConfig,
    logger: coreServices.rootLogger,
  },
  factory({ config, logger }) {
    return new PackageDiscoveryService(config, logger);
  },
});
