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
import { Socket } from 'socket.io';
import http from 'http';
import { Logger } from 'winston';
import { IdentityApi } from '@backstage/plugin-auth-node';
import { EventBroker } from '@backstage/plugin-events-node';
import { Config } from '@backstage/config';

/**
 * @internal
 */
export type SignalsSubscription = {
  pluginId: string;
  topic?: string;
};

/**
 * @internal
 */
export type SignalsClientSubscribeCommand = {
  pluginId: string;
  topic?: string;
};

/**
 * @internal
 */
export type SignalsConnection = {
  ws: Socket;
  ip?: string;
  sub?: string;
  ownershipEntityRefs?: string[];
  subscriptions: Map<string, SignalsSubscription>;
};

/**
 * @public
 */
export type ServiceOptions = {
  httpServer: http.Server;
  eventBroker: EventBroker;
  config: Config;
  logger: Logger;
  identity: IdentityApi;
};
