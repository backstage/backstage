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

import {
  ApiBlueprint,
  AppRootElementBlueprint,
  createFrontendPlugin,
  discoveryApiRef,
  identityApiRef,
} from '@backstage/frontend-plugin-api';
import { signalApiRef } from '@backstage/plugin-signals-react';
import { SignalClient } from './api/SignalClient';
import { SignalsDisplay } from './plugin';
import { compatWrapper } from '@backstage/core-compat-api';

const api = ApiBlueprint.make({
  params: defineParams =>
    defineParams({
      api: signalApiRef,
      deps: {
        identity: identityApiRef,
        discoveryApi: discoveryApiRef,
      },
      factory: ({ identity, discoveryApi }) => {
        return SignalClient.create({
          identity,
          discoveryApi,
        });
      },
    }),
});

const signalsDisplayAppRootElement = AppRootElementBlueprint.make({
  name: 'signals-display',
  params: {
    element: compatWrapper(<SignalsDisplay />),
  },
});

/** @alpha */
export default createFrontendPlugin({
  pluginId: 'signals',
  info: { packageJson: () => import('../package.json') },
  extensions: [api, signalsDisplayAppRootElement],
});
