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

import {
  coreExtensionData,
  createExtensionInput,
  PageBlueprint,
  SubPageBlueprint,
} from '@backstage/frontend-plugin-api';
import { rootRouteRef } from '../routes';
import {
  FormFieldBlueprint,
  formFieldsApiRef,
  scaffolderGroupFilterDataRef,
} from '@backstage/plugin-scaffolder-react/alpha';

export const scaffolderPage = PageBlueprint.makeWithOverrides({
  inputs: {
    formFields: createExtensionInput([
      FormFieldBlueprint.dataRefs.formFieldLoader,
    ]),
  },
  factory(originalFactory) {
    return originalFactory({
      routeRef: rootRouteRef,
      path: '/create',
      title: 'Create',
    });
  },
});

export const scaffolderTemplatesSubPage = SubPageBlueprint.makeWithOverrides({
  name: 'templates',
  inputs: {
    filters: createExtensionInput([coreExtensionData.reactElement]),
    groups: createExtensionInput([scaffolderGroupFilterDataRef]),
  },
  factory(originalFactory, { inputs, apis }) {
    const formFieldsApi = apis.get(formFieldsApiRef);
    return originalFactory({
      path: 'templates',
      title: 'Templates',
      loader: async () => {
        const formFields = (await formFieldsApi?.loadFormFields()) ?? [];

        const filters = inputs.filters.map(filter =>
          filter.get(coreExtensionData.reactElement),
        );

        const groups = inputs.groups.length
          ? inputs.groups.map(group => group.get(scaffolderGroupFilterDataRef))
          : undefined;

        return import('./components/TemplatesSubPage').then(m => (
          <m.TemplatesSubPage
            formFields={formFields}
            filters={<>{filters}</>}
            groups={groups}
          />
        ));
      },
    });
  },
});

export const scaffolderTasksSubPage = SubPageBlueprint.make({
  name: 'tasks',
  params: {
    path: 'tasks',
    title: 'Tasks',
    loader: () =>
      import('./components/TasksSubPage').then(m => <m.TasksSubPage />),
  },
});

export const scaffolderActionsSubPage = SubPageBlueprint.make({
  name: 'actions',
  params: {
    path: 'actions',
    title: 'Actions',
    loader: () =>
      Promise.all([
        import('../components/ActionsPage'),
        import('@backstage/core-components'),
      ]).then(([m, { Content }]) => (
        <Content>
          <m.ActionPageContent />
        </Content>
      )),
  },
});

export const scaffolderEditorSubPage = SubPageBlueprint.make({
  name: 'editor',
  params: {
    path: 'edit',
    title: 'Template Editor',
    loader: () =>
      import('./components/EditorSubPage').then(m => <m.EditorSubPage />),
  },
});

export const scaffolderTemplatingExtensionsSubPage = SubPageBlueprint.make({
  name: 'templating-extensions',
  params: {
    path: 'templating-extensions',
    title: 'Templating Extensions',
    loader: () =>
      Promise.all([
        import('../components/TemplatingExtensionsPage'),
        import('@backstage/core-components'),
      ]).then(([m, { Content }]) => (
        <Content>
          <m.TemplatingExtensionsPageContent linkLocal />
        </Content>
      )),
  },
});

export default [
  scaffolderPage,
  scaffolderTemplatesSubPage,
  scaffolderTasksSubPage,
  scaffolderActionsSubPage,
  scaffolderEditorSubPage,
  scaffolderTemplatingExtensionsSubPage,
];
