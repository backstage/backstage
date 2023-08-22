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

import React from 'react';
import {
  createExtension,
  createPlugin,
  coreExtensionData,
} from '@backstage/frontend-plugin-api';
import { Router as GraphiQLPage } from '@backstage/plugin-graphiql';

export const GraphiqlPageExtension = createExtension({
  output: {
    component: coreExtensionData.reactComponent,
    path: coreExtensionData.routePath,
  },
  factory({ bind, config }) {
    bind.component(() => {
      return <GraphiQLPage />;
    });
    // TODO: In need of schemas and type safety
    bind.path((config as { path: string }).path);
  },
});

export const graphiqlPlugin = createPlugin({
  id: 'graphiql',
  defaultExtensionInstances: [
    {
      id: 'graphiql.page',
      at: 'core.router/routes',
      extension: GraphiqlPageExtension,
      config: { path: '/graphiql' },
    },
  ],
});
