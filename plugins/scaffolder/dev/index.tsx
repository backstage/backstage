/*
 * Copyright 2020 Spotify AB
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
import { discoveryApiRef, identityApiRef } from '@backstage/core';
import { CatalogClient } from '@backstage/catalog-client';
import { catalogApiRef } from '@backstage/plugin-catalog-react';
import { TemplateIndexPage, TemplatePage } from '../src/plugin';
import { ScaffolderApi, scaffolderApiRef } from '../src';

createDevApp()
  .registerApi({
    api: catalogApiRef,
    deps: { discoveryApi: discoveryApiRef },
    factory: ({ discoveryApi }) => new CatalogClient({ discoveryApi }),
  })
  .registerApi({
    api: scaffolderApiRef,
    deps: { discoveryApi: discoveryApiRef, identityApi: identityApiRef },
    factory: ({ discoveryApi, identityApi }) =>
      new ScaffolderApi({ discoveryApi, identityApi }),
  })
  .addPage({
    path: '/create',
    title: 'Create',
    element: <TemplateIndexPage />,
  })
  .addPage({
    path: '/create/:templateName',
    element: <TemplatePage />,
  })
  .render();
