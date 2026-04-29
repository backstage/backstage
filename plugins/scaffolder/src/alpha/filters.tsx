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

import { ScaffolderFilterBlueprint } from '@backstage/plugin-scaffolder-react/alpha';
import { z } from 'zod/v4';

const scaffolderSearchbar = ScaffolderFilterBlueprint.make({
  name: 'searchbar',
  params: {
    loader: async () => {
      const { EntitySearchBar } = await import(
        '@backstage/plugin-catalog-react'
      );
      return <EntitySearchBar />;
    },
  },
});

const scaffolderTemplateKindFilter = ScaffolderFilterBlueprint.make({
  name: 'template-kind',
  params: {
    loader: async () => {
      const { EntityKindPicker } = await import(
        '@backstage/plugin-catalog-react'
      );
      return <EntityKindPicker initialFilter="template" hidden />;
    },
  },
});

const scaffolderUsersListFilter = ScaffolderFilterBlueprint.makeWithOverrides({
  name: 'user-list',
  configSchema: {
    initialFilter: z.enum(['starred', 'all']).default('all'),
  },
  factory(originalFactory, { config }) {
    return originalFactory({
      loader: async () => {
        const { UserListPicker } = await import(
          '@backstage/plugin-catalog-react'
        );
        return <UserListPicker initialFilter={config.initialFilter} />;
      },
    });
  },
});

const scaffolderCategoryFilter = ScaffolderFilterBlueprint.make({
  name: 'category',
  params: {
    loader: async () => {
      const { TemplateCategoryPicker } = await import(
        '@backstage/plugin-scaffolder-react/alpha'
      );
      return <TemplateCategoryPicker />;
    },
  },
});

const scaffolderTagFilter = ScaffolderFilterBlueprint.make({
  name: 'tag',
  params: {
    loader: async () => {
      const { EntityTagPicker } = await import(
        '@backstage/plugin-catalog-react'
      );
      return <EntityTagPicker />;
    },
  },
});

const scaffolderOwnerFilter = ScaffolderFilterBlueprint.make({
  name: 'owner',
  params: {
    loader: async () => {
      const { EntityOwnerPicker } = await import(
        '@backstage/plugin-catalog-react'
      );
      return <EntityOwnerPicker />;
    },
  },
});

// this is the default order that the filters will be applied in
export default [
  scaffolderSearchbar,
  scaffolderTemplateKindFilter,
  scaffolderUsersListFilter,
  scaffolderCategoryFilter,
  scaffolderTagFilter,
  scaffolderOwnerFilter,
];
