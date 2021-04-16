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
  useRouteRef,
} from '@backstage/core';
import { Box, Button, makeStyles } from '@material-ui/core';
import { upperFirst } from 'lodash';
import React, { useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { createComponentRouteRef } from '../../routes';
import { useEntityListState } from '../../state';
import { EntityFilterGroupBar, useFilterGroups } from '../CatalogFilter';
import { CatalogTable } from '../CatalogTable/CatalogTable';
import { EntityTypeFilter } from '../EntityTypeFilter/EntityTypeFilter';
import { ResultsFilterNew } from '../ResultsFilter/ResultsFilterNew';
import { useMockData } from './useMockData';

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

export const CatalogIndexContent = () => {
  const styles = useStyles();

  const { state, getFilter, setFilter } = useEntityListState();
  const { filterId, filterGroups } = useFilterGroups();
  const createComponentLink = useRouteRef(createComponentRouteRef);
  const { addMockData, showAddExampleEntities } = useMockData();

  const defaultFilterGroup = 'owned';

  useEffect(() => {
    setFilter(filterId, { type: defaultFilterGroup });
  }, [setFilter, filterId]);

  const selectedFilterGroup = getFilter(filterId)?.type ?? defaultFilterGroup;

  return (
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
        {showAddExampleEntities && (
          <Button
            className={styles.buttonSpacing}
            variant="outlined"
            color="primary"
            onClick={addMockData}
          >
            Add example components
          </Button>
        )}
        <SupportButton>All your software catalog entities</SupportButton>
      </ContentHeader>
      <div className={styles.contentWrapper}>
        <div>
          <Box marginBottom={2}>
            <EntityTypeFilter />
          </Box>
          <EntityFilterGroupBar
            buttonGroups={filterGroups}
            initiallySelected={selectedFilterGroup}
          />
          <ResultsFilterNew availableTags={state.availableTags} />
        </div>
        <CatalogTable
          titlePreamble={upperFirst(selectedFilterGroup)}
          entities={state.matchingEntities}
          loading={state.loading}
          error={state.error}
        />
      </div>
    </Content>
  );
};
