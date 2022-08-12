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

import { Backend, createSpecializedBackend } from '@backstage/backend-app-api';
import {
  AnyServiceFactory,
  ServiceRef,
  createServiceFactory,
  BackendRegistrable,
} from '@backstage/backend-plugin-api';

/** @alpha */
export interface TestBackendOptions<TServices extends any[]> {
  services: readonly [
    ...{
      [index in keyof TServices]:
        | AnyServiceFactory
        | [ServiceRef<TServices[index]>, Partial<TServices[index]>];
    },
  ];
}

/** @alpha */
export function createTestBackend<TServices extends any[]>(
  options: TestBackendOptions<TServices>,
): Backend {
  const factories = options.services?.map(serviceDef => {
    if (Array.isArray(serviceDef)) {
      return createServiceFactory({
        service: serviceDef[0],
        deps: {},
        factory: async () => async () => serviceDef[1],
      });
    }
    return serviceDef as AnyServiceFactory;
  });
  return createSpecializedBackend({ services: factories ?? [] });
}

/** @alpha */
export async function startTestBackend<TServices extends any[]>(
  options: TestBackendOptions<TServices> & {
    registrables?: BackendRegistrable[];
  },
): Promise<void> {
  const { registrables = [], ...otherOptions } = options;
  const backend = createTestBackend(otherOptions);
  for (const reg of registrables) {
    backend.add(reg);
  }
  await backend.start();
}
