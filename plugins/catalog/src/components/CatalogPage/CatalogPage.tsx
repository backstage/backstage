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
  EntityFilter,
  EntityKindFilter,
  EntityListProvider,
  useStarredEntities,
  useEntityListProvider,
  useOwnUser,
  UserOwnedEntityFilter,
  UserStarredEntityFilter,
} from '@backstage/plugin-catalog-react';

import { createComponentRouteRef } from '../../routes';
import { CatalogTable } from '../CatalogTable';
import CatalogLayout from './CatalogLayout';
import { EntityTypePicker } from '../EntityTypePicker';
import { UserListFilter } from '../UserListFilter';

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

const CatalogPageContents = () => {
  const styles = useStyles();
  const { loading, error, entities, filters } = useEntityListProvider();
  const createComponentLink = useRouteRef(createComponentRouteRef);
  const isTypeFiltered = filters.find(f => f.id === 'type') !== undefined;

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
            <UserListFilter />
          </div>
          <CatalogTable
            titlePreamble={capitalize(UserListFilter.current(filters))}
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

export type CatalogPageProps = {
  initiallySelectedFilter?: 'owned' | 'starred';
};

export const CatalogPage = (props: CatalogPageProps) => {
  const initialFilters: EntityFilter[] = [new EntityKindFilter('component')];
  const { value: user } = useOwnUser();
  const { isStarredEntity } = useStarredEntities();

  if (props.initiallySelectedFilter === 'owned') {
    initialFilters.push(new UserOwnedEntityFilter(user));
  } else if (props.initiallySelectedFilter === 'starred') {
    initialFilters.push(new UserStarredEntityFilter(isStarredEntity));
  }

  return (
    <EntityListProvider initialFilters={initialFilters}>
      <CatalogPageContents />
    </EntityListProvider>
  );
};
