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
import { EntityFilterQuery } from '@backstage/catalog-client';
import { Entity } from '@backstage/catalog-model';
import { catalogServiceRef } from '@backstage/plugin-catalog-node/alpha';
import { searchIndexRegistryExtensionPoint } from '@backstage/plugin-search-backend-node/alpha';
import { DefaultTechDocsCollatorFactory } from './collators/DefaultTechDocsCollatorFactory';
import {
  TechDocsCollatorDocumentTransformer,
  TechDocsCollatorEntityTransformer,
} from './collators';

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

/** @public */
export interface TechDocsCollatorEntityFilterExtensionPoint {
  setEntityFilterFunction(
    filterFunction: (entities: Entity[]) => Entity[],
  ): void;
  setCustomCatalogApiFilters(apiFilters: EntityFilterQuery): void;
}

/**
 * Extension point used to filter the entities that the collator will use.
 *
 * @public
 */
export const techDocsCollatorEntityFilterExtensionPoint =
  createExtensionPoint<TechDocsCollatorEntityFilterExtensionPoint>({
    id: 'search.techdocsCollator.entityFilter',
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
    let entityFilterFunction: ((e: Entity[]) => Entity[]) | undefined;
    let customCatalogApiFilters: EntityFilterQuery | undefined;

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

    env.registerExtensionPoint(techDocsCollatorEntityFilterExtensionPoint, {
      setEntityFilterFunction(newEntityFilterFunction) {
        if (entityFilterFunction) {
          throw new Error(
            'TechDocs entity filter functions may only be set once',
          );
        }
        entityFilterFunction = newEntityFilterFunction;
      },
      setCustomCatalogApiFilters(newCatalogApiFilters) {
        if (customCatalogApiFilters) {
          throw new Error(
            'TechDocs catalog entity filters may only be set once',
          );
        }
        customCatalogApiFilters = newCatalogApiFilters;
      },
    });

    env.registerInit({
      deps: {
        config: coreServices.rootConfig,
        logger: coreServices.logger,
        auth: coreServices.auth,
        discovery: coreServices.discovery,
        scheduler: coreServices.scheduler,
        catalog: catalogServiceRef,
        indexRegistry: searchIndexRegistryExtensionPoint,
      },
      async init({
        config,
        logger,
        auth,
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
            logger,
            catalogClient: catalog,
            entityTransformer,
            documentTransformer,
            customCatalogApiFilters,
            entityFilterFunction,
          }),
        });
      },
    });
  },
});
