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
import { createAzureDevOpsWebhookValidator } from '../http/createAzureDevOpsWebhookValidator';

/**
 * Module for the events-backend plugin,
 * registering an HTTP POST ingress for Azure DevOps webhook events.
 *
 * The ingress is only registered when
 * `events.modules.azureDevOps.webhookSecret` is configured.
 * Incoming requests are validated against the `x-ado-webhook-secret`
 * custom header using timing-safe comparison.
 *
 * @public
 */
export default createBackendModule({
  pluginId: 'events',
  moduleId: 'azure-dev-ops-webhook',
  register(env) {
    env.registerInit({
      deps: {
        config: coreServices.rootConfig,
        events: eventsExtensionPoint,
      },
      async init({ config, events }) {
        const validator = createAzureDevOpsWebhookValidator(config);
        if (validator) {
          events.addHttpPostIngress({
            topic: 'azureDevOps',
            validator,
          });
        }
      },
    });
  },
});
