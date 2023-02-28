/*
 * Copyright 2020 The Backstage Authors
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

import { Logger } from 'winston';
import { PluginTaskScheduler } from '@backstage/backend-tasks';
import {
  CATALOG_FILTER_EXISTS,
  CatalogClient,
} from '@backstage/catalog-client';
import { Config } from '@backstage/config';
import { LighthouseRestApi } from '@backstage/plugin-lighthouse-common';
import { stringifyEntityRef } from '@backstage/catalog-model';
import { LighthouseAuditScheduleImpl } from '../config';

/** @public **/
export interface CreateLighthouseSchedulerOptions {
  logger: Logger;
  config: Config;
  scheduler?: PluginTaskScheduler;
  catalogClient: CatalogClient;
}

/** @public **/
export async function createScheduler(
  options: CreateLighthouseSchedulerOptions,
) {
  const { logger, scheduler, catalogClient, config } = options;
  const lighthouseApi = LighthouseRestApi.fromConfig(config);

  const lighthouseAuditConfig = LighthouseAuditScheduleImpl.fromConfig(config);
  const formFactorToScreenEmulationMap = {
    // the default is mobile, so no need to override
    mobile: undefined,
    // Values from lighthouse's cli "desktop" preset
    // https://github.com/GoogleChrome/lighthouse/blob/a6738e0033e7e5ca308b97c1c36f298b7d399402/lighthouse-core/config/constants.js#L71-L77
    desktop: {
      mobile: false,
      width: 1350,
      height: 940,
      deviceScaleFactor: 1,
      disabled: false,
    },
  };

  logger.info(
    `Running with Scheduler Config ${JSON.stringify(
      lighthouseAuditConfig.getSchedule(),
    )} and timeout ${JSON.stringify(lighthouseAuditConfig.getTimeout())}`,
  );

  if (scheduler) {
    await scheduler.scheduleTask({
      id: 'lighthouse_audit',
      frequency: lighthouseAuditConfig.getSchedule(),
      timeout: lighthouseAuditConfig.getTimeout(),
      initialDelay: { minutes: 15 },
      fn: async () => {
        const filter: Record<string, symbol | string> = {
          kind: 'Component',
          'spec.type': 'website',
          ['metadata.annotations.lighthouse.com/website-url']:
            CATALOG_FILTER_EXISTS,
        };

        logger.info('Running Lighthouse Audit Task');

        const websitesWithUrl = await catalogClient.getEntities({
          filter: [filter],
        });

        let index = 0;
        for (const entity of websitesWithUrl.items) {
          const websiteUrl =
            entity.metadata.annotations?.['lighthouse.com/website-url'] ?? '';

          if (!websiteUrl) {
            continue;
          }

          const controller = new AbortController();

          await scheduler.scheduleTask({
            id: `lighthouse_audit_${stringifyEntityRef(entity)}`,
            frequency: {},
            timeout: {},
            initialDelay: { minutes: index * 2 },
            signal: controller.signal,
            fn: async () => {
              logger.info(
                `Processing Website Url ${websiteUrl} for Entity ${entity.metadata.name}`,
              );

              await lighthouseApi.triggerAudit({
                url: websiteUrl,
                options: {
                  lighthouseConfig: {
                    settings: {
                      formFactor: 'mobile',
                      emulatedFormFactor: 'mobile',
                      screenEmulation: formFactorToScreenEmulationMap.mobile,
                    },
                  },
                },
              });

              logger.info('Stop Scheduled Task');
              controller.abort();
            },
          });
          index++;
        }
      },
    });
  }
}
