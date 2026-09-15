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
  ApiBlueprint,
  createExtensionInput,
  discoveryApiRef,
  fetchApiRef,
  identityApiRef,
  PageBlueprint,
  SubPageBlueprint,
} from '@backstage/frontend-plugin-api';
import { z } from 'zod/v4';
import {
  createZodV4FilterPredicateSchema,
  filterPredicateToFilterFunction,
} from '@backstage/filter-predicates';
import { rootRouteRef } from '../routes';
import CreateComponentIcon from '@material-ui/icons/AddCircleOutline';
import {
  FormFieldBlueprint,
  formFieldsApiRef,
  scaffolderTemplateOutputsComponentRef,
  scaffolderTemplateOutputTemplateRefsRef,
} from '@backstage/plugin-scaffolder-react/alpha';
import { scmIntegrationsApiRef } from '@backstage/integration-react';
import {
  scaffolderApiRef,
  TemplateGroupFilter,
} from '@backstage/plugin-scaffolder-react';
import { ReactRouterV6PageRouter } from '@backstage/plugin-app-react-router-v6';
import { ScaffolderClient } from '../api';

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
      icon: <CreateComponentIcon fontSize="inherit" />,
    });
  },
});

export const scaffolderTemplatesSubPage = SubPageBlueprint.makeWithOverrides({
  name: 'templates',
  configSchema: {
    enableBackstageUi: z.boolean().optional().default(false),
    groups: z
      .array(
        z.object({
          title: z.string(),
          filter: createZodV4FilterPredicateSchema(),
        }),
      )
      .optional(),
    templateFilter: createZodV4FilterPredicateSchema().optional(),
  },
  factory(originalFactory, { apis, config }) {
    const formFieldsApi = apis.get(formFieldsApiRef);

    const groups: TemplateGroupFilter[] | undefined = config.groups?.map(
      group => ({
        title: group.title,
        filter: filterPredicateToFilterFunction(group.filter),
      }),
    );
    const templateFilter =
      config.templateFilter === undefined
        ? undefined
        : filterPredicateToFilterFunction(config.templateFilter);

    return originalFactory({
      path: 'templates',
      title: 'Templates',
      loader: async () => {
        const formFields = (await formFieldsApi?.loadFormFields()) ?? [];

        // The sub-page routes with React Router v6: it picks between the
        // template list and the wizard with its own `<Routes>`, and the wizard
        // reads the selected template with `useRouteRefParams` from
        // `@backstage/core-plugin-api`, which is still React Router's
        // `useParams`. Declared on the sub-page rather than on the page above,
        // because the sub-page's own mount is what those routes are relative
        // to.
        return import('./components/TemplatesSubPage').then(m => (
          <ReactRouterV6PageRouter>
            <m.TemplatesSubPage
              formFields={formFields}
              groups={groups}
              templateFilter={templateFilter}
              formProps={{
                EXPERIMENTAL_theme: config.enableBackstageUi ? 'bui' : 'mui',
              }}
            />
          </ReactRouterV6PageRouter>
        ));
      },
    });
  },
});

export const scaffolderTasksSubPage = SubPageBlueprint.makeWithOverrides({
  name: 'tasks',
  inputs: {
    templateOutputsComponents: createExtensionInput(
      [
        scaffolderTemplateOutputsComponentRef,
        scaffolderTemplateOutputTemplateRefsRef,
      ],
      { optional: true },
    ),
  },
  factory(originalFactory, { inputs }) {
    return originalFactory({
      path: 'tasks',
      title: 'Tasks',
      loader: async () => {
        const templateOutputsComponents = inputs.templateOutputsComponents?.map(
          input => ({
            component: input.get(scaffolderTemplateOutputsComponentRef),
            templateRefs: input.get(scaffolderTemplateOutputTemplateRefsRef),
          }),
        );
        return import('./components/TasksSubPage').then(m => (
          <ReactRouterV6PageRouter>
            <m.TasksSubPage
              templateOutputsComponents={templateOutputsComponents}
            />
          </ReactRouterV6PageRouter>
        ));
      },
    });
  },
});

export const scaffolderActionsSubPage = SubPageBlueprint.make({
  name: 'actions',
  params: {
    path: 'actions',
    title: 'Actions',
    // `ActionPageContent` renders each selected action's description through
    // `MarkdownContent`, which renders `Link` from
    // `@backstage/core-components` for every anchor in the markdown, and that
    // `Link` renders react-router's `Link` for any href without a URL scheme.
    // The `useRouteRef` calls elsewhere in that module belong to the legacy
    // full-page `ActionsPage`, which this loader never renders. The framework
    // provides no routing library context at page depth, so the sub-page
    // declares the one it uses. Action descriptions carry app-absolute or
    // in-page targets, so this needs a router to exist rather than needing
    // this particular scope.
    loader: () =>
      Promise.all([
        import('../components/ActionsPage'),
        import('@backstage/core-components'),
      ]).then(([m, { Content }]) => (
        <ReactRouterV6PageRouter>
          <Content>
            <m.ActionPageContent />
          </Content>
        </ReactRouterV6PageRouter>
      )),
  },
});

export const scaffolderEditorSubPage = SubPageBlueprint.make({
  name: 'editor',
  params: {
    path: 'edit',
    title: 'Template Editor',
    // Routes between the editor's own screens with `<Routes>` and moves
    // between them with React Router's `useNavigate`.
    loader: () =>
      import('./components/EditorSubPage').then(m => (
        <ReactRouterV6PageRouter>
          <m.EditorSubPage />
        </ReactRouterV6PageRouter>
      )),
  },
});

export const scaffolderTemplatingExtensionsSubPage = SubPageBlueprint.make({
  name: 'templating-extensions',
  params: {
    path: 'templating-extensions',
    title: 'Templating Extensions',
    // Resolves its own deep-link anchors with `useRouteRef` from
    // `@backstage/core-plugin-api`, which is still React Router's
    // `useLocation`, and renders them through `Link` from
    // `@backstage/core-components`, which is React Router's own `Link`. With
    // `linkLocal` those links stay in-app, so they take the router branch
    // rather than the plain `<a>` one.
    loader: () =>
      Promise.all([
        import('../components/TemplatingExtensionsPage'),
        import('@backstage/core-components'),
      ]).then(([m, { Content }]) => (
        <ReactRouterV6PageRouter>
          <Content>
            <m.TemplatingExtensionsPageContent linkLocal />
          </Content>
        </ReactRouterV6PageRouter>
      )),
  },
});

export const repoUrlPickerFormField = FormFieldBlueprint.make({
  name: 'repo-url-picker',
  params: {
    field: () => import('./fields/RepoUrlPicker').then(m => m.RepoUrlPicker),
  },
});

export const entityNamePickerFormField = FormFieldBlueprint.make({
  name: 'entity-name-picker',
  params: {
    field: () =>
      import('./fields/EntityNamePicker').then(m => m.EntityNamePicker),
  },
});

export const entityPickerFormField = FormFieldBlueprint.make({
  name: 'entity-picker',
  params: {
    field: () => import('./fields/EntityPicker').then(m => m.EntityPicker),
  },
});

export const ownerPickerFormField = FormFieldBlueprint.make({
  name: 'owner-picker',
  params: {
    field: () => import('./fields/OwnerPicker').then(m => m.OwnerPicker),
  },
});

export const entityTagsPickerFormField = FormFieldBlueprint.make({
  name: 'entity-tags-picker',
  params: {
    field: () =>
      import('./fields/EntityTagsPicker').then(m => m.EntityTagsPicker),
  },
});

export const multiEntityPickerFormField = FormFieldBlueprint.make({
  name: 'multi-entity-picker',
  params: {
    field: () =>
      import('./fields/MultiEntityPicker').then(m => m.MultiEntityPicker),
  },
});

export const myGroupsPickerFormField = FormFieldBlueprint.make({
  name: 'my-groups-picker',
  params: {
    field: () => import('./fields/MyGroupsPicker').then(m => m.MyGroupsPicker),
  },
});

export const ownedEntityPickerFormField = FormFieldBlueprint.make({
  name: 'owned-entity-picker',
  params: {
    field: () =>
      import('./fields/OwnedEntityPicker').then(m => m.OwnedEntityPicker),
  },
});

export const repoBranchPickerFormField = FormFieldBlueprint.make({
  name: 'repo-branch-picker',
  params: {
    field: () =>
      import('./fields/RepoBranchPicker').then(m => m.RepoBranchPicker),
  },
});

export const repoOwnerPickerFormField = FormFieldBlueprint.make({
  name: 'repo-owner-picker',
  params: {
    field: () =>
      import('./fields/RepoOwnerPicker').then(m => m.RepoOwnerPicker),
  },
});

export const scaffolderApi = ApiBlueprint.make({
  params: defineParams =>
    defineParams({
      api: scaffolderApiRef,
      deps: {
        discoveryApi: discoveryApiRef,
        scmIntegrationsApi: scmIntegrationsApiRef,
        fetchApi: fetchApiRef,
        identityApi: identityApiRef,
      },
      factory: ({ discoveryApi, scmIntegrationsApi, fetchApi, identityApi }) =>
        new ScaffolderClient({
          discoveryApi,
          scmIntegrationsApi,
          fetchApi,
          identityApi,
        }),
    }),
});
