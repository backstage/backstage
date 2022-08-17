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
  AnyServiceFactory,
  BackendFeature,
  ExtensionPoint,
  FactoryFunc,
  ServiceRef,
} from '@backstage/backend-plugin-api';
import { BackstageBackend } from './BackstageBackend';

/**
 * @public
 */
export interface Backend {
  add(feature: BackendFeature): void;
  start(): Promise<void>;
}

export interface BackendRegisterInit {
  id: string;
  consumes: Set<ServiceOrExtensionPoint>;
  provides: Set<ServiceOrExtensionPoint>;
  deps: { [name: string]: ServiceOrExtensionPoint };
  init: (deps: { [name: string]: unknown }) => Promise<void>;
}

/**
 * @public
 */
export interface CreateSpecializedBackendOptions {
  services: AnyServiceFactory[];
}

export type ServiceHolder = {
  get<T>(api: ServiceRef<T>): FactoryFunc<T> | undefined;
};

/**
 * @public
 */
export function createSpecializedBackend(
  options: CreateSpecializedBackendOptions,
): Backend {
  return new BackstageBackend(options.services);
}

/**
 * @public
 */
export type ServiceOrExtensionPoint<T = unknown> =
  | ExtensionPoint<T>
  | ServiceRef<T>;
