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
import type { SecretProvider, SecretResolverService } from './types';

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
          providers: secretProviderServiceRef,
          logger: coreServices.logger,
          pluginMetadata: coreServices.pluginMetadata,
        },
        async factory({ providers, logger, pluginMetadata }) {
          return DefaultSecretResolverService.create({
            providers,
            logger,
            consumer: { pluginId: pluginMetadata.getId() },
          });
        },
      }),
  },
);
