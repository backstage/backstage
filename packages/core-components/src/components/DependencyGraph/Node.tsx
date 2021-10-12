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
import makeStyles from '@material-ui/core/styles/makeStyles';
import { DefaultNode } from './DefaultNode';
import { RenderNodeFunction, RenderNodeProps, DependencyNode } from './types';
import { NODE_TEST_ID } from './constants';
import dagre from 'dagre';

export type DependencyGraphNodeClassKey = 'node';

const useStyles = makeStyles(
  theme => ({
    node: {
      transition: `${theme.transitions.duration.shortest}ms`,
    },
  }),
  { name: 'BackstageDependencyGraphNode' },
);

export type GraphNode<T> = dagre.Node<DependencyNode<T>>;

export type NodeComponentProps<T> = {
  node: GraphNode<T>;
  render?: RenderNodeFunction<T>;
  setNode: dagre.graphlib.Graph['setNode'];
};

const renderDefault = (props: RenderNodeProps) => <DefaultNode {...props} />;

export function Node<T>({
  render = renderDefault,
  setNode,
  node,
}: NodeComponentProps<T>) {
  const { width, height, x = 0, y = 0 } = node;
  const nodeProps: DependencyNode<T> = node;
  const classes = useStyles();
  const nodeRef = React.useRef<SVGGElement | null>(null);

  React.useLayoutEffect(() => {
    // set the node width to the actual rendered width to properly layout graph
    if (nodeRef.current) {
      let { height: renderedHeight, width: renderedWidth } =
        nodeRef.current.getBBox();
      renderedHeight = Math.round(renderedHeight);
      renderedWidth = Math.round(renderedWidth);

      if (renderedHeight !== height || renderedWidth !== width) {
        setNode(node.id, {
          ...node,
          height: renderedHeight,
          width: renderedWidth,
        });
      }
    }
  }, [node, width, height, setNode]);

  return (
    <g
      ref={nodeRef}
      data-testid={NODE_TEST_ID}
      className={classes.node}
      transform={`translate(${x - width / 2},${y - height / 2})`}
    >
      {render({ node: nodeProps })}
    </g>
  );
}
