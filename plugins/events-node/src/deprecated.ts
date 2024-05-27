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

import {
  coreServices,
  type EventParams as _EventParams,
  type EventsService as _EventsService,
  type EventsServiceEventHandler as _EventsServiceEventHandler,
  type EventsServiceSubscribeOptions as _EventsServiceSubscribeOptions,
} from '@backstage/backend-plugin-api';

export type { EventBroker } from './api/EventBroker';
export type { EventPublisher } from './api/EventPublisher';
export type { EventSubscriber } from './api/EventSubscriber';

/**
 * @public
 * @deprecated Use {@link @backstage/backend-plugin-api#coreServices.events} instead.
 */
export const eventsServiceRef = coreServices.events;

/**
 * @public
 * @deprecated Use {@link @backstage/backend-plugin-api#EventParams} instead.
 */
export type EventParams = _EventParams;

/**
 * @public
 * @deprecated Use {@link @backstage/backend-plugin-api#EventsService} instead.
 */
export type EventsService = _EventsService;

/**
 * @public
 * @deprecated Use {@link @backstage/backend-plugin-api#EventsServiceEventHandler} instead.
 */
export type EventsServiceEventHandler = _EventsServiceEventHandler;

/**
 * @public
 * @deprecated Use {@link @backstage/backend-plugin-api#EventsServiceSubscribeOptions} instead.
 */
export type EventsServiceSubscribeOptions = _EventsServiceSubscribeOptions;
