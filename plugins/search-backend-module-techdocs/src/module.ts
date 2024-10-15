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

/**
 * @packageDocumentation
 * A module for the search backend that exports TechDocs modules.
 */

import {
  coreServices,
  createBackendModule,
  createExtensionPoint,
  readSchedulerServiceTaskScheduleDefinitionFromConfig,
} from '@backstage/backend-plugin-api';
import { catalogServiceRef } from '@backstage/plugin-catalog-node/alpha';
import {
  DefaultTechDocsCollatorFactory,
  TechDocsCollatorDocumentTransformer,
  TechDocsCollatorEntityTransformer,
} from '@backstage/plugin-search-backend-module-techdocs';
import { searchIndexRegistryExtensionPoint } from '@backstage/plugin-search-backend-node/alpha';

/** @public */
export interface TechDocsCollatorEntityTransformerExtensionPoint {
  setTransformer(transformer: TechDocsCollatorEntityTransformer): void;
  setDocumentTransformer(
    transformer: TechDocsCollatorDocumentTransformer,
  ): void;
}

/**
 * Extension point used to customize the TechDocs collator entity transformer.
 *
 * @public
 */
export const techdocsCollatorEntityTransformerExtensionPoint =
  createExtensionPoint<TechDocsCollatorEntityTransformerExtensionPoint>({
    id: 'search.techdocsCollator.transformer',
  });

/**
 * @public
 * Search backend module for the TechDocs index.
 */
export default createBackendModule({
  pluginId: 'search',
  moduleId: 'techdocs-collator',
  register(env) {
    let entityTransformer: TechDocsCollatorEntityTransformer | undefined;
    let documentTransformer: TechDocsCollatorDocumentTransformer | undefined;

    env.registerExtensionPoint(
      techdocsCollatorEntityTransformerExtensionPoint,
      {
        setTransformer(newTransformer) {
          if (entityTransformer) {
            throw new Error(
              'TechDocs collator entity transformer may only be set once',
            );
          }
          entityTransformer = newTransformer;
        },
        setDocumentTransformer(newTransformer) {
          if (documentTransformer) {
            throw new Error(
              'TechDocs collator document transformer may only be set once',
            );
          }
          documentTransformer = newTransformer;
        },
      },
    );

    env.registerInit({
      deps: {
        config: coreServices.rootConfig,
        logger: coreServices.logger,
        auth: coreServices.auth,
        httpAuth: coreServices.httpAuth,
        discovery: coreServices.discovery,
        scheduler: coreServices.scheduler,
        catalog: catalogServiceRef,
        indexRegistry: searchIndexRegistryExtensionPoint,
      },
      async init({
        config,
        logger,
        auth,
        httpAuth,
        discovery,
        scheduler,
        catalog,
        indexRegistry,
      }) {
        const defaultSchedule = {
          frequency: { minutes: 10 },
          timeout: { minutes: 15 },
          initialDelay: { seconds: 3 },
        };

        const schedule = config.has('search.collators.techdocs.schedule')
          ? readSchedulerServiceTaskScheduleDefinitionFromConfig(
              config.getConfig('search.collators.techdocs.schedule'),
            )
          : defaultSchedule;

        indexRegistry.addCollator({
          schedule: scheduler.createScheduledTaskRunner(schedule),
          factory: DefaultTechDocsCollatorFactory.fromConfig(config, {
            discovery,
            auth,
            httpAuth,
            logger,
            catalogClient: catalog,
            entityTransformer,
            documentTransformer,
          }),
        });
      },
    });
  },
});
