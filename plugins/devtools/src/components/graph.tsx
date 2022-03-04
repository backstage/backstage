/*
 * Copyright 2022 The Backstage Authors
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

import React, { useMemo } from 'react';
import ReactFlow, { Node, Edge } from 'react-flow-renderer';
import { Paper } from '@material-ui/core';
import * as dagre from 'dagre';

export type UnpositionedNode<T = any> = Omit<Node<T>, 'position'>;

export interface GraphProps {
  nodes: UnpositionedNode[];
  edges: Edge[];
}

export function Graph(props: GraphProps) {
  const elements = useMemo(() => {
    const graph = new dagre.graphlib.Graph();

    graph.setGraph({ rankdir: 'TB', marginx: 10, ranker: 'tight-tree' });
    graph.setDefaultEdgeLabel(() => ({}));

    props.nodes.forEach(node => {
      graph.setNode(node.id, { label: node.data.name, width: 140, height: 50 });
    });
    props.edges.forEach(edge => {
      graph.setEdge(edge.source, edge.target);
    });

    dagre.layout(graph, { rankdir: 'LR', marginx: 10, ranker: 'tight-tree' });

    const nodes = props.nodes.map((node): Node => {
      const layouted = graph.node(node.id);

      const isPlugin = node.data.label.startsWith('Plugin ');
      const isCoreApi = node.id.startsWith('core.');
      const isInternalApi = node.id.startsWith('internal.');
      const isPluginApi = node.id.startsWith('plugin.');

      const backgroundColor =
        // eslint-disable-next-line no-nested-ternary
        isPlugin
          ? '#fbfba7'
          : // eslint-disable-next-line no-nested-ternary
          isCoreApi
          ? '#ffd2d2'
          : // eslint-disable-next-line no-nested-ternary
          isInternalApi
          ? '#deffde'
          : isPluginApi
          ? '#e1ecff'
          : 'whitesmoke';

      return {
        ...node,
        position: {
          x: layouted.x,
          y: layouted.y,
        },
        data: {
          ...node.data,
          label: <span>{node.data.label}</span>,
        },
        style: { backgroundColor },
      };
    });

    return [...nodes, ...props.edges];
  }, [props.nodes, props.edges]);

  return (
    <Paper style={{ margin: 16 }}>
      <div style={{ height: 700 }}>
        <ReactFlow elements={elements} nodesConnectable={false} />
      </div>
    </Paper>
  );
}
