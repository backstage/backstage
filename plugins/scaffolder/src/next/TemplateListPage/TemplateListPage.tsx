/*
 * Copyright 2022 The Backstage Authors
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
import { TemplateEntityV1beta3 } from '@backstage/plugin-scaffolder-common';

import { Content, Header, Page } from '@backstage/core-components';
import {
  EntityKindPicker,
  EntityListProvider,
  EntitySearchBar,
  EntityTagPicker,
  CatalogFilterLayout,
  UserListPicker,
} from '@backstage/plugin-catalog-react';
import { CategoryPicker } from './CategoryPicker';
import { TemplateGroupFilter, TemplateGroups } from './TemplateGroups';
import { ContextMenu } from './ContextMenu';
import { TemplateListContentHeader } from './TemplateListContentHeader';

export type TemplateListPageProps = {
  TemplateCardComponent?: React.ComponentType<{
    template: TemplateEntityV1beta3;
  }>;
  TemplatePageHeaderComponent?: typeof Header;
  TemplateListContentHeaderComponent?: React.ComponentType<{}>;
  groups?: TemplateGroupFilter[];
  contextMenu?: {
    editor?: boolean;
    actions?: boolean;
    tasks?: boolean;
  };
};

const defaultGroup: TemplateGroupFilter = {
  title: 'Templates',
  filter: () => true,
};

const createGroupsWithOther = (
  groups: TemplateGroupFilter[],
): TemplateGroupFilter[] => [
  ...groups,
  {
    title: 'Other Templates',
    filter: e => ![...groups].some(({ filter }) => filter(e)),
  },
];

export const TemplateListPage = (props: TemplateListPageProps) => {
  const {
    TemplateCardComponent,
    TemplatePageHeaderComponent = Header,
    TemplateListContentHeaderComponent = TemplateListContentHeader,
    groups: givenGroups = [],
  } = props;

  const groups = givenGroups.length
    ? createGroupsWithOther(givenGroups)
    : [defaultGroup];

  return (
    <EntityListProvider>
      <Page themeId="website">
        <TemplatePageHeaderComponent
          pageTitleOverride="Create a new component"
          title="Create a new component"
          subtitle="Create new software components using standard templates in your organization"
        >
          <ContextMenu {...props.contextMenu} />
        </TemplatePageHeaderComponent>
        <Content>
          <TemplateListContentHeaderComponent />
          <CatalogFilterLayout>
            <CatalogFilterLayout.Filters>
              <EntitySearchBar />
              <EntityKindPicker initialFilter="template" hidden />
              <UserListPicker
                initialFilter="all"
                availableFilters={['all', 'starred']}
              />
              <CategoryPicker />
              <EntityTagPicker />
            </CatalogFilterLayout.Filters>
            <CatalogFilterLayout.Content>
              <TemplateGroups
                groups={groups}
                TemplateCardComponent={TemplateCardComponent}
              />
            </CatalogFilterLayout.Content>
          </CatalogFilterLayout>
        </Content>
      </Page>
    </EntityListProvider>
  );
};
