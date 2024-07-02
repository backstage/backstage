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

// eslint-disable-next-line @backstage/no-relative-monorepo-imports
import {
  createLifecycleMiddleware as _createLifecycleMiddleware,
  type LifecycleMiddlewareOptions as _LifecycleMiddlewareOptions,
} from '../../../../../backend-defaults/src/entrypoints/httpRouter/createLifecycleMiddleware';

/**
 * Options for {@link createLifecycleMiddleware}.
 * @public
 * @deprecated Please import from `@backstage/backend-defaults/httpRouter` instead.
 */
export type LifecycleMiddlewareOptions = _LifecycleMiddlewareOptions;

/**
 * Creates a middleware that pauses requests until the service has started.
 *
 * @remarks
 *
 * Requests that arrive before the service has started will be paused until startup is complete.
 * If the service does not start within the provided timeout, the request will be rejected with a
 * {@link @backstage/errors#ServiceUnavailableError}.
 *
 * If the service is shutting down, all requests will be rejected with a
 * {@link @backstage/errors#ServiceUnavailableError}.
 *
 * @public
 * @deprecated Please import from `@backstage/backend-defaults/httpRouter` instead.
 */
export const createLifecycleMiddleware = _createLifecycleMiddleware;
