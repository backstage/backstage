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
  BackendRegistrable,
  FactoryFunc,
  ServiceRef,
} from '@backstage/backend-plugin-api';
import { defaultServiceFactories } from '../services/implementations';
import { BackstageBackend } from './BackstageBackend';

/**
 * @public
 */
export interface Backend {
  add(extension: BackendRegistrable): void;
  start(): Promise<void>;
}

export interface BackendRegisterInit {
  id: string;
  consumes: Set<ServiceRef<unknown>>;
  provides: Set<ServiceRef<unknown>>;
  deps: { [name: string]: ServiceRef<unknown> };
  init: (deps: { [name: string]: unknown }) => Promise<void>;
}

/**
 * @public
 */
export interface CreateBackendOptions {
  apis: AnyServiceFactory[];
}

export type ServiceHolder = {
  get<T>(api: ServiceRef<T>): FactoryFunc<T> | undefined;
};

/**
 * @public
 */
export function createBackend(options?: CreateBackendOptions): Backend {
  // TODO: merge with provided APIs
  return new BackstageBackend([
    ...defaultServiceFactories,
    ...(options?.apis ?? []),
  ]);
}
