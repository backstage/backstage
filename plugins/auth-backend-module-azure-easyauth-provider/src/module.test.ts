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

import { mockServices, startTestBackend } from '@backstage/backend-test-utils';
import authPlugin from '@backstage/plugin-auth-backend';
import { authModuleAzureEasyAuthProvider } from './module';

const rootConfig = mockServices.rootConfig.factory({
  data: {
    app: {
      baseUrl: 'http://localhost:3000',
    },
    auth: {
      providers: {
        azureEasyAuth: {
          signIn: {
            resolvers: [{ resolver: 'idMatchingUserEntityAnnotation' }],
          },
        },
      },
    },
  },
});

const features = [authPlugin, authModuleAzureEasyAuthProvider, rootConfig];

describe('authModuleAzureEasyAuthProvider', () => {
  const env = process.env;
  beforeEach(() => {
    jest.resetModules();
    process.env = { ...env };
  });
  afterEach(() => {
    process.env = env;
  });

  it('should fail when run outside of Azure App Services', async () => {
    await expect(startTestBackend({ features })).rejects.toThrow(
      'Backstage is not running on Azure App Services',
    );
  });

  it('should fail when Azure App Services Auth is not enabled', async () => {
    process.env.WEBSITE_SKU = 'Standard';
    process.env.WEBSITE_AUTH_ENABLED = 'False';
    await expect(startTestBackend({ features })).rejects.toThrow(
      'Azure App Services does not have authentication enabled',
    );
  });

  it('should fail when Azure App Services Auth is not AAD', async () => {
    process.env.WEBSITE_SKU = 'Standard';
    process.env.WEBSITE_AUTH_ENABLED = 'True';
    process.env.WEBSITE_AUTH_DEFAULT_PROVIDER = 'Facebook';
    await expect(startTestBackend({ features })).rejects.toThrow(
      'Authentication provider is not Entra ID',
    );
  });

  it('should fail when Token Store not enabled', async () => {
    process.env.WEBSITE_SKU = 'Standard';
    process.env.WEBSITE_AUTH_ENABLED = 'True';
    process.env.WEBSITE_AUTH_DEFAULT_PROVIDER = 'AzureActiveDirectory';
    process.env.WEBSITE_AUTH_TOKEN_STORE = 'False';
    await expect(startTestBackend({ features })).rejects.toThrow(
      'Token Store is not enabled',
    );
  });

  it('should start successfully when running in Azure App Services with AAD Auth', async () => {
    process.env.WEBSITE_SKU = 'Standard';
    process.env.WEBSITE_AUTH_ENABLED = 'True';
    process.env.WEBSITE_AUTH_DEFAULT_PROVIDER = 'AzureActiveDirectory';
    process.env.WEBSITE_AUTH_TOKEN_STORE = 'True';
    await expect(startTestBackend({ features })).resolves.toBeInstanceOf(
      Object,
    );
  });
});
