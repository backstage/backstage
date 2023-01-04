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

import {
  Content,
  ContentHeader,
  Header,
  Page,
  SupportButton,
} from '@backstage/core-components';
import {
  EntityKindPicker,
  EntityListProvider,
  EntitySearchBar,
  EntityTagPicker,
  CatalogFilterLayout,
  UserListPicker,
} from '@backstage/plugin-catalog-react';
import { CategoryPicker } from './CategoryPicker';
import { RegisterExistingButton } from './RegisterExistingButton';
import { useRouteRef } from '@backstage/core-plugin-api';
import { TemplateGroupFilter, TemplateGroups } from './TemplateGroups';
import { registerComponentRouteRef } from '../../routes';

export type TemplateListPageProps = {
  TemplateCardComponent?: React.ComponentType<{
    template: TemplateEntityV1beta3;
  }>;
  groups?: TemplateGroupFilter[];
};

const defaultGroup: TemplateGroupFilter = {
  title: 'All Templates',
  filter: () => true,
};

export const TemplateListPage = (props: TemplateListPageProps) => {
  const registerComponentLink = useRouteRef(registerComponentRouteRef);
  const { TemplateCardComponent, groups = [] } = props;

  return (
    <EntityListProvider>
      <Page themeId="website">
        <Header
          pageTitleOverride="Create a new component"
          title="Create a new component"
          subtitle="Create new software components using standard templates in your organization"
        />
        <Content>
          <ContentHeader title="Available Templates">
            <RegisterExistingButton
              title="Register Existing Component"
              to={registerComponentLink && registerComponentLink()}
            />
            <SupportButton>
              Create new software components using standard templates. Different
              templates create different kinds of components (services,
              websites, documentation, ...).
            </SupportButton>
          </ContentHeader>

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
                groups={[...groups, defaultGroup]}
                TemplateCardComponent={TemplateCardComponent}
              />
            </CatalogFilterLayout.Content>
          </CatalogFilterLayout>
        </Content>
      </Page>
    </EntityListProvider>
  );
};
