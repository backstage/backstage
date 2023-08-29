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

import { ServiceFactory, ServiceRef } from '@backstage/backend-plugin-api';
import { defaultServiceFactories } from './TestBackend';
// Direct internal import to avoid duplication.
// This is a relative import in order to make sure that the implementation is duplicated
// rather than leading to an import from @backstage/backend-app-api.
// eslint-disable-next-line @backstage/no-relative-monorepo-imports
import { ServiceRegistry } from '../../../../backend-app-api/src/wiring/ServiceRegistry';

/** @public */
export class ServiceFactoryTester<TService, TScope extends 'root' | 'plugin'> {
  readonly #subject: ServiceRef<TService, TScope>;
  readonly #registry: ServiceRegistry;

  static from<TService, TScope extends 'root' | 'plugin'>(
    subject:
      | ServiceFactory<TService, TScope>
      | (() => ServiceFactory<TService, TScope>),
    options?: { dependencies?: Array<ServiceFactory | (() => ServiceFactory)> },
  ) {
    return new ServiceFactoryTester(
      typeof subject === 'function' ? subject() : subject,
      options?.dependencies,
    );
  }

  private constructor(
    subject: ServiceFactory<TService, TScope>,
    dependencies?: Array<ServiceFactory | (() => ServiceFactory)>,
  ) {
    this.#subject = subject.service;

    this.#registry = new ServiceRegistry([
      ...defaultServiceFactories,
      ...(dependencies?.map(f => (typeof f === 'function' ? f() : f)) ?? []),
      subject,
    ]);
  }

  async get(
    ...args: 'root' extends TScope ? [] : [pluginId?: string]
  ): Promise<TService> {
    const [pluginId] = args;
    return this.#registry.get(this.#subject, pluginId ?? 'test')!;
  }

  async getService<TGetService, TGetScope extends 'root' | 'plugin'>(
    service: ServiceRef<TGetService, TGetScope>,
    ...args: 'root' extends TGetScope ? [] : [pluginId?: string]
  ): Promise<TGetService> {
    const [pluginId] = args;
    const instance = await this.#registry.get(service, pluginId ?? 'test');
    if (instance === undefined) {
      throw new Error(`Service '${service.id}' not found`);
    }
    return instance;
  }
}
