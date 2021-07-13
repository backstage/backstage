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
  Content,
  ContentHeader,
  ContentHeaderTitle,
  PageWithHeader,
  SupportButton,
  TableColumn,
  TableProps,
} from '@backstage/core-components';
import { configApiRef, useApi } from '@backstage/core-plugin-api';
import {
  EntityKindPicker,
  EntityLifecyclePicker,
  EntityListProvider,
  EntityOwnerPicker,
  EntityTagPicker,
  EntityTypePicker,
  UserListFilterKind,
  UserListPicker,
} from '@backstage/plugin-catalog-react';
import { BackstageTheme } from '@backstage/theme';
import { Box, Grid, IconButton, useMediaQuery } from '@material-ui/core';
import FilterListIcon from '@material-ui/icons/FilterList';
import React, { useState } from 'react';
import { CatalogTable } from '../CatalogTable';
import { EntityRow } from '../CatalogTable/types';
import { CreateComponentButton } from '../CreateComponentButton/CreateComponentButton';
import { FilterContainer } from '../FilterContainer';
import { FilteredTableLayout } from '../FilteredTableLayout';

export type CatalogPageProps = {
  initiallySelectedFilter?: UserListFilterKind;
  columns?: TableColumn<EntityRow>[];
  actions?: TableProps<EntityRow>['actions'];
};

const CatalogPageHeaderAction = ({
  showFilter,
  toggleFilter,
  isMidSizeScreen,
}: {
  showFilter: boolean;
  toggleFilter: (showFilter: boolean) => void;
  isMidSizeScreen: boolean;
}) =>
  isMidSizeScreen ? (
    <Box display="flex" alignItems="center">
      <ContentHeaderTitle title="Components" />
      <IconButton onClick={() => toggleFilter(!showFilter)}>
        <FilterListIcon />
      </IconButton>
    </Box>
  ) : (
    <ContentHeaderTitle title="Components" />
  );

const CatalogPageHeader = ({
  children,
  ...props
}: React.PropsWithChildren<{
  showFilter: boolean;
  toggleFilter: (showFilter: boolean) => void;
  isMidSizeScreen: boolean;
}>) => {
  return (
    <ContentHeader
      titleComponent={() => <CatalogPageHeaderAction {...props} />}
    >
      {children}
    </ContentHeader>
  );
};

export const CatalogPage = ({
  columns,
  actions,
  initiallySelectedFilter = 'owned',
}: CatalogPageProps) => {
  const [showFilter, toggleFilter] = useState<boolean>(false);
  const isMidSizeScreen = useMediaQuery<BackstageTheme>(theme =>
    theme.breakpoints.down('md'),
  );

  const orgName =
    useApi(configApiRef).getOptionalString('organization.name') ?? 'Backstage';

  return (
    <PageWithHeader title={`${orgName} Catalog`} themeId="home">
      <Content>
        <CatalogPageHeader
          showFilter={showFilter}
          toggleFilter={toggleFilter}
          isMidSizeScreen={isMidSizeScreen}
        >
          <CreateComponentButton />
          <SupportButton>All your software catalog entities</SupportButton>
        </CatalogPageHeader>
        <EntityListProvider>
          <FilteredTableLayout>
            <FilterContainer
              showFilter={showFilter}
              toggleFilter={toggleFilter}
              isMidSizeScreen={isMidSizeScreen}
            >
              <EntityKindPicker initialFilter="component" hidden />
              <EntityTypePicker />
              <UserListPicker initialFilter={initiallySelectedFilter} />
              <EntityOwnerPicker />
              <EntityLifecyclePicker />
              <EntityTagPicker />
            </FilterContainer>
            <Grid id="drawer-container" item xs={12} lg={10}>
              <CatalogTable columns={columns} actions={actions} />
            </Grid>
          </FilteredTableLayout>
        </EntityListProvider>
      </Content>
    </PageWithHeader>
  );
};
