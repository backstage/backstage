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

import React, { FC } from 'react';
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
import { Link as RouterLink } from 'react-router-dom';
import { rootRoute as scaffolderRootRoute } from '@backstage/plugin-scaffolder';

const useStyles = makeStyles(theme => ({
  contentWrapper: {
    display: 'grid',
    gridTemplateAreas: "'filters' 'table'",
    gridTemplateColumns: '250px 1fr',
    gridColumnGap: theme.spacing(2),
  },
}));

import { catalogApiRef } from '../..';
import { envelopeToComponent } from '../../data/utils';

const CatalogPage: FC<{}> = () => {
  const catalogApi = useApi(catalogApiRef);
  const { value, error, loading } = useAsync(() => catalogApi.getEntities());
  const [selectedFilter, setSelectedFilter] = React.useState<CatalogFilterItem>(
    defaultFilter,
  );

  const onFilterSelected = React.useCallback(
    selected => setSelectedFilter(selected),
    [],
  );
  const styles = useStyles();

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
              </span>
              Welcome to Backstage, we are happy to have you. Start by checking
              out our
              <Link href="/welcome" color="textSecondary">
                getting started
              </Link>
              page.
            </Typography>
          }
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
            components={(value && value.map(envelopeToComponent)) || []}
            loading={loading}
            error={error}
          />
        </div>
      </Content>
    </Page>
  );
};

export default CatalogPage;
