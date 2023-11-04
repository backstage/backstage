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
import { AppTree } from '@backstage/frontend-plugin-api';
import Box from '@material-ui/core/Box';
import { useMemo } from 'react';

function resolveGraphData(tree: AppTree) {
  const nodes = [...tree.nodes.values()]
    .filter(n => n.instance)
    .map(n => ({ ...n, id: n.spec.id }));
  return {
    nodes,
    edges: nodes
      .filter(n => n.edges.attachedTo)
      .map(n => ({
        from: n.spec.id,
        to: n.edges.attachedTo!.node.spec.id,
        label: n.edges.attachedTo!.input,
      })),
  };
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
        direction={DependencyGraphTypes.Direction.BOTTOM_TOP}
      />
    </Box>
  );
}
