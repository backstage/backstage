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

import { createBackendModule } from '@backstage/backend-plugin-api';
import {
  authProvidersExtensionPoint,
  commonSignInResolvers,
  createProxyAuthProviderFactory,
} from '@backstage/plugin-auth-node';
import { azureEasyAuthAuthenticator } from './authenticator';
import { azureEasyAuthSignInResolvers } from './resolvers';

/** @public */
export const authModuleAzureEasyAuthProvider = createBackendModule({
  pluginId: 'auth',
  moduleId: 'azure-easyauth-provider',
  register(reg) {
    reg.registerInit({
      deps: {
        providers: authProvidersExtensionPoint,
      },
      async init({ providers }) {
        validateAppServiceConfiguration(process.env);
        providers.registerProvider({
          providerId: 'azureEasyAuth',
          factory: createProxyAuthProviderFactory({
            authenticator: azureEasyAuthAuthenticator,
            signInResolverFactories: {
              ...commonSignInResolvers,
              ...azureEasyAuthSignInResolvers,
            },
          }),
        });
      },
    });
  },
});

function validateAppServiceConfiguration(env: NodeJS.ProcessEnv) {
  // Based on https://github.com/AzureAD/microsoft-identity-web/blob/f7403779d1a91f4a3fec0ed0993bd82f50f299e1/src/Microsoft.Identity.Web/AppServicesAuth/AppServicesAuthenticationInformation.cs#L38-L59
  //
  // It's critical to validate we're really running in a correctly configured Azure App Services,
  // As we rely on App Services to manage & validate the ID and Access Token headers
  // Without that, this users can be trivially impersonated.
  if (env.WEBSITE_SKU === undefined) {
    throw new Error('Backstage is not running on Azure App Services');
  }
  if (env.WEBSITE_AUTH_ENABLED?.toLocaleLowerCase('en-US') !== 'true') {
    throw new Error('Azure App Services does not have authentication enabled');
  }
  if (
    env.WEBSITE_AUTH_DEFAULT_PROVIDER?.toLocaleLowerCase('en-US') !==
    'azureactivedirectory'
  ) {
    throw new Error('Authentication provider is not Entra ID');
  }
  if (env.WEBSITE_AUTH_TOKEN_STORE?.toLocaleLowerCase('en-US') !== 'true') {
    throw new Error('Token Store is not enabled');
  }
}
