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
import {
  getEntityName,
  parseEntityRef,
  stringifyEntityRef,
} from '@backstage/catalog-model';
import { InfoCard, InfoCardVariants } from '@backstage/core-components';
import { useAnalytics, useRouteRef } from '@backstage/core-plugin-api';
import {
  formatEntityRefTitle,
  useEntity,
} from '@backstage/plugin-catalog-react';
import { makeStyles, Theme } from '@material-ui/core';
import qs from 'qs';
import React, { MouseEvent, useCallback } from 'react';
import { useNavigate } from 'react-router';
import { catalogEntityRouteRef, catalogGraphRouteRef } from '../../routes';
import {
  ALL_RELATION_PAIRS,
  Direction,
  EntityNode,
  EntityRelationsGraph,
  RelationPairs,
} from '../EntityRelationsGraph';

const useStyles = makeStyles<Theme, { height: number | undefined }>({
  card: ({ height }) => ({
    display: 'flex',
    flexDirection: 'column',
    maxHeight: height,
    minHeight: height,
  }),
  graph: {
    flex: 1,
    minHeight: 0,
  },
});

export const CatalogGraphCard = ({
  variant = 'gridItem',
  relationPairs = ALL_RELATION_PAIRS,
  maxDepth = 1,
  unidirectional = true,
  mergeRelations = true,
  kinds,
  relations,
  direction = Direction.LEFT_RIGHT,
  height,
  title = 'Relations',
  zoom = 'enable-on-click',
}: {
  variant?: InfoCardVariants;
  relationPairs?: RelationPairs;
  maxDepth?: number;
  unidirectional?: boolean;
  mergeRelations?: boolean;
  kinds?: string[];
  relations?: string[];
  direction?: Direction;
  height?: number;
  title?: string;
  zoom?: 'enabled' | 'disabled' | 'enable-on-click';
}) => {
  const { entity } = useEntity();
  const entityName = getEntityName(entity);
  const catalogEntityRoute = useRouteRef(catalogEntityRouteRef);
  const catalogGraphRoute = useRouteRef(catalogGraphRouteRef);
  const navigate = useNavigate();
  const classes = useStyles({ height });
  const analytics = useAnalytics();

  const onNodeClick = useCallback(
    (node: EntityNode, _: MouseEvent<unknown>) => {
      const nodeEntityName = parseEntityRef(node.id);
      const path = catalogEntityRoute({
        kind: nodeEntityName.kind.toLocaleLowerCase('en-US'),
        namespace: nodeEntityName.namespace.toLocaleLowerCase('en-US'),
        name: nodeEntityName.name,
      });
      analytics.captureEvent(
        'click',
        node.title ?? formatEntityRefTitle(nodeEntityName),
        { attributes: { to: path } },
      );
      navigate(path);
    },
    [catalogEntityRoute, navigate, analytics],
  );

  const catalogGraphParams = qs.stringify(
    { rootEntityRefs: [stringifyEntityRef(entity)] },
    { arrayFormat: 'brackets', addQueryPrefix: true },
  );
  const catalogGraphUrl = `${catalogGraphRoute()}${catalogGraphParams}`;

  return (
    <InfoCard
      title={title}
      cardClassName={classes.card}
      variant={variant}
      noPadding
      deepLink={{
        title: 'View graph',
        link: catalogGraphUrl,
      }}
    >
      <EntityRelationsGraph
        rootEntityNames={entityName}
        maxDepth={maxDepth}
        unidirectional={unidirectional}
        mergeRelations={mergeRelations}
        kinds={kinds}
        relations={relations}
        direction={direction}
        onNodeClick={onNodeClick}
        className={classes.graph}
        relationPairs={relationPairs}
        zoom={zoom}
      />
    </InfoCard>
  );
};
