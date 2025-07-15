/*
 * Copyright 2025 The Backstage Authors
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
import { createBackend } from '@backstage/backend-defaults';
import { mockServices } from '@backstage/backend-test-utils';

void (async () => {
  const backend = createBackend();

  // Mocking the auth and httpAuth service allows you to call your plugin API without
  // having to authenticate.
  //
  // If you want to use real auth, you can install the following instead:
  //   backend.add(import('@backstage/plugin-auth-backend'));
  //   backend.add(import('@backstage/plugin-auth-backend-module-guest-provider'));
  backend.add(mockServices.auth.factory());
  backend.add(mockServices.httpAuth.factory());
  backend.add(mockServices.scheduler.factory());

  backend.add(mockServices.database.factory());
  backend.add(mockServices.logger.factory());
  backend.add(mockServices.urlReader.factory());
  backend.add(mockServices.discovery.factory());
  backend.add(mockServices.httpRouter.factory());
  backend.add(mockServices.permissionsRegistry.factory());
  backend.add(import('../src'));

  await backend.start();
})();
