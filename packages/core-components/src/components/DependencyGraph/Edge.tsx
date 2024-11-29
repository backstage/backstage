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
import * as d3Shape from 'd3-shape';
import isFinite from 'lodash/isFinite';
import makeStyles from '@material-ui/core/styles/makeStyles';
import { DependencyGraphTypes as Types } from './types';
import { ARROW_MARKER_ID, EDGE_TEST_ID, LABEL_TEST_ID } from './constants';
import { DefaultLabel } from './DefaultLabel';
import dagre from 'dagre';

/* Based on: https://github.com/dagrejs/dagre/wiki#configuring-the-layout  */
export type EdgeProperties = {
  label?: string;
  width?: number;
  height?: number;
  labeloffset?: number;
  labelpos?: Types.LabelPosition;
  minlen?: number;
  weight?: number;
};
export type GraphEdge<T> = Types.DependencyEdge<T> &
  dagre.GraphEdge &
  EdgeProperties;

/** @public */
export type DependencyGraphEdgeClassKey = 'path' | 'label';

const useStyles = makeStyles(
  theme => ({
    path: {
      strokeWidth: 1.3,
      stroke: theme.palette.textSubtle,
      fill: 'none',
      transition: `${theme.transitions.duration.shortest}ms`,
    },
    label: {
      transition: `${theme.transitions.duration.shortest}ms`,
    },
  }),
  { name: 'BackstageDependencyGraphEdge' },
);

type EdgePoint = dagre.GraphEdge['points'][0];

/** @public */
export type EdgeComponentProps<T = unknown> = {
  id: dagre.Edge;
  edge: GraphEdge<T>;
  render?: Types.RenderLabelFunction<T>;
  setEdge: (
    id: dagre.Edge,
    edge: Types.DependencyEdge<T>,
  ) => dagre.graphlib.Graph<{}>;
  curve: 'curveStepBefore' | 'curveMonotoneX';
  showArrowHeads?: boolean;
};

const renderDefault = (props: Types.RenderLabelProps<unknown>) => (
  <DefaultLabel {...props} />
);

export function Edge<EdgeData>({
  render = renderDefault,
  setEdge,
  id,
  edge,
  curve,
  showArrowHeads,
}: EdgeComponentProps<EdgeData>) {
  const { x = 0, y = 0, width, height, points } = edge;
  const labelProps: Types.DependencyEdge<EdgeData> = edge;
  const classes = useStyles();

  const labelRef = React.useRef<SVGGElement>(null);

  React.useLayoutEffect(() => {
    // set the label width to the actual rendered width to properly layout graph
    if (labelRef.current) {
      let { height: renderedHeight, width: renderedWidth } =
        labelRef.current.getBBox();
      renderedHeight = Math.round(renderedHeight);
      renderedWidth = Math.round(renderedWidth);

      if (renderedHeight !== height || renderedWidth !== width) {
        setEdge(id, {
          ...edge,
          height: renderedHeight,
          width: renderedWidth,
        });
      }
    }
  }, [edge, height, width, setEdge, id]);

  let path: string = '';

  const createPath = React.useMemo(
    () =>
      d3Shape
        .line<EdgePoint>()
        .x(d => d.x)
        .y(d => d.y)
        .curve(d3Shape[curve]),
    [curve],
  );

  if (points) {
    const finitePoints = points.filter(
      (point: EdgePoint) => isFinite(point.x) && isFinite(point.y),
    );
    path = createPath(finitePoints) || '';
  }

  return (
    <>
      {path && (
        <path
          data-testid={EDGE_TEST_ID}
          className={classes.path}
          markerEnd={showArrowHeads ? `url(#${ARROW_MARKER_ID})` : undefined}
          d={path}
        />
      )}
      {labelProps.label ? (
        <g
          ref={labelRef}
          data-testid={LABEL_TEST_ID}
          className={classes.label}
          transform={`translate(${x},${y})`}
        >
          {render({ edge: labelProps })}
        </g>
      ) : null}
    </>
  );
}
