/*
 * Copyright 2022 The Backstage Authors
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
  AzureDevOpsTechDocsEventSubscriber,
  BitbucketServerTechDocsEventSubscriber,
  GithubTechDocsEventSubscriber,
} from '@backstage/plugin-techdocs-backend-module-events';
import {
  EventsBackend,
  HttpPostIngressEventPublisher,
} from '@backstage/plugin-events-backend';

import { AzureDevOpsEventRouter } from '@backstage/plugin-events-backend-module-azure';
import { BitbucketCloudEventRouter } from '@backstage/plugin-events-backend-module-bitbucket-cloud';
import { CatalogClient } from '@backstage/catalog-client';
import { GithubEventRouter } from '@backstage/plugin-events-backend-module-github';
import { PluginEnvironment } from '../types';
import { Router } from 'express';

export default async function createPlugin(
  env: PluginEnvironment,
): Promise<Router> {
  const catalogClient = new CatalogClient({
    discoveryApi: env.discovery,
  });

  const githubEventRouter = new GithubEventRouter({ events: env.events });
  githubEventRouter.subscribe();

  const azureDevOpsEventRouter = new AzureDevOpsEventRouter({
    events: env.events,
  });
  azureDevOpsEventRouter.subscribe();

  const bitbucketCloudEventRouter = new BitbucketCloudEventRouter({
    events: env.events,
  });
  bitbucketCloudEventRouter.subscribe();

  const azureDevOpsTechDocsEventSubscriber =
    AzureDevOpsTechDocsEventSubscriber.fromConfig(env.config, {
      logger: env.logger,
      tokenManager: env.tokenManager,
      catalogClient,
    });

  const bitbucketServerTechDocsEventSubscriber =
    BitbucketServerTechDocsEventSubscriber.fromConfig(env.config, {
      logger: env.logger,
      tokenManager: env.tokenManager,
      catalogClient,
    });

  const gitHubTechDocsEventSubscriber =
    GithubTechDocsEventSubscriber.fromConfig(env.config, {
      logger: env.logger,
      tokenManager: env.tokenManager,
      catalogClient,
    });

  const eventsRouter = Router();

  const http = HttpPostIngressEventPublisher.fromConfig({
    config: env.config,
    events: env.events,
    logger: env.logger,
  });
  http.bind(eventsRouter);

  await new EventsBackend(env.logger)
    .setEventBroker(env.eventBroker)
    .addSubscribers(
      azureDevOpsTechDocsEventSubscriber,
      bitbucketServerTechDocsEventSubscriber,
      gitHubTechDocsEventSubscriber,
    )
    .start();

  return eventsRouter;
}
