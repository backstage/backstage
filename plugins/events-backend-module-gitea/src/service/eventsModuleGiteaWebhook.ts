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
  createBackendModule,
} from '@backstage/backend-plugin-api';
import { eventsExtensionPoint } from '@backstage/plugin-events-node/alpha';
import { createGiteaSignatureValidator } from '../http/createGiteaSignatureValidator';

/**
 * Module for the events-backend plugin,
 * registering an HTTP POST ingress with request validator
 * which verifies the webhook signature based on a secret.
 *
 * @public
 */
export default createBackendModule({
  pluginId: 'events',
  moduleId: 'gitea-webhook',
  register(env) {
    env.registerInit({
      deps: {
        config: coreServices.rootConfig,
        events: eventsExtensionPoint,
      },
      async init({ config, events }) {
        const validator = createGiteaSignatureValidator(config);
        if (validator) {
          events.addHttpPostIngress({
            topic: 'gitea',
            validator,
          });
        }
      },
    });
  },
});
