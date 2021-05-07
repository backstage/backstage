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

import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Button, makeStyles } from '@material-ui/core';
import { capitalize } from 'lodash';
import {
  Content,
  ContentHeader,
  SupportButton,
  useRouteRef,
} from '@backstage/core';
import {
  EntityKindFilter,
  EntityListProvider,
  reduceCatalogFilters,
  useEntityListProvider,
  UserListFilterKind,
} from '@backstage/plugin-catalog-react';

import { createComponentRouteRef } from '../../routes';
import { CatalogTable } from '../CatalogTable';
import CatalogLayout from './CatalogLayout';
import { EntityTypePicker } from '../EntityTypePicker';
import { UserListPicker } from '../UserListPicker';

const useStyles = makeStyles(theme => ({
  contentWrapper: {
    display: 'grid',
    gridTemplateAreas: "'filters' 'table'",
    gridTemplateColumns: '250px 1fr',
    gridColumnGap: theme.spacing(2),
  },
  buttonSpacing: {
    marginLeft: theme.spacing(2),
  },
}));

export type CatalogPageProps = {
  initiallySelectedFilter?: UserListFilterKind;
};

const CatalogPageContents = ({
  initiallySelectedFilter = 'owned',
}: CatalogPageProps) => {
  const styles = useStyles();
  const { loading, error, entities, filters } = useEntityListProvider();
  const createComponentLink = useRouteRef(createComponentRouteRef);
  const isTypeFiltered =
    reduceCatalogFilters(filters)['spec.type'] !== undefined;

  return (
    <CatalogLayout>
      <Content>
        <ContentHeader title="Components">
          {createComponentLink && (
            <Button
              component={RouterLink}
              variant="contained"
              color="primary"
              to={createComponentLink()}
            >
              Create Component
            </Button>
          )}
          <SupportButton>All your software catalog entities</SupportButton>
        </ContentHeader>
        <div className={styles.contentWrapper}>
          <div>
            <EntityTypePicker />
            <UserListPicker initialValue={initiallySelectedFilter} />
          </div>
          <CatalogTable
            titlePreamble={capitalize(UserListPicker.current())}
            entities={entities}
            loading={loading}
            error={error}
            showTypeColumn={!isTypeFiltered}
          />
        </div>
      </Content>
    </CatalogLayout>
  );
};

export const CatalogPage = (props: CatalogPageProps) => {
  return (
    <EntityListProvider
      staticFilter={new EntityKindFilter('component')}
      {...props}
    >
      <CatalogPageContents />
    </EntityListProvider>
  );
};
