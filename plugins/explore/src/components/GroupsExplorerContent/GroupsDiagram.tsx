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
  GroupEntity,
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
  formatEntityRefTitle,
  getEntityRelations,
} from '@backstage/plugin-catalog-react';
import { BackstageTheme } from '@backstage/theme';
import { makeStyles, Typography, useTheme } from '@material-ui/core';
import ZoomOutMap from '@material-ui/icons/ZoomOutMap';
import classNames from 'classnames';
import React from 'react';
import { useAsync } from 'react-use';

const useStyles = makeStyles((theme: BackstageTheme) => ({
  graph: {
    flex: 1,
    minHeight: 0,
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
    color: 'black',
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
}));

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
      <title>{props.node.name}</title>

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
              {props.node.name}
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
export function GroupsDiagram() {
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
      name:
        (catalogItem as GroupEntity).spec?.profile?.displayName ||
        formatEntityRefTitle(catalogItem, { defaultKind: 'Group' }),
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
    <>
      <DependencyGraph
        nodes={nodes}
        edges={edges}
        nodeMargin={10}
        direction={DependencyGraphTypes.Direction.RIGHT_LEFT}
        renderNode={RenderNode}
        className={classes.graph}
      />
      <Typography
        variant="caption"
        style={{ display: 'block', textAlign: 'right' }}
      >
        <ZoomOutMap style={{ verticalAlign: 'bottom' }} /> Use pinch &amp; zoom
        to move around the diagram.
      </Typography>
    </>
  );
}
