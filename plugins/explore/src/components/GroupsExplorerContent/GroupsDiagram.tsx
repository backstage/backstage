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
  parseEntityRef,
  RELATION_CHILD_OF,
  stringifyEntityRef,
} from '@backstage/catalog-model';
import {
  DependencyGraph,
  DependencyGraphTypes,
  Link,
  Progress,
  ResponseErrorPanel,
} from '@backstage/core-components';
import { configApiRef, useApi, useRouteRef } from '@backstage/core-plugin-api';
import {
  catalogApiRef,
  entityRouteRef,
  getEntityRelations,
  EntityDisplayName,
} from '@backstage/plugin-catalog-react';
import { makeStyles, Typography, useTheme } from '@material-ui/core';
import ZoomOutMap from '@material-ui/icons/ZoomOutMap';
import classNames from 'classnames';
import React from 'react';
import useAsync from 'react-use/lib/useAsync';

const useStyles = makeStyles(
  theme => ({
    graph: {
      minHeight: '100%',
      flex: 1,
    },
    graphWrapper: {
      display: 'flex',
      height: '100%',
    },
    organizationNode: {
      fill: theme.palette.secondary.light,
      stroke: theme.palette.secondary.light,
    },
    groupNode: {
      fill: theme.palette.primary.light,
      stroke: theme.palette.primary.light,
    },
    centeredContent: {
      padding: theme.spacing(1),
      height: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: theme.palette.common.black,
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
    textOrganization: {
      color: theme.palette.secondary.contrastText,
    },
    textGroup: {
      color: theme.palette.primary.contrastText,
    },
    textWrapper: {
      display: '-webkit-box',
      WebkitBoxOrient: 'vertical',
      WebkitLineClamp: 2,
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      textAlign: 'center',
      fontWeight: 'bold',
      fontSize: '20px',
    },
  }),
  {
    name: 'ExploreGroupsDiagram',
  },
);

function RenderNode(props: DependencyGraphTypes.RenderNodeProps<any>) {
  const nodeWidth = 180;
  const nodeHeight = 60;
  const theme = useTheme();
  const classes = useStyles();
  const catalogEntityRoute = useRouteRef(entityRouteRef);

  if (props.node.id === 'root') {
    return (
      <g>
        <rect
          width={nodeWidth}
          height={nodeHeight}
          rx={theme.shape.borderRadius}
          className={classes.organizationNode}
        />
        <title>{props.node.name}</title>
        <foreignObject width={nodeWidth} height={nodeHeight}>
          <div className={classes.centeredContent}>
            <div
              className={classNames(
                classes.textWrapper,
                classes.textOrganization,
              )}
            >
              {props.node.name}
            </div>
          </div>
        </foreignObject>
      </g>
    );
  }

  const ref = parseEntityRef(props.node.id);

  return (
    <g>
      <rect
        width={nodeWidth}
        height={nodeHeight}
        rx={theme.shape.borderRadius}
        className={classes.groupNode}
      />
      <title>
        <EntityDisplayName entityRef={props.node.id} hideIcon disableTooltip />
      </title>

      <Link
        to={catalogEntityRoute({
          kind: ref.kind,
          namespace: ref.namespace,
          name: ref.name,
        })}
      >
        <foreignObject width={nodeWidth} height={nodeHeight}>
          <div className={classes.centeredContent}>
            <div className={classNames(classes.textWrapper, classes.textGroup)}>
              <EntityDisplayName entityRef={props.node.id} hideIcon />
            </div>
          </div>
        </foreignObject>
      </Link>
    </g>
  );
}

/**
 * Dynamically generates a diagram of groups registered in the catalog.
 */
export function GroupsDiagram(props: {
  direction?: DependencyGraphTypes.Direction;
}) {
  const nodes = new Array<{
    id: string;
    kind: string;
    name: string;
  }>();
  const edges = new Array<{ from: string; to: string; label: string }>();

  const classes = useStyles();
  const configApi = useApi(configApiRef);
  const catalogApi = useApi(catalogApiRef);
  const organizationName =
    configApi.getOptionalString('organization.name') ?? 'Backstage';
  const {
    loading,
    error,
    value: catalogResponse,
  } = useAsync(() => {
    return catalogApi.getEntities({
      filter: {
        kind: ['Group'],
      },
    });
  }, [catalogApi]);

  if (loading) {
    return <Progress />;
  } else if (error) {
    return <ResponseErrorPanel error={error} />;
  }

  // the root of this diagram is the organization
  nodes.push({
    id: 'root',
    kind: 'Organization',
    name: organizationName,
  });

  for (const catalogItem of catalogResponse?.items || []) {
    const currentItemId = stringifyEntityRef(catalogItem);

    nodes.push({
      id: stringifyEntityRef(catalogItem),
      kind: catalogItem.kind,
      name: '',
    });

    // Edge to parent
    const catalogItemRelations_childOf = getEntityRelations(
      catalogItem,
      RELATION_CHILD_OF,
    );

    // if no parent is found, link the node to the root
    if (catalogItemRelations_childOf.length === 0) {
      edges.push({
        from: currentItemId,
        to: 'root',
        label: '',
      });
    }

    catalogItemRelations_childOf.forEach(relation => {
      edges.push({
        from: currentItemId,
        to: stringifyEntityRef(relation),
        label: '',
      });
    });
  }

  return (
    <div className={classes.graphWrapper}>
      <DependencyGraph
        nodes={nodes}
        edges={edges}
        nodeMargin={10}
        direction={props.direction || DependencyGraphTypes.Direction.RIGHT_LEFT}
        renderNode={RenderNode}
        className={classes.graph}
        fit="contain"
      />

      <Typography
        variant="caption"
        color="textSecondary"
        display="block"
        className={classes.legend}
      >
        <ZoomOutMap className="icon" /> Use pinch &amp; zoom to move around the
        diagram.
      </Typography>
    </div>
  );
}
