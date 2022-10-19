/*
 * Copyright 2020 The Backstage Authors
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
  createSubRouteRef,
} from '@backstage/core-plugin-api';

export const registerComponentRouteRef = createExternalRouteRef({
  id: 'register-component',
  optional: true,
});

export const viewTechDocRouteRef = createExternalRouteRef({
  id: 'view-techdoc',
  optional: true,
  params: ['namespace', 'kind', 'name'],
});

export const rootRouteRef = createRouteRef({
  id: 'scaffolder',
});

/**
 * @deprecated This is the old template route, can be deleted before next major release
 */
export const legacySelectedTemplateRouteRef = createSubRouteRef({
  id: 'scaffolder/legacy/selected-template',
  parent: rootRouteRef,
  path: '/templates/:templateName',
});

export const nextRouteRef = createRouteRef({
  id: 'scaffolder/next',
});

export const selectedTemplateRouteRef = createSubRouteRef({
  id: 'scaffolder/selected-template',
  parent: rootRouteRef,
  path: '/templates/:namespace/:templateName',
});

export const nextSelectedTemplateRouteRef = createSubRouteRef({
  id: 'scaffolder/next/selected-template',
  parent: nextRouteRef,
  path: '/templates/:namespace/:templateName',
});

export const scaffolderTaskRouteRef = createSubRouteRef({
  id: 'scaffolder/task',
  parent: rootRouteRef,
  path: '/tasks/:taskId',
});

export const nextScaffolderTaskRouteRef = createSubRouteRef({
  id: 'scaffolder/next/task',
  parent: nextRouteRef,
  path: '/tasks/:taskId',
});

export const scaffolderListTaskRouteRef = createSubRouteRef({
  id: 'scaffolder/list-tasks',
  parent: rootRouteRef,
  path: '/tasks',
});

export const actionsRouteRef = createSubRouteRef({
  id: 'scaffolder/actions',
  parent: rootRouteRef,
  path: '/actions',
});

export const editRouteRef = createSubRouteRef({
  id: 'scaffolder/edit',
  parent: rootRouteRef,
  path: '/edit',
});
