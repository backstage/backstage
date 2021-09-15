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
import { useRouteRef } from '@backstage/core-plugin-api';
import { useEntity } from '@backstage/plugin-catalog-react';
import { makeStyles, Theme } from '@material-ui/core';
import qs from 'qs';
import React, { MouseEvent, useCallback } from 'react';
import { useNavigate } from 'react-router';
import { catalogEntityRouteRef, catalogGraphRouteRef } from '../../routes';
import {
  Direction,
  EntityNode,
  EntityRelationsGraph,
  RelationPairs,
  RELATION_PAIRS,
} from '../EntityRelationsGraph';

const useStyles = makeStyles<Theme, { maxHeight: number | undefined }>({
  card: ({ maxHeight }) => ({
    display: 'flex',
    flexDirection: 'column',
    maxHeight,
    minHeight: 0,
  }),
  graph: {
    flex: 1,
    minHeight: 0,
  },
});

export type Props = {
  variant?: InfoCardVariants;
  relationPairs?: RelationPairs;
  maxDepth?: number;
  unidirectional?: boolean;
  mergeRelations?: boolean;
  kinds?: string[];
  relations?: string[];
  direction?: Direction;
  maxHeight?: number;
  title?: string;
};

export const CatalogGraphCard = ({
  variant = 'gridItem',
  relationPairs = RELATION_PAIRS,
  maxDepth = 1,
  unidirectional = true,
  mergeRelations = true,
  kinds,
  relations,
  direction = Direction.LEFT_RIGHT,
  maxHeight,
  title = 'Relations',
}: Props) => {
  const { entity } = useEntity();
  const entityName = getEntityName(entity);
  const catalogEntityRoute = useRouteRef(catalogEntityRouteRef);
  const catalogGraphRoute = useRouteRef(catalogGraphRouteRef);
  const navigate = useNavigate();
  const classes = useStyles({ maxHeight });

  const onNodeClick = useCallback(
    (node: EntityNode, _: MouseEvent) => {
      const nodeEntityName = parseEntityRef(node.id);
      const path = catalogEntityRoute({
        kind: nodeEntityName.kind.toLowerCase(),
        namespace: nodeEntityName.namespace.toLowerCase(),
        name: nodeEntityName.name,
      });
      navigate(path);
    },
    [catalogEntityRoute, navigate],
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
      />
    </InfoCard>
  );
};
