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
  createExtensionPoint,
  LoggerService,
} from '@backstage/backend-plugin-api';
import { incrementalIngestionProvidersExtensionPoint } from '@backstage/plugin-catalog-backend-module-incremental-ingestion';
import {
  GroupTransformer,
  OrganizationTransformer,
  ProviderConfigTransformer,
  UserTransformer,
  readProviderConfigs,
} from '@backstage/plugin-catalog-backend-module-msgraph';
import { HumanDuration } from '@backstage/types';
import {
  MicrosoftGraphIncrementalEntityProvider,
  MSGraphContext,
  MSGraphCursor,
} from '../MicrosoftGraphIncrementalEntityProvider';

/**
 * Interface for
 * {@link microsoftGraphIncrementalEntityProviderTransformExtensionPoint}.
 *
 * @public
 */
export interface MicrosoftGraphIncrementalEntityProviderTransformsExtensionPoint {
  /**
   * Set the function that transforms a user entry in msgraph to an entity.
   * Optionally, you can pass separate transformers per provider ID.
   */
  setUserTransformer(
    transformer: UserTransformer | Record<string, UserTransformer>,
  ): void;

  /**
   * Set the function that transforms a group entry in msgraph to an entity.
   * Optionally, you can pass separate transformers per provider ID.
   */
  setGroupTransformer(
    transformer: GroupTransformer | Record<string, GroupTransformer>,
  ): void;

  /**
   * Set the function that transforms an organization entry in msgraph to an
   * entity. Optionally, you can pass separate transformers per provider ID.
   */
  setOrganizationTransformer(
    transformer:
      | OrganizationTransformer
      | Record<string, OrganizationTransformer>,
  ): void;

  /**
   * Set the function that transforms provider config dynamically.
   * Optionally, you can pass separate transformers per provider ID.
   */
  setProviderConfigTransformer(
    transformer:
      | ProviderConfigTransformer
      | Record<string, ProviderConfigTransformer>,
  ): void;
}

/**
 * Extension point used to customize the transforms applied by the incremental
 * module.
 *
 * @public
 */
export const microsoftGraphIncrementalEntityProviderTransformExtensionPoint =
  createExtensionPoint<MicrosoftGraphIncrementalEntityProviderTransformsExtensionPoint>(
    {
      id: 'catalog.microsoftGraphIncrementalEntityProvider.transforms',
    },
  );

/**
 * Registers {@link MicrosoftGraphIncrementalEntityProvider} instances with the
 * catalog's incremental ingestion extension point.
 *
 * This module requires `catalogModuleIncrementalIngestionEntityProvider` to
 * also be installed in the backend.
 *
 * @example
 * ```ts
 * // packages/backend/src/index.ts
 * backend.add(import('@backstage/plugin-catalog-backend-module-incremental-ingestion'));
 * backend.add(import('@backstage/plugin-catalog-backend-module-msgraph-incremental'));
 * ```
 *
 * @public
 */
export const catalogModuleMicrosoftGraphIncrementalEntityProvider =
  createBackendModule({
    pluginId: 'catalog',
    moduleId: 'microsoftGraphIncrementalEntityProvider',
    register(env) {
      let userTransformer:
        | UserTransformer
        | Record<string, UserTransformer>
        | undefined;
      let groupTransformer:
        | GroupTransformer
        | Record<string, GroupTransformer>
        | undefined;
      let organizationTransformer:
        | OrganizationTransformer
        | Record<string, OrganizationTransformer>
        | undefined;
      let providerConfigTransformer:
        | ProviderConfigTransformer
        | Record<string, ProviderConfigTransformer>
        | undefined;

      env.registerExtensionPoint(
        microsoftGraphIncrementalEntityProviderTransformExtensionPoint,
        {
          setUserTransformer(transformer) {
            if (userTransformer) {
              throw new Error('User transformer may only be set once');
            }
            userTransformer = transformer;
          },
          setGroupTransformer(transformer) {
            if (groupTransformer) {
              throw new Error('Group transformer may only be set once');
            }
            groupTransformer = transformer;
          },
          setOrganizationTransformer(transformer) {
            if (organizationTransformer) {
              throw new Error('Organization transformer may only be set once');
            }
            organizationTransformer = transformer;
          },
          setProviderConfigTransformer(transformer) {
            if (providerConfigTransformer) {
              throw new Error(
                'Provider config transformer may only be set once',
              );
            }
            providerConfigTransformer = transformer;
          },
        },
      );

      env.registerInit({
        deps: {
          config: coreServices.rootConfig,
          logger: coreServices.logger,
          incremental: incrementalIngestionProvidersExtensionPoint,
        },
        async init({ config, logger, incremental }) {
          const providerConfigs = readProviderConfigs(config);

          for (const providerConfig of providerConfigs) {
            const provider = new MicrosoftGraphIncrementalEntityProvider({
              id: providerConfig.id,
              provider: providerConfig,
              logger,
              userTransformer: resolveTransformer(
                providerConfig.id,
                userTransformer,
              ),
              groupTransformer: resolveTransformer(
                providerConfig.id,
                groupTransformer,
              ),
              organizationTransformer: resolveTransformer(
                providerConfig.id,
                organizationTransformer,
              ),
              providerConfigTransformer: resolveTransformer(
                providerConfig.id,
                providerConfigTransformer,
              ),
            });

            const restLength = deriveRestLength(providerConfig, logger);

            incremental.addProvider<MSGraphCursor, MSGraphContext>({
              provider,
              options: {
                burstInterval: { seconds: 3 },
                burstLength: { minutes: 5 },
                restLength,
                backoff: [
                  { seconds: 30 },
                  { minutes: 3 },
                  { minutes: 30 },
                  { hours: 3 },
                ],
              },
            });
          }
        },
      });
    },
  });

function resolveTransformer<T extends Function>(
  id: string,
  transformer?: T | Record<string, T>,
): T | undefined {
  if (['undefined', 'function'].includes(typeof transformer)) {
    return transformer as T;
  }
  return (transformer as Record<string, T>)[id];
}

function deriveRestLength(
  providerConfig: ReturnType<typeof readProviderConfigs>[number],
  logger: LoggerService,
): HumanDuration {
  const freq = providerConfig.schedule?.frequency;
  // Only treat plain duration objects as restLength — exclude cron expressions
  // and any other non-duration schedule types (e.g. manual triggers).
  if (
    freq &&
    typeof freq === 'object' &&
    !('cron' in freq) &&
    !('trigger' in freq)
  ) {
    return freq as HumanDuration;
  }
  if (freq) {
    logger.warn(
      `MicrosoftGraphIncrementalEntityProvider:${providerConfig.id}: ` +
        `schedule.frequency is not a duration-based schedule; cannot derive restLength from it. ` +
        `Defaulting restLength to 8 hours.`,
    );
  }
  return { hours: 8 };
}
