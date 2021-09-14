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
import {
  createRouter,
  exampleChecks,
  exampleFactRetriever,
  DefaultTechInsightsBuilder,
} from '@backstage/plugin-tech-insights-backend';
import { Router } from 'express';
import { PluginEnvironment } from '../types';

export default async function createPlugin({
  logger,
  config,
  discovery,
  database,
}: PluginEnvironment): Promise<Router> {
  const builder = new DefaultTechInsightsBuilder({
    logger,
    config,
    database,
    discovery,
    factRetrievers: [
      {
        factRetriever: exampleFactRetriever,
        cadence: '* 1 * * *',
      },
    ],
    checks: exampleChecks,
  });

  return await createRouter({
    ...(await builder.build()),
    logger,
    config,
  });
}
