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

import {
  coreServices,
  createServiceFactory,
} from '@backstage/backend-plugin-api';
import { DefaultSystemMetadataService } from './lib/DefaultSystemMetadataService';
import { systemMetadataServiceRef } from '@backstage/backend-plugin-api/alpha';
import { createSystemMetadataRouter } from './lib/createSystemMetadataRouter';

/**
 * Metadata about an entire Backstage system, a collection of Backstage instances.
 *
 * @alpha
 */
export const systemMetadataServiceFactory = createServiceFactory({
  service: systemMetadataServiceRef,
  deps: {
    logger: coreServices.rootLogger,
    config: coreServices.rootConfig,
    httpRouter: coreServices.rootHttpRouter,
  },
  async factory({ logger, config, httpRouter }) {
    const systemMetadata = DefaultSystemMetadataService.create({
      logger,
      config,
    });

    const router = await createSystemMetadataRouter({ systemMetadata, logger });

    httpRouter.use('/.backstage/systemMetadata/v1', router);
    return systemMetadata;
  },
});
