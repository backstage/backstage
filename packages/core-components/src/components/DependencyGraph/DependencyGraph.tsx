/*
 * Copyright 2020 The Backstage Authors
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

import React from 'react';
import * as d3Zoom from 'd3-zoom';
import * as d3Selection from 'd3-selection';
import useTheme from '@material-ui/core/styles/useTheme';
import dagre from 'dagre';
import debounce from 'lodash/debounce';
import { BackstageTheme } from '@backstage/theme';
import {
  DependencyEdge,
  DependencyNode,
  Direction,
  Alignment,
  Ranker,
  RenderNodeFunction,
  RenderLabelFunction,
  LabelPosition,
} from './types';
import { Node } from './Node';
import { Edge, GraphEdge } from './Edge';
import { ARROW_MARKER_ID } from './constants';

/**
 * Properties of {@link DependencyGraph}
 *
 * @public
 * @remarks
 * `<NodeData>` and `<EdgeData>` are useful when rendering custom or edge labels
 */
export interface DependencyGraphProps<NodeData, EdgeData>
  extends React.SVGProps<SVGSVGElement> {
  /**
   * Edges of graph
   */
  edges: DependencyEdge<EdgeData>[];
  /**
   * Nodes of Graph
   */
  nodes: DependencyNode<NodeData>[];
  /**
   * Graph {@link DependencyGraphTypes.Direction | direction}
   *
   * @remarks
   *
   * Default: `DependencyGraphTypes.Direction.TOP_BOTTOM`
   */
  direction?: Direction;
  /**
   * Node {@link DependencyGraphTypes.Alignment | alignment}
   */
  align?: Alignment;
  /**
   * Margin between nodes on each rank
   *
   * @remarks
   *
   * Default: 50
   */
  nodeMargin?: number;
  /**
   * Margin between edges
   *
   * @remarks
   *
   * Default: 10
   */
  edgeMargin?: number;
  /**
   * Margin between each rank
   *
   * @remarks
   *
   * Default: 50
   */
  rankMargin?: number;
  /**
   * Margin on left and right of whole graph
   *
   * @remarks
   *
   * Default: 0
   */
  paddingX?: number;
  /**
   * Margin on top and bottom of whole graph
   *
   * @remarks
   *
   * Default: 0
   */
  paddingY?: number;
  /**
   * Heuristic used to find set of edges that will make graph acyclic
   */
  acyclicer?: 'greedy';
  /**
   * {@link DependencyGraphTypes.Ranker | Algorithm} used to rank nodes
   *
   * @remarks
   *
   * Default: `DependencyGraphTypes.Ranker.NETWORK_SIMPLEX`
   */
  ranker?: Ranker;
  /**
   * {@link DependencyGraphTypes.LabelPosition | Position} of label in relation to edge
   *
   * @remarks
   *
   * Default: `DependencyGraphTypes.LabelPosition.RIGHT`
   */
  labelPosition?: LabelPosition;
  /**
   * How much to move label away from edge
   *
   * @remarks
   *
   * Applies only when {@link DependencyGraphProps.labelPosition} is `DependencyGraphTypes.LabelPosition.LEFT` or
   * `DependencyGraphTypes.LabelPosition.RIGHT`
   */
  labelOffset?: number;
  /**
   * Minimum number of ranks to keep between connected nodes
   */
  edgeRanks?: number;
  /**
   * Weight applied to edges in graph
   */
  edgeWeight?: number;
  /**
   * Custom node rendering component
   */
  renderNode?: RenderNodeFunction<NodeData>;
  /**
   * Custom label rendering component
   */
  renderLabel?: RenderLabelFunction<EdgeData>;
  /**
   * {@link https://developer.mozilla.org/en-US/docs/Web/SVG/Element/defs | Defs} shared by rendered SVG to be used by
   * {@link DependencyGraphProps.renderNode} and/or {@link DependencyGraphProps.renderLabel}
   */
  defs?: SVGDefsElement | SVGDefsElement[];
  /**
   * Controls zoom behavior of graph
   *
   * @remarks
   *
   * Default: `enabled`
   */
  zoom?: 'enabled' | 'disabled' | 'enable-on-click';
}

const WORKSPACE_ID = 'workspace';

/**
 * Graph component used to visualize relations between entities
 *
 * @public
 */
export function DependencyGraph<NodeData, EdgeData>(
  props: DependencyGraphProps<NodeData, EdgeData>,
) {
  const {
    edges,
    nodes,
    renderNode,
    direction = Direction.TOP_BOTTOM,
    align,
    nodeMargin = 50,
    edgeMargin = 10,
    rankMargin = 50,
    paddingX = 0,
    paddingY = 0,
    acyclicer,
    ranker = Ranker.NETWORK_SIMPLEX,
    labelPosition = LabelPosition.RIGHT,
    labelOffset = 10,
    edgeRanks = 1,
    edgeWeight = 1,
    renderLabel,
    defs,
    zoom = 'enabled',
    ...svgProps
  } = props;
  const theme: BackstageTheme = useTheme();
  const [containerWidth, setContainerWidth] = React.useState<number>(100);
  const [containerHeight, setContainerHeight] = React.useState<number>(100);

  const graph = React.useRef<dagre.graphlib.Graph<DependencyNode<NodeData>>>(
    new dagre.graphlib.Graph(),
  );
  const [graphWidth, setGraphWidth] = React.useState<number>(
    graph.current.graph()?.width || 0,
  );
  const [graphHeight, setGraphHeight] = React.useState<number>(
    graph.current.graph()?.height || 0,
  );
  const [graphNodes, setGraphNodes] = React.useState<string[]>([]);
  const [graphEdges, setGraphEdges] = React.useState<dagre.Edge[]>([]);

  const maxWidth = Math.max(graphWidth, containerWidth);
  const maxHeight = Math.max(graphHeight, containerHeight);

  const containerRef = React.useMemo(
    () =>
      debounce((node: SVGSVGElement) => {
        if (!node) {
          return;
        }
        // Set up zooming + panning
        const container = d3Selection.select<SVGSVGElement, null>(node);
        const workspace = d3Selection.select(node.getElementById(WORKSPACE_ID));

        function enableZoom() {
          container.call(
            d3Zoom
              .zoom<SVGSVGElement, null>()
              .scaleExtent([1, 10])
              .on('zoom', event => {
                event.transform.x = Math.min(
                  0,
                  Math.max(
                    event.transform.x,
                    maxWidth - maxWidth * event.transform.k,
                  ),
                );
                event.transform.y = Math.min(
                  0,
                  Math.max(
                    event.transform.y,
                    maxHeight - maxHeight * event.transform.k,
                  ),
                );
                workspace.attr('transform', event.transform);
              }),
          );
        }

        if (zoom === 'enabled') {
          enableZoom();
        } else if (zoom === 'enable-on-click') {
          container.on('click', () => enableZoom());
        }

        const { width: newContainerWidth, height: newContainerHeight } =
          node.getBoundingClientRect();
        if (containerWidth !== newContainerWidth) {
          setContainerWidth(newContainerWidth);
        }
        if (containerHeight !== newContainerHeight) {
          setContainerHeight(newContainerHeight);
        }
      }, 100),
    [containerHeight, containerWidth, maxWidth, maxHeight, zoom],
  );

  const setNodesAndEdges = React.useCallback(() => {
    // Cleaning up lingering nodes and edges
    const currentGraphNodes = graph.current.nodes();
    const currentGraphEdges = graph.current.edges();

    currentGraphNodes.forEach(nodeId => {
      const remainingNode = nodes.some(node => node.id === nodeId);
      if (!remainingNode) {
        graph.current.removeNode(nodeId);
      }
    });

    currentGraphEdges.forEach(e => {
      const remainingEdge = edges.some(
        edge => edge.from === e.v && edge.to === e.w,
      );
      if (!remainingEdge) {
        graph.current.removeEdge(e.v, e.w);
      }
    });

    // Adding/updating nodes and edges
    nodes.forEach(node => {
      const existingNode = graph.current
        .nodes()
        .find(nodeId => node.id === nodeId);

      if (existingNode && graph.current.node(existingNode)) {
        const { width, height, x, y } = graph.current.node(existingNode);
        graph.current.setNode(existingNode, { ...node, width, height, x, y });
      } else {
        graph.current.setNode(node.id, { ...node, width: 0, height: 0 });
      }
    });

    edges.forEach(e => {
      graph.current.setEdge(e.from, e.to, {
        ...e,
        label: e.label,
        width: 0,
        height: 0,
        labelpos: labelPosition,
        labeloffset: labelOffset,
        weight: edgeWeight,
        minlen: edgeRanks,
      });
    });
  }, [edges, nodes, labelPosition, labelOffset, edgeWeight, edgeRanks]);

  const updateGraph = React.useMemo(
    () =>
      debounce(
        () => {
          dagre.layout(graph.current);
          const { height, width } = graph.current.graph();
          const newHeight = Math.max(0, height || 0);
          const newWidth = Math.max(0, width || 0);
          setGraphWidth(newWidth);
          setGraphHeight(newHeight);

          setGraphNodes(graph.current.nodes());
          setGraphEdges(graph.current.edges());
        },
        250,
        { leading: true },
      ),
    [],
  );

  React.useEffect(() => {
    graph.current.setGraph({
      rankdir: direction,
      align,
      nodesep: nodeMargin,
      edgesep: edgeMargin,
      ranksep: rankMargin,
      marginx: paddingX,
      marginy: paddingY,
      acyclicer,
      ranker,
    });

    setNodesAndEdges();
    updateGraph();

    return updateGraph.cancel;
  }, [
    acyclicer,
    align,
    direction,
    edgeMargin,
    paddingX,
    paddingY,
    nodeMargin,
    rankMargin,
    ranker,
    setNodesAndEdges,
    updateGraph,
  ]);

  function setNode(id: string, node: DependencyNode<NodeData>) {
    graph.current.setNode(id, node);
    updateGraph();
    return graph.current;
  }

  function setEdge(id: dagre.Edge, edge: DependencyEdge<EdgeData>) {
    graph.current.setEdge(id, edge);
    updateGraph();
    return graph.current;
  }

  return (
    <svg
      ref={containerRef}
      {...svgProps}
      width="100%"
      height={maxHeight}
      viewBox={`0 0 ${maxWidth} ${maxHeight}`}
    >
      <defs>
        <marker
          id={ARROW_MARKER_ID}
          viewBox="0 0 24 24"
          markerWidth="14"
          markerHeight="14"
          refX="16"
          refY="12"
          orient="auto"
          markerUnits="strokeWidth"
        >
          <path
            fill={theme.palette.textSubtle}
            d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z"
          />
        </marker>
        {defs}
      </defs>
      <g id={WORKSPACE_ID}>
        <svg
          width={graphWidth}
          height={graphHeight}
          y={maxHeight / 2 - graphHeight / 2}
          x={maxWidth / 2 - graphWidth / 2}
          viewBox={`0 0 ${graphWidth} ${graphHeight}`}
        >
          {graphEdges.map(e => {
            const edge = graph.current.edge(e) as GraphEdge<EdgeData>;
            if (!edge) return null;
            return (
              <Edge
                key={`${e.v}-${e.w}`}
                id={e}
                setEdge={setEdge}
                render={renderLabel}
                edge={edge}
              />
            );
          })}
          {graphNodes.map((id: string) => {
            const node = graph.current.node(id);
            if (!node) return null;
            return (
              <Node
                key={id}
                setNode={setNode}
                render={renderNode}
                node={node}
              />
            );
          })}
        </svg>
      </g>
    </svg>
  );
}
