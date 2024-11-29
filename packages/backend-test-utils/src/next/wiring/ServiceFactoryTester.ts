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

/**
 * Options for {@link ServiceFactoryTester}.
 * @public
 */
export interface ServiceFactoryTesterOptions {
  /**
   * Additional service factories to make available as dependencies.
   *
   * @remarks
   *
   * If a service factory is provided for a service that already has a default
   * implementation, the provided factory will override the default.
   */
  dependencies?: Array<ServiceFactory>;
}

/**
 * A utility to help test service factories in isolation.
 *
 * @public
 */
export class ServiceFactoryTester<
  TService,
  TScope extends 'root' | 'plugin',
  TInstances extends 'singleton' | 'multiton' = 'singleton',
> {
  readonly #subject: ServiceRef<TService, TScope, TInstances>;
  readonly #registry: ServiceRegistry;

  /**
   * Creates a new {@link ServiceFactoryTester} used to test the provided subject.
   *
   * @param subject - The service factory to test.
   * @param options - Additional options
   * @returns A new tester instance for the provided subject.
   */
  static from<
    TService,
    TScope extends 'root' | 'plugin',
    TInstances extends 'singleton' | 'multiton' = 'singleton',
  >(
    subject: ServiceFactory<TService, TScope, TInstances>,
    options?: ServiceFactoryTesterOptions,
  ): ServiceFactoryTester<TService, TScope, TInstances> {
    const registry = ServiceRegistry.create([
      ...defaultServiceFactories,
      ...(options?.dependencies ?? []),
      subject,
    ]);
    return new ServiceFactoryTester(subject.service, registry);
  }

  private constructor(
    subject: ServiceRef<TService, TScope, TInstances>,
    registry: ServiceRegistry,
  ) {
    this.#subject = subject;
    this.#registry = registry;
  }

  /**
   * Returns the service instance for the subject.
   *
   * @remarks
   *
   * If the subject is a plugin scoped service factory a plugin ID
   * can be provided to instantiate the service for a specific plugin.
   *
   * By default the plugin ID 'test' is used.
   */
  async getSubject(
    ...args: 'root' extends TScope ? [] : [pluginId?: string]
  ): Promise<TInstances extends 'multiton' ? TService[] : TService> {
    const [pluginId] = args;
    const instance = this.#registry.get(this.#subject, pluginId ?? 'test')!;
    return instance;
  }

  /**
   * Return the service instance for any of the provided dependencies or built-in services.
   *
   * @remarks
   *
   * A plugin ID can optionally be provided for plugin scoped services, otherwise the plugin ID 'test' is used.
   */
  async getService<
    TGetService,
    TGetScope extends 'root' | 'plugin',
    TGetInstances extends 'singleton' | 'multiton' = 'singleton',
  >(
    service: ServiceRef<TGetService, TGetScope, TGetInstances>,
    ...args: 'root' extends TGetScope ? [] : [pluginId?: string]
  ): Promise<TGetInstances extends 'multiton' ? TGetService[] : TGetService> {
    const [pluginId] = args;
    const instance = await this.#registry.get(service, pluginId ?? 'test');
    if (instance === undefined) {
      throw new Error(`Service '${service.id}' not found`);
    }
    return instance;
  }
}
