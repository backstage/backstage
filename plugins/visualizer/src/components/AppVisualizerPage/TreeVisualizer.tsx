/*
 * Copyright 2023 The Backstage Authors
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
  DependencyGraph,
  DependencyGraphTypes,
} from '@backstage/core-components';
import { AppNode, AppTree } from '@backstage/frontend-plugin-api';
import Box from '@material-ui/core/Box';
import { makeStyles } from '@material-ui/core/styles';
import { useLayoutEffect, useMemo, useRef, useState } from 'react';

type NodeType =
  | ({ type: 'node'; id: string } & AppNode)
  | { type: 'input'; id: string; name: string };

function inputId({ node, input }: { node: AppNode; input: string }) {
  return `${node.spec.id}$$${input}`;
}

function resolveGraphData(tree: AppTree): {
  nodes: NodeType[];
  edges: { from: string; to: string }[];
} {
  const nodes = [...tree.nodes.values()]
    .filter(node => node.instance)
    .map(node => ({ ...node, id: node.spec.id, type: 'node' as const }));

  return {
    nodes: [
      ...nodes,
      ...nodes.flatMap(node =>
        [...node.edges.attachments.keys()].map(input => ({
          id: inputId({ node, input }),
          type: 'input' as const,
          name: input,
        })),
      ),
    ],
    edges: [
      ...nodes
        .filter(node => node.edges.attachedTo)
        .map(node => ({
          from: inputId(node.edges.attachedTo!),
          to: node.spec.id,
        })),
      ...nodes.flatMap(node =>
        [...node.edges.attachments.keys()].map(input => ({
          from: node.spec.id,
          to: inputId({ node, input }),
        })),
      ),
    ],
  };
}

const useStyles = makeStyles(theme => ({
  node: {
    fill: (node: NodeType) =>
      node.type === 'node'
        ? theme.palette.primary.light
        : theme.palette.grey[500],
    stroke: theme.palette.primary.light,
  },
  text: {
    fill: theme.palette.primary.contrastText,
  },
}));

/** @public */
export function Node(props: { node: NodeType }) {
  const { node } = props;
  const classes = useStyles(node);
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);
  const idRef = useRef<SVGTextElement | null>(null);

  useLayoutEffect(() => {
    // set the width to the length of the ID
    if (idRef.current) {
      let { height: renderedHeight, width: renderedWidth } =
        idRef.current.getBBox();
      renderedHeight = Math.round(renderedHeight);
      renderedWidth = Math.round(renderedWidth);

      if (renderedHeight !== height || renderedWidth !== width) {
        setWidth(renderedWidth);
        setHeight(renderedHeight);
      }
    }
  }, [width, height]);

  const padding = 10;
  const paddedWidth = width + padding * 2;
  const paddedHeight = height + padding * 2;

  return (
    <g>
      <rect
        className={classes.node}
        width={paddedWidth}
        height={paddedHeight}
        rx={10}
      />
      <text
        ref={idRef}
        className={classes.text}
        y={paddedHeight / 2}
        x={paddedWidth / 2}
        textAnchor="middle"
        alignmentBaseline="middle"
      >
        {node.type === 'node' ? node.id : node.name}
      </text>
    </g>
  );
}

export function TreeVisualizer({ tree }: { tree: AppTree }) {
  const graphData = useMemo(() => resolveGraphData(tree), [tree]);

  return (
    <Box height="100%" flex="1 1 100%" flexDirection="column" overflow="hidden">
      <DependencyGraph
        fit="contain"
        style={{ height: '100%', width: '100%' }}
        {...graphData}
        nodeMargin={10}
        edgeMargin={30}
        rankMargin={100}
        renderNode={Node}
        direction={DependencyGraphTypes.Direction.TOP_BOTTOM}
      />
    </Box>
  );
}
