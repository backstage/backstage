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

import {
  configApiRef,
  identityApiRef,
  analyticsApiRef,
  createApiFactory,
  createApiExtension,
  createExtensionOverrides,
} from '@backstage/frontend-plugin-api';

import { GoogleAnalytics4 } from './apis/implementations/AnalyticsApi';

/**
 * @alpha
 */
export default createExtensionOverrides({
  extensions: [
    // Overrides the default analytics API with a Google Analytics 4 implementation.
    createApiExtension({
      factory: createApiFactory({
        api: analyticsApiRef,
        deps: { configApi: configApiRef, identityApi: identityApiRef },
        factory: ({ configApi, identityApi }) => {
          return GoogleAnalytics4.fromConfig(configApi, {
            identityApi,
          });
        },
      }),
    }),
  ],
});
