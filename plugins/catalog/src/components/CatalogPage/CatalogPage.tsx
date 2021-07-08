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

import React from 'react';
import { Grid, withWidth } from '@material-ui/core';
import {
  EntityListProvider,
  UserListFilterKind,
} from '@backstage/plugin-catalog-react';
import { CatalogTable } from '../CatalogTable';

import { EntityRow } from '../CatalogTable/types';
import CatalogLayout from './CatalogLayout';
import { CreateComponentButton } from '../CreateComponentButton';
import {
  Content,
  ContentHeader,
  SupportButton,
  TableColumn,
  TableProps,
} from '@backstage/core-components';
import { CatalogFilter } from '../CatalogFilter';

export type CatalogPageProps = {
  initiallySelectedFilter?: UserListFilterKind;
  columns?: TableColumn<EntityRow>[];
  actions?: TableProps<EntityRow>['actions'];
};

export const CatalogPage = withWidth()(
  ({ columns, actions, initiallySelectedFilter }: CatalogPageProps) => {
    return (
      <CatalogLayout>
        <Content>
          <ContentHeader title="Components">
            <CreateComponentButton />
            <SupportButton>All your software catalog entities</SupportButton>
          </ContentHeader>
          <Grid container spacing={2}>
            <EntityListProvider>
              <Grid item xs={12} sm={12} lg={2}>
                <CatalogFilter
                  initiallySelectedFilter={initiallySelectedFilter}
                />
              </Grid>
              <Grid item xs={12} sm={12} lg={10}>
                <CatalogTable columns={columns} actions={actions} />
              </Grid>
            </EntityListProvider>
          </Grid>
        </Content>
      </CatalogLayout>
    );
  },
);
