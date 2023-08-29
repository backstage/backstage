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

import { ServiceFactory } from '@backstage/backend-plugin-api';
import { defaultServiceFactories } from './TestBackend';
// Direct internal import to avoid duplication.
// This is a relative import in order to make sure that the implementation is duplicated
// rather than leading to an import from @backstage/backend-app-api.
// eslint-disable-next-line @backstage/no-relative-monorepo-imports
import { ServiceRegistry } from '../../../../backend-app-api/src/wiring/ServiceRegistry';

/** @public */
export function makeServiceFactoryTester<
  TService,
  TScope extends 'root' | 'plugin',
>(
  subject:
    | ServiceFactory<TService, TScope>
    | (() => ServiceFactory<TService, TScope>),
  dependencies?: Array<ServiceFactory | (() => ServiceFactory)>,
): 'root' extends TScope
  ? () => Promise<TService>
  : (pluginId: string) => Promise<TService> {
  const subjectFactory = typeof subject === 'function' ? subject() : subject;
  const services = [
    ...defaultServiceFactories,
    ...(dependencies?.map(f => (typeof f === 'function' ? f() : f)) ?? []),
    subjectFactory,
  ];

  const registry = new ServiceRegistry(services);

  return async (pluginId?: string) => {
    return registry.get(subjectFactory.service, pluginId ?? '')! as TService;
  };
}
