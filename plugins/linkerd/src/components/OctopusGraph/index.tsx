/*
 * Copyright 2021 Spotify AB
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
import React, { PropsWithChildren, useState, useEffect } from 'react';
import dagre from 'dagre';
import ReactFlow, {
  ReactFlowProvider,
  addEdge,
  removeElements,
  isNode,
  Elements,
} from 'react-flow-renderer';
import { Node } from './Node';
import { DeploymentResponse } from '../../api/types';
import { Entity } from '@backstage/catalog-model';

export const OctopusGraph = ({
  stats,
  entity,
}: {
  stats: DeploymentResponse;
  entity: Entity;
}) => {
  const incomingRequests = [];
  const outgoingRequests = [];

  for (const [key, data] of Object.entries(stats.incoming?.deployment ?? {})) {
    incomingRequests.push({
      id: key,
      data: { name: key, isSource: true, header: 'upstream', l5d: data },
      type: 'node',
      position: { x: 0, y: 0 },
    });
    incomingRequests.push({
      id: `${key}-to-current`,
      type: 'smoothstep',
      source: key,
      target: 'current',
      animated: true,
    });
  }

  for (const [key, data] of Object.entries(stats.outgoing?.deployment ?? {})) {
    outgoingRequests.push({
      id: key,
      type: 'node',
      data: { name: key, isTarget: true, header: 'downstream', l5d: data },
      position: { x: 0, y: 0 },
    });
    outgoingRequests.push({
      id: `current-to-${key}`,
      type: 'smoothstep',
      source: 'current',
      target: key,
      animated: true,
    });
  }

  const orderedElements = [
    ...incomingRequests,
    {
      id: 'current',
      type: 'node',
      position: { x: 0, y: 0 },
      targetPosition: 'left',
      sourcePosition: 'right',
      data: {
        name: entity.metadata.name,
        isSource: true,
        isTarget: true,
        header: 'current',
      },
    },
    ...outgoingRequests,
  ].sort((a, b) => a.id.localeCompare(b.id));

  const dagreGraph = new dagre.graphlib.Graph();

  dagreGraph.setDefaultEdgeLabel(() => ({}));

  const getLayoutedElements = React.useCallback(
    elements => {
      const isHorizontal = true;
      dagreGraph.setGraph({ rankdir: 'LR' });
      elements.forEach(el => {
        if (isNode(el)) {
          dagreGraph.setNode(el.id, { width: 400, height: 300 });
        } else {
          dagreGraph.setEdge(el.source, el.target);
        }
      });
      dagre.layout(dagreGraph);

      return elements.map(el => {
        if (isNode(el)) {
          const nodeWithPosition = dagreGraph.node(el.id);
          el.targetPosition = isHorizontal ? 'left' : 'top';
          el.sourcePosition = isHorizontal ? 'right' : 'bottom';
          // unfortunately we need this little hack to pass a slighltiy different position
          // in order to notify react flow about the change
          el.position = {
            x: nodeWithPosition.x + Math.random() / 1000,
            y: nodeWithPosition.y,
          };
        }
        return el;
      });
    },
    [dagreGraph],
  );

  const layoutedElements = getLayoutedElements(orderedElements);
  const [elements, setElements] = useState(layoutedElements);

  const onConnect = params =>
    setElements(els =>
      addEdge({ ...params, type: 'smoothstep', animated: true }, els),
    );
  const onElementsRemove = elementsToRemove =>
    setElements(els => removeElements(elementsToRemove, els));

  useEffect(() => {
    setElements(getLayoutedElements(orderedElements));
  }, [stats, orderedElements, getLayoutedElements]);
  return (
    <ReactFlowProvider>
      <ReactFlow
        nodeTypes={{ node: Node }}
        onLoad={instance => instance.fitView()}
        elements={elements}
        onConnect={onConnect}
        onElementsRemove={onElementsRemove}
      />
    </ReactFlowProvider>
  );
};
