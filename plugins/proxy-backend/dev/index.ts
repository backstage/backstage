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

import { createBackend } from '@backstage/backend-defaults';
import { createBackendModule } from '@backstage/backend-plugin-api';
import { proxyEndpointsExtensionPoint } from '@backstage/plugin-proxy-node/alpha';

const backend = createBackend();
backend.add(import('../src'));

backend.add(
  createBackendModule({
    pluginId: 'proxy',
    moduleId: 'demo-additional-endpoints',
    register: reg => {
      reg.registerInit({
        deps: {
          proxyEndpoints: proxyEndpointsExtensionPoint,
        },
        init: async ({ proxyEndpoints }) => {
          proxyEndpoints.addProxyEndpoints({
            ...Object.fromEntries(
              ['foo', 'bar', 'baz'].map(msv => [
                `/${msv}`,
                { target: `http://${msv}.org` },
              ]),
            ),
            '/gocd': 'http://cannot-override-config.no',
          });
        },
      });
    },
  }),
);

backend.start();
