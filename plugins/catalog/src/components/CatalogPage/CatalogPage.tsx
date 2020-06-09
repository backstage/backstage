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
  DismissableBanner,
  Header,
  HeaderTabs,
  HomepageTimer,
  Page,
  pageTheme,
  SupportButton,
  useApi,
} from '@backstage/core';
import { rootRoute as scaffolderRootRoute } from '@backstage/plugin-scaffolder';
import { Button, makeStyles, Typography, Link } from '@material-ui/core';
import GitHub from '@material-ui/icons/GitHub';
import StarOutline from '@material-ui/icons/StarBorder';
import Star from '@material-ui/icons/Star';
import React, { FC, useCallback, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { useAsync } from 'react-use';
import { catalogApiRef } from '../..';
import { Component } from '../../data/component';
import { defaultFilter, filterGroups, dataResolvers } from '../../data/filters';
import { entityToComponent, findLocationForEntityMeta } from '../../data/utils';
import {
  CatalogFilter,
  CatalogFilterItem,
} from '../CatalogFilter/CatalogFilter';

import { useStarredEntities } from '../../hooks/useStarredEntites';

import CatalogTable from '../CatalogTable/CatalogTable';

const useStyles = makeStyles(theme => ({
  contentWrapper: {
    display: 'grid',
    gridTemplateAreas: "'filters' 'table'",
    gridTemplateColumns: '250px 1fr',
    gridColumnGap: theme.spacing(2),
  },
  emoji: {
    fontSize: '125%',
    marginRight: theme.spacing(2),
  },
}));

const CatalogPage: FC<{}> = () => {
  const catalogApi = useApi(catalogApiRef);
  const { starredEntities, toggleStarredEntity } = useStarredEntities();
  const [selectedFilter, setSelectedFilter] = useState<CatalogFilterItem>(
    defaultFilter,
  );

  const { value, error, loading } = useAsync(
    () => dataResolvers[selectedFilter.id]({ catalogApi, starredEntities }),
    [selectedFilter.id, starredEntities.size],
  );

  const onFilterSelected = useCallback(
    selected => setSelectedFilter(selected),
    [],
  );

  const styles = useStyles();

  const actions = [
    (rowData: Component) => {
      const location = findLocationForEntityMeta(rowData.metadata);
      return {
        icon: GitHub,
        tooltip: 'View on GitHub',
        onClick: () => {
          if (!location) return;
          window.open(location.target, '_blank');
        },
        hidden: location ? location?.type !== 'github' : true,
      };
    },
    (rowData: Component) => {
      return {
        icon: starredEntities.has(rowData.metadata.name) ? Star : StarOutline,
        toolTip: `${
          starredEntities.has(rowData.metadata.name) ? 'Unstar' : 'Star'
        } ${rowData.metadata.name}`,
        onClick: () => toggleStarredEntity(rowData.metadata.name),
      };
    },
  ];

  // TODO: replace me with the proper tabs implemntation
  const tabs = [
    {
      id: 'services',
      label: 'Services',
    },
    {
      id: 'websites',
      label: 'Websites',
    },
    {
      id: 'libs',
      label: 'Libraries',
    },
    {
      id: 'documentation',
      label: 'Documentation',
    },
  ];

  return (
    <Page theme={pageTheme.home}>
      <Header title="Service Catalog" subtitle="Keep track of your software">
        <HomepageTimer />
      </Header>
      <HeaderTabs tabs={tabs} />
      <Content>
        <DismissableBanner
          variant="info"
          message={
            <Typography>
              <span role="img" aria-label="wave" className={styles.emoji}>
                👋🏼
              </span>
              Welcome to Backstage, we are happy to have you. Start by checking
              out our{' '}
              <Link href="/welcome" color="textSecondary">
                getting started
              </Link>{' '}
              page.
            </Typography>
          }
          id="catalog_page_welcome_banner"
        />

        <ContentHeader title="Services">
          <Button
            component={RouterLink}
            variant="contained"
            color="primary"
            to={scaffolderRootRoute.path}
          >
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
          <CatalogTable
            titlePreamble={selectedFilter.label}
            components={
              (value &&
                value.map(val => {
                  return {
                    ...entityToComponent(val),
                    locationSpec: findLocationForEntityMeta(val.metadata),
                  };
                })) ||
              []
            }
            loading={loading}
            error={error}
            actions={actions}
          />
        </div>
      </Content>
    </Page>
  );
};

export default CatalogPage;
