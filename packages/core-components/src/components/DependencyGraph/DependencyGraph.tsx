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

import {
  SVGProps,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import useMeasure from 'react-use/esm/useMeasure';
import classNames from 'classnames';
import { once } from 'lodash';
import * as d3Zoom from 'd3-zoom';
import * as d3Selection from 'd3-selection';
import useTheme from '@material-ui/core/styles/useTheme';
import dagre from '@dagrejs/dagre';
import debounce from 'lodash/debounce';
import { DependencyGraphTypes as Types } from './types';
import { Node } from './Node';
import { Edge, GraphEdge } from './Edge';
import { ARROW_MARKER_ID } from './constants';
import IconButton from '@material-ui/core/IconButton';
import FullscreenIcon from '@material-ui/icons/Fullscreen';
import FullscreenExitIcon from '@material-ui/icons/FullscreenExit';
import { FullScreen, useFullScreenHandle } from 'react-full-screen';
import { makeStyles, Theme } from '@material-ui/core/styles';
import Tooltip from '@material-ui/core/Tooltip';
import { useTranslationRef } from '@backstage/core-plugin-api/alpha';
import { coreComponentsTranslationRef } from '../../translation';

const useStyles = makeStyles((theme: Theme) => ({
  fullscreenButton: {
    position: 'absolute',
    right: 0,
  },
  root: {
    overflow: 'hidden',
    minHeight: '100%',
    minWidth: '100%',
  },
  fixedHeight: {
    maxHeight: '100%',
  },
  fullscreen: {
    backgroundColor: theme.palette.background.paper,
  },
}));

/**
 * Properties of {@link DependencyGraph}
 *
 * @public
 * @remarks
 * `<NodeData>` and `<EdgeData>` are useful when rendering custom or edge labels
 */
export interface DependencyGraphProps<NodeData, EdgeData>
  extends SVGProps<SVGSVGElement> {
  /**
   * Edges of graph
   */
  edges: Types.DependencyEdge<EdgeData>[];
  /**
   * Nodes of Graph
   */
  nodes: Types.DependencyNode<NodeData>[];
  /**
   * Graph {@link DependencyGraphTypes.(Direction:namespace) | direction}
   *
   * @remarks
   *
   * Default: `DependencyGraphTypes.Direction.TOP_BOTTOM`
   */
  direction?: Types.Direction;
  /**
   * Node {@link DependencyGraphTypes.(Alignment:namespace) | alignment}
   */
  align?: Types.Alignment;
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
   * {@link DependencyGraphTypes.(Ranker:namespace) | Algorithm} used to rank nodes
   *
   * @remarks
   *
   * Default: `DependencyGraphTypes.Ranker.NETWORK_SIMPLEX`
   */
  ranker?: Types.Ranker;
  /**
   * {@link DependencyGraphTypes.(LabelPosition:namespace) | Position} of label in relation to edge
   *
   * @remarks
   *
   * Default: `DependencyGraphTypes.LabelPosition.RIGHT`
   */
  labelPosition?: Types.LabelPosition;
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
   * Custom edge rendering component
   */
  renderEdge?: Types.RenderEdgeFunction<EdgeData>;
  /**
   * Custom node rendering component
   */
  renderNode?: Types.RenderNodeFunction<NodeData>;
  /**
   * Custom label rendering component
   */
  renderLabel?: Types.RenderLabelFunction<EdgeData>;
  /**
   * {@link https://developer.mozilla.org/en-US/docs/Web/SVG/Element/defs | Defs} shared by rendered SVG to be used by
   * {@link DependencyGraphProps.renderNode} and/or {@link DependencyGraphProps.renderLabel}
   */
  defs?: JSX.Element | JSX.Element[];
  /**
   * Controls zoom behavior of graph
   *
   * @remarks
   *
   * Default: `enabled`
   */
  zoom?: 'enabled' | 'disabled' | 'enable-on-click';
  /**
   * A factory for curve generators addressing both lines and areas.
   *
   * @remarks
   *
   * Default: 'curveMonotoneX'
   */
  curve?: 'curveStepBefore' | 'curveMonotoneX';
  /**
   * Controls if the arrow heads should be rendered or not.
   *
   * Default: false
   */
  showArrowHeads?: boolean;
  /**
   * Controls if the graph should be contained or grow
   *
   * @remarks
   *
   * Default: 'grow'
   */
  fit?: 'grow' | 'contain';
  /**
   * Controls if user can toggle fullscreen mode
   *
   * @remarks
   *
   * Default: true
   */
  allowFullscreen?: boolean;
}

const WORKSPACE_ID = 'workspace';
const DEPENDENCY_GRAPH_SVG = 'dependency-graph';

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
    direction = Types.Direction.TOP_BOTTOM,
    align,
    nodeMargin = 50,
    edgeMargin = 10,
    rankMargin = 50,
    paddingX = 0,
    paddingY = 0,
    acyclicer,
    ranker = Types.Ranker.NETWORK_SIMPLEX,
    labelPosition = Types.LabelPosition.RIGHT,
    labelOffset = 10,
    edgeRanks = 1,
    edgeWeight = 1,
    renderEdge,
    renderLabel,
    defs,
    zoom = 'enabled',
    curve = 'curveMonotoneX',
    showArrowHeads = false,
    fit = 'grow',
    allowFullscreen = true,
    ...svgProps
  } = props;
  const theme = useTheme();
  const [containerWidth, setContainerWidth] = useState<number>(100);
  const [containerHeight, setContainerHeight] = useState<number>(100);
  const fullScreenHandle = useFullScreenHandle();
  const styles = useStyles();
  const { t } = useTranslationRef(coreComponentsTranslationRef);

  const graph = useRef<dagre.graphlib.Graph<Types.DependencyNode<NodeData>>>(
    new dagre.graphlib.Graph(),
  );
  const [graphWidth, setGraphWidth] = useState<number>(
    graph.current.graph()?.width || 0,
  );
  const [graphHeight, setGraphHeight] = useState<number>(
    graph.current.graph()?.height || 0,
  );
  const [graphNodes, setGraphNodes] = useState<string[]>([]);
  const [graphEdges, setGraphEdges] = useState<dagre.Edge[]>([]);

  const maxWidth = Math.max(graphWidth, containerWidth);
  const maxHeight = Math.max(graphHeight, containerHeight);

  const [_measureRef] = useMeasure();
  const measureRef = once(_measureRef);

  const scalableHeight =
    fit === 'grow' && !fullScreenHandle.active ? maxHeight : '100%';

  const containerRef = useMemo(
    () =>
      debounce((root: HTMLDivElement) => {
        if (!root) {
          return;
        }
        measureRef(root);

        // Set up zooming + panning
        const node: SVGSVGElement = root.querySelector(
          `svg#${DEPENDENCY_GRAPH_SVG}`,
        ) as SVGSVGElement;
        if (!node) {
          return;
        }
        const container = d3Selection.select<SVGSVGElement, null>(node);
        const workspace = d3Selection.select(node.getElementById(WORKSPACE_ID));

        function enableZoom() {
          container.call(
            d3Zoom
              .zoom<SVGSVGElement, null>()
              .scaleExtent([1, Infinity])
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
          root.getBoundingClientRect();
        if (
          containerWidth !== newContainerWidth &&
          newContainerWidth <= maxWidth
        ) {
          setContainerWidth(newContainerWidth);
        }
        if (
          containerHeight !== newContainerHeight &&
          newContainerHeight <= maxHeight
        ) {
          setContainerHeight(newContainerHeight);
        }
      }, 100),
    [measureRef, containerHeight, containerWidth, maxWidth, maxHeight, zoom],
  );

  const setNodesAndEdges = useCallback(() => {
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

  const updateGraph = useMemo(
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

  useEffect(() => {
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

  const setNode = useCallback(
    (id: string, node: Types.DependencyNode<NodeData>) => {
      graph.current.setNode(id, node);
      updateGraph();
      return graph.current;
    },
    [updateGraph],
  );

  const setEdge = useCallback(
    (id: dagre.Edge, edge: Types.DependencyEdge<EdgeData>) => {
      graph.current.setEdge(id, edge);
      updateGraph();
      return graph.current;
    },
    [updateGraph],
  );

  return (
    <FullScreen
      handle={fullScreenHandle}
      className={classNames(
        fullScreenHandle.active ? styles.fullscreen : styles.root,
      )}
    >
      {allowFullscreen && (
        <Tooltip title={t('dependencyGraph.fullscreenTooltip')}>
          <IconButton
            className={styles.fullscreenButton}
            onClick={
              fullScreenHandle.active
                ? fullScreenHandle.exit
                : fullScreenHandle.enter
            }
          >
            {fullScreenHandle.active ? (
              <FullscreenExitIcon />
            ) : (
              <FullscreenIcon />
            )}
          </IconButton>
        </Tooltip>
      )}

      <div ref={containerRef} style={{ width: '100%', height: '100%' }}>
        <svg
          {...svgProps}
          width="100%"
          height={scalableHeight}
          viewBox={`0 0 ${maxWidth} ${maxHeight}`}
          id={DEPENDENCY_GRAPH_SVG}
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
                if (renderEdge) return renderEdge({ edge, id: e });

                return (
                  <Edge
                    key={`${e.v}-${e.w}`}
                    id={e}
                    setEdge={setEdge}
                    render={renderLabel}
                    edge={edge}
                    curve={curve}
                    showArrowHeads={showArrowHeads}
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
      </div>
    </FullScreen>
  );
}
