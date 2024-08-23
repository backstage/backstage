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

import express from 'express';

import { Config } from '@backstage/config';
import {
  AuthService,
  DiscoveryService,
  LifecycleService,
  LoggerService,
  UserInfoService,
} from '@backstage/backend-plugin-api';
import { createLegacyAuthAdapters } from '@backstage/backend-common';

import { IdentityApi } from '@backstage/plugin-auth-node';
import { EventsService } from '@backstage/plugin-events-node';

import { createRouter as _createRouter } from './service/router';

/**
 * @public
 * @deprecated Please migrate to the new backend system as this will be removed in the future.
 */
export interface RouterOptions {
  logger: LoggerService;
  events: EventsService;
  identity?: IdentityApi;
  discovery: DiscoveryService;
  config: Config;
  lifecycle?: LifecycleService;
  auth?: AuthService;
  userInfo?: UserInfoService;
}

/**
 * @public
 * @deprecated Please migrate to the new backend system as this will be removed in the future.
 */
export async function createRouter(
  options: RouterOptions,
): Promise<express.Router> {
  return _createRouter({
    ...options,
    ...createLegacyAuthAdapters(options),
  });
}
