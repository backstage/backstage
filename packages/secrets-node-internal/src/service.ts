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
import { DefaultSecretsService } from './DefaultSecretsService';
import { createSecretProviderRegistry } from './SecretProviderRegistry';
import type { SecretProvider, SecretsService } from './types';

/**
 * Plugin-scoped, multiton service ref that {@link SecretProvider} implementations
 * register against.
 *
 * @remarks
 *
 * Providers are plugin scoped so their factories can depend on plugin-scoped
 * services such as `coreServices.pluginMetadata` or the Connection Service, as
 * well as root services. Each plugin gets its own provider instance. Register a
 * provider by adding a service factory bound to this ref; the resolver selects
 * it by its `id`.
 *
 * @public
 */
export const secretProviderServiceRef = createServiceRef<SecretProvider>({
  id: 'secrets.provider',
  scope: 'plugin',
  multiton: true,
});

/**
 * Plugin-scoped {@link SecretsService} that routes references to the registered
 * {@link secretProviderServiceRef} providers.
 *
 * @remarks
 *
 * The resolver is plugin scoped, so it routes through this plugin's own
 * provider instances, whose identity is bound by dependency injection. It
 * validates provider ids once when this plugin's resolver is initialized.
 *
 * @public
 */
export const secretsServiceRef = createServiceRef<SecretsService>({
  id: 'secrets',
  scope: 'plugin',
  defaultFactory: async service =>
    createServiceFactory({
      service,
      deps: {
        providers: secretProviderServiceRef,
        logger: coreServices.logger,
      },
      async factory({ providers, logger }) {
        return DefaultSecretsService.create({
          registry: createSecretProviderRegistry(providers),
          logger,
        });
      },
    }),
});
