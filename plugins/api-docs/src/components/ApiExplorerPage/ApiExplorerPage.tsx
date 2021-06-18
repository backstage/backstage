/*
 * Copyright 2020 Spotify AB
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
  SupportButton,
  TableColumn,
  useRouteRef,
} from '@backstage/core';
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
import { CatalogTable, CatalogTableRow } from '@backstage/plugin-catalog';
import { Button, makeStyles } from '@material-ui/core';
import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { createComponentRouteRef } from '../../routes';
import { ApiExplorerLayout } from './ApiExplorerLayout';

const useStyles = makeStyles(theme => ({
  contentWrapper: {
    display: 'grid',
    gridTemplateAreas: "'filters' 'table'",
    gridTemplateColumns: '250px 1fr',
    gridColumnGap: theme.spacing(2),
  },
}));

export type ApiExplorerPageProps = {
  initiallySelectedFilter?: UserListFilterKind;
  columns?: TableColumn<CatalogTableRow>[];
};

export const ApiExplorerPage = ({
  initiallySelectedFilter = 'all',
  columns,
}: ApiExplorerPageProps) => {
  const styles = useStyles();
  const createComponentLink = useRouteRef(createComponentRouteRef);

  return (
    <ApiExplorerLayout>
      <Content>
        <ContentHeader title="">
          {createComponentLink && (
            <Button
              variant="contained"
              color="primary"
              component={RouterLink}
              to={createComponentLink()}
            >
              Register Existing API
            </Button>
          )}
          <SupportButton>All your APIs</SupportButton>
        </ContentHeader>
        <div className={styles.contentWrapper}>
          <EntityListProvider>
            <div>
              <EntityKindPicker initialFilter="api" hidden />
              <UserListPicker initialFilter={initiallySelectedFilter} />
              <EntityTypePicker />
              <EntityOwnerPicker />
              <EntityLifecyclePicker />
              <EntityTagPicker />
            </div>
            <CatalogTable columns={columns} />
          </EntityListProvider>
        </div>
      </Content>
    </ApiExplorerLayout>
  );
};
