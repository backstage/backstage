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
  BackendFeature,
  ExtensionPoint,
  ServiceRef,
  ServiceFactory,
} from '@backstage/backend-plugin-api';

/**
 * @public
 */
export interface Backend {
  add(feature: BackendFeature | Promise<{ default: BackendFeature }>): void;
  start(): Promise<void>;
  stop(): Promise<void>;
}

/**
 * @public
 */
export interface CreateSpecializedBackendOptions {
  defaultServiceFactories: ServiceFactory[];
}

/**
 * @public
 */
export type ServiceOrExtensionPoint<T = unknown> =
  | ExtensionPoint<T>
  | ServiceRef<T>;

/**
 * @public
 */
export type BackendStartupOptions = {
  [pluginId: string]: {
    /**
     * Used to mark plugins as optional, which allows the backend to start up even in the event
     * of a plugin failure. Plugin failures without this configuration are fatal. This can
     * enable leaving a crashing plugin installed, but still permit backend startup, which may
     * help troubleshoot data-dependent issues.
     */
    optional?: boolean;
  };
};
