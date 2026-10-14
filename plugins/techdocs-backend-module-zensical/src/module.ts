/*
 * Copyright 2026 The Backstage Authors
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
  createBackendModule,
} from '@backstage/backend-plugin-api';
import { techdocsGeneratorExtensionPoint } from '@backstage/plugin-techdocs-node';
import { TechdocsZensicalGenerator } from './TechdocsZensicalGenerator';

/**
 * Registers the Zensical documentation engine with the TechDocs backend.
 *
 * @public
 */
export const techdocsModuleZensical = createBackendModule({
  pluginId: 'techdocs',
  moduleId: 'zensical',
  register(env) {
    env.registerInit({
      deps: {
        config: coreServices.rootConfig,
        logger: coreServices.logger,
        generator: techdocsGeneratorExtensionPoint,
      },
      async init({ config, logger, generator }) {
        const zensicalGenerator = TechdocsZensicalGenerator.fromConfig(config, {
          logger,
        });
        generator.registerGenerator('zensical', zensicalGenerator);
        logger.info('Registered Zensical documentation engine');
      },
    });
  },
});
