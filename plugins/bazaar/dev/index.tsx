/*
 * Copyright 2021 The Backstage Authors
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
import { createDevApp } from '@backstage/dev-utils';
import { CatalogApi, catalogApiRef } from '@backstage/plugin-catalog-react';
import { bazaarPlugin, BazaarPage } from '../src/plugin';
import { bazaarApiRef } from '../src/api';

import getProjectsData from './__fixtures__/get-projects-response.json';

createDevApp()
  .registerPlugin(bazaarPlugin)
  .registerApi({
    api: bazaarApiRef,
    deps: {},
    factory: () =>
      ({
        getProjects: async () => getProjectsData,
      } as any),
  })
  .registerApi({
    api: catalogApiRef,
    deps: {},
    factory: () =>
      ({
        getEntities: () => ({}),
      } as CatalogApi),
  })
  .addPage({
    element: <BazaarPage />,
    title: 'Root Page',
  })
  .render();
