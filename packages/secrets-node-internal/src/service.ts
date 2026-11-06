/*
 * Copyright 2026 The Backstage Authors
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
  createServiceFactory,
  createServiceRef,
} from '@backstage/backend-plugin-api';
import { DefaultSecretResolverService } from './DefaultSecretResolverService';
import { createSecretProviderRegistry } from './SecretProviderRegistry';
import type {
  SecretProvider,
  SecretProviderRegistry,
  SecretResolverService,
} from './types';

/**
 * Root-scoped, multiton service ref that {@link SecretProvider} implementations
 * register against.
 *
 * @remarks
 *
 * Providers are root scoped so their factories can depend on root services such
 * as `rootConfig` and `rootLogger`. Register a provider by adding a service
 * factory bound to this ref; the resolver selects it by its `id`.
 *
 * @public
 */
export const secretProviderServiceRef = createServiceRef<SecretProvider>({
  id: 'secrets.provider',
  scope: 'root',
  multiton: true,
});

/**
 * Root-scoped registry that validates the set of registered providers once and
 * exposes a lookup by id.
 *
 * @remarks
 *
 * Building the registry at root scope means a misconfiguration such as a
 * duplicate provider id surfaces as a single startup error, rather than lazily
 * and repeatedly for every plugin that depends on the resolver. It is internal
 * wiring for {@link secretResolverServiceRef} and is deliberately not exported.
 */
const secretProviderRegistryServiceRef =
  createServiceRef<SecretProviderRegistry>({
    id: 'secrets.provider-registry',
    scope: 'root',
    defaultFactory: async service =>
      createServiceFactory({
        service,
        deps: { providers: secretProviderServiceRef },
        async factory({ providers }) {
          return createSecretProviderRegistry(providers);
        },
      }),
  });

/**
 * Plugin-scoped {@link SecretResolverService} that routes references to the
 * registered {@link secretProviderServiceRef} providers.
 *
 * @remarks
 *
 * The resolver is plugin scoped so the consuming plugin's identity is derived
 * from `coreServices.pluginMetadata` rather than supplied by the caller.
 *
 * @public
 */
export const secretResolverServiceRef = createServiceRef<SecretResolverService>(
  {
    id: 'secrets.resolver',
    scope: 'plugin',
    defaultFactory: async service =>
      createServiceFactory({
        service,
        deps: {
          registry: secretProviderRegistryServiceRef,
          logger: coreServices.logger,
          pluginMetadata: coreServices.pluginMetadata,
        },
        async factory({ registry, logger, pluginMetadata }) {
          return DefaultSecretResolverService.create({
            registry,
            logger,
            consumer: { pluginId: pluginMetadata.getId() },
          });
        },
      }),
  },
);
