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
  ApiBlueprint,
  createFrontendModule,
  discoveryApiRef,
  errorApiRef,
  fetchApiRef,
  identityApiRef,
  storageApiRef,
} from '@backstage/frontend-plugin-api';
import { UserSettingsStorage } from '@backstage/plugin-user-settings';
import { signalApiRef } from '@backstage/plugin-signals-react';

/** @public */
export const appModuleUserSettings = createFrontendModule({
  pluginId: 'app',
  extensions: [
    ApiBlueprint.make({
      name: 'user-settings-storage',
      params: defineParams =>
        defineParams({
          api: storageApiRef,
          deps: {
            discoveryApi: discoveryApiRef,
            fetchApi: fetchApiRef,
            errorApi: errorApiRef,
            identityApi: identityApiRef,
            signalApi: signalApiRef,
          },
          factory: deps => UserSettingsStorage.create(deps),
        }),
    }),
  ],
});
