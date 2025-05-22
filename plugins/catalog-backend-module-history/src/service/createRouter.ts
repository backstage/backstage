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

import { Knex } from 'knex';
import { createOpenApiRouter } from '../schema/openapi';
import { GetEventsModelImpl } from './endpoints/GetEvents.model';
import { bindGetEventsEndpoint } from './endpoints/GetEvents.router';
import { bindReadSubscriptionEndpoint } from './endpoints/ReadSubscription.router';
import { ReadSubscriptionModelImpl } from './endpoints/ReadSubscription.model';
import { AckSubscriptionModelImpl } from './endpoints/AckSubscription.model';
import { bindAckSubscriptionEndpoint } from './endpoints/AckSubscription.router';
import { HistoryConfig } from '../config';

export async function createRouter(options: {
  knexPromise: Promise<Knex>;
  historyConfig: HistoryConfig;
  shutdownSignal: AbortSignal;
}) {
  const router = await createOpenApiRouter();

  bindGetEventsEndpoint(
    router,
    new GetEventsModelImpl({
      knexPromise: options.knexPromise,
      historyConfig: options.historyConfig,
      shutdownSignal: options.shutdownSignal,
    }),
  );

  /*
  bindUpsertSubscriptionEndpoint(
    router,
    new UpsertSubscriptionModelImpl({
      knexPromise: options.knexPromise,
      historyConfig: options.historyConfig,
    }),
  );
  */

  bindReadSubscriptionEndpoint(
    router,
    new ReadSubscriptionModelImpl({
      knexPromise: options.knexPromise,
      historyConfig: options.historyConfig,
      shutdownSignal: options.shutdownSignal,
    }),
  );

  bindAckSubscriptionEndpoint(
    router,
    new AckSubscriptionModelImpl({
      knexPromise: options.knexPromise,
    }),
  );

  return router;
}
