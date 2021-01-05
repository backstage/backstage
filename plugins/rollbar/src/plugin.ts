/*
 * Copyright 2020 Spotify AB
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
  createPlugin,
  createApiFactory,
  discoveryApiRef,
  identityApiRef,
} from '@backstage/core';
import { rootRouteRef, entityRouteRef } from './routes';
import { RollbarHome } from './components/RollbarHome/RollbarHome';
import { RollbarProjectPage } from './components/RollbarProjectPage/RollbarProjectPage';
import { rollbarApiRef } from './api/RollbarApi';
import { RollbarClient } from './api/RollbarClient';

export const plugin = createPlugin({
  id: 'rollbar',
  apis: [
    createApiFactory({
      api: rollbarApiRef,
      deps: { discoveryApi: discoveryApiRef, identityApi: identityApiRef },
      factory: ({ discoveryApi, identityApi }) =>
        new RollbarClient({ discoveryApi, identityApi }),
    }),
  ],
  register({ router }) {
    router.addRoute(rootRouteRef, RollbarHome);
    router.addRoute(entityRouteRef, RollbarProjectPage);
  },
});
