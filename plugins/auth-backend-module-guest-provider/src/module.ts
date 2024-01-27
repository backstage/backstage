/*
 * Copyright 2024 The Backstage Authors
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
  createBackendModule,
} from '@backstage/backend-plugin-api';
import { authProvidersExtensionPoint } from '@backstage/plugin-auth-node';
import { createGuestAuthProviderFactory } from './createGuestAuthFactory';

/** @public */
export const authModuleGuestProvider = createBackendModule({
  pluginId: 'auth',
  moduleId: 'guest-provider',
  register(reg) {
    reg.registerInit({
      deps: {
        logger: coreServices.logger,
        providers: authProvidersExtensionPoint,
      },
      async init({ providers }) {
        if (process.env.NODE_ENV === 'production') {
          throw new Error(
            'Guest provider does not support authenticating production workloads.',
          );
        }
        providers.registerProvider({
          providerId: 'guest',
          factory: createGuestAuthProviderFactory(),
        });
      },
    });
  },
});
