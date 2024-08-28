/*
 * Copyright 2023 The Backstage Authors
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
  createApiFactory,
  createComponentExtension,
  createPlugin,
  discoveryApiRef,
  identityApiRef,
} from '@backstage/core-plugin-api';
import { signalApiRef } from '@backstage/plugin-signals-react';
import { SignalClient } from './api/SignalClient';

/** @public */
export const signalsPlugin = createPlugin({
  id: 'signals',
  apis: [
    createApiFactory({
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
  ],
});

/** @public */
export const SignalsDisplay = signalsPlugin.provide(
  createComponentExtension({
    name: 'SignalsDisplay',
    component: {
      // No-op for now, this is just a placeholder to avoid the need for an explicit plugin installation
      sync: () => null,
    },
  }),
);
