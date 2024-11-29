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
import { useAnalytics, useRouteRef } from '@backstage/core-plugin-api';
import {
  entityRouteRef,
  humanizeEntityRef,
} from '@backstage/plugin-catalog-react';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import FilterListIcon from '@material-ui/icons/FilterList';
import ZoomOutMap from '@material-ui/icons/ZoomOutMap';
import ToggleButton from '@material-ui/lab/ToggleButton';
import React, { MouseEvent, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ALL_RELATION_PAIRS,
  Direction,
  EntityNode,
  EntityRelationsGraph,
  EntityRelationsGraphProps,
} from '../EntityRelationsGraph';
import { CurveFilter } from './CurveFilter';
import { DirectionFilter } from './DirectionFilter';
import { MaxDepthFilter } from './MaxDepthFilter';
import { SelectedKindsFilter } from './SelectedKindsFilter';
import { SelectedRelationsFilter } from './SelectedRelationsFilter';
import { SwitchFilter } from './SwitchFilter';
import { useCatalogGraphPage } from './useCatalogGraphPage';

/** @public */
export type CatalogGraphPageClassKey =
  | 'content'
  | 'container'
  | 'fullHeight'
  | 'graphWrapper'
  | 'graph'
  | 'legend'
  | 'filters';

const useStyles = makeStyles(
  theme => ({
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
  }),
  { name: 'PluginCatalogGraphCatalogGraphPage' },
);

export const CatalogGraphPage = (
  props: {
    initialState?: {
      selectedRelations?: string[];
      selectedKinds?: string[];
      rootEntityRefs?: string[];
      maxDepth?: number;
      unidirectional?: boolean;
      mergeRelations?: boolean;
      direction?: Direction;
      showFilters?: boolean;
      curve?: 'curveStepBefore' | 'curveMonotoneX';
    };
  } & Partial<EntityRelationsGraphProps>,
) => {
  const {
    relationPairs = ALL_RELATION_PAIRS,
    initialState,
    entityFilter,
  } = props;

  const navigate = useNavigate();
  const classes = useStyles();
  const catalogEntityRoute = useRouteRef(entityRouteRef);
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
    curve,
    setCurve,
    rootEntityNames,
    setRootEntityNames,
    showFilters,
    toggleShowFilters,
  } = useCatalogGraphPage({ initialState });
  const analytics = useAnalytics();
  const onNodeClick = useCallback(
    (node: EntityNode, event: MouseEvent<unknown>) => {
      const nodeEntityName = parseEntityRef(node.id);

      if (event.shiftKey) {
        const path = catalogEntityRoute({
          kind: nodeEntityName.kind.toLocaleLowerCase('en-US'),
          namespace: nodeEntityName.namespace.toLocaleLowerCase('en-US'),
          name: nodeEntityName.name,
        });

        analytics.captureEvent(
          'click',
          node.entity.metadata.title ?? humanizeEntityRef(nodeEntityName),
          { attributes: { to: path } },
        );
        navigate(path);
      } else {
        analytics.captureEvent(
          'click',
          node.entity.metadata.title ?? humanizeEntityRef(nodeEntityName),
        );
        setRootEntityNames([nodeEntityName]);
      }
    },
    [catalogEntityRoute, navigate, setRootEntityNames, analytics],
  );

  return (
    <Page themeId="home">
      <Header
        title="Catalog Graph"
        subtitle={rootEntityNames.map(e => humanizeEntityRef(e)).join(', ')}
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
              <CurveFilter value={curve} onChange={setCurve} />
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
                {...props}
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
                entityFilter={entityFilter}
                className={classes.graph}
                zoom="enabled"
                curve={curve}
              />
            </Paper>
          </Grid>
        </Grid>
      </Content>
    </Page>
  );
};
