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
  createPageExtension,
  createPlugin,
} from '@backstage/frontend-plugin-api';

/**
 * @alpha
 */
export const GraphiqlPage = createPageExtension({
  id: 'graphiql.page',
  defaultPath: '/graphiql',
  component: () => import('./components').then(m => <m.GraphiQLPage />),
});

/**
 * @alpha
 */
export const graphiqlPlugin = createPlugin({
  id: 'graphiql',
  extensions: [GraphiqlPage],
});
