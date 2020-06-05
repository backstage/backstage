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

import React, { FC, useCallback, useState } from 'react';
import {
  Content,
  ContentHeader,
  DismissableBanner,
  Header,
  HomepageTimer,
  SupportButton,
  Page,
  pageTheme,
  useApi,
} from '@backstage/core';
import { useAsync } from 'react-use';
import CatalogTable from '../CatalogTable/CatalogTable';
import {
  CatalogFilter,
  CatalogFilterItem,
} from '../CatalogFilter/CatalogFilter';
import { Button, makeStyles, Typography, Link } from '@material-ui/core';
import { filterGroups, defaultFilter } from '../../data/filters';
import GitHub from '@material-ui/icons/GitHub';
import {
  Entity,
  Location,
  LOCATION_ANNOTATION,
} from '@backstage/catalog-model';

const useStyles = makeStyles(theme => ({
  contentWrapper: {
    display: 'grid',
    gridTemplateAreas: "'filters' 'table'",
    gridTemplateColumns: '250px 1fr',
    gridColumnGap: theme.spacing(2),
  },
}));

import { catalogApiRef } from '../..';
import { envelopeToComponent, findLocationForEntity } from '../../data/utils';
import { Component } from '../../data/component';

const CatalogPage: FC<{}> = () => {
  const catalogApi = useApi(catalogApiRef);
  const { value, error, loading } = useAsync(() => catalogApi.getEntities());
  const [selectedFilter, setSelectedFilter] = useState<CatalogFilterItem>(
    defaultFilter,
  );

  const onFilterSelected = useCallback(
    selected => setSelectedFilter(selected),
    [],
  );
  const styles = useStyles();

  const { value: locations } = useAsync(async () => {
    const getLocationDataForEntities = async (entities: Entity[]) => {
      return Promise.all(
        entities.map(entity => {
          const locationId = entity.metadata.annotations?.[LOCATION_ANNOTATION];
          if (!locationId) return undefined;

          return catalogApi.getLocationById(locationId);
        }),
      );
    };

    if (value) {
      return getLocationDataForEntities(value).then(
        (location): Location[] =>
          location.filter(loc => !!loc) as Array<Location>,
      );
    }
    return [];
  }, [value, catalogApi, catalogApi]);
  const actions = [
    (rowData: Component) => ({
      icon: GitHub,
      tooltip: 'View on GitHub',
      onClick: () => {
        if (!rowData || !rowData.location) return;
        window.open(rowData.location.target, '_blank');
      },
      hidden:
        rowData && rowData.location ? rowData.location.type !== 'github' : true,
    }),
  ];

  return (
    <Page theme={pageTheme.home}>
      <Header title="Service Catalog" subtitle="Keep track of your software">
        <HomepageTimer />
      </Header>
      <Content>
        <DismissableBanner
          variant="info"
          message={
            <Typography>
              <span role="img" aria-label="wave" style={{ fontSize: '125%' }}>
                👋🏼
              </span>{' '}
              Welcome to Backstage, we are happy to have you. Start by checking
              out our{' '}
              <Link href="/welcome" color="textSecondary">
                getting started
              </Link>{' '}
              page.
            </Typography>
          }
        />
        <ContentHeader title="Services">
          <Button variant="contained" color="primary" href="/create">
            Create Service
          </Button>
          <SupportButton>All your components</SupportButton>
        </ContentHeader>
        <div className={styles.contentWrapper}>
          <div>
            <CatalogFilter
              groups={filterGroups}
              selectedId={selectedFilter.id}
              onSelectedChange={onFilterSelected}
            />
          </div>
          {locations && (
            <CatalogTable
              titlePreamble={selectedFilter.label}
              components={
                (value &&
                  value.map(val => {
                    return {
                      ...envelopeToComponent(val),
                      location: findLocationForEntity(val, locations),
                    };
                  })) ||
                []
              }
              loading={loading}
              error={error}
              actions={actions}
            />
          )}
        </div>
      </Content>
    </Page>
  );
};

export default CatalogPage;
