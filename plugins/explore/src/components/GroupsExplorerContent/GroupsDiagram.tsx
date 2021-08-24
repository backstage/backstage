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
  RELATION_CHILD_OF,
  stringifyEntityRef,
  parseEntityRef,
  GroupEntity,
} from '@backstage/catalog-model';
import {
  catalogApiRef,
  entityRouteRef,
  getEntityRelations,
  formatEntityRefTitle,
} from '@backstage/plugin-catalog-react';
import { makeStyles, Typography } from '@material-ui/core';
import ZoomOutMap from '@material-ui/icons/ZoomOutMap';
import React from 'react';
import { useAsync } from 'react-use';
import { BackstageTheme } from '@backstage/theme';

import {
  DependencyGraph,
  DependencyGraphTypes,
  Progress,
  ResponseErrorPanel,
  Link,
} from '@backstage/core-components';
import { useApi, useRouteRef, configApiRef } from '@backstage/core-plugin-api';

const useStyles = makeStyles((theme: BackstageTheme) => ({
  organizationNode: {
    fill: 'coral',
    stroke: theme.palette.border,
  },
  groupNode: {
    fill: 'yellowgreen',
    stroke: theme.palette.border,
  },
}));

const TEXT_FONT_SIZE: number = 15;
const NODE_WIDTH: number = 180;
const NODE_HEIGHT: number = 90;
const NODE_CORNER_RADIUS: number = 20;
const NODE_MIDDLE_ALIGNMENT_SHIFT: number = 5;
const NODE_MAX_WORDS_PER_ROW: number = 3;
const NODE_MAX_LINES: number = 3;

function RenderNode(props: DependencyGraphTypes.RenderNodeProps<any>) {
  const classes = useStyles();
  const catalogEntityRoute = useRouteRef(entityRouteRef);

  if (props.node.id === 'root') {
    return (
      <g>
        <rect
          width={NODE_WIDTH}
          height={NODE_HEIGHT}
          rx={NODE_CORNER_RADIUS}
          className={classes.organizationNode}
        />
        <title>{props.node.name}</title>
        <text
          x={NODE_WIDTH / 2}
          y={NODE_HEIGHT / 2 + NODE_MIDDLE_ALIGNMENT_SHIFT}
          textAnchor="middle"
          alignmentBaseline="baseline"
          style={{ fontWeight: 'bold' }}
        >
          {props.node.name}
        </text>
      </g>
    );
  }

  const ref = parseEntityRef(props.node.id);
  const nameChunks = splitNameInChunks(props.node.name);
  const objs = prepareForDisplay(nameChunks);

  return (
    <g>
      <rect
        width={NODE_WIDTH}
        height={NODE_HEIGHT}
        rx={NODE_CORNER_RADIUS}
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
        <text
          x={NODE_WIDTH / 2}
          y={NODE_HEIGHT / 2 + NODE_MIDDLE_ALIGNMENT_SHIFT}
          textAnchor="middle"
          alignmentBaseline="baseline"
          style={{ fontWeight: 'bold', fontSize: TEXT_FONT_SIZE }}
        >
          {objs.map(function (object: any, i: number) {
            return (
              <tspan
                key={i}
                y={NODE_HEIGHT / 2 + NODE_MIDDLE_ALIGNMENT_SHIFT}
                x="90"
                textAnchor="middle"
                dy={object.dy}
              >
                {object.text}
              </tspan>
            );
          })}
        </text>
      </Link>
    </g>
  );
}

/**
 * Join chunks based on max words per line and add dy position shifting
 * @param chunkedArray
 * @returns
 */
function prepareForDisplay(chunkedArray: any): any {
  return chunkedArray.map((val: Array<string>, pos: number) => {
    const text = val.join(' ');
    // If array length == 1, dy should be 0 since there is no need to divide the node into blocks, we just need to centralize it
    const dy = chunkedArray.length === 1 ? 0 : getDy(pos) - 30;
    return { dy: dy, text: text };
  });
}

/**
 * text svg dy shifting based on array pos and in the blocks inside the node
 * @param i text position on the array
 */
function getDy(i: number) {
  const blocksSize = NODE_HEIGHT / NODE_MAX_LINES;
  const position = blocksSize * i;
  return position;
}

/**
 * Create Chunked name based on NODE_MAX_LINES and NODE_MAX_WORDS_PER_ROW
 * @param name from props.node.name
 * @returns
 */
function splitNameInChunks(name: string) {
  const array = name.split(' ');
  const formated = array
    .slice(0, NODE_MAX_LINES * NODE_MAX_WORDS_PER_ROW)
    .map((it, pos) =>
      pos + 1 === NODE_MAX_LINES * NODE_MAX_WORDS_PER_ROW ? `${it}...` : it,
    );
  const chunked = chunkArray(formated, NODE_MAX_WORDS_PER_ROW);
  return chunked;
}

/**
 * Returns an array with arrays of the given size.
 *
 * @param arr {Array} Array to split
 * @param size {Integer} Size of each group
 */
function chunkArray(arr: Array<any>, size: number) {
  const results = [];

  while (arr.length) {
    results.push(arr.splice(0, size));
  }
  return results;
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
