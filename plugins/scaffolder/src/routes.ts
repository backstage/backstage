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
  createRouteRef,
  createSubRouteRef,
} from '@backstage/frontend-plugin-api';
import { createExternalRouteRef } from '@backstage/core-plugin-api';

export const registerComponentRouteRef = createExternalRouteRef({
  id: 'register-component',
  optional: true,
  defaultTarget: 'catalog-import.importPage',
});

export const viewTechDocRouteRef = createExternalRouteRef({
  id: 'view-techdoc',
  optional: true,
  params: ['namespace', 'kind', 'name'],
  defaultTarget: 'techdocs.docRoot',
});

/**
 * @public
 */
export const rootRouteRef = createRouteRef({
  extensionId: 'page:scaffolder',
});

/**
 * @deprecated This is the old template route, can be deleted before next major release
 * @public
 */
export const legacySelectedTemplateRouteRef = createSubRouteRef({
  parent: rootRouteRef,
  path: '/templates/:templateName',
});

export const selectedTemplateRouteRef = createSubRouteRef({
  parent: rootRouteRef,
  path: '/templates/:namespace/:templateName',
});

export const scaffolderTaskRouteRef = createSubRouteRef({
  parent: rootRouteRef,
  path: '/tasks/:taskId',
});

export const scaffolderListTaskRouteRef = createSubRouteRef({
  parent: rootRouteRef,
  path: '/tasks',
});

export const actionsRouteRef = createSubRouteRef({
  parent: rootRouteRef,
  path: '/actions',
});

export const editRouteRef = createSubRouteRef({
  parent: rootRouteRef,
  path: '/edit',
});

export const editorRouteRef = createSubRouteRef({
  parent: rootRouteRef,
  path: '/template',
});

export const customFieldsRouteRef = createSubRouteRef({
  parent: rootRouteRef,
  path: '/custom-fields',
});

export const templateFormRouteRef = createSubRouteRef({
  parent: rootRouteRef,
  path: '/template-form',
});

export const templatingExtensionsRouteRef = createSubRouteRef({
  parent: rootRouteRef,
  path: '/templating-extensions',
});
