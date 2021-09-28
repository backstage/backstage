/*
 * Copyright 2021 The Backstage Authors
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
import { parseEntityRef } from '@backstage/catalog-model';
import {
  Content,
  ContentHeader,
  Header,
  Page,
  SupportButton,
} from '@backstage/core-components';
import { useRouteRef } from '@backstage/core-plugin-api';
import { formatEntityRefTitle } from '@backstage/plugin-catalog-react';
import { Grid, makeStyles, Paper, Typography } from '@material-ui/core';
import FilterListIcon from '@material-ui/icons/FilterList';
import ZoomOutMap from '@material-ui/icons/ZoomOutMap';
import { ToggleButton } from '@material-ui/lab';
import React, { MouseEvent, useCallback } from 'react';
import { useNavigate } from 'react-router';
import { catalogEntityRouteRef } from '../../routes';
import {
  Direction,
  EntityNode,
  EntityRelationsGraph,
  RelationPairs,
  ALL_RELATION_PAIRS,
} from '../EntityRelationsGraph';
import { DirectionFilter } from './DirectionFilter';
import { MaxDepthFilter } from './MaxDepthFilter';
import { SelectedKindsFilter } from './SelectedKindsFilter';
import { SelectedRelationsFilter } from './SelectedRelationsFilter';
import { SwitchFilter } from './SwitchFilter';
import { useCatalogGraphPage } from './useCatalogGraphPage';

const useStyles = makeStyles(theme => ({
  content: {
    minHeight: 0,
  },
  container: {
    height: '100%',
    maxHeight: '100%',
    minHeight: 0,
  },
  fullHeight: {
    maxHeight: '100%',
    display: 'flex',
    minHeight: 0,
  },
  graphWrapper: {
    position: 'relative',
    flex: 1,
    minHeight: 0,
    display: 'flex',
  },
  graph: {
    flex: 1,
    minHeight: 0,
  },
  legend: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    padding: theme.spacing(1),
    '& .icon': {
      verticalAlign: 'bottom',
    },
  },
  filters: {
    display: 'grid',
    gridGap: theme.spacing(1),
    gridAutoRows: 'auto',
    [theme.breakpoints.up('lg')]: {
      display: 'block',
    },
    [theme.breakpoints.only('md')]: {
      gridTemplateColumns: 'repeat(3, 1fr)',
    },
    [theme.breakpoints.only('sm')]: {
      gridTemplateColumns: 'repeat(2, 1fr)',
    },
    [theme.breakpoints.down('xs')]: {
      gridTemplateColumns: 'repeat(1, 1fr)',
    },
  },
}));

export const CatalogGraphPage = ({
  relationPairs = ALL_RELATION_PAIRS,
  initialState,
}: {
  relationPairs?: RelationPairs;
  initialState?: {
    selectedRelations?: string[];
    selectedKinds?: string[];
    rootEntityRefs?: string[];
    maxDepth?: number;
    unidirectional?: boolean;
    mergeRelations?: boolean;
    direction?: Direction;
    showFilters?: boolean;
  };
}) => {
  const navigate = useNavigate();
  const classes = useStyles();
  const catalogEntityRoute = useRouteRef(catalogEntityRouteRef);
  const {
    maxDepth,
    setMaxDepth,
    selectedKinds,
    setSelectedKinds,
    selectedRelations,
    setSelectedRelations,
    unidirectional,
    setUnidirectional,
    mergeRelations,
    setMergeRelations,
    direction,
    setDirection,
    rootEntityNames,
    setRootEntityNames,
    showFilters,
    toggleShowFilters,
  } = useCatalogGraphPage({ initialState });
  const onNodeClick = useCallback(
    (node: EntityNode, event: MouseEvent<unknown>) => {
      const nodeEntityName = parseEntityRef(node.id);

      if (event.shiftKey) {
        const path = catalogEntityRoute({
          kind: nodeEntityName.kind.toLocaleLowerCase('en-US'),
          namespace: nodeEntityName.namespace.toLocaleLowerCase('en-US'),
          name: nodeEntityName.name,
        });
        navigate(path);
      } else {
        setRootEntityNames([nodeEntityName]);
      }
    },
    [catalogEntityRoute, navigate, setRootEntityNames],
  );

  return (
    <Page themeId="home">
      <Header
        title="Catalog Graph"
        subtitle={rootEntityNames.map(e => formatEntityRefTitle(e)).join(', ')}
      />
      <Content stretch className={classes.content}>
        <ContentHeader
          titleComponent={
            <ToggleButton
              value="show filters"
              selected={showFilters}
              onChange={() => toggleShowFilters()}
            >
              <FilterListIcon /> Filters
            </ToggleButton>
          }
        >
          <SupportButton>
            Start tracking your component in by adding it to the software
            catalog.
          </SupportButton>
        </ContentHeader>
        <Grid container alignItems="stretch" className={classes.container}>
          {showFilters && (
            <Grid item xs={12} lg={2} className={classes.filters}>
              <MaxDepthFilter value={maxDepth} onChange={setMaxDepth} />
              <SelectedKindsFilter
                value={selectedKinds}
                onChange={setSelectedKinds}
              />
              <SelectedRelationsFilter
                value={selectedRelations}
                onChange={setSelectedRelations}
                relationPairs={relationPairs}
              />
              <DirectionFilter value={direction} onChange={setDirection} />
              <SwitchFilter
                value={unidirectional}
                onChange={setUnidirectional}
                label="Simplified"
              />
              <SwitchFilter
                value={mergeRelations}
                onChange={setMergeRelations}
                label="Merge Relations"
              />
            </Grid>
          )}
          <Grid item xs className={classes.fullHeight}>
            <Paper className={classes.graphWrapper}>
              <Typography
                variant="caption"
                color="textSecondary"
                display="block"
                className={classes.legend}
              >
                <ZoomOutMap className="icon" /> Use pinch &amp; zoom to move
                around the diagram. Click to change active node, shift click to
                navigate to entity.
              </Typography>
              <EntityRelationsGraph
                rootEntityNames={rootEntityNames}
                maxDepth={maxDepth}
                kinds={
                  selectedKinds && selectedKinds.length > 0
                    ? selectedKinds
                    : undefined
                }
                relations={
                  selectedRelations && selectedRelations.length > 0
                    ? selectedRelations
                    : undefined
                }
                mergeRelations={mergeRelations}
                unidirectional={unidirectional}
                onNodeClick={onNodeClick}
                direction={direction}
                relationPairs={relationPairs}
                className={classes.graph}
                zoom="enabled"
              />
            </Paper>
          </Grid>
        </Grid>
      </Content>
    </Page>
  );
};
