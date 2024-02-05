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
  createApiExtension,
  createApiFactory,
  createPlugin,
} from '@backstage/frontend-plugin-api';
import { convertLegacyRouteRef } from '@backstage/core-compat-api';
import { ApiEntity } from '@backstage/catalog-model';

import { defaultDefinitionWidgets } from './components/ApiDefinitionCard';
import { rootRoute, registerComponentRouteRef } from './routes';
import { apiDocsConfigRef } from './config';

const ApiDocsConfigApi = createApiExtension({
  factory: createApiFactory({
    api: apiDocsConfigRef,
    deps: {},
    factory: () => {
      const definitionWidgets = defaultDefinitionWidgets();
      return {
        getApiDefinitionWidget: (apiEntity: ApiEntity) => {
          return definitionWidgets.find(d => d.type === apiEntity.spec.type);
        },
      };
    },
  }),
});

export default createPlugin({
  id: 'api-docs',
  routes: {
    root: convertLegacyRouteRef(rootRoute),
  },
  externalRoutes: {
    registerApi: convertLegacyRouteRef(registerComponentRouteRef),
  },
  extensions: [ApiDocsConfigApi],
});
