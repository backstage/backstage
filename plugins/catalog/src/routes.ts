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

import {
  createExternalRouteRef,
  createRouteRef,
} from '@backstage/core-plugin-api';

export const createComponentRouteRef = createExternalRouteRef({
  id: 'create-component',
  optional: true,
  defaultTarget: 'scaffolder.createComponent',
});

export const viewTechDocRouteRef = createExternalRouteRef({
  id: 'view-techdoc',
  optional: true,
  params: ['namespace', 'kind', 'name'],
  defaultTarget: 'techdocs.docRoot',
});

export const createFromTemplateRouteRef = createExternalRouteRef({
  id: 'create-from-template',
  optional: true,
  params: ['namespace', 'templateName'],
  defaultTarget: 'scaffolder.selectedTemplate',
});

export const unregisterRedirectRouteRef = createExternalRouteRef({
  id: 'catalog:unregister-redirect',
  optional: true,
});

export const rootRouteRef = createRouteRef({
  id: 'catalog',
});
