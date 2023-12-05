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
import { IdentityApi } from '@backstage/plugin-auth-node';
import { EventBroker } from '@backstage/plugin-events-node';
import { Logger } from 'winston';
import { WebSocket } from 'ws';
import { JsonObject } from '@backstage/types';

/**
 * @public
 */
export type ServiceOptions = {
  eventBroker?: EventBroker;
  logger: Logger;
  identity: IdentityApi;
};

/** @public */
export type SignalEventBrokerPayload = {
  recipients?: string[];
  topic?: string;
  message?: JsonObject;
};

/**
 * @internal
 */
export type SignalConnection = {
  id: string;
  user: string;
  ws: WebSocket;
  ownershipEntityRefs: string[];
  subscriptions: Set<string>;
};
